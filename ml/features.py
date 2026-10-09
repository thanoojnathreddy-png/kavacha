"""
KAVACH - Feature Engineering Module
Extracts 60+ lexical, host-based, content-based, and typosquatting features
from candidate URLs for multi-class and binary threat prediction.
"""

import math
import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, List, Tuple

# Suspicious keywords strongly correlated with phishing attacks
SUSPICIOUS_KEYWORDS = [
    'login', 'verify', 'secure', 'update', 'account', 'bank', 'paypal', 'wallet',
    'confirm', 'password', 'signin', 'invoice', 'kyc', 'otp', 'netbanking',
    'billing', 'refund', 'support', 'bonus', 'claim', 'authenticate', 'free',
    'reward', 'security', 'suspended', 'unlock', 'portal', 'alert', 'credential',
    'action-required', 'auth', 'recover', 'reactivate', 'card', 'cvv', 'pan'
]

# High-risk TLDs frequently abused in phishing campaigns
HIGH_RISK_TLDS = {
    'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'fit', 'surf', 'rest',
    'icu', 'cam', 'club', 'work', 'bid', 'loan', 'win', 'men', 'racing', 'country',
    'stream', 'gdn', 'mom', 'vip', 'monster', 'beauty', 'hair', 'quest', 'click'
}

# Known URL shorteners
URL_SHORTENERS = {
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'adf.ly', 'bit.do', 'cutt.ly', 'rebrand.ly', 'tiny.cc', 'rb.gy', 'shorte.st'
}

# Curated global and Indian high-value target brands
TARGET_BRANDS = [
    # Indian Banking & Fintech
    'sbi', 'onlinesbi', 'hdfc', 'hdfcbank', 'icici', 'icicibank', 'axis', 'axisbank',
    'pnb', 'canarabank', 'kotak', 'paytm', 'phonepe', 'gpay', 'googlepay', 'upi',
    'bhim', 'cred', 'mobikwik', 'freecharge',
    # Indian Government & Public Services
    'aadhaar', 'uidai', 'digilocker', 'irctc', 'incometax', 'incometaxindia',
    'indiapost', 'epfindia', 'parivahan', 'vahan', 'cowin',
    # Indian E-Commerce & Telecom
    'flipkart', 'amazon', 'jio', 'reliancejio', 'airtel', 'vi', 'vodafone',
    'swiggy', 'zomato', 'zepto', 'blinkit',
    # Global Tech & Financial
    'paypal', 'apple', 'icloud', 'microsoft', 'office365', 'outlook', 'live',
    'google', 'gmail', 'netflix', 'facebook', 'instagram', 'whatsapp', 'meta',
    'chase', 'wellsfargo', 'bankofamerica', 'citi', 'binance', 'coinbase',
    'metamask', 'steam', 'dropbox', 'github', 'yahoo', 'adobe'
]

