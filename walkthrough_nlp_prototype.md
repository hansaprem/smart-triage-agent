# TRIEVO Healthcare — Clinical NLP Prototype
## Model Evidence & Live Evaluation Walkthrough

---

### Project Identity & Isolation Verification
- **Project Name**: `trievo-clinical-nlp`
- **Product Name**: `TRIEVO Healthcare — Clinical NLP Prototype`
- **Isolation Status**: Completely independent application. Zero references, components, routes, or assets from any external project.
- **Frontend URL**: [http://localhost:3000](http://localhost:3000) (or `/nlp`)
- **Backend API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 1. Quickstart: How to Run the Prototype

### Terminal 1: Start the Real Python NLP Backend
From the project directory:
```bash
python -m nlp.api
```
*(Or via uvicorn: `python -m uvicorn nlp.api:app --host 127.0.0.1 --port 8000`)*
- Loads the trained Transformer checkpoint from `nlp/models/trievo_ner/`.
- Health Check: `GET http://127.0.0.1:8000/api/nlp/health`
- Real-Time Inference: `POST http://127.0.0.1:8000/api/nlp/analyze`

### Terminal 2: Start the Standalone Prototype Dashboard
From the project directory:
```bash
npx next start -p 3000
# OR in development mode:
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in any modern web browser.

---

## 2. Core Demonstration Sections Built for Supervisor Review

### 1. Trained Model Evidence
- **Model Checkpoint Status**: Verified on disk at `nlp/models/trievo_ner/`:
  - `model.safetensors` (90.3 MB)
  - `config.json` (1.3 KB)
  - `tokenizer.json` (712 KB)
  - `label_mapping.json` (386 B)
  - `training_history.json` (747 B)
- **Architecture**: `BertForTokenClassification`
- **Backbone**: `sentence-transformers/all-MiniLM-L6-v2` (22.5M parameters, 6 layers, 384 hidden dimensions, 12 attention heads, 128 max sequence tokens).
- **Optimization**: AdamW ($\text{lr} = 3 \times 10^{-5}$, weight decay $= 0.01$).
- **Status Badge**: `"TRAINED MODEL — LOADED"` (Verified live via `/api/nlp/health`).

### 2. Actual Evaluation Evidence (Official Held-Out Test Set)
Verified from `nlp/evaluation/test_results.json` (evaluated across 1,000 held-out sentences from BC5CDR using strict `seqeval` entity boundary scoring):
- **Test Loss**: `0.2373`
- **Overall Precision**: `56.81%`
- **Overall Recall**: `73.71%`
- **Overall F1-Score**: `64.17%`
- **Per-Class Breakdown**:
  - `DISEASE_PROBLEM`: Precision: `52%` | Recall: `64%` | F1: `57%` | Support: `748 entities`
  - `MEDICATION_CHEMICAL`: Precision: `61%` | Recall: `82%` | F1: `70%` | Support: `842 entities`

### 3. Training Progress & Learning Curve
Verified from `nlp/models/trievo_ner/training_history.json`:
- **Epoch 1**: Train Loss: `0.9135` | Val Loss: `0.3369` | Precision: `45.53%` | Recall: `58.10%` | F1: `51.05%`
- **Epoch 2**: Train Loss: `0.2892` | Val Loss: `0.2487` | Precision: `53.95%` | Recall: `64.11%` | F1: `58.59%`
- **Epoch 3**: Train Loss: `0.2200` | Val Loss: `0.2428` | Precision: `53.13%` | Recall: `68.16%` | F1: `59.72%` *(Best Checkpoint Saved)*
- Visual multi-metric convergence curve rendering training loss descent and validation F1 improvement.

### 4 & 5. Live Model Inference & Sentence-Level Highlighting
Users enter raw clinical text or click any supervisor demo case and click **"ANALYZE WITH TRAINED MODEL"**:
- **Pipeline Step Visualization**: Input Text $\rightarrow$ Subword Tokenization $\rightarrow$ BertForTokenClassification $\rightarrow$ Span Extraction $\rightarrow$ Confidence $\rightarrow$ Structured Output.
- **Sentence-Level Highlighted Span View**: Inlines detected clinical entities directly in the narrative text with color-coded chips (`DISEASE_PROBLEM`, `MEDICATION_CHEMICAL`, `SYMPTOM_SIGN`, `PROCEDURE_TEST`), tooltips, and confidence percentages.
- **Entity Cards**: Displaying extracted entity text, category taxonomy, character offsets (`start`, `end`), and a color-coded confidence progress bar.

### 6. Demo Cases for Supervisor
Four one-click clinical cases matching acute presentations:
1. **Case 1 (Cardiovascular)**: *"Patient has severe chest pain and shortness of breath for 3 days. Give aspirin."*
   - Model detects: `chest pain` (69.4%), `shortness` (63.7%), `breath` (64.1%), `aspirin` (83.7%).
2. **Case 2 (Dengue)**: *"Patient has high grade fever, myalgia and dengue fever."*
   - Model detects: `high` (47.1%), `fever` (66.6%), `myalgia` (83.6%), `dengue fever` (76.0%).
3. **Case 3 (Tuberculosis)**: *"Patient has pulmonary tuberculosis with hemoptysis and weight loss."*
   - Model detects: `pulmonary tuberculosis` (65.1%), `hemoptysis` (87.2%), `weight loss` (75.8%).
4. **Case 4 (Trauma)**: *"Patient involved in a road traffic accident with blunt chest trauma and rib fractures."*
   - Model detects: `road traffic accident` (54.2%), `blunt chest trauma` (69.3%), `rib fractures` (73.5%).

### 7. Custom Trievo Emergency Validation
Displays the 12 acute clinical evaluation cases from `nlp/evaluation/custom_test_results.json` (47 total entities extracted across cardiovascular, respiratory, trauma, and infectious emergency complaints).

### 8. Raw Model Output Evidence
Collapsible raw JSON panel displaying the structured API response with a **"Copy JSON"** button to prove to supervisors that the frontend receives genuine structured model outputs.

### 9. Clinical Disclaimer & Scope
- *"Research prototype only. Model outputs are for demonstration and evaluation and must not be used as a standalone clinical diagnosis or treatment decision."*
- Explicitly states that severity, duration, and negation/assertion are separate downstream tasks and not learned classes in this token NER model.

---

## 3. Project File Changes Summary

### Files Created / Configured for Standalone Trievo Project:
- `package.json`: Project name updated to `trievo-clinical-nlp`.
- `app/layout.tsx`: Independent layout, metadata title `"TRIEVO Healthcare — Clinical NLP Prototype"`.
- `app/page.tsx`: Complete Trievo Clinical NLP Model Evidence & Live Evaluation dashboard.
- `app/nlp/page.tsx`: Alias route for direct access.
- `app/api/nlp/evidence/route.ts`: API endpoint serving verified metadata, evaluation, and training history.
- `app/api/nlp/analyze/route.ts`: Proxies live inference requests to Python FastAPI.
- `app/api/nlp/health/route.ts`: Live backend health checking.
- `nlp/api.py`: FastAPI inference service wrapping `predict.py`.
- `walkthrough_nlp_prototype.md`: Master reference document.

### Non-Trievo / FIP Artifacts Removed:
- Removed FIP routes: `analysis`, `assessment`, `dashboard`, `insights`, `login`, `queue`, `reports`, `result`, `review`, `settings`.
- Removed FIP components and patient contexts (`components/`, `data/`, `types/`, `lib/patient-context.tsx`, `lib/triage-engine.ts`).
