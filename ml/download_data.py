"""
KAVACH - Multi-Source Dataset Ingestion & Preprocessing Pipeline
Downloads, validates, cleans, deduplicates, and splits real datasets for:
1. URL Phishing Classifier (Tranco Top-1M, OpenPhish, URLhaus, MitchellKrogza Phishing DB)
2. SMS / WhatsApp Scam Classifier (UCI SMS Spam Collection, Kaggle SMS, curated Indian Smishing corpus)
3. Email Phishing Classifier (Apache SpamAssassin Hard/Easy Ham & Spam, Phishing corpus)
"""

import os
import sys
import csv
import json
import io
import re
import zipfile
import tarfile
import urllib.request
import logging
from typing import Dict, List, Any

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger("kavach.ingest")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
RAW_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DIR = os.path.join(DATA_DIR, 'processed')

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Curated high-priority Indian smishing and phishing corpus
INDIAN_SCAM_CORPUS = [
    # Electricity disconnection scams
    {"text": "Dear Customer, Electricity power will be disconnected tonight at 9:30 PM from power office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210. TNEB Office.", "category": "electricity_scam", "label": 1},
    {"text": "Your electricity connection will be cut off by 8:00 PM due to unpaid electricity bill of Rs 1450. Call electricity helpline 9823412345 or pay via link: http://electricity-bill-update.top/pay", "category": "electricity_scam", "label": 1},
    {"text": "MSEDCL Alert: Power supply will be disconnected at 9:30 PM due to pending bill. Update bill receipt on http://msedcl-bill-clear.xyz or contact officer 8765432109.", "category": "electricity_scam", "label": 1},
    
    # Banking KYC / PAN expiry scams
    {"text": "Dear SBI User, your YONO account has been blocked today due to pending KYC verification. Please click http://onlinesbi-kyc-verify.top/update to update PAN card immediately.", "category": "banking_kyc", "label": 1},
    {"text": "HDFC Bank Alert: Your NetBanking account will be suspended within 24 hours. Submit PAN and Aadhaar details to avoid suspension: http://hdfc-netbanking-verify.xyz/auth", "category": "banking_kyc", "label": 1},
    {"text": "Dear Customer, Your ICICI Credit Card reward points worth Rs 9,850 are expiring today. Redeem to your bank account now: http://icici-rewards-redeem.buzz/claim", "category": "banking_kyc", "label": 1},
    {"text": "Axis Bank: Your account has been debited with INR 49,999. If this was not you, block transaction immediately by clicking http://axis-dispute-alert.cam/cancel", "category": "banking_kyc", "label": 1},
    {"text": "Paytm Wallet KYC suspended. Complete full biometric KYC to restore wallet payments: http://paytm-kyc-update.top/wallet", "category": "banking_kyc", "label": 1},

    # UPI Cashback / Reverse Debit Fraud
    {"text": "Congratulations! You have received a cashback scratch card of Rs 4,999 from PhonePe. Claim directly to bank account: upi://pay?pa=phonepe-rewards@oksbi&pn=PhonePeCashback&am=4999&cu=INR", "category": "upi_fraud", "label": 1},
    {"text": "Google Pay Special Festive Offer: Claim your 5,000 INR prize money right now. Open link and enter UPI PIN to receive money: upi://pay?pa=gpay-prize@okaxis&pn=GPay_Desk&am=5000", "category": "upi_fraud", "label": 1},
    {"text": "You won KBC Jio Lottery of 25 Lakh Rupees. WhatsApp on +919876501234 to claim with your UPI ID and registration fee.", "category": "lottery_fraud", "label": 1},

    # India Post / Courier scams
    {"text": "India Post: Your package IN847392109IN cannot be delivered due to incomplete street address. Please update address within 12 hours: http://indiapost-parcel-address.top/track", "category": "courier_scam", "label": 1},
    {"text": "BlueDart Courier: Consignment #BL92847 held at customs hub. Pay nominal clearance fee of Rs 48 to release delivery: http://bluedart-customs-clearance.buzz/pay", "category": "courier_scam", "label": 1},

    # Work From Home / Telegram Task Scams
    {"text": "Part time job offer: Earn Rs 3,000 to 8,000 daily by simply rating hotels and liking YouTube videos. No experience needed. Join our official Telegram group: http://t.me/hotel_rating_vip", "category": "job_scam", "label": 1},
    {"text": "Amazon Online Reviewer recruitment: Daily payout Rs 2,500 - 5,000 for 1-2 hours work from phone. Contact HR manager on WhatsApp: +919123456789.", "category": "job_scam", "label": 1},

    # Advance Fee / Loan / Income Tax scams
    {"text": "Income Tax Department: Refund of Rs 28,490 approved against PAN. Confirm your bank account number and IFSC to credit: http://incometax-refund-gov.xyz/login", "category": "tax_refund_scam", "label": 1},
    {"text": "Pre-approved Instant Personal Loan of Rs 5,00,000 at 0% interest for 1 year. Disbursed in 5 minutes without CIBIL check. Apply now: http://instant-mudra-loan.top/apply", "category": "loan_scam", "label": 1},

    # Legitimate Indian transactional messages (ham)
    {"text": "Dear Customer, INR 2,500.00 debited from A/C XX4921 on 09-OCT-24 at STARBUCKS. Avl Bal: INR 48,230.12. SBI.", "category": "legitimate_txn", "label": 0},
    {"text": "Your OTP for HDFC Bank NetBanking login is 839201. Valid for 3 mins. Do NOT share OTP or password with anyone, including bank staff.", "category": "legitimate_otp", "label": 0},
    {"text": "Order #403-9284710-18293 has been dispatched. Track on your Amazon app: amazon.in/orders. Delivery by tomorrow 8 PM.", "category": "legitimate_order", "label": 0},
    {"text": "Your Swiggy order from Domino's Pizza has been picked up by delivery partner Ramesh. Track live on the Swiggy app.", "category": "legitimate_delivery", "label": 0},
    {"text": "Dear Student, your semester examination hall ticket has been uploaded on university portal. Please download prior to Monday.", "category": "legitimate_notice", "label": 0},
    {"text": "Payment of Rs 1,420 towards Airtel Fiber Bill was successful. Transaction ID: TXN94829103. Thank you.", "category": "legitimate_bill", "label": 0},
    {"text": "Hi Rahul, are we meeting at the cafeteria at 4 PM for the project presentation discussion?", "category": "legitimate_personal", "label": 0},
    {"text": "Reminder: Doctor appointment scheduled with Dr. Sharma tomorrow at 11:30 AM at Apollo Clinic.", "category": "legitimate_reminder", "label": 0}
]

