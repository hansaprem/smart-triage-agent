"""
Trievo Healthcare - Clinical NLP Label Harmonization & Schema Mapping
=====================================================================
Harmonizes entity and assertion annotation schemas across multiple clinical/biomedical datasets:
1. BC5CDR (BioCreative V Chemical-Disease Relations)
2. MedMentions ST21pv (NCBI/NLM UMLS Concepts)
3. i2b2/VA 2010 Concepts & Assertions (Harvard DBMI n2c2)

Unified Trievo NER Labels:
- DISEASE_PROBLEM: Diseases, syndromes, conditions, disorders, acute pathologies
- MEDICATION_CHEMICAL: Medications, pharmaceutical drugs, active substances, chemicals
- SYMPTOM_SIGN: Cardinal patient symptoms, physical signs, acute presentations
- PROCEDURE_TEST: Clinical procedures, diagnostic tests, imaging, laboratory evaluations
"""

from typing import Dict, List, Optional

# Core Trievo Clinical NER Label Schema (BIO format)
TRIEVO_NER_TAGS = [
    "O",
    "B-DISEASE_PROBLEM",
    "I-DISEASE_PROBLEM",
    "B-MEDICATION_CHEMICAL",
    "I-MEDICATION_CHEMICAL",
    "B-SYMPTOM_SIGN",
    "I-SYMPTOM_SIGN",
    "B-PROCEDURE_TEST",
    "I-PROCEDURE_TEST",
]

LABEL2ID: Dict[str, int] = {tag: i for i, tag in enumerate(TRIEVO_NER_TAGS)}
ID2LABEL: Dict[int, str] = {i: tag for i, tag in enumerate(TRIEVO_NER_TAGS)}

# Assertion classification schema (aligned with i2b2 2010)
TRIEVO_ASSERTION_TAGS = [
    "present",
    "absent",      # Negated / denied
    "possible",    # Suspected / uncertain
    "conditional",
    "hypothetical",
    "associated_with_other",
]

ASSERTION2ID: Dict[str, int] = {tag: i for i, tag in enumerate(TRIEVO_ASSERTION_TAGS)}
ID2ASSERTION: Dict[int, str] = {i: tag for i, tag in enumerate(TRIEVO_ASSERTION_TAGS)}

# Source dataset mappings
BC5CDR_LABEL_MAP: Dict[str, str] = {
    "Disease": "DISEASE_PROBLEM",
    "Chemical": "MEDICATION_CHEMICAL",
}

MEDMENTIONS_ST21PV_MAP: Dict[str, str] = {
    # Diseases, disorders & pathologies
    "T047": "DISEASE_PROBLEM",   # Disease or Syndrome
    "T048": "DISEASE_PROBLEM",   # Mental or Behavioral Dysfunction
    "T191": "DISEASE_PROBLEM",   # Neoplastic Process
    "T037": "DISEASE_PROBLEM",   # Injury or Poisoning
    
    # Signs and symptoms
    "T184": "SYMPTOM_SIGN",      # Sign or Symptom
    "T033": "SYMPTOM_SIGN",      # Finding
    
    # Medications & Chemicals
    "T121": "MEDICATION_CHEMICAL",  # Pharmacologic Substance
    "T200": "MEDICATION_CHEMICAL",  # Clinical Drug
    "T109": "MEDICATION_CHEMICAL",  # Organic Chemical
    "T125": "MEDICATION_CHEMICAL",  # Hormone
    "T129": "MEDICATION_CHEMICAL",  # Immunologic Factor
    
    # Procedures & Diagnostic Tests
    "T060": "PROCEDURE_TEST",    # Diagnostic Procedure
    "T061": "PROCEDURE_TEST",    # Therapeutic or Preventive Procedure
}

I2B2_2010_LABEL_MAP: Dict[str, str] = {
    "problem": "DISEASE_PROBLEM",
    "treatment": "MEDICATION_CHEMICAL",
    "test": "PROCEDURE_TEST",
}

I2B2_2010_ASSERTION_MAP: Dict[str, str] = {
    "present": "present",
    "absent": "absent",
    "possible": "possible",
    "conditional": "conditional",
    "hypothetical": "hypothetical",
    "associated with someone else": "associated_with_other",
    "not associated with the patient": "associated_with_other",
}


def map_source_label(source_dataset: str, original_label: str) -> Optional[str]:
    """
    Map an original dataset annotation to the common Trievo schema.
    Returns None if label should be excluded from unified training.
    """
    source = source_dataset.lower()
    if "bc5cdr" in source:
        return BC5CDR_LABEL_MAP.get(original_label)
    elif "medmentions" in source:
        return MEDMENTIONS_ST21PV_MAP.get(original_label)
    elif "i2b2" in source:
        return I2B2_2010_LABEL_MAP.get(original_label.lower())
    return None


def get_bio_tag(entity_type: str, is_first: bool) -> str:
    """Helper to produce BIO tag string."""
    prefix = "B-" if is_first else "I-"
    return f"{prefix}{entity_type}"
