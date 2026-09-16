# TRIEVO Healthcare — Clinical NLP Subsystem

**Production Clinical Named Entity Recognition (NER) & Extraction Architecture**  
*Integrated into the Trievo Smart Triage Decision-Support Platform (`smart-triage-agent/`)*

---

## 1. Project Objective & Scope

The Trievo Clinical NLP subsystem ingests unstructured clinical free text (e.g. nurse triage narratives, emergency intake notes, patient self-reported chief complaints) and extracts structured clinical entities:
- **Diseases, Syndromes & Clinical Conditions** (`DISEASE_PROBLEM`)
- **Cardinal Patient Symptoms & Clinical Signs** (`SYMPTOM_SIGN`)
- **Medications, Therapeutics & Chemical Substances** (`MEDICATION_CHEMICAL`)
- **Clinical Procedures & Diagnostic Tests** (`PROCEDURE_TEST`)

### Scope Boundary
- **In-Scope**: Clinical token classification, span-level entity extraction, label harmonization across clinical datasets, held-out evaluation, and inference bridges.
- **Out-of-Scope**: Priority Engine, emergency triage scoring, and vital sign thresholds (handled independently by the triage engine in `lib/triage-engine.ts`).

---

## 2. Dataset Decision Matrix & Status

| Dataset | Task | Annotation Type | Labels | Records / Size | Access Requirement | Role in Trievo | Direct Training / Domain Adaptation / Custom |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BC5CDR** | Disease & Chemical NER | PubTator token-level entity spans | `Disease`, `Chemical`, MeSH IDs | 1,500 abstracts (12,850+ entities) | **OPEN** (Public Domain / CC0) | Core Supervised NER Model | **Direct Supervised Training** |
| **MedMentions (ST21pv)** | Biomedical NER & UMLS Normalization | PubTator entity spans + UMLS CUIs | 21 clinical semantic types (T047, T184, T121, etc.) | 4,392 abstracts (350k+ mentions) | **OPEN** (Public Domain / CC0) | Symptom & Concept Normalization | **Direct Supervised Training** |
| **i2b2/VA 2010** | Clinical Problem NER & Assertion | Character offsets + Assertion categories | `problem`, `treatment`, `test`; 6 assertion classes | 826 discharge summaries & ICU notes | **RESTRICTED** (Academic DUA via Harvard DBMI) | Clinical Assertion / Negation Pipeline | **Direct Training (Pipeline Ready, Pending DUA)** |
| **MIMIC-IV-Note (v2.2)** | Clinical Free-Text Ingestion | Document-level metadata only; **no token NER** | Metadata (`charttime`, `note_type`, `text`) | 331k discharge + 2.3M radiology notes | **RESTRICTED** (PhysioNet CITI Certificate + DUA) | Clinical Domain Adaptation / MLM Pretraining | **Domain Adaptation / Custom Annotation Source** |

---

## 3. Label Harmonization Strategy

To eliminate annotation conflicts between PubMed biomedical abstracts, clinical progress notes, and triage intakes, annotations are mapped into Trievo's unified schema:

```
SOURCE DATASET          ORIGINAL LABEL           TRIEVO UNIFIED LABEL
-------------------------------------------------------------------------
BC5CDR                  Disease                  DISEASE_PROBLEM
BC5CDR                  Chemical                 MEDICATION_CHEMICAL

MedMentions (ST21pv)    T047 (Disease/Syndrome)  DISEASE_PROBLEM
MedMentions (ST21pv)    T048 (Mental Dysfunction)DISEASE_PROBLEM
MedMentions (ST21pv)    T191 (Neoplastic)        DISEASE_PROBLEM
MedMentions (ST21pv)    T184 (Sign or Symptom)   SYMPTOM_SIGN
MedMentions (ST21pv)    T033 (Finding)           SYMPTOM_SIGN
MedMentions (ST21pv)    T121 (Pharmacologic)     MEDICATION_CHEMICAL
MedMentions (ST21pv)    T200 (Clinical Drug)     MEDICATION_CHEMICAL
MedMentions (ST21pv)    T060 (Diagnostic Proc)   PROCEDURE_TEST

i2b2/VA 2010            problem                  DISEASE_PROBLEM
i2b2/VA 2010            treatment                MEDICATION_CHEMICAL
i2b2/VA 2010            test                     PROCEDURE_TEST
```

