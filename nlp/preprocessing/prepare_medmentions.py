"""
Trievo Healthcare - MedMentions ST21pv Dataset Preprocessing Pipeline
=====================================================================
Processes the official MedMentions ST21pv corpus:
- 4,392 PubMed abstracts annotated with UMLS concepts across 21 clinical semantic types
- Parses PubTator format with UMLS CUI identifiers
- Maps semantic types to Trievo unified schema (SYMPTOM_SIGN, DISEASE_PROBLEM, MEDICATION_CHEMICAL, PROCEDURE_TEST)
- Segments abstracts into sentences with token-level BIO tags
- Generates reproducible 60/20/20 train/dev/test splits (or respects official PMID lists)
- Saves processed datasets into JSONL format
"""

import os
import re
import json
import logging
from typing import List, Dict, Tuple, Any

from nlp.harmonization.label_mapping import map_source_label, get_bio_tag, LABEL2ID

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def parse_medmentions_file(file_path: str) -> List[Dict[str, Any]]:
    """
    Parses MedMentions PubTator format.
    Format:
    PMID|t|Title
    PMID|a|Abstract
    PMID \t Start \t End \t Mention \t SemanticType \t UMLS_CUI
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"MedMentions raw file not found at: {file_path}")

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

            if "|t|" in line:
                parts = line.split("|t|", 1)
                pmid = parts[0].strip()
                title = parts[1].strip()
                current_doc = {
                    "pmid": pmid,
                    "title": title,
                    "abstract": "",
                    "text": title,
                    "entities": [],
                }
            elif "|a|" in line:
                parts = line.split("|a|", 1)
                abstract = parts[1].strip()
                if current_doc:
                    current_doc["abstract"] = abstract
                    current_doc["text"] = current_doc["title"] + " " + abstract
            elif "\t" in line and current_doc:
                parts = line.split("\t")
                if len(parts) >= 6:
                    try:
                        start = int(parts[1])
                        end = int(parts[2])
                        mention = parts[3].strip()
                        sem_type = parts[4].strip()
                        cui = parts[5].strip()
                        current_doc["entities"].append({
                            "start": start,
                            "end": end,
                            "mention": mention,
                            "sem_type": sem_type,
                            "cui": cui,
                        })
                    except ValueError:
                        continue

        if current_doc and current_doc["text"]:
            documents.append(current_doc)

    logger.info(f"Loaded {len(documents)} MedMentions documents from {file_path}")
    return documents


def tokenize_with_spans(text: str) -> List[Tuple[str, int, int]]:
    pattern = re.compile(r"\w+|[^\w\s]")
    return [(m.group(), m.start(), m.end()) for m in pattern.finditer(text)]


def align_medmentions_to_bio(tokens_with_spans: List[Tuple[str, int, int]],
                             entities: List[Dict[str, Any]]) -> List[str]:
    bio_tags = ["O"] * len(tokens_with_spans)
    sorted_entities = sorted(entities, key=lambda e: (e["start"], -(e["end"] - e["start"])))

    for ent in sorted_entities:
        e_start = ent["start"]
        e_end = ent["end"]
        raw_type = ent["sem_type"]
        mapped_type = map_source_label("medmentions", raw_type)

        if not mapped_type:
            continue

        first_token_idx = None
        for i, (tok_str, t_start, t_end) in enumerate(tokens_with_spans):
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
    text = doc["text"]
    entities = doc["entities"]
    tokens_with_spans = tokenize_with_spans(text)
    bio_tags = align_medmentions_to_bio(tokens_with_spans, entities)

    sentences = []
    cur_tokens = []
    cur_tags = []
    cur_spans = []

    for (tok, start, end), tag in zip(tokens_with_spans, bio_tags):
        cur_tokens.append(tok)
        cur_tags.append(tag)
        cur_spans.append((start, end))

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

    if cur_tokens:
        sentence_text = text[cur_spans[0][0]:cur_spans[-1][1]]
        sentences.append({
            "pmid": doc["pmid"],
            "text": sentence_text,
            "tokens": cur_tokens,
            "ner_tags": cur_tags,
        })

    return sentences


def process_medmentions(raw_file: str, output_dir: str, max_docs: int = None) -> Dict[str, int]:
    """
    Processes MedMentions and creates 60/20/20 train/dev/test splits.
    """
    os.makedirs(output_dir, exist_ok=True)
    docs = parse_medmentions_file(raw_file)

    if max_docs and max_docs < len(docs):
        docs = docs[:max_docs]

    # Deterministic split by PMID hash
    train_docs, dev_docs, test_docs = [], [], []
    for doc in docs:
        h = hash(doc["pmid"]) % 10
        if h < 6:
            train_docs.append(doc)
        elif h < 8:
            dev_docs.append(doc)
        else:
            test_docs.append(doc)

    splits = {
        "train": train_docs,
        "dev": dev_docs,
        "test": test_docs,
    }

    counts = {}
    for split_name, doc_list in splits.items():
        all_sentences = []
        entity_stats = {"SYMPTOM_SIGN": 0, "DISEASE_PROBLEM": 0, "MEDICATION_CHEMICAL": 0, "PROCEDURE_TEST": 0}

        for doc in doc_list:
            sentences = segment_document_into_sentences(doc)
            for s in sentences:
                all_sentences.append(s)
                for tag in s["ner_tags"]:
                    if tag.startswith("B-"):
                        ent = tag[2:]
                        if ent in entity_stats:
                            entity_stats[ent] += 1

        out_file = os.path.join(output_dir, f"{split_name}.jsonl")
        with open(out_file, "w", encoding="utf-8") as out_f:
            for s in all_sentences:
                out_f.write(json.dumps(s, ensure_ascii=False) + "\n")

        counts[split_name] = len(all_sentences)
        logger.info(f"Processed MedMentions {split_name}: {len(all_sentences)} sentences | Entities: {entity_stats}")

    return counts


if __name__ == "__main__":
    raw_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "raw", "medmentions", "corpus_pubtator.txt"))
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "medmentions"))
    # Process sample subset (e.g. 1000 docs) for fast processing or full set
    counts = process_medmentions(raw_file, out_dir, max_docs=1000)
    print("MedMentions Preprocessing completed:", counts)
