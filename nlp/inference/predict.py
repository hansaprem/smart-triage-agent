"""
Trievo Healthcare - Clinical NER Real-Time Inference Pipeline
=============================================================
Loads the trained Trievo Clinical NER model and produces structured entity predictions
with exact character offsets, entity types, and model confidence scores.
"""

import os
import sys
import json
import logging
import argparse
from typing import List, Dict, Any

import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification

from nlp.harmonization.label_mapping import ID2LABEL

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


class TrievoNERPredictor:
    def __init__(self, model_dir: str = "nlp/models/trievo_ner", device: str = None):
        if not os.path.exists(model_dir):
            raise FileNotFoundError(f"Trained model directory not found at: {model_dir}. Please train the model first.")

        if device:
            self.device = torch.device(device)
        else:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        logger.info(f"Loading Trievo Clinical NER model from {model_dir} on {self.device}...")
        self.tokenizer = AutoTokenizer.from_pretrained(model_dir)
        self.model = AutoModelForTokenClassification.from_pretrained(model_dir)
        self.model.to(self.device)
        self.model.eval()

        # Load label mapping if saved
        label_map_file = os.path.join(model_dir, "label_mapping.json")
        if os.path.exists(label_map_file):
            with open(label_map_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.id2label = {int(k): v for k, v in data.get("id2label", ID2LABEL).items()}
        else:
            self.id2label = ID2LABEL

    def predict(self, text: str) -> List[Dict[str, Any]]:
        """
        Runs inference on raw clinical text.
        Extracts contiguous entity spans with character offsets and confidence scores.
        """
        if not text or not text.strip():
            return []

        # Tokenize with offsets
        encoding = self.tokenizer(
            text,
            return_offsets_mapping=True,
            return_tensors="pt",
            truncation=True,
            max_length=256,
        )

        input_ids = encoding["input_ids"].to(self.device)
        attention_mask = encoding["attention_mask"].to(self.device)
        offset_mapping = encoding["offset_mapping"][0].cpu().numpy()

        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits[0]  # shape: [seq_len, num_labels]
            probs = torch.softmax(logits, dim=-1)
            confidences, pred_ids = torch.max(probs, dim=-1)

        pred_ids = pred_ids.cpu().numpy()
        confidences = confidences.cpu().numpy()

        entities = []
        current_entity = None

        for idx, (pred_id, conf) in enumerate(zip(pred_ids, confidences)):
            start_char, end_char = offset_mapping[idx]
            # Skip special tokens ([CLS], [SEP], padding) where offset length is 0
            if start_char == end_char:
                continue

            tag = self.id2label.get(pred_id, "O")

            if tag.startswith("B-"):
                if current_entity:
                    entities.append(current_entity)
                ent_type = tag[2:]
                current_entity = {
                    "text": text[start_char:end_char],
                    "label": ent_type,
                    "start": int(start_char),
                    "end": int(end_char),
                    "confidence": float(conf),
                    "_tokens_count": 1,
                }
            elif tag.startswith("I-"):
                ent_type = tag[2:]
                if current_entity and current_entity["label"] == ent_type:
                    # Extend current entity span
                    current_entity["end"] = int(end_char)
                    current_entity["text"] = text[current_entity["start"]:current_entity["end"]]
                    current_entity["confidence"] += float(conf)
                    current_entity["_tokens_count"] += 1
                else:
                    if current_entity:
                        entities.append(current_entity)
                    current_entity = {
                        "text": text[start_char:end_char],
                        "label": ent_type,
                        "start": int(start_char),
                        "end": int(end_char),
                        "confidence": float(conf),
                        "_tokens_count": 1,
                    }
            else:  # "O"
                if current_entity:
                    entities.append(current_entity)
                    current_entity = None

        if current_entity:
            entities.append(current_entity)

        # Average confidences and clean up internal fields
        for ent in entities:
            ent["confidence"] = round(ent["confidence"] / max(1, ent.pop("_tokens_count")), 4)

        return entities


def main():
    parser = argparse.ArgumentParser(description="Trievo Clinical NER Inference")
    parser.add_argument("--model_dir", type=str, default="nlp/models/trievo_ner")
    parser.add_argument("--text", type=str, default="Patient has acute severe hypertension and was prescribed clonidine and naloxone.")
    args = parser.parse_args()

    predictor = TrievoNERPredictor(args.model_dir)
    results = predictor.predict(args.text)
    print("\nINPUT CLINICAL TEXT:")
    print(f"\"{args.text}\"")
    print("\nEXTRACTED CLINICAL ENTITIES:")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
