"""
Trievo Healthcare - BC5CDR Dataset Preprocessing Pipeline
==========================================================
Processes the official BioCreative V Chemical-Disease Relation (BC5CDR) corpus:
- Parses PubTator format (Title, Abstract, tab-delimited annotations)
- Aligns character offsets with token spans
- Maps annotations to Trievo unified clinical BIO tags (DISEASE_PROBLEM, MEDICATION_CHEMICAL)
- Segments abstracts into sentences to maintain maximum transformer fidelity
- Saves processed train, dev, and test splits into JSONL format
"""

import os
import re
import json
import logging
from typing import List, Dict, Tuple, Any

from nlp.harmonization.label_mapping import map_source_label, get_bio_tag, LABEL2ID

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def parse_pubtator_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Parses a PubTator formatted file.
    Returns list of documents with:
      pmid, text, entities: list of (start, end, text, type, mesh_id)
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Raw BC5CDR file not found at: {file_path}")

    documents = []
    current_doc = None

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                if current_doc and current_doc["text"]:
                    documents.append(current_doc)
                    current_doc = None
                continue

            # Title line: PMID|t|Title
            if "|t|" in line:
                parts = line.split("|t|", 1)
                pmid = parts[0].strip()
                title = parts[1].strip()
                current_doc = {
                    "pmid": pmid,
                    "title": title,
                    "abstract": "",
                    "text": title,
                    "title_len": len(title),
                    "entities": [],
                }
            # Abstract line: PMID|a|Abstract
            elif "|a|" in line:
                parts = line.split("|a|", 1)
                abstract = parts[1].strip()
                if current_doc:
                    current_doc["abstract"] = abstract
                    # In PubTator, abstract is appended after a space
                    current_doc["text"] = current_doc["title"] + " " + abstract

            # Entity line: PMID \t start \t end \t mention \t type \t id
            elif "\t" in line:
                parts = line.split("\t")
                if len(parts) >= 6 and current_doc:
                    try:
                        start = int(parts[1])
                        end = int(parts[2])
                        mention = parts[3].strip()
                        ent_type = parts[4].strip()
                        mesh_id = parts[5].strip()
                        current_doc["entities"].append({
                            "start": start,
                            "end": end,
                            "mention": mention,
                            "type": ent_type,
                            "mesh_id": mesh_id,
                        })
                    except ValueError:
                        continue

        if current_doc and current_doc["text"]:
            documents.append(current_doc)

    logger.info(f"Loaded {len(documents)} documents from {file_path}")
    return documents


def tokenize_with_spans(text: str) -> List[Tuple[str, int, int]]:
    """
    Simple whitespace and punctuation-aware word tokenization preserving exact character spans.
    """
    tokens = []
    # Match words, numbers, and individual punctuation marks
    pattern = re.compile(r"\w+|[^\w\s]")
    for match in pattern.finditer(text):
        tokens.append((match.group(), match.start(), match.end()))
    return tokens


def align_tokens_to_bio(tokens_with_spans: List[Tuple[str, int, int]],
                        entities: List[Dict[str, Any]]) -> List[str]:
    """
    Aligns character-level entity spans to token-level BIO labels.
    Handles overlapping/duplicate mentions safely.
    """
    bio_tags = ["O"] * len(tokens_with_spans)

    # Sort entities by start offset
    sorted_entities = sorted(entities, key=lambda e: (e["start"], -(e["end"] - e["start"])))

    for ent in sorted_entities:
        e_start = ent["start"]
        e_end = ent["end"]
        raw_type = ent["type"]
        mapped_type = map_source_label("bc5cdr", raw_type)

        if not mapped_type:
            continue

        # Find overlapping tokens
        first_token_idx = None
        for i, (tok_str, t_start, t_end) in enumerate(tokens_with_spans):
            # Overlap check
            if t_start < e_end and t_end > e_start:
                if first_token_idx is None:
                    first_token_idx = i
                    if bio_tags[i] == "O":
                        bio_tags[i] = get_bio_tag(mapped_type, is_first=True)
                else:
                    if bio_tags[i] == "O":
                        bio_tags[i] = get_bio_tag(mapped_type, is_first=False)

    return bio_tags


def segment_document_into_sentences(doc: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Splits document text into sentence segments while preserving token alignments.
    Uses sentence boundary punctuation (. ! ?).
    """
    text = doc["text"]
    entities = doc["entities"]
    tokens_with_spans = tokenize_with_spans(text)
    bio_tags = align_tokens_to_bio(tokens_with_spans, entities)

    sentences = []
    cur_tokens = []
    cur_tags = []
    cur_spans = []

    for (tok, start, end), tag in zip(tokens_with_spans, bio_tags):
        cur_tokens.append(tok)
        cur_tags.append(tag)
        cur_spans.append((start, end))

        # Check sentence boundary
        if tok in [".", "!", "?"] and len(cur_tokens) >= 5:
            sentence_text = text[cur_spans[0][0]:cur_spans[-1][1]]
            sentences.append({
                "pmid": doc["pmid"],
                "text": sentence_text,
                "tokens": cur_tokens,
                "ner_tags": cur_tags,
            })
            cur_tokens = []
            cur_tags = []
            cur_spans = []

    # Remainder
    if cur_tokens:
        sentence_text = text[cur_spans[0][0]:cur_spans[-1][1]]
        sentences.append({
            "pmid": doc["pmid"],
            "text": sentence_text,
            "tokens": cur_tokens,
            "ner_tags": cur_tags,
        })

    return sentences


def process_bc5cdr(raw_dir: str, output_dir: str) -> Dict[str, int]:
    """
    Processes official BC5CDR train, dev, and test sets.
    """
    os.makedirs(output_dir, exist_ok=True)
    splits = {
        "train": "CDR_TrainingSet.PubTator.txt",
        "dev": "CDR_DevelopmentSet.PubTator.txt",
        "test": "CDR_TestSet.PubTator.txt",
    }

    counts = {}
    for split_name, filename in splits.items():
        file_path = os.path.join(raw_dir, filename)
        docs = parse_pubtator_file(file_path)

        all_sentences = []
        entity_stats = {"DISEASE_PROBLEM": 0, "MEDICATION_CHEMICAL": 0}

        for doc in docs:
            sentences = segment_document_into_sentences(doc)
            for s in sentences:
                all_sentences.append(s)
                for tag in s["ner_tags"]:
                    if tag == "B-DISEASE_PROBLEM":
                        entity_stats["DISEASE_PROBLEM"] += 1
                    elif tag == "B-MEDICATION_CHEMICAL":
                        entity_stats["MEDICATION_CHEMICAL"] += 1

        out_file = os.path.join(output_dir, f"{split_name}.jsonl")
        with open(out_file, "w", encoding="utf-8") as out_f:
            for s in all_sentences:
                out_f.write(json.dumps(s, ensure_ascii=False) + "\n")

        counts[split_name] = len(all_sentences)
        logger.info(f"Processed BC5CDR {split_name}: {len(all_sentences)} sentences | Entities: {entity_stats}")

    return counts


if __name__ == "__main__":
    raw_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw", "bc5cdr"))
    out_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "bc5cdr"))
    counts = process_bc5cdr(raw_path, out_path)
    print("Preprocessing completed:", counts)
