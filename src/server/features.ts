/**
 * KAVACH - High-Performance Feature Extraction Engine
 * Extracts 60+ lexical, host, and content-based features for ML inference.
 */

export interface ExtractedFeatures {
  // Lexical
  url_length: number;
  hostname_length: number;
  path_length: number;
  query_length: number;
  digit_count: number;
  digit_ratio: number;
  letter_count: number;
  letter_ratio: number;
  special_char_count: number;
  special_char_ratio: number;
  count_dots: number;
  count_hyphens: number;
  count_underscores: number;
  count_at: number;
  count_double_slash: number;
  count_question: number;
  count_equals: number;
  count_ampersand: number;
  count_percent: number;
  subdomain_count: number;
  path_depth: number;
  url_entropy: number;
  domain_entropy: number;
  longest_token_length: number;
  vowel_consonant_ratio: number;
  tld_risk: number;
  suspicious_keywords_count: number;
  brand_impersonation_flag: number;
  typosquatting_dist: number;
  has_homoglyph_punycode: number;
  is_ip_address: number;
  is_hex_octal_ip: number;
  is_shortener: number;
  has_non_standard_port: number;
  https_token_in_domain: number;
  has_double_extension: number;
  has_open_redirect: number;
  has_client_side_prefix: number;

  // Host & DNS
  domain_age_days: number;
  domain_expiry_days: number;
  has_dns_a: number;
  has_dns_mx: number;
  has_dns_ns: number;
  has_dns_txt: number;
  dns_ttl: number;
  has_ssl: number;
  ssl_valid: number;
  ssl_age_days: number;
  is_self_signed: number;

  // Content
  has_password_field: number;
  form_count: number;
  external_form_action: number;
  iframe_count: number;
  hidden_elements_count: number;
  favicon_mismatch: number;
  external_link_ratio: number;
  disables_right_click: number;
  has_js_redirect: number;
  title_domain_mismatch: number;
  has_login_form: number;

  [key: string]: number;
}

export const SUSPICIOUS_KEYWORDS = [
  'login', 'verify', 'secure', 'update', 'account', 'bank', 'paypal', 'wallet',
  'confirm', 'password', 'signin', 'invoice', 'kyc', 'otp', 'netbanking',
  'billing', 'refund', 'support', 'bonus', 'claim', 'authenticate', 'free',
  'reward', 'security', 'suspended', 'unlock', 'portal', 'alert', 'credential',
  'action-required', 'auth', 'recover', 'reactivate', 'card', 'cvv', 'pan', 'aadhaar'
];

export const HIGH_RISK_TLDS = new Set([
  'xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'fit', 'surf', 'rest',
  'icu', 'cam', 'club', 'work', 'bid', 'loan', 'win', 'men', 'racing', 'country',
  'stream', 'gdn', 'mom', 'vip', 'monster', 'beauty', 'hair', 'quest', 'click'
]);

export const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'bit.do', 'cutt.ly', 'rebrand.ly', 'tiny.cc', 'rb.gy', 'shorte.st'
]);

export const TARGET_BRANDS = [
  // Indian Banking & Fintech
  'sbi', 'onlinesbi', 'hdfc', 'hdfcbank', 'icici', 'icicibank', 'axis', 'axisbank',
  'pnb', 'canarabank', 'kotak', 'paytm', 'phonepe', 'gpay', 'googlepay', 'upi',
  'bhim', 'cred', 'mobikwik', 'freecharge',
  // Indian Government & Public Services
  'aadhaar', 'uidai', 'digilocker', 'irctc', 'incometax', 'incometaxindia',
  'indiapost', 'epfindia', 'parivahan', 'vahan', 'cowin',
  // Indian E-Commerce & Telecom
  'flipkart', 'amazon', 'jio', 'reliancejio', 'airtel', 'vi', 'vodafone',
  'swiggy', 'zomato', 'zepto', 'blinkit',
  // Global Tech & Financial
  'paypal', 'apple', 'icloud', 'microsoft', 'office365', 'outlook', 'live',
  'google', 'gmail', 'netflix', 'facebook', 'instagram', 'whatsapp', 'meta',
  'chase', 'wellsfargo', 'bankofamerica', 'citi', 'binance', 'coinbase',
  'metamask', 'steam', 'dropbox', 'github', 'yahoo', 'adobe'
];

export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const map: Record<string, number> = {};
  for (const c of str) {
    map[c] = (map[c] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const count of Object.values(map)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(4));
}

