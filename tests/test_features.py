"""
KAVACH - Unit Tests for Feature Extraction and Typosquatting
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.features import extract_features, detect_typosquatting, shannon_entropy, damerau_levenshtein_distance

def test_entropy():
    # Uniform string should have higher entropy than repetitive string
    rep = shannon_entropy("aaaaaaa")
    div = shannon_entropy("a1b2c3d4")
    assert rep == 0.0
    assert div > 2.5

def test_damerau_levenshtein():
    # Transposition distance
    assert damerau_levenshtein_distance("paypal", "payapl") == 1
    assert damerau_levenshtein_distance("sbi", "sbi") == 0
    assert damerau_levenshtein_distance("hdfc", "hdf") == 1

def test_typosquatting_detection():
    # Detecting typosquatting on SBI
    is_typo, brand, dist = detect_typosquatting("onlinesbi-verification.com")
    assert is_typo == True
    assert brand == "sbi" or brand == "onlinesbi"

    # Legit domain should not be flagged as typo
    is_legit, _, _ = detect_typosquatting("google.com")
    assert is_legit == False

def test_extract_features():
    feat = extract_features("http://onlinesbi-kyc-verify.top/update.html?user=123")
    assert feat['url_length'] > 20
    assert feat['count_dots'] >= 1
    assert feat['tld_risk'] == 1.0  # .top is in HIGH_RISK_TLDS
    assert feat['suspicious_keywords_count'] >= 2  # kyc, verify

if __name__ == '__main__':
    test_entropy()
    test_damerau_levenshtein()
    test_typosquatting_detection()
    test_extract_features()
    print("All KAVACH feature engineering unit tests passed successfully!")
