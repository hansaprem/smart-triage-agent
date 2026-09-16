# TRIEVO Healthcare — Clinical NLP Prototype
## Vercel Deployment & Production Architecture Guide

---

### Project Identity & Isolation Verification
- **Project Name**: `trievo-clinical-nlp`
- **Product Name**: `TRIEVO Healthcare — Clinical NLP Prototype`
- **Architecture**: Next.js 14 App Router + Python FastAPI Serverless Functions (`@vercel/python`)
- **Trained Model**: `BertForTokenClassification` on `sentence-transformers/all-MiniLM-L6-v2` (22.5M parameters)
- **Status**: 100% independent application. Completely isolated from any external or academic coursework projects.

---

## 1. Production Architecture on Vercel

```
                                  ┌──────────────────────────────┐
                                  │   Public Vercel Domain URL   │
                                  │   https://<project>.vercel.app│
                                  └──────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │                                                 │
            GET / & /nlp│                                  /api/nlp/*     │
                        ▼                                                 ▼
        ┌───────────────────────────────┐                 ┌───────────────────────────────┐
        │       Next.js 14 Frontend     │                 │   FastAPI Python Serverless   │
        │       (App Router UI)         │                 │       `api/index.py`          │
        ├───────────────────────────────┤                 ├───────────────────────────────┤
        │ - Model Evidence Cards        │                 │ - GET  /api/nlp/health        │
        │ - Official BC5CDR Test Table  │                 │ - GET  /api/nlp/evidence      │
        │ - Convergence History Charts  │                 │ - POST /api/nlp/analyze       │
        │ - Live Interactive Inference  │                 └───────────────┬───────────────┘
        │ - Sentence Span Highlighter   │                                 │
        │ - 4 Clinical Demo Cases       │                                 ▼
        │ - Raw JSON Output Viewer      │                 ┌───────────────────────────────┐
        └───────────────────────────────┘                 │  Trained Trievo Checkpoint    │
                                                          │   `nlp/models/trievo_ner/`    │
                                                          │  (model.safetensors, 90.3MB)  │
                                                          └───────────────────────────────┘
```

---

## 2. Quickstart: Running Locally

### Step 1: Start the Python FastAPI Inference Engine
From the project root:
```bash
python -m uvicorn api.index:app --host 127.0.0.1 --port 8000
```
- Server starts on `http://127.0.0.1:8000`.
- Verifies model weights load from `nlp/models/trievo_ner/model.safetensors`.

