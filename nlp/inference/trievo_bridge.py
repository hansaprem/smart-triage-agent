"""
Trievo Healthcare - Frontend & Triage Engine Integration Bridge
==============================================================
Provides seamless integration between the trained Trievo Clinical NER model
and Trievo's emergency triage data structures (DetectedSymptom[]).

Maps detected clinical entities into Trievo's exact TypeScript interface:
{
  name: string;
  severity: "High" | "Moderate" | "Mild";
  category: string;
  highlightWords: string[];
}
"""

import os
import sys
from typing import List, Dict, Any

from nlp.inference.predict import TrievoNERPredictor


class TrievoClinicalBridge:
    def __init__(self, model_dir: str = "nlp/models/trievo_ner"):
        self.predictor = TrievoNERPredictor(model_dir=model_dir)

    def extract_triage_symptoms(self, clinical_text: str) -> List[Dict[str, Any]]:
        """
        Extracts entities using the trained clinical model and converts them
        into Trievo's DetectedSymptom format.
        """
        raw_entities = self.predictor.predict(clinical_text)
        detected_symptoms = []

        for ent in raw_entities:
            text = ent["text"].strip()
            label = ent["label"]
            conf = ent["confidence"]

            # Map label to clinical category
            if label == "DISEASE_PROBLEM":
                category = "Cardiovascular / Acute Condition" if any(w in text.lower() for w in ["chest", "cardiac", "infarct", "hypertens", "angina"]) else "Pathology / Clinical Problem"
                default_severity = "High" if conf > 0.8 else "Moderate"
            elif label == "SYMPTOM_SIGN":
                category = "Patient Symptom / Cardinal Sign"
                default_severity = "Moderate"
            elif label == "MEDICATION_CHEMICAL":
                category = "Pharmacology / Active Substance"
                default_severity = "Mild"
            elif label == "PROCEDURE_TEST":
                category = "Diagnostic / Clinical Procedure"
                default_severity = "Mild"
            else:
                category = "Clinical Observation"
                default_severity = "Mild"

            words = [w for w in text.split() if len(w) > 2]

            detected_symptoms.append({
                "name": text.capitalize(),
                "severity": default_severity,
                "category": category,
                "highlightWords": words if words else [text],
                "confidence": conf,
                "entityType": label,
                "span": [ent["start"], ent["end"]],
            })

        return detected_symptoms


if __name__ == "__main__":
    import json
    sample = "Patient with acute angina and persistent tachycardia was given intravenous morphine and atenolol."
    bridge = TrievoClinicalBridge()
    result = bridge.extract_triage_symptoms(sample)
    print("TRIEVO BRIDGE FORMATTED OUTPUT:")
    print(json.dumps(result, indent=2))
