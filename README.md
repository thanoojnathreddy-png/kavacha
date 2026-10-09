# KAVACH (कवच) - Your Armor Against Phishing

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Accuracy](https://img.shields.io/badge/ML%20Accuracy-98.42%25-brightgreen.svg)]()
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.9964-success.svg)]()
[![Threat-Feeds](https://img.shields.io/badge/Threat%20Feeds-PhishTank%20%7C%20URLhaus%20%7C%20OpenPhish-red.svg)]()

> **"Your Armor Against Phishing"** — A multi-layered AI cyber defense platform for real-time detection of malicious URLs, phishing traps, typosquatting attacks, and deceptive UPI social engineering scams.

---

## Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              KAVACH CLIENT INTERFACES                             |
|  [Web Application (React 19)]  |  [Chrome Extension (MV3)]  |  [FastAPI / REST]   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        SSRF FIREWALL & INPUT NORMALIZER                          |
|  - Blocks RFC1918 Private IPs, Loopback (127.0.0.1, ::1), AWS metadata (169.254)  |
|  - Decodes Punycode (xn--) and canonicalizes Hex/Octal IP representations          |
+-----------------------------------------+-----------------------------------------+
                                          |
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
+-----------------------------------+     +-----------------------------------+
|   LAYER 1: LEXICAL & BRAND ENGINE  |     |   LAYER 2: NETWORK & SANDBOX      |
| - 60+ engineered numerical features|     | - DNS Resolver (A, MX, NS, TXT)   |
| - Shannon Entropy (URL & Host)    |     | - TLS/SSL Validation & Age Audit  |
| - Damerau-Levenshtein Typosquat   |     | - RDAP/WHOIS Domain Age Query     |
| - Tranco 10k + Indian Brands (SBI,|     | - Recursive Redirect Chain Tracer |
|   HDFC, Paytm, PhonePe, Aadhaar)  |     | - Safe DOM Inspection (No Script) |
+-----------------------------------+     +-----------------------------------+
                     |                                         |
                     +--------------------+--------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                   LAYER 3: CALIBRATED STACKING ML ENSEMBLE                        |
|  - Base Classifiers: LightGBM + XGBoost + Random Forest + Char-Level CNN-BiLSTM   |
|  - Meta-Learner: CalibratedClassifierCV (Isotonic / Platt Scaling)               |
|  - Multi-Class Head: Benign | Phishing | Malware | Defacement                     |
|  - Explainable AI: Dynamic SHAP (SHapley Additive exPlanations) Waterfall Output  |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                       KAVACH HYBRID RISK SCORE (0 - 100)                          |
|  - ML Ensemble (65%) + Threat Intel (25%) + Network Infrastructure Signals (10%)  |
|  - Categorization: SAFE (0-29) | SUSPICIOUS (30-69) | DANGEROUS (70-100)          |
|  - Actionable Protocol Checklist + One-Click Defanged Target (hxxps://...[.])     |
+-----------------------------------------------------------------------------------+
```

---

## Features

1. **Explainable AI (XAI)**: Exact SHAP waterfall chart detailing which lexical or network features pushed the risk score higher or lower.
2. **Kavach Hybrid Risk Score**: Combines neural ensemble predictions with live threat intel feeds (PhishTank, OpenPhish, URLhaus).
3. **URL Anatomy Visualizer**: Color-codes and flags suspicious subdomains, TLDs, and path depths.
4. **Typosquatting & Homograph Detector**: Identifies brand impersonation targeting global platforms (PayPal, Google, Apple) and Indian financial institutions (SBI, HDFC, ICICI, Axis, Paytm, PhonePe, Aadhaar, IRCTC, India Post).
5. **Indian Cyber Fraud Archetype Analyzer**:
   - Fake Electricity Bill Disconnection threats ("power cut tonight at 9:30 PM")
   - Urgent NetBanking KYC / PAN update threats
   - UPI reverse-payment scams disguised as "Cashback"
   - India Post address verification traps
6. **QR Code & UPI Analyzer**: Inspects decoded QR codes and detects fraudulent `upi://pay` intents where victims are tricked into entering their PIN to receive funds.
7. **Multi-Hop Redirect Tracer**: Follows chained 301/302 shorteners to reveal the final destination.
8. **Browser Extension (Manifest V3)**: Real-time link hover badge that alerts users before clicking.
9. **Emergency Response Playbook**: Step-by-step containment guide with direct access to India's National Cyber Crime Portal helpline **1930** and **cybercrime.gov.in**.

---

## Model Benchmark Results (Held-Out Test Set: N = 81,434)

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Latency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Logistic Regression (Baseline) | 89.24% | 88.72% | 89.84% | 0.8891 | 0.9412 | 0.8 ms |
| Random Forest (200 Trees) | 96.82% | 96.54% | 97.12% | 0.9683 | 0.9894 | 4.6 ms |
| Gradient Boosting (GBDT) | 97.41% | 97.20% | 97.65% | 0.9742 | 0.9921 | 6.2 ms |
| LightGBM (Hist Gradient) | 98.12% | 97.90% | 98.35% | 0.9812 | 0.9951 | 2.1 ms |
| XGBoost (Depth 8, Reg 0.1) | 98.31% | 98.10% | 98.54% | 0.9832 | 0.9960 | 3.4 ms |
| Char-level CNN-BiLSTM | 97.85% | 97.62% | 98.10% | 0.9786 | 0.9938 | 14.8 ms |
| **KAVACH Stacking Ensemble (Prod)** | **98.42%** | **98.15%** | **98.68%** | **0.9841** | **0.9964** | **3.8 ms** |

---

## Dataset Provenance & Ingestion

KAVACH is trained on **542,890 verified URLs** sourced from:
- **PhishTank**: Real-time verified phishing feeds
- **OpenPhish**: Community zero-day threat feed
- **URLhaus (abuse.ch)**: Active malware payload hosts
- **Tranco Top 1M**: Highly ranked legitimate domains
- **Kaggle Malicious URLs Corpus (651k)**: Multi-class benign, defacement, phishing, and malware URLs
- **Curated Indian Brand Corpus**: 150+ brand stems across Indian banking, fintech, and public services

---

## Quickstart & Setup

### Requirements
- Node.js >= 18
- Python 3.10+ (for Python offline retraining scripts)

### Installation
```bash
# 1. Install Node dependencies
npm install

# 2. Run Python dataset download pipeline (optional)
python3 ml/download_data.py

# 3. Train models
python3 ml/train.py

# 4. Launch full-stack platform
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## Ethical Use & Limitations

1. **Defensive Purpose**: KAVACH is built strictly for threat identification, incident response, and cybersecurity education.
2. **Safe Sandboxing**: When querying remote web servers, KAVACH enforces a 3.5s timeout, limits response size to 256KB, never executes JavaScript, and blocks requests to private IP ranges (SSRF protection).
3. **No Automated Blocking**: KAVACH provides recommendations and risk scores; final blocking decisions remain with network administrators and security personnel.
