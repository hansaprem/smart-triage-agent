"""
Trievo Healthcare - Custom Clinical Emergency Evaluation Runner
==============================================================
Runs the trained Clinical NER model against Trievo-specific acute clinical cases:
- Evaluates detection on cardiovascular, respiratory, trauma, and infectious complaints
- Formats structured outputs with detected spans, confidence, and triage categorization
"""

import os
import sys
import json
import logging
import argparse

from nlp.inference.predict import TrievoNERPredictor
from nlp.inference.trievo_bridge import TrievoClinicalBridge

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def evaluate_custom_cases(cases_file: str, model_dir: str, output_file: str = None):
    if not os.path.exists(cases_file):
        raise FileNotFoundError(f"Custom test cases file not found: {cases_file}")

    bridge = TrievoClinicalBridge(model_dir=model_dir)

    with open(cases_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    cases = data.get("cases", [])
    results = []

    logger.info(f"Evaluating {len(cases)} custom Trievo emergency test cases...")

    for c in cases:
        case_id = c["id"]
        category = c["category"]
        text = c["text"]

        detected = bridge.extract_triage_symptoms(text)

        res = {
            "case_id": case_id,
            "category": category,
            "text": text,
            "expected_entities": c.get("expected_clinical_entities", []),
            "detected_entities": detected,
            "num_detected": len(detected),
        }
        results.append(res)
        logger.info(f"[{case_id} - {category}] Detected {len(detected)} entities in: '{text[:60]}...'")

    summary = {
        "dataset_type": "CUSTOM_TRIEVO_TEST_DATA",
        "total_cases": len(cases),
        "total_entities_detected": sum(r["num_detected"] for r in results),
        "case_evaluations": results,
    }

    if output_file:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, indent=2)
        logger.info(f"Custom case evaluation saved to {output_file}")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--cases", type=str, default="nlp/data/custom/trievo_test_cases.json")
    parser.add_argument("--model_dir", type=str, default="nlp/models/trievo_ner")
    parser.add_argument("--output", type=str, default="nlp/evaluation/custom_test_results.json")
    args = parser.parse_args()

    evaluate_custom_cases(args.cases, args.model_dir, args.output)
