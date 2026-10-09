export interface QuizQuestion {
  id: number;
  scenario: string;
  sender_or_medium: string;
  url_or_content: string;
  is_phishing: boolean;
  category: 'Banking Phishing' | 'UPI Fraud' | 'Utility Scam' | 'Legitimate Service' | 'Delivery Scam';
  explanation: string;
  key_indicators: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: "You receive an SMS warning that your State Bank of India netbanking will be suspended today.",
    sender_or_medium: "SMS from sender: 'VK-SBIBNK'",
    url_or_content: "http://onlinesbi-kyc-verify.top/update.html",
    is_phishing: true,
    category: "Banking Phishing",
    explanation: "This is a classic credential harvesting attack. Official SBI portals are exclusively hosted on 'onlinesbi.sbi' or 'sbi.co.in'. The deceptive '.top' TLD and unencrypted HTTP connection are immediate red flags.",
    key_indicators: [
      "Top-Level Domain is '.top' instead of official bank domain",
      "Subdomain trickery: 'onlinesbi-kyc-verify'",
      "Insecure plain HTTP protocol (no TLS)",
      "Urgent threat of immediate account suspension"
    ]
  },
  {
    id: 2,
    scenario: "WhatsApp message claiming your home electricity will be disconnected tonight at 9:30 PM due to an unpaid bill.",
    sender_or_medium: "WhatsApp from +91 98765 43210 with state power logo",
    url_or_content: "Dear Consumer, your electricity will be disconnected tonight at 9:30 PM. Call Electricity Officer immediately at 9876543210 or update bill at http://billpay-portal.xyz/pay",
    is_phishing: true,
    category: "Utility Scam",
    explanation: "This is India's notorious Electricity Bill Disconnection Scam. Utility companies never instruct customers to call private 10-digit mobile numbers or make payments via disposable '.xyz' websites.",
    key_indicators: [
      "Sent from a personal 10-digit mobile number rather than registered government shortcode",
      "Artificial time pressure ('tonight at 9:30 PM')",
      "High-risk .xyz domain masquerading as official billing gateway"
    ]
  },
  {
    id: 3,
    scenario: "An email confirming an order you placed on Amazon India with standard tracking.",
    sender_or_medium: "Email from: auto-confirm@amazon.in",
    url_or_content: "https://www.amazon.in/gp/your-account/order-history?ref=oh_aui_menu",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is a genuine URL belonging to Amazon India. The domain stem 'amazon.in' is authentic, protected with valid Extended Validation TLS, and utilizes verified internal path routing.",
    key_indicators: [
      "Exact match on official top-level domain 'amazon.in'",
      "Valid HTTPS encryption from trusted certificate authority",
      "Standard authenticated account dashboard route"
    ]
  },
  {
    id: 4,
    scenario: "A PhonePe user on OLX wants to buy your used table and sends a QR code to 'transfer money into your bank account'.",
    sender_or_medium: "OLX Chat / WhatsApp",
    url_or_content: "upi://pay?pa=refundservice2024@okaxis&pn=REFUND_CREDIT_DESK&am=4500&cu=INR",
    is_phishing: true,
    category: "UPI Fraud",
    explanation: "Golden rule of UPI: You NEVER enter your UPI PIN to RECEIVE money. Scanning this QR code or opening this UPI intent link will initiate a debit from your own bank account.",
    key_indicators: [
      "UPI payment link contains amount debit parameter ('am=4500')",
      "Fake merchant display name 'REFUND_CREDIT_DESK' hiding personal VPA",
      "Misrepresents sending money as receiving money"
    ]
  },
  {
    id: 5,
    scenario: "An SMS claiming your India Post parcel cannot be delivered due to an incomplete street address.",
    sender_or_medium: "SMS from unknown header",
    url_or_content: "http://indiapost-parcels-tracking.buzz/address_update.php",
    is_phishing: true,
    category: "Delivery Scam",
    explanation: "India Post is a department of the Government of India and strictly operates under the 'indiapost.gov.in' domain. The '.buzz' TLD indicates a spoofed credential and credit card collection site.",
    key_indicators: [
      "Absence of official '.gov.in' sovereign domain",
      "High-risk '.buzz' TLD",
      "Demands fee payment for redelivery to steal card CVV"
    ]
  },
  {
    id: 6,
    scenario: "IRCTC ticket booking confirmation link to verify PNR status.",
    sender_or_medium: "Official SMS from 'IRCTC'",
    url_or_content: "https://www.irctc.co.in/nget/train-search",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is the genuine IRCTC Next Generation e-Ticketing portal. Notice the exact domain 'irctc.co.in' with verified HTTPS.",
    key_indicators: [
      "Official 'irctc.co.in' domain registered by Indian Railway Catering and Tourism Corp",
      "Active TLS certificates signed by public CA",
      "No urgency coercion"
    ]
  }
];