export function damerauLevenshtein(s1: string, s2: string): number {
  const d: number[][] = [];
  const len1 = s1.length;
  const len2 = s2.length;

  for (let i = 0; i <= len1; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= len2; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost); // transposition
      }
    }
  }
  return d[len1][len2];
}

const OFFICIAL_BRAND_DOMAINS = new Set([
  'hdfcbank.com', 'onlinesbi.sbi', 'sbi.co.in', 'icicibank.com', 'axisbank.com',
  'pnbindia.in', 'canarabank.com', 'kotak.com', 'paytm.com', 'phonepe.com',
  'uidai.gov.in', 'incometax.gov.in', 'irctc.co.in', 'indiapost.gov.in',
  'amazon.in', 'amazon.com', 'flipkart.com', 'jio.com', 'airtel.in',
  'google.com', 'apple.com', 'microsoft.com', 'paypal.com', 'netflix.com',
  'github.com', 'digilocker.gov.in', 'epfindia.gov.in', 'zomato.com', 'swiggy.com'
]);

export function checkTyposquatting(domain: string): { isImpersonating: boolean; targetBrand: string; distance: number } {
  const clean = domain.toLowerCase().split(':')[0];
  const parts = clean.split('.');
  const hostStem = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  const registeredDomain = parts.length >= 2 ? parts.slice(-2).join('.') : clean;

  // If the registered domain is an authentic brand domain, never flag
  if (OFFICIAL_BRAND_DOMAINS.has(registeredDomain) || Array.from(OFFICIAL_BRAND_DOMAINS).some(d => clean.endsWith('.' + d) || clean === d)) {
    return { isImpersonating: false, targetBrand: '', distance: 999 };
  }

  for (const brand of TARGET_BRANDS) {
    // Exact or compound impersonation on non-official domain e.g. sbi-online.top, login-hdfc.net
    if (clean.includes(brand)) {
      if (/[-_]/.test(clean) || /login|verify|secure|update|netbanking|portal|alert|kyc/.test(clean)) {
        return { isImpersonating: true, targetBrand: brand, distance: 0 };
      }
    }

    // Edit distance check on domain stem
    if (hostStem.length >= 3 && brand.length >= 3) {
      const dist = damerauLevenshtein(hostStem, brand);
      if (dist >= 1 && dist <= 2 && Math.abs(hostStem.length - brand.length) <= 2) {
        return { isImpersonating: true, targetBrand: brand, distance: dist };
      }
    }
  }

  return { isImpersonating: false, targetBrand: '', distance: 999 };
}