### Step 2: Start the Next.js Frontend
In a separate terminal from the project root:
```bash
npm run dev
# OR for production preview:
npm run build
npx next start -p 3000
```
- Open **[http://localhost:3000](http://localhost:3000)** in your browser.
- Next.js automatically rewrites `/api/nlp/*` to `http://127.0.0.1:8000/api/nlp/*` in local mode.

---

## 3. How to Deploy to Vercel

### Method A: Deploy via GitHub / GitLab (Recommended)
1. Commit the repository to your Git provider:
   ```bash
   git add .
   git commit -m "Deploy Trievo Clinical NLP Prototype to Vercel"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New..." $\rightarrow$ "Project"**.
3. Import your `trievo-clinical-nlp` repository.
4. **Project Settings**:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `.next` (default).
5. **Environment Variables** (Optional / Recommended for Heavy ML Functions):
   - `VERCEL_SUPPORT_LARGE_FUNCTIONS`: `1` (Enables Vercel Large Functions up to 5GB bundle size).
6. Click **"Deploy"**.
7. Once deployment finishes, Vercel gives you your live public production URL (e.g. `https://trievo-clinical-nlp.vercel.app`).

### Method B: Deploy via Vercel CLI
From the project root:
```bash
# Preview deployment:
npx vercel

# Production deployment:
npx vercel --prod
```

---

## 4. Production API Endpoints

All endpoints are available directly under the public Vercel domain without localhost dependencies:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/nlp/health` | Live health probe; verifies trained model is loaded on device. |
| `GET` | `/api/nlp/evidence` | Returns verified architecture specs, checkpoint file list, 3-epoch training history, and official test metrics from disk. |
| `POST` | `/api/nlp/analyze` | Executes live token classification on input text using the trained Transformer checkpoint; returns entities with character spans and calibrated confidences. |

### Sample Inference Request:
```bash
curl -X POST "https://<your-vercel-domain>/api/nlp/analyze" \
     -H "Content-Type: application/json" \
     -d '{"text": "Patient has severe chest pain and shortness of breath for 3 days. Give aspirin."}'
```

### Sample Inference Response:
```json
{
  "entities": [
    {
      "text": "chest pain",
      "label": "DISEASE_PROBLEM",
      "start": 19,
      "end": 29,
      "confidence": 0.6936
    },
    {
      "text": "shortness",
      "label": "DISEASE_PROBLEM",
      "start": 34,
      "end": 43,
      "confidence": 0.6368
    },
    {
      "text": "breath",
      "label": "DISEASE_PROBLEM",
      "start": 47,
      "end": 53,
      "confidence": 0.641
    },
    {
      "text": "aspirin",
      "label": "MEDICATION_CHEMICAL",
      "start": 71,
      "end": 78,
      "confidence": 0.8374
    }
  ],
  "text": "Patient has severe chest pain and shortness of breath for 3 days. Give aspirin.",
  "num_entities": 4,
  "model": "Trievo Clinical NER"
}
```

---

## 5. Supervisor Demonstration Protocol (Step-by-Step)

When presenting the live public URL to your supervisor, follow this structured walkthrough:

1. **Model Online Status**:
   - Point out the top live status pill: `● MODEL ONLINE — Ready for Analysis`.
   - Explains that the frontend is dynamically connected to the live PyTorch token classifier.
2. **Architecture & Checkpoint Evidence (Section 1)**:
   - Highlight the verified model specs: `BertForTokenClassification`, `all-MiniLM-L6-v2` (22.5M parameters), 6 layers, 384 hidden dimensions, 12 attention heads.
   - Show the 5 verified checkpoint artifacts on disk (`model.safetensors`, `config.json`, `tokenizer.json`, `label_mapping.json`, `training_history.json`).
3. **Official Held-Out Test Evaluation (Section 2)**:
   - Present the empirical metrics from BC5CDR (1,000 sentences, strict `seqeval` entity-level matching):
     - **Precision**: 56.81%
     - **Recall**: 73.71% (high sensitivity critical for emergency triage)
     - **F1-Score**: 64.17%
     - **Per-Class**: `DISEASE_PROBLEM` (F1 57%), `MEDICATION_CHEMICAL` (F1 70%).
4. **Training Convergence Curves (Section 3)**:
   - Walk through the 3 epochs from `training_history.json`:
     - Training loss decreased from `0.9135` $\rightarrow$ `0.2200`.
     - Validation F1 improved from `51.05%` $\rightarrow$ `59.72%`.
5. **Live Inference Demonstration (Section 4 & 5)**:
   - Click each of the 4 supervisor demo buttons:
     - **Case 1 (Cardiovascular)**: Detects `chest pain` (69.4%), `shortness` (63.7%), `breath` (64.1%), `aspirin` (83.7%).
     - **Case 2 (Dengue)**: Detects `high` (47.1%), `fever` (66.6%), `myalgia` (83.6%), `dengue fever` (76.0%).
     - **Case 3 (Tuberculosis)**: Detects `pulmonary tuberculosis` (65.1%), `hemoptysis` (87.2%), `weight loss` (75.8%).
     - **Case 4 (Trauma)**: Detects `road traffic accident` (54.2%), `blunt chest trauma` (69.3%), `rib fractures` (73.5%).
   - Show the live **Sentence Highlighted Span View** with real-time confidence tags.
6. **Raw Model JSON Output (Section 8)**:
   - Expand the **"RAW MODEL OUTPUT EVIDENCE"** accordion and click **"Copy JSON"** to prove the frontend renders genuine API responses.
7. **Custom Emergency Validation (Section 7)**:
   - Review the table of 12 custom acute emergency cases (47 total entities extracted).

---

## 6. Known Limitations & Scope Disclosure

1. **Research Prototype**: This system is an academic research and clinical decision-support prototype. It is not an autonomous diagnostic medical device.
2. **Learned Categories**: The model extracts `DISEASE_PROBLEM`, `MEDICATION_CHEMICAL`, `SYMPTOM_SIGN`, and `PROCEDURE_TEST`.
3. **Downstream Tasks**: Severity, temporal duration, and negation/assertion are handled as rule-based downstream tasks and are not claimed as learned token classification classes in this baseline NER model.
