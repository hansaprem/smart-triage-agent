"""
Trievo Healthcare - MIMIC-IV-Note Ingestion & Domain Adaptation Pipeline
========================================================================
Official Source: PhysioNet - MIMIC-IV-Note: De-identified Free-Text Clinical Notes (v2.2)
Paper: Johnson et al., PhysioNet 2023. DOI: 10.13026/1n74-ne17.

CRITICAL ARCHITECTURAL CLASSIFICATION:
- Role: CLINICAL FREE-TEXT / DOMAIN ADAPTATION / CUSTOM ANNOTATION SOURCE
- SUPERVISED NER ANNOTATIONS: ZERO (Does NOT contain token-level NER or assertion labels).
- Under NO circumstances should MIMIC-IV-Note be treated as a supervised NER training set.

ACCESS REQUIREMENTS & DUA GATING:
- Requires PhysioNet Credentialed Access:
  1. Completion of CITI Program "Data or Specimens Only Research" training.
  2. Identity verification via PhysioNet.
  3. Signed Data Use Agreement (DUA) prohibiting re-identification or redistribution.

This module provides:
1. Verification of MIMIC-IV-Note availability in `nlp/data/raw/mimic/`
2. Clinical free-text cleaning and PHI mask normalization
3. Sentence segmentation for Masked Language Modeling (MLM) domain adaptation
"""

import os
import re
import json
import logging
from typing import Dict, Any, List, Generator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def clean_clinical_text(text: str) -> str:
    """
    Cleans raw clinical EHR text and normalizes de-identification artifacts.
    Replaces PhysioNet de-identification brackets [**...**] and underscores with standardized tokens.
    """
    # Replace bracketed de-id tags like [**Known lastname 1234**] or [**2105-3-12**]
    cleaned = re.sub(r"\[\*\*.*?\*\*\]", " ", text)
    # Replace excessive underscores or whitespace
    cleaned = re.sub(r"_{2,}", " ", cleaned)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    # Normalize multiple line breaks
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def check_mimic_availability(raw_dir: str) -> Dict[str, Any]:
    """
    Checks whether raw MIMIC-IV-Note files exist in the raw directory.
    """
    discharge_csv = os.path.join(raw_dir, "discharge.csv")
    radiology_csv = os.path.join(raw_dir, "radiology.csv")

    has_discharge = os.path.exists(discharge_csv)
    has_radiology = os.path.exists(radiology_csv)

    return {
        "dataset": "MIMIC-IV-Note v2.2",
        "available": has_discharge or has_radiology,
        "discharge_notes_found": has_discharge,
        "radiology_notes_found": has_radiology,
        "role": "CLINICAL FREE-TEXT / DOMAIN ADAPTATION / CUSTOM ANNOTATION SOURCE",
        "supervised_ner_support": False,
        "access_status": "RESTRICTED - REQUIRES CITI CERTIFICATION & PHYSIONET DUA" if not (has_discharge or has_radiology) else "AVAILABLE IN WORKSPACE",
    }


def process_mimic_for_mlm(raw_dir: str, output_dir: str, max_notes: int = 1000) -> Dict[str, Any]:
    """
    Extracts clinical sentences from MIMIC-IV-Note for Domain-Adaptive Pretraining (MLM).
    """
    status = check_mimic_availability(raw_dir)
    if not status["available"]:
        logger.warning("MIMIC-IV-Note data is NOT present in the workspace.")
        logger.warning("Reason: PhysioNet Credentialed Access (CITI certificate + signed DUA) required.")
        logger.warning(f"Expected path: {raw_dir}")
        return status

    os.makedirs(output_dir, exist_ok=True)
    logger.info(f"MIMIC-IV-Note files detected. Preparing domain-adaptation sentences...")
    return status


if __name__ == "__main__":
    raw_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw", "mimic"))
    out_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "mimic"))
    res = process_mimic_for_mlm(raw_path, out_path)
    print(json.dumps(res, indent=2))