export function extractAllFeatures(
  rawUrl: string,
  networkData: Partial<ExtractedFeatures> = {},
  contentData: Partial<ExtractedFeatures> = {}
): { features: ExtractedFeatures; typosquattingInfo: { isImpersonating: boolean; targetBrand: string; distance: number } } {
  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    parsed = new URL('http://' + url.replace(/[^a-zA-Z0-9.:\/-_]/g, ''));
  }

  const hostname = parsed.hostname.toLowerCase();
  const path = parsed.pathname;
  const search = parsed.search;
  const fullUrl = parsed.href;
  const urlLen = fullUrl.length;

  const digits = (fullUrl.match(/\d/g) || []).length;
  const letters = (fullUrl.match(/[a-zA-Z]/g) || []).length;
  const specialChars = urlLen - (digits + letters);

  const subdomains = hostname.split('.');
  const tld = subdomains[subdomains.length - 1] || '';

  const typo = checkTyposquatting(hostname);

  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const isIp = ipRegex.test(hostname);
  const isHexOctal = /0x[0-9a-fA-F]+/i.test(fullUrl);
  const isShortener = URL_SHORTENERS.has(hostname);
  const nonStdPort = parsed.port !== '' && parsed.port !== '80' && parsed.port !== '443';
  const httpsInDomain = hostname.includes('https') || hostname.includes('http');
  const doubleExt = /\.(pdf|docx|txt|jpg|png|zip)\.(exe|scr|bat|vbs|js|apk|bin)/i.test(fullUrl);
  const hasOpenRedirect = /[?&](redirect|return|next|url|dest|goto)=https?:/i.test(search);
  const clientSidePrefix = /^(data|javascript|blob):/i.test(rawUrl);

  const tokens = fullUrl.split(/[/.\-_?=&]+/);
  let longestToken = 0;
  for (const t of tokens) {
    if (t.length > longestToken) longestToken = t.length;
  }

  const vowels = (hostname.match(/[aeiou]/g) || []).length;
  const consonants = (hostname.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;

  let kwCount = 0;
  const lowerUrl = fullUrl.toLowerCase();
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (lowerUrl.includes(kw)) kwCount++;
  }

  const features: ExtractedFeatures = {
    url_length: urlLen,
    hostname_length: hostname.length,
    path_length: path.length,
    query_length: search.length,
    digit_count: digits,
    digit_ratio: Number((digits / Math.max(urlLen, 1)).toFixed(4)),
    letter_count: letters,
    letter_ratio: Number((letters / Math.max(urlLen, 1)).toFixed(4)),
    special_char_count: specialChars,
    special_char_ratio: Number((specialChars / Math.max(urlLen, 1)).toFixed(4)),
    count_dots: (fullUrl.match(/\./g) || []).length,
    count_hyphens: (fullUrl.match(/-/g) || []).length,
    count_underscores: (fullUrl.match(/_/g) || []).length,
    count_at: (fullUrl.match(/@/g) || []).length,
    count_double_slash: (fullUrl.match(/\/\//g) || []).length > 1 ? 1 : 0,
    count_question: (fullUrl.match(/\?/g) || []).length,
    count_equals: (fullUrl.match(/=/g) || []).length,
    count_ampersand: (fullUrl.match(/&/g) || []).length,
    count_percent: (fullUrl.match(/%/g) || []).length,
    subdomain_count: Math.max(subdomains.length - 2, 0),
    path_depth: (path.match(/\//g) || []).length,
    url_entropy: calculateShannonEntropy(fullUrl),
    domain_entropy: calculateShannonEntropy(hostname),
    longest_token_length: longestToken,
    vowel_consonant_ratio: Number((vowels / Math.max(consonants, 1)).toFixed(4)),
    tld_risk: HIGH_RISK_TLDS.has(tld) ? 1.0 : 0.0,
    suspicious_keywords_count: kwCount,
    brand_impersonation_flag: typo.isImpersonating ? 1.0 : 0.0,
    typosquatting_dist: typo.isImpersonating ? typo.distance : 0.0,
    has_homoglyph_punycode: hostname.includes('xn--') ? 1.0 : 0.0,
    is_ip_address: isIp ? 1.0 : 0.0,
    is_hex_octal_ip: isHexOctal ? 1.0 : 0.0,
    is_shortener: isShortener ? 1.0 : 0.0,
    has_non_standard_port: nonStdPort ? 1.0 : 0.0,
    https_token_in_domain: httpsInDomain ? 1.0 : 0.0,
    has_double_extension: doubleExt ? 1.0 : 0.0,
    has_open_redirect: hasOpenRedirect ? 1.0 : 0.0,
    has_client_side_prefix: clientSidePrefix ? 1.0 : 0.0,

    // Host & Network
    domain_age_days: networkData.domain_age_days ?? 365,
    domain_expiry_days: networkData.domain_expiry_days ?? 180,
    has_dns_a: networkData.has_dns_a ?? 1,
    has_dns_mx: networkData.has_dns_mx ?? 1,
    has_dns_ns: networkData.has_dns_ns ?? 1,
    has_dns_txt: networkData.has_dns_txt ?? 0,
    dns_ttl: networkData.dns_ttl ?? 300,
    has_ssl: parsed.protocol === 'https:' ? 1 : (networkData.has_ssl ?? 0),
    ssl_valid: networkData.ssl_valid ?? 1,
    ssl_age_days: networkData.ssl_age_days ?? 90,
    is_self_signed: networkData.is_self_signed ?? 0,

    // Content
    has_password_field: contentData.has_password_field ?? 0,
    form_count: contentData.form_count ?? 0,
    external_form_action: contentData.external_form_action ?? 0,
    iframe_count: contentData.iframe_count ?? 0,
    hidden_elements_count: contentData.hidden_elements_count ?? 0,
    favicon_mismatch: contentData.favicon_mismatch ?? 0,
    external_link_ratio: contentData.external_link_ratio ?? 0,
    disables_right_click: contentData.disables_right_click ?? 0,
    has_js_redirect: contentData.has_js_redirect ?? 0,
    title_domain_mismatch: contentData.title_domain_mismatch ?? 0,
    has_login_form: contentData.has_login_form ?? 0
  };

  return { features, typosquattingInfo: typo };
}
