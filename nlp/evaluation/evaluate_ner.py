"""
Trievo Healthcare - Clinical NER Evaluation Pipeline
====================================================
Evaluates the trained Clinical NER model on held-out test data:
- Calculates exact Precision, Recall, and F1 (overall and per-class)
- Uses seqeval for strict entity-level boundary matching
- Saves evaluation report and metrics to JSON
"""

import os
import sys
import json
import logging
import argparse
from typing import Dict, Any

import numpy as np
import torch
from torch.utils.data import DataLoader
from transformers import AutoTokenizer, AutoModelForTokenClassification
from seqeval.metrics import classification_report, f1_score, precision_score, recall_score

from nlp.training.train_ner import ClinicalNERDataset
from nlp.harmonization.label_mapping import LABEL2ID, ID2LABEL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def run_evaluation(model_dir: str, test_file: str, output_file: str = None, batch_size: int = 16, max_samples: int = None) -> Dict[str, Any]:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Loading trained model from {model_dir} on {device}...")

    tokenizer = AutoTokenizer.from_pretrained(model_dir)
    model = AutoModelForTokenClassification.from_pretrained(model_dir)
    model.to(device)
    model.eval()

    test_dataset = ClinicalNERDataset(test_file, tokenizer, LABEL2ID, max_length=128, max_samples=max_samples)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    total_loss = 0.0
    all_preds = []
    all_trues = []

    logger.info(f"Evaluating {len(test_dataset)} test sentences...")
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            labels = batch["labels"].to(device)

            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            total_loss += outputs.loss.item()

            logits = outputs.logits.detach().cpu().numpy()
            label_ids = labels.to("cpu").numpy()
            preds = np.argmax(logits, axis=2)

            for i in range(preds.shape[0]):
                pred_list = []
                true_list = []
                for j in range(preds.shape[1]):
                    if label_ids[i, j] != -100:
                        pred_list.append(ID2LABEL.get(preds[i, j], "O"))
                        true_list.append(ID2LABEL.get(label_ids[i, j], "O"))
                all_preds.append(pred_list)
                all_trues.append(true_list)

    avg_loss = total_loss / max(1, len(test_loader))
    precision = precision_score(all_trues, all_preds, zero_division=0)
    recall = recall_score(all_trues, all_preds, zero_division=0)
    f1 = f1_score(all_trues, all_preds, zero_division=0)
    report_str = classification_report(all_trues, all_preds, zero_division=0)
    report_dict = classification_report(all_trues, all_preds, zero_division=0, output_dict=True)

    results = {
        "test_loss": float(avg_loss),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "per_class": report_dict,
        "classification_report": report_str,
        "num_test_sentences": len(test_dataset),
    }

    print("\n" + "=" * 60 + "\nOFFICIAL HELD-OUT TEST EVALUATION RESULTS:\n" + "=" * 60)
    print(f"Test Loss: {avg_loss:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("\n" + report_str)

    def _make_serializable(obj):
        if isinstance(obj, dict):
            return {k: _make_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [_make_serializable(v) for v in obj]
        elif isinstance(obj, (np.integer,)):
            return int(obj)
        elif isinstance(obj, (np.floating,)):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return obj

    serializable_results = _make_serializable(results)

    if output_file:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(serializable_results, f, indent=2)
        logger.info(f"Saved test evaluation results to {output_file}")

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model_dir", type=str, default="nlp/models/trievo_ner")
    parser.add_argument("--test_file", type=str, default="nlp/data/processed/bc5cdr/test.jsonl")
    parser.add_argument("--output_file", type=str, default="nlp/evaluation/test_results.json")
    parser.add_argument("--max_samples", type=int, default=1000)
    args = parser.parse_args()

    run_evaluation(args.model_dir, args.test_file, args.output_file, max_samples=args.max_samples)
