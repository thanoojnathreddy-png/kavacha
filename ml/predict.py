"""
KAVACH Python ML Inference Service CLI
Accepts JSON commands via stdin/argv and returns predictions using the trained models.
Supports:
- url: Predict URL threat using calibrated classifier
- sms: Predict SMS/WhatsApp scam probability using TF-IDF + LogisticRegression
- email: Predict Email phishing probability using TF-IDF + LogisticRegression
"""

import sys
import os
import json
import logging
import joblib
import numpy as np

logging.basicConfig(level=logging.ERROR)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load feature extractor
sys.path.insert(0, os.path.join(BASE_DIR, 'ml'))
from features import extract_features, FEATURE_NAMES

def predict_url(url: str):
    model_path = os.path.join(MODELS_DIR, 'url_classifier.joblib')
    multi_path = os.path.join(MODELS_DIR, 'url_multi_classifier.joblib')
    
    if not os.path.exists(model_path):
        return {"error": "URL model artifact not found"}
        
    model = joblib.load(model_path)
    feats = extract_features(url)
    vec = np.array([[feats[fn] for fn in FEATURE_NAMES]], dtype=np.float32)
    
    prob = float(model.predict_proba(vec)[0][1])
    verdict = "DANGEROUS" if prob >= 0.70 else ("SUSPICIOUS" if prob >= 0.35 else "SAFE")

    category = "Benign"
    if os.path.exists(multi_path):
        multi_model = joblib.load(multi_path)
        cat_id = int(multi_model.predict(vec)[0])
        category = ["Benign", "Phishing", "Malware"][cat_id] if cat_id in (0, 1, 2) else "Phishing"

    return {
        "url": url,
        "ml_probability": prob,
        "risk_score": int(round(prob * 100)),
        "verdict": verdict,
        "category": category
    }

def predict_sms(text: str):
    vec_path = os.path.join(MODELS_DIR, 'sms_vectorizer.joblib')
    clf_path = os.path.join(MODELS_DIR, 'sms_classifier.joblib')
    
    if not (os.path.exists(vec_path) and os.path.exists(clf_path)):
        return {"error": "SMS model artifacts not found"}

    vectorizer = joblib.load(vec_path)
    clf = joblib.load(clf_path)

    x = vectorizer.transform([text])
    prob = float(clf.predict_proba(x)[0][1])
    
    return {
        "text": text,
        "ml_probability": prob,
        "risk_score": int(round(prob * 100)),
        "verdict": "DANGEROUS" if prob >= 0.65 else ("SUSPICIOUS" if prob >= 0.35 else "SAFE")
    }

def predict_email(text: str):
    vec_path = os.path.join(MODELS_DIR, 'email_vectorizer.joblib')
    clf_path = os.path.join(MODELS_DIR, 'email_classifier.joblib')

    if not (os.path.exists(vec_path) and os.path.exists(clf_path)):
        return {"error": "Email model artifacts not found"}

    vectorizer = joblib.load(vec_path)
    clf = joblib.load(clf_path)

    x = vectorizer.transform([text])
    prob = float(clf.predict_proba(x)[0][1])

    return {
        "text": text[:200],
        "ml_probability": prob,
        "risk_score": int(round(prob * 100)),
        "verdict": "DANGEROUS" if prob >= 0.65 else ("SUSPICIOUS" if prob >= 0.35 else "SAFE")
    }

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python3 predict.py <type> <input>"}))
        sys.exit(1)

    task = sys.argv[1]
    input_str = sys.argv[2]

    if task == 'url':
        print(json.dumps(predict_url(input_str)))
    elif task == 'sms':
        print(json.dumps(predict_sms(input_str)))
    elif task == 'email':
        print(json.dumps(predict_email(input_str)))
    else:
        print(json.dumps({"error": f"Unknown task: {task}"}))
