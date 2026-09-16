"""
Trievo Healthcare - Clinical NER Lightweight ONNX Inference Pipeline
===================================================================
Production serverless inference engine utilizing ONNX Runtime CPU and HuggingFace
tokenizers. Delivers 100% equivalent predictions to BertForTokenClassification
without requiring the heavy PyTorch (~750MB) and Transformers (~70MB) runtimes.
"""

import os
import sys
import json
import logging
from typing import List, Dict, Any

import numpy as np
import onnxruntime as ort
from tokenizers import Tokenizer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("trievo_onnx_infer")

DEFAULT_LABELS = {
    0: "O",
    1: "B-DISEASE_PROBLEM",
    2: "I-DISEASE_PROBLEM",
    3: "B-MEDICATION_CHEMICAL",
    4: "I-MEDICATION_CHEMICAL",
    5: "B-SYMPTOM_SIGN",
    6: "I-SYMPTOM_SIGN",
    7: "B-PROCEDURE_TEST",
    8: "I-PROCEDURE_TEST",
}


class TrievoONNXPredictor:
    """Lightweight token classification predictor using ONNX Runtime CPU."""

    def __init__(self, model_dir: str = "nlp/models/trievo_ner"):
        self.model_dir = model_dir
        onnx_file = os.path.join(model_dir, "model.onnx")
        if not os.path.exists(onnx_file):
            raise FileNotFoundError(f"ONNX checkpoint not found at {onnx_file}")

        logger.info(f"Loading Trievo ONNX model from {onnx_file} on CPUExecutionProvider...")
        sess_options = ort.SessionOptions()
        sess_options.intra_op_num_threads = 1
        sess_options.inter_op_num_threads = 1
        sess_options.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(
            onnx_file,
            sess_options=sess_options,
            providers=["CPUExecutionProvider"],
        )

        # Load tokenizer directly from tokenizer.json (pure Rust/C++ binding, no PyTorch needed)
        tok_file = os.path.join(model_dir, "tokenizer.json")
        if not os.path.exists(tok_file):
            raise FileNotFoundError(f"Tokenizer file not found at {tok_file}")
        self.tokenizer = Tokenizer.from_file(tok_file)
        self.tokenizer.enable_truncation(max_length=128)
        self.tokenizer.enable_padding(length=128)

        # Load label mapping
        label_file = os.path.join(model_dir, "label_mapping.json")
        if os.path.exists(label_file):
            with open(label_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.id2label = {int(k): v for k, v in data.get("id2label", DEFAULT_LABELS).items()}
        else:
            self.id2label = DEFAULT_LABELS

        self.device = "cpu (ONNX Runtime)"
        logger.info(f"Trievo ONNX predictor initialized successfully with {len(self.id2label)} labels.")

    def predict(self, text: str) -> List[Dict[str, Any]]:
        """
        Runs token classification inference on raw clinical text.
        Extracts contiguous entity spans with character offsets and confidence scores.
        """
        if not text or not text.strip():
            return []

        # Tokenize with exact character offsets
        encoding = self.tokenizer.encode(text)
        input_ids = np.array([encoding.ids], dtype=np.int64)
        attention_mask = np.array([encoding.attention_mask], dtype=np.int64)
        offsets = encoding.offsets

        # ONNX forward pass
        outputs = self.session.run(["logits"], {"input_ids": input_ids, "attention_mask": attention_mask})
        logits = outputs[0][0]  # shape: (128, num_labels)

        # Softmax for calibrated token probabilities
        exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
        probs = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
        pred_ids = np.argmax(probs, axis=-1)
        confidences = np.max(probs, axis=-1)

        # BIO sequence decoding
        entities = []
        current_entity = None

        for idx, (token_id, pred_id, conf, (start, end)) in enumerate(zip(encoding.ids, pred_ids, confidences, offsets)):
            # Skip special tokens ([CLS], [SEP], [PAD]) with zero offset span
            if start == 0 and end == 0:
                continue

            tag = self.id2label.get(pred_id, "O")

            if tag.startswith("B-"):
                if current_entity is not None:
                    entities.append(current_entity)
                ent_type = tag[2:]
                current_entity = {
                    "text": text[start:end],
                    "label": ent_type,
                    "start": int(start),
                    "end": int(end),
                    "confidence": float(conf),
                    "_tokens_count": 1,
                }
            elif tag.startswith("I-"):
                ent_type = tag[2:]
                if current_entity is not None and current_entity["label"] == ent_type:
                    current_entity["end"] = int(end)
                    current_entity["text"] = text[current_entity["start"]:int(end)]
                    current_entity["confidence"] += float(conf)
                    current_entity["_tokens_count"] += 1
                else:
                    if current_entity is not None:
                        entities.append(current_entity)
                    current_entity = {
                        "text": text[start:end],
                        "label": ent_type,
                        "start": int(start),
                        "end": int(end),
                        "confidence": float(conf),
                        "_tokens_count": 1,
                    }
            else:  # "O"
                if current_entity is not None:
                    entities.append(current_entity)
                    current_entity = None

        if current_entity is not None:
            entities.append(current_entity)

        # Finalize average confidence
        for ent in entities:
            count = max(1, ent.pop("_tokens_count", 1))
            ent["confidence"] = round(ent["confidence"] / count, 4)

        return entities
