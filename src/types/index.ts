export type TabType =
  | 'dashboard'
  | 'scanner'
  | 'bulk'
  | 'email'
  | 'sms'
  | 'qr'
  | 'model'
  | 'redirect_map'
  | 'history'
  | 'quiz'
  | 'emergency'
  | 'settings';

export interface ShapContribution {
  feature: string;
  label: string;
  value: number;
  contribution: number;
  category: 'Brand' | 'Lexical' | 'Network' | 'Host' | 'Content' | 'Evasion';
  description: string;
}

export interface ModelPrediction {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  risk_score: number;
  hybrid_score: number;
  class_probabilities: {
    benign: number;
    phishing: number;
    malware: number;
    defacement: number;
  };
  shap_waterfall: ShapContribution[];
  top_reasons: string[];
  actionable_steps: string[];
  defanged_url: string;
  primary_category: 'Benign' | 'Phishing' | 'Malware' | 'Defacement';
}

export interface NetworkTelemetry {
  ip: string;
  dns_records: {
    a: string[];
    mx: string[];
    ns: string[];
    txt: string[];
  };
  dns_ttl: number;
  ssl: {
    has_ssl: boolean;
    valid: boolean;
    issuer: string;
    subject: string;
    valid_from: string;
    valid_to: string;
    days_remaining: number;
    age_days: number;
    is_self_signed: boolean;
  };
  domain_whois: {
    domain_age_days: number;
    expiry_days: number;
    registrar: string;
    creation_date: string;
  };
  geolocation: {
    country: string;
    country_code: string;
    city: string;
    asn: string;
    org: string;
    lat: number;
    lon: number;
  };
  redirect_chain: Array<{
    hop: number;
    url: string;
    status: number;
    latency_ms: number;
  }>;
  content_analysis: {
    has_password_field: boolean;
    form_count: number;
    external_form_action: boolean;
    iframe_count: number;
    hidden_elements_count: number;
    favicon_mismatch: boolean;
    external_link_ratio: number;
    disables_right_click: boolean;
    has_js_redirect: boolean;
    title_domain_mismatch: boolean;
    has_login_form: boolean;
    page_title: string;
  };
}

export interface ScanResult {
  scan_id: string;
  url: string;
  prediction: ModelPrediction;
  features: Record<string, number>;
  typosquatting: {
    isImpersonating: boolean;
    targetBrand: string;
    distance: number;
  };
  network: NetworkTelemetry;
  threat_intel: {
    reputation_score: number;
    sources_checked: string[];
    threat_feeds: {
      google_safe_browsing: string;
      virustotal: { positives: number; total: number; status: string };
      phishtank: { in_database: boolean; verified: boolean };
      openphish: { flagged: boolean };
    };
  };
  latency_ms: number;
  timestamp: string;
}

export interface ScanRecord {
  id: string;
  url: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  risk_score: number;
  category: string;
  created_at: string;
  details: any;
}
