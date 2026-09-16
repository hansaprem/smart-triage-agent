"""
Trievo Healthcare - Clinical NLP FastAPI Service
================================================
Lightweight REST API providing clinical entity extraction using the trained
Trievo Clinical NER model (BertForTokenClassification on all-MiniLM-L6-v2).

Endpoints:
- POST /api/nlp/analyze: Extracts clinical entities with spans & confidence
- GET  /api/nlp/health:  Returns model status, device, and metadata
"""

import os
import sys
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Ensure repository root is on sys.path
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from nlp.inference.predict import TrievoNERPredictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("trievo_nlp_api")

app = FastAPI(
    title="Trievo Clinical NLP API",
    description="Clinical Named Entity Recognition for Trievo Healthcare Emergency Triage",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model predictor instance
PREDICTOR: Optional[TrievoNERPredictor] = None
MODEL_DIR = os.path.join(REPO_ROOT, "nlp", "models", "trievo_ner")


def get_predictor() -> TrievoNERPredictor:
    global PREDICTOR
    if PREDICTOR is None:
        logger.info(f"Initializing Trievo Clinical NER Predictor from {MODEL_DIR}...")
        if not os.path.exists(MODEL_DIR):
            raise RuntimeError(f"Trained model not found at {MODEL_DIR}. Please check model checkpoint directory.")
        PREDICTOR = TrievoNERPredictor(model_dir=MODEL_DIR)
        logger.info("Trievo Clinical NER Predictor initialized successfully.")
    return PREDICTOR


class AnalyzeRequest(BaseModel):
    text: str = Field(..., description="Raw clinical text/patient complaint")


class EntityResponse(BaseModel):
    text: str
    label: str
    start: int
    end: int
    confidence: float


class AnalyzeResponse(BaseModel):
    entities: List[EntityResponse]
    text: str
    num_entities: int
    model: str = "Trievo Clinical NER"


@app.on_event("startup")
def startup_event():
    """Startup notification - predictor initialized on demand or warm-up."""
    logger.info("Trievo Clinical NLP API service started and listening.")


@app.get("/api/nlp/health")
def health():
    """Health & metadata check endpoint."""
    try:
        pred = get_predictor()
        return {
            "status": "ready",
            "model": "Trievo Clinical NER",
            "architecture": "BertForTokenClassification",
            "backbone": "all-MiniLM-L6-v2",
            "device": str(pred.device),
            "model_dir": "nlp/models/trievo_ner",
            "labels": list(pred.id2label.values()),
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


@app.post("/api/nlp/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    """
    Analyzes unstructured clinical text and returns extracted clinical entities.
    """
    raw_text = req.text.strip() if req.text else ""
    if not raw_text:
        return AnalyzeResponse(entities=[], text="", num_entities=0)

    try:
        predictor = get_predictor()
        entities = predictor.predict(raw_text)
        return AnalyzeResponse(
            entities=entities,
            text=raw_text,
            num_entities=len(entities),
            model="Trievo Clinical NER",
        )
    except Exception as e:
        logger.exception("Inference error in analyze endpoint")
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")


def main():
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    logger.info(f"Starting Trievo Clinical NLP Service on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    main()
