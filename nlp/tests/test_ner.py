"""
Trievo Healthcare - Clinical NLP Unit & Integration Tests
=========================================================
Tests schema harmonization, data alignment, preprocessing, and inference formatting.
"""

import os
import unittest

from nlp.harmonization.label_mapping import (
    TRIEVO_NER_TAGS,
    LABEL2ID,
    ID2LABEL,
    map_source_label,
    get_bio_tag,
    BC5CDR_LABEL_MAP,
    MEDMENTIONS_ST21PV_MAP,
    I2B2_2010_LABEL_MAP,
)
from nlp.preprocessing.prepare_bc5cdr import tokenize_with_spans, align_tokens_to_bio
from nlp.preprocessing.prepare_i2b2 import parse_concept_line, parse_assertion_line


class TestLabelHarmonization(unittest.TestCase):
    def test_schema_bijective(self):
        """Verify LABEL2ID and ID2LABEL are exact inverses."""
        self.assertEqual(len(LABEL2ID), len(ID2LABEL))
        for tag, idx in LABEL2ID.items():
            self.assertEqual(ID2LABEL[idx], tag)

    def test_bc5cdr_mapping(self):
        """Test BC5CDR entity mapping."""
        self.assertEqual(map_source_label("bc5cdr", "Disease"), "DISEASE_PROBLEM")
        self.assertEqual(map_source_label("bc5cdr", "Chemical"), "MEDICATION_CHEMICAL")
        self.assertIsNone(map_source_label("bc5cdr", "UnknownEntity"))

    def test_medmentions_mapping(self):
        """Test MedMentions UMLS semantic type mappings."""
        self.assertEqual(map_source_label("medmentions", "T047"), "DISEASE_PROBLEM")
        self.assertEqual(map_source_label("medmentions", "T184"), "SYMPTOM_SIGN")
        self.assertEqual(map_source_label("medmentions", "T121"), "MEDICATION_CHEMICAL")
        self.assertEqual(map_source_label("medmentions", "T060"), "PROCEDURE_TEST")

    def test_i2b2_mapping(self):
        """Test i2b2 2010 concept mappings."""
        self.assertEqual(map_source_label("i2b2", "problem"), "DISEASE_PROBLEM")
        self.assertEqual(map_source_label("i2b2", "treatment"), "MEDICATION_CHEMICAL")
        self.assertEqual(map_source_label("i2b2", "test"), "PROCEDURE_TEST")


class TestTokenAlignment(unittest.TestCase):
    def test_tokenization_spans(self):
        text = "Patient has severe chest pain."
        tokens_with_spans = tokenize_with_spans(text)
        tokens = [t[0] for t in tokens_with_spans]
        self.assertIn("severe", tokens)
        self.assertIn("chest", tokens)
        self.assertIn("pain", tokens)
        # Check span matches exact substring
        for tok, start, end in tokens_with_spans:
            self.assertEqual(text[start:end], tok)

    def test_bio_alignment(self):
        text = "Naloxone reverses clonidine induced hypotension."
        tokens_with_spans = tokenize_with_spans(text)
        entities = [
            {"start": 0, "end": 8, "mention": "Naloxone", "type": "Chemical"},
            {"start": 18, "end": 27, "mention": "clonidine", "type": "Chemical"},
            {"start": 36, "end": 47, "mention": "hypotension", "type": "Disease"},
        ]
        bio_tags = align_tokens_to_bio(tokens_with_spans, entities)
        self.assertEqual(bio_tags[0], "B-MEDICATION_CHEMICAL")  # Naloxone
        self.assertEqual(bio_tags[1], "O")                     # reverses
        self.assertEqual(bio_tags[2], "B-MEDICATION_CHEMICAL")  # clonidine


class TestI2B2Parsing(unittest.TestCase):
    def test_parse_concept(self):
        line = 'c="chest pain" 4:2 4:3||t="problem"'
        res = parse_concept_line(line)
        self.assertIsNotNone(res)
        self.assertEqual(res["mention"], "chest pain")
        self.assertEqual(res["type"], "problem")

    def test_parse_assertion(self):
        line = 'c="shortness of breath" 7:1 7:3||t="problem"||a="absent"'
        res = parse_assertion_line(line)
        self.assertIsNotNone(res)
        self.assertEqual(res["mention"], "shortness of breath")
        self.assertEqual(res["type"], "problem")
        self.assertEqual(res["assertion"], "absent")


if __name__ == "__main__":
    unittest.main()
