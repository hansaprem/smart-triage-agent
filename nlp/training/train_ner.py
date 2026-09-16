"""
Trievo Healthcare - Optimized Clinical NER Model Training Pipeline
===================================================================
High-performance PyTorch + Hugging Face Transformer training pipeline:
- Vectorized batch pre-tokenization for rapid DataLoader execution on CPU/GPU
- Strict BIO label alignment with subwords
- Evaluation with seqeval (strict entity-level boundary matching)
- Best checkpoint saving (weights, tokenizer, label mappings, training history)
"""

import os
import sys
import json
import yaml
import time
import random
import logging
import argparse
from typing import List, Dict, Any, Tuple

import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoTokenizer,
    AutoModelForTokenClassification,
    get_linear_schedule_with_warmup,
)
from seqeval.metrics import classification_report, f1_score, precision_score, recall_score

from nlp.harmonization.label_mapping import TRIEVO_NER_TAGS, LABEL2ID, ID2LABEL

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


def set_seed(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


class ClinicalNERDataset(Dataset):
    def __init__(self, data_path: str, tokenizer, label2id: Dict[str, int], max_length: int = 128, max_samples: int = None):
        self.examples = []
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Data file not found: {data_path}")

        with open(data_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    self.examples.append(json.loads(line))
                    if max_samples and len(self.examples) >= max_samples:
                        break

        logger.info(f"Loaded {len(self.examples)} samples from {data_path}. Pre-encoding into tensors...")
        sys.stdout.flush()
        t0 = time.time()

        all_tokens = [ex["tokens"] for ex in self.examples]
        all_ner_tags = [ex["ner_tags"] for ex in self.examples]

        # Fast vectorized batch tokenization
        encoding = tokenizer(
            all_tokens,
            is_split_into_words=True,
            max_length=max_length,
            truncation=True,
            padding="max_length",
            return_tensors="pt",
        )

        all_labels = []
        for i, ner_tags in enumerate(all_ner_tags):
            word_ids = encoding.word_ids(batch_index=i)
            labels = []
            previous_word_idx = None
            for word_idx in word_ids:
                if word_idx is None:
                    labels.append(-100)
                elif word_idx != previous_word_idx:
                    tag = ner_tags[word_idx] if word_idx < len(ner_tags) else "O"
                    labels.append(label2id.get(tag, 0))
                else:
                    tag = ner_tags[word_idx] if word_idx < len(ner_tags) else "O"
                    if tag.startswith("B-"):
                        tag = "I-" + tag[2:]
                    labels.append(label2id.get(tag, 0))
                previous_word_idx = word_idx
            all_labels.append(labels)

        self.input_ids = encoding["input_ids"]
        self.attention_mask = encoding["attention_mask"]
        self.labels = torch.tensor(all_labels, dtype=torch.long)
        logger.info(f"Vectorized pre-encoding completed in {time.time() - t0:.2f}s!")
        sys.stdout.flush()

    def __len__(self):
        return len(self.input_ids)

    def __getitem__(self, idx):
        return {
            "input_ids": self.input_ids[idx],
            "attention_mask": self.attention_mask[idx],
            "labels": self.labels[idx],
        }


def evaluate(model, dataloader, id2label: Dict[int, str], device: torch.device) -> Dict[str, Any]:
    model.eval()
    total_val_loss = 0.0
    all_preds = []
    all_trues = []

    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            total_val_loss += outputs.loss.item()

            logits = outputs.logits.detach().cpu().numpy()
            label_ids = labels.to("cpu").numpy()
            preds = np.argmax(logits, axis=2)

            for i in range(preds.shape[0]):
                pred_list = []
                true_list = []
                for j in range(preds.shape[1]):
                    if label_ids[i, j] != -100:
                        pred_list.append(id2label.get(preds[i, j], "O"))
                        true_list.append(id2label.get(label_ids[i, j], "O"))
                all_preds.append(pred_list)
                all_trues.append(true_list)

    avg_loss = total_val_loss / max(1, len(dataloader))
    precision = precision_score(all_trues, all_preds, zero_division=0)
    recall = recall_score(all_trues, all_preds, zero_division=0)
    f1 = f1_score(all_trues, all_preds, zero_division=0)
    report_str = classification_report(all_trues, all_preds, zero_division=0)

    return {
        "val_loss": float(avg_loss),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "report": report_str,
    }


def train(config_path: str, override_epochs: int = None, override_batch_size: int = None, max_train_samples: int = None, max_dev_samples: int = None):
    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    set_seed(config["training"].get("seed", 42))
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using compute device: {device}")
    sys.stdout.flush()

    model_name = config["model"]["name_or_path"]
    max_length = config["model"].get("max_length", 128)
    output_dir = config["training"]["output_dir"]
    os.makedirs(output_dir, exist_ok=True)

    local_snapshot = os.path.expanduser(r"~/.cache/huggingface/hub/models--sentence-transformers--all-MiniLM-L6-v2/snapshots/1110a243fdf4706b3f48f1d95db1a4f5529b4d41")
    load_source = local_snapshot if os.path.exists(local_snapshot) and "MiniLM" in model_name else model_name

    logger.info(f"Loading tokenizer and model from: {load_source}")
    sys.stdout.flush()
    tokenizer = AutoTokenizer.from_pretrained(load_source)
    model = AutoModelForTokenClassification.from_pretrained(
        load_source,
        num_labels=len(TRIEVO_NER_TAGS),
        id2label=ID2LABEL,
        label2id=LABEL2ID,
    )
    model.to(device)

    train_file = config["training"]["train_file"]
    dev_file = config["training"]["dev_file"]

    train_dataset = ClinicalNERDataset(train_file, tokenizer, LABEL2ID, max_length=max_length, max_samples=max_train_samples)
    dev_dataset = ClinicalNERDataset(dev_file, tokenizer, LABEL2ID, max_length=max_length, max_samples=max_dev_samples)

    batch_size = override_batch_size or config["training"].get("batch_size", 16)
    epochs = override_epochs or config["training"].get("num_epochs", 3)
    lr = float(config["training"].get("learning_rate", 3e-5))

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    dev_loader = DataLoader(dev_dataset, batch_size=batch_size, shuffle=False)

    total_steps = len(train_loader) * epochs
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=config["training"].get("weight_decay", 0.01))
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=int(total_steps * config["training"].get("warmup_ratio", 0.1)),
        num_training_steps=total_steps,
    )

    logger.info(f"Starting Clinical NER training for {epochs} epochs ({total_steps} total steps, batch_size={batch_size})...")
    sys.stdout.flush()
    best_f1 = -1.0
    history = []

    for epoch in range(1, epochs + 1):
        model.train()
        total_train_loss = 0.0
        start_time = time.time()

        for step, batch in enumerate(train_loader, 1):
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            optimizer.zero_grad()
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            loss.backward()

            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            scheduler.step()

            total_train_loss += loss.item()

            if step % 25 == 0 or step == len(train_loader):
                logger.info(f"Epoch {epoch}/{epochs} | Step {step}/{len(train_loader)} | Train Loss: {loss.item():.4f}")
                sys.stdout.flush()

        epoch_train_loss = total_train_loss / len(train_loader)
        epoch_time = time.time() - start_time

        # Validation evaluation
        logger.info(f"Running evaluation for Epoch {epoch}...")
        sys.stdout.flush()
        metrics = evaluate(model, dev_loader, ID2LABEL, device)
        logger.info(
            f"Epoch {epoch} Completed in {epoch_time:.1f}s | Train Loss: {epoch_train_loss:.4f} | "
            f"Val Loss: {metrics['val_loss']:.4f} | Precision: {metrics['precision']:.4f} | "
            f"Recall: {metrics['recall']:.4f} | F1: {metrics['f1']:.4f}"
        )
        sys.stdout.flush()

        history.append({
            "epoch": epoch,
            "train_loss": epoch_train_loss,
            "val_loss": metrics["val_loss"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1": metrics["f1"],
            "time_seconds": epoch_time,
        })

        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            logger.info(f"--> New best F1 score: {best_f1:.4f}! Saving model checkpoint to {output_dir}...")
            sys.stdout.flush()
            model.save_pretrained(output_dir)
            tokenizer.save_pretrained(output_dir)

            with open(os.path.join(output_dir, "label_mapping.json"), "w", encoding="utf-8") as f:
                json.dump({"label2id": LABEL2ID, "id2label": ID2LABEL}, f, indent=2)

    # Save final training history log
    log_path = os.path.join(output_dir, "training_history.json")
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)
    logger.info(f"Training completed successfully! Best Validation F1: {best_f1:.4f}. Artifacts saved in {output_dir}")
    sys.stdout.flush()

    return history


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=str, default="nlp/configs/ner_config.yaml")
    parser.add_argument("--epochs", type=int, default=None)
    parser.add_argument("--batch_size", type=int, default=None)
    parser.add_argument("--max_train_samples", type=int, default=None)
    parser.add_argument("--max_dev_samples", type=int, default=None)
    args = parser.parse_args()

    train(
        args.config,
        override_epochs=args.epochs,
        override_batch_size=args.batch_size,
        max_train_samples=args.max_train_samples,
        max_dev_samples=args.max_dev_samples,
    )