def shannon_entropy(data: str) -> float:
    """Calculate Shannon entropy of a string."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    frequencies = {}
    for char in data:
        frequencies[char] = frequencies.get(char, 0) + 1
    for count in frequencies.values():
        p = count / length
        entropy -= p * math.log2(p)
    return float(entropy)

def damerau_levenshtein_distance(s1: str, s2: str) -> int:
    """Compute Damerau-Levenshtein distance between two strings."""
    d = {}
    len1 = len(s1)
    len2 = len(s2)
    for i in range(-1, len1 + 1):
        d[(i, -1)] = i + 1
    for j in range(-1, len2 + 1):
        d[(-1, j)] = j + 1

    for i in range(len1):
        for j in range(len2):
            cost = 0 if s1[i] == s2[j] else 1
            d[(i, j)] = min(
                d[(i - 1, j)] + 1,        # deletion
                d[(i, j - 1)] + 1,        # insertion
                d[(i - 1, j - 1)] + cost  # substitution
            )
            if i and j and s1[i] == s2[j - 1] and s1[i - 1] == s2[j]:
                d[(i, j)] = min(d[(i, j)], d[i - 2, j - 2] + cost)  # transposition
    return d[len1 - 1, len2 - 1]

def detect_typosquatting(domain: str) -> Tuple[bool, str, int]:
    """Detect if domain is typosquatting or impersonating a known brand."""
    clean_domain = domain.lower()
    # Strip port if any
    clean_domain = clean_domain.split(':')[0]
    
    # Extract base domain without TLD
    parts = clean_domain.split('.')
    if len(parts) >= 2:
        host_stem = parts[-2]
    else:
        host_stem = parts[0]

    for brand in TARGET_BRANDS:
        # Check direct substring brand impersonation in subdomain or host stem
        if brand in clean_domain and clean_domain != f"{brand}.com" and clean_domain != f"{brand}.in" and clean_domain != f"{brand}.gov.in":
            # Suspicious combination like 'sbi-update.com' or 'hdfc-verification.com'
            if any(char in clean_domain for char in ['-', '_', 'login', 'secure', 'verify', 'online', 'bank', 'support']):
                return True, brand, 0

        # Check edit distance on host stem
        if len(host_stem) >= 3 and len(brand) >= 3:
            dist = damerau_levenshtein_distance(host_stem, brand)
            if 1 <= dist <= 2 and abs(len(host_stem) - len(brand)) <= 2:
                return True, brand, dist

    return False, "", 999

def extract_features(url: str, network_data: Dict[str, Any] = None, content_data: Dict[str, Any] = None) -> Dict[str, float]:
    """
    Extract 60+ engineered features from raw URL and optional network/content data.
    Returns a dictionary of numerical feature values.
    """
    features: Dict[str, float] = {}
    network = network_data or {}
    content = content_data or {}

    raw_url = url.strip()
    if not raw_url.startswith(('http://', 'https://')):
        raw_url = 'http://' + raw_url

    parsed = urlparse(raw_url)
    hostname = (parsed.netloc or '').lower()
    path = parsed.path or ''
    query = parsed.query or ''

    # Clean hostname (remove port)
    hostname_clean = hostname.split(':')[0]

    # --- 1. LEXICAL FEATURES ---
    url_len = len(url)
    features['url_length'] = float(url_len)
    features['hostname_length'] = float(len(hostname_clean))
    features['path_length'] = float(len(path))
    features['query_length'] = float(len(query))

    digits = sum(c.isdigit() for c in url)
    letters = sum(c.isalpha() for c in url)
    special_chars = url_len - (digits + letters)

    features['digit_count'] = float(digits)
    features['digit_ratio'] = float(digits / max(url_len, 1))
    features['letter_count'] = float(letters)
    features['letter_ratio'] = float(letters / max(url_len, 1))
    features['special_char_count'] = float(special_chars)
    features['special_char_ratio'] = float(special_chars / max(url_len, 1))

    features['count_dots'] = float(url.count('.'))
    features['count_hyphens'] = float(url.count('-'))
    features['count_underscores'] = float(url.count('_'))
    features['count_at'] = float(url.count('@'))
    features['count_double_slash'] = float(url.count('//') - 1 if '//' in url else 0)
    features['count_question'] = float(url.count('?'))
    features['count_equals'] = float(url.count('='))
    features['count_ampersand'] = float(url.count('&'))
    features['count_percent'] = float(url.count('%'))

    subdomains = hostname_clean.split('.')
    features['subdomain_count'] = float(max(len(subdomains) - 2, 0))
    features['path_depth'] = float(path.count('/') if path else 0)

    features['url_entropy'] = shannon_entropy(url)
    features['domain_entropy'] = shannon_entropy(hostname_clean)

    tokens = re.split(r'[/.\-_?=&]', url)
    longest_tok = max((len(t) for t in tokens if t), default=0)
    features['longest_token_length'] = float(longest_tok)

    vowels = sum(c in 'aeiou' for c in hostname_clean)
    consonants = sum(c.isalpha() and c not in 'aeiou' for c in hostname_clean)
    features['vowel_consonant_ratio'] = float(vowels / max(consonants, 1))

    tld = subdomains[-1] if subdomains else ''
    features['tld_risk'] = 1.0 if tld in HIGH_RISK_TLDS else 0.0

    kw_count = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url.lower())
    features['suspicious_keywords_count'] = float(kw_count)

    is_typo, brand_target, typo_dist = detect_typosquatting(hostname_clean)
    features['brand_impersonation_flag'] = 1.0 if is_typo else 0.0
    features['typosquatting_dist'] = float(typo_dist if is_typo else 0.0)

    features['has_homoglyph_punycode'] = 1.0 if 'xn--' in hostname_clean else 0.0

    ip_regex = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    is_ip = bool(re.match(ip_regex, hostname_clean))
    features['is_ip_address'] = 1.0 if is_ip else 0.0

    # Hex/octal IP detection
    hex_ip = bool(re.search(r'0x[0-9a-fA-F]+', url))
    features['is_hex_octal_ip'] = 1.0 if hex_ip else 0.0

    # URL shorteners
    features['is_shortener'] = 1.0 if hostname_clean in URL_SHORTENERS else 0.0

    # Non-standard ports
    has_port = parsed.port is not None and parsed.port not in (80, 443)
    features['has_non_standard_port'] = 1.0 if has_port else 0.0

    # HTTPS token in domain
    features['https_token_in_domain'] = 1.0 if 'https' in hostname_clean or 'http' in hostname_clean else 0.0

    # Double extensions
    double_ext = bool(re.search(r'\.(pdf|docx|txt|jpg|png|zip)\.(exe|scr|bat|vbs|js|apk)', url, re.I))
    features['has_double_extension'] = 1.0 if double_ext else 0.0

    # Open redirect parameter
    has_redirect_param = any(k in query.lower() for k in ['redirect', 'return', 'next', 'url', 'dest', 'goto'])
    features['has_open_redirect'] = 1.0 if has_redirect_param else 0.0

    # Client-side prefix
    features['has_client_side_prefix'] = 1.0 if url.startswith(('data:', 'javascript:', 'blob:')) else 0.0

    # --- 2. HOST & NETWORK FEATURES ---
    features['domain_age_days'] = float(network.get('domain_age_days', 365.0))
    features['domain_expiry_days'] = float(network.get('domain_expiry_days', 180.0))
    features['has_dns_a'] = 1.0 if network.get('has_dns_a', True) else 0.0
    features['has_dns_mx'] = 1.0 if network.get('has_dns_mx', True) else 0.0
    features['has_dns_ns'] = 1.0 if network.get('has_dns_ns', True) else 0.0
    features['has_dns_txt'] = 1.0 if network.get('has_dns_txt', False) else 0.0
    features['dns_ttl'] = float(network.get('dns_ttl', 300))
    features['has_ssl'] = 1.0 if (parsed.scheme == 'https' or network.get('has_ssl', False)) else 0.0
    features['ssl_valid'] = 1.0 if network.get('ssl_valid', True) else 0.0
    features['ssl_age_days'] = float(network.get('ssl_age_days', 90.0))
    features['is_self_signed'] = 1.0 if network.get('is_self_signed', False) else 0.0

    # --- 3. CONTENT-BASED FEATURES ---
    features['has_password_field'] = 1.0 if content.get('has_password_field', False) else 0.0
    features['form_count'] = float(content.get('form_count', 0))
    features['external_form_action'] = 1.0 if content.get('external_form_action', False) else 0.0
    features['iframe_count'] = float(content.get('iframe_count', 0))
    features['hidden_elements_count'] = float(content.get('hidden_elements_count', 0))
    features['favicon_mismatch'] = 1.0 if content.get('favicon_mismatch', False) else 0.0
    features['external_link_ratio'] = float(content.get('external_link_ratio', 0.0))
    features['disables_right_click'] = 1.0 if content.get('disables_right_click', False) else 0.0
    features['has_js_redirect'] = 1.0 if content.get('has_js_redirect', False) else 0.0
    features['title_domain_mismatch'] = 1.0 if content.get('title_domain_mismatch', False) else 0.0
    features['has_login_form'] = 1.0 if content.get('has_login_form', False) else 0.0

    return features

FEATURE_NAMES = list(extract_features("https://example.com").keys())