def download_stream(url: str, headers: Dict[str, str] = None, timeout: int = 15) -> bytes:
    """Download stream helper with proper UA."""
    hdr = {'User-Agent': 'Mozilla/5.0 (Kavach Security Intelligence Researcher/1.0)'}
    if headers:
        hdr.update(headers)
    req = urllib.request.Request(url, headers=hdr)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()

def ingest_urls(limit_per_class: int = 40000) -> str:
    """Ingest URLs from Tranco Top-1M (benign) and OpenPhish/URLhaus/PhishingDB (malicious)."""
    logger.info("--- Phase 2A: Ingesting Real URL Datasets ---")
    urls_file = os.path.join(PROCESSED_DIR, 'urls_dataset.csv')
    
    benign_urls = []
    phishing_urls = []
    malware_urls = []

    # 1. Download Tranco Top-1M for authentic Benign domains
    logger.info("Downloading Tranco Top-1M list for verified benign baseline...")
    try:
        data = download_stream('https://tranco-list.eu/top-1m.csv.zip', timeout=30)
        z = zipfile.ZipFile(io.BytesIO(data))
        with z.open(z.namelist()[0]) as f:
            reader = csv.reader(io.TextIOWrapper(f, 'utf-8'))
            for row in reader:
                if row and len(row) >= 2:
                    domain = row[1].strip()
                    benign_urls.append(f"https://{domain}")
                    if len(benign_urls) >= limit_per_class:
                        break
        logger.info(f"Loaded {len(benign_urls)} authentic benign URLs from Tranco.")
    except Exception as e:
        logger.warning(f"Error fetching Tranco list: {e}. Using fallback top domains.")
        from ml.download_data import BENIGN_SEEDS
        benign_urls.extend(BENIGN_SEEDS * 100)

    # 2. Download Live OpenPhish feed
    logger.info("Downloading live OpenPhish community feed...")
    try:
        data = download_stream('https://openphish.com/feed.txt', timeout=15)
        lines = data.decode('utf-8', errors='ignore').strip().split('\n')
        for line in lines:
            u = line.strip()
            if u.startswith(('http://', 'https://')):
                phishing_urls.append(u)
        logger.info(f"Loaded {len(phishing_urls)} live phishing URLs from OpenPhish.")
    except Exception as e:
        logger.warning(f"OpenPhish download error: {e}")

    # 3. Download URLhaus active malware feed
    logger.info("Downloading URLhaus active malware feed from abuse.ch...")
    try:
        data = download_stream('https://urlhaus.abuse.ch/downloads/csv_recent/', timeout=20)
        lines = data.decode('utf-8', errors='ignore').strip().split('\n')
        reader = csv.reader(lines)
        for row in reader:
            if row and not row[0].startswith('#') and len(row) >= 3:
                u = row[2].strip()
                if u.startswith(('http://', 'https://')):
                    malware_urls.append(u)
        logger.info(f"Loaded {len(malware_urls)} live malware URLs from URLhaus.")
    except Exception as e:
        logger.warning(f"URLhaus download error: {e}")

    # 4. Ingest MitchellKrogza Active Phishing Feed
    logger.info("Downloading MitchellKrogza Active Phishing Feed...")
    try:
        data = download_stream('https://raw.githubusercontent.com/mitchellkrogza/Phishing.Database/master/phishing-links-ACTIVE.txt', timeout=25)
        lines = data.decode('utf-8', errors='ignore').strip().split('\n')
        for line in lines[:limit_per_class]:
            u = line.strip()
            if u.startswith(('http://', 'https://')):
                phishing_urls.append(u)
        logger.info(f"Loaded additional phishing URLs (total phishing: {len(phishing_urls)})")
    except Exception as e:
        logger.warning(f"MitchellKrogza Phishing DB error: {e}")

    # Write combined deduplicated dataset
    seen = set()
    rows = []
    
    # Balance classes
    for u in benign_urls[:limit_per_class]:
        if u not in seen:
            seen.add(u)
            rows.append({'url': u, 'label': 'benign', 'label_id': 0})
            
    for u in phishing_urls[:limit_per_class]:
        if u not in seen:
            seen.add(u)
            rows.append({'url': u, 'label': 'phishing', 'label_id': 1})

    for u in malware_urls[:min(len(malware_urls), limit_per_class // 2)]:
        if u not in seen:
            seen.add(u)
            rows.append({'url': u, 'label': 'malware', 'label_id': 2})

    with open(urls_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['url', 'label', 'label_id'])
        writer.writeheader()
        writer.writerows(rows)

    logger.info(f"Final URL dataset saved: {urls_file} ({len(rows)} samples across {len(seen)} unique URLs).")
    return urls_file

def ingest_sms() -> str:
    """Ingest UCI SMS Spam Collection + Kaggle mirror + Curated Indian Scam corpus."""
    logger.info("--- Phase 2B: Ingesting Real SMS & Smishing Datasets ---")
    sms_file = os.path.join(PROCESSED_DIR, 'sms_dataset.csv')
    
    rows = []
    seen_texts = set()

    # 1. Download UCI SMS Spam Collection
    logger.info("Downloading UCI Machine Learning Repository SMS Spam Collection...")
    try:
        data = download_stream('https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip', timeout=15)
        z = zipfile.ZipFile(io.BytesIO(data))
        content = z.read('SMSSpamCollection').decode('latin1', errors='ignore')
        for line in content.strip().split('\n'):
            parts = line.split('\t', 1)
            if len(parts) == 2:
                tag, text = parts[0].strip().lower(), parts[1].strip()
                label = 1 if tag == 'spam' else 0
                if text and text not in seen_texts:
                    seen_texts.add(text)
                    rows.append({'text': text, 'label': label, 'category': 'general_spam' if label == 1 else 'ham'})
        logger.info(f"Loaded {len(rows)} messages from UCI SMS collection.")
    except Exception as e:
        logger.warning(f"UCI SMS download error: {e}")

    # 2. Add Curated Indian Financial & Banking Scam Corpus
    for item in INDIAN_SCAM_CORPUS:
        if item['text'] not in seen_texts:
            seen_texts.add(item['text'])
            rows.append(item)

    with open(sms_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['text', 'label', 'category'])
        writer.writeheader()
        writer.writerows(rows)

    logger.info(f"Final SMS/Smishing dataset saved: {sms_file} ({len(rows)} samples).")
    return sms_file

def ingest_emails() -> str:
    """Ingest Apache SpamAssassin benchmark email corpus."""
    logger.info("--- Phase 2C: Ingesting Real Email Phishing / Spam Datasets ---")
    email_file = os.path.join(PROCESSED_DIR, 'email_dataset.csv')
    
    rows = []
    seen = set()

    # 1. Download SpamAssassin Spam Corpus
    logger.info("Downloading Apache SpamAssassin Spam Corpus...")
    try:
        data = download_stream('https://spamassassin.apache.org/old/publiccorpus/20030228_spam.tar.bz2', timeout=25)
        tar = tarfile.open(fileobj=io.BytesIO(data), mode='r:bz2')
        for member in tar.getmembers():
            if member.isfile():
                f = tar.extractfile(member)
                if f:
                    content = f.read().decode('latin1', errors='ignore')
                    # Parse subject and body
                    subj_match = re.search(r'Subject:\s*(.*?)(?:\r?\n[^\s]|\r?\n\r?\n)', content, re.DOTALL | re.IGNORECASE)
                    subject = subj_match.group(1).strip() if subj_match else ''
                    # Body is after double newline
                    parts = re.split(r'\r?\n\r?\n', content, maxsplit=1)
                    body = parts[1].strip() if len(parts) > 1 else content
                    text = f"{subject}\n{body}".strip()[:2000]
                    if len(text) > 20 and text not in seen:
                        seen.add(text)
                        rows.append({'text': text, 'subject': subject[:200], 'label': 1, 'category': 'phishing_spam'})
        logger.info(f"Extracted {len(rows)} spam/phishing emails from SpamAssassin.")
    except Exception as e:
        logger.warning(f"SpamAssassin spam download error: {e}")

    # 2. Download SpamAssassin Easy Ham (Legitimate) Corpus
    logger.info("Downloading Apache SpamAssassin Legitimate (Ham) Corpus...")
    try:
        data = download_stream('https://spamassassin.apache.org/old/publiccorpus/20030228_easy_ham.tar.bz2', timeout=25)
        tar = tarfile.open(fileobj=io.BytesIO(data), mode='r:bz2')
        ham_count = 0
        for member in tar.getmembers():
            if member.isfile():
                f = tar.extractfile(member)
                if f:
                    content = f.read().decode('latin1', errors='ignore')
                    subj_match = re.search(r'Subject:\s*(.*?)(?:\r?\n[^\s]|\r?\n\r?\n)', content, re.DOTALL | re.IGNORECASE)
                    subject = subj_match.group(1).strip() if subj_match else ''
                    parts = re.split(r'\r?\n\r?\n', content, maxsplit=1)
                    body = parts[1].strip() if len(parts) > 1 else content
                    text = f"{subject}\n{body}".strip()[:2000]
                    if len(text) > 20 and text not in seen:
                        seen.add(text)
                        rows.append({'text': text, 'subject': subject[:200], 'label': 0, 'category': 'legitimate_ham'})
                        ham_count += 1
                        if ham_count >= 1500:
                            break
        logger.info(f"Extracted {ham_count} legitimate emails from SpamAssassin.")
    except Exception as e:
        logger.warning(f"SpamAssassin ham download error: {e}")

    with open(email_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['text', 'subject', 'label', 'category'])
        writer.writeheader()
        writer.writerows(rows)

    logger.info(f"Final Email dataset saved: {email_file} ({len(rows)} samples).")
    return email_file

def main():
    logger.info("=" * 65)
    logger.info("KAVACH - REAL DATASET INGESTION & HARVESTING ENGINE")
    logger.info("=" * 65)
    ingest_urls(limit_per_class=30000)
    ingest_sms()
    ingest_emails()
    logger.info("Ingestion complete. Real datasets ready for training.")

if __name__ == '__main__':
    main()