---

## 4. Architecture & Directory Layout

```
smart-triage-agent/
└── nlp/
    ├── data/
    │   ├── raw/
    │   │   ├── bc5cdr/            # Official BC5CDR PubTator files
    │   │   ├── medmentions/        # Official MedMentions ST21pv corpus
    │   │   ├── i2b2_2010/         # DUA placeholder & instructions
    │   │   └── mimic/             # PhysioNet DUA placeholder & instructions
    │   ├── processed/             # Tokenized BIO datasets (train, dev, test)
    │   └── custom/                # 12 Trievo acute emergency test cases
    ├── preprocessing/
    │   ├── prepare_bc5cdr.py      # BC5CDR parser -> BIO jsonl
    │   ├── prepare_medmentions.py # MedMentions parser -> BIO jsonl
    │   ├── prepare_i2b2.py        # n2c2 .con/.ast parser
    │   └── prepare_mimic.py       # MIMIC cleaner & text segmenter
    ├── harmonization/
    │   └── label_mapping.py       # Unified label schema & mappings
    ├── training/
    │   └── train_ner.py           # PyTorch Transformer fine-tuning pipeline
    ├── evaluation/
    │   ├── evaluate_ner.py        # Official test evaluation (seqeval)
    │   └── run_trievo_tests.py    # Custom clinical emergency validation
    ├── inference/
    │   ├── predict.py             # Real-time span extraction engine
    │   └── trievo_bridge.py       # Bridge to frontend DetectedSymptom[]
    ├── models/
    │   └── trievo_ner/            # Saved weights, tokenizer, config
    ├── configs/
    │   └── ner_config.yaml        # Training hyperparameters
    ├── tests/
    │   └── test_ner.py            # Unit test suite
    ├── requirements.txt
    └── README.md
```

---

## 5. Model Training & Evaluation Workflow

### Step 1: Preprocess Accessible Datasets
```bash
python -m nlp.preprocessing.prepare_bc5cdr
python -m nlp.preprocessing.prepare_medmentions
```

### Step 2: Train Clinical NER Model
```bash
python -m nlp.training.train_ner --config nlp/configs/ner_config.yaml --epochs 3 --batch_size 16
```

### Step 3: Evaluate on Held-Out Test Data
```bash
python -m nlp.evaluation.evaluate_ner --model_dir nlp/models/trievo_ner --test_file nlp/data/processed/bc5cdr/test.jsonl
```

### Step 4: Run Real-Time Clinical Inference
```bash
python -m nlp.inference.predict --text "Patient has severe acute chest pain and was given nitroglycerin."
```

### Step 5: Test Against Custom Trievo Emergency Cases
```bash
python -m nlp.evaluation.run_trievo_tests
```

---

## 6. Dataset Gaps & Future Roadmap

1. **Assertion / Negation Classification**:
   - `i2b2/VA 2010`: Pipeline is fully implemented in `prepare_i2b2.py`. Once the user acquires approval via the Harvard DBMI portal, the corpus can be processed for assertion training.
2. **Clinical Free-Text Domain Adaptation**:
   - `MIMIC-IV-Note`: Preprocessing script `prepare_mimic.py` is configured for Masked Language Modeling once PhysioNet credentialing is established.
3. **Severity & Duration**:
   - Standard public clinical datasets lack direct token-level severity/duration annotations. The current model detects clinical problems and medications; duration and severity extraction currently rely on rule-based qualifiers until custom annotated datasets are completed.
4. **Disease-Specific Gaps (TB, Dengue, Trauma)**:
   - Evaluated via `nlp/data/custom/trievo_test_cases.json`. Marked for domain-specific custom active-learning annotation.
