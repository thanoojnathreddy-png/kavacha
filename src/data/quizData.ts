export interface QuizQuestion {
  id: number;
  scenario: string;
  sender_or_medium: string;
  url_or_content: string;
  is_phishing: boolean;
  category:
    | 'Banking Phishing'
    | 'UPI Fraud'
    | 'Utility Scam'
    | 'Legitimate Service'
    | 'Delivery Scam'
    | 'Job & Investment Scam'
    | 'Lottery / Prize Scam'
    | 'Tax / Government Impersonation'
    | 'Social Media Impersonation';
  explanation: string;
  key_indicators: string[];
}

export const QUIZ_QUESTION_BANK: Omit<QuizQuestion, 'id'>[] = [
  {
    scenario: "You receive an SMS warning that your State Bank of India netbanking will be suspended today unless PAN is linked.",
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
  },
  {
    scenario: "Telegram message offering Part-time YouTube video like/subscribe job with Rs 3,500 daily payout upon Rs 1,000 security deposit.",
    sender_or_medium: "Telegram recruiter: 'HR Global Media'",
    url_or_content: "http://vip-task-earning-portal.club/register?ref=HR77",
    is_phishing: true,
    category: "Job & Investment Scam",
    explanation: "This is a classic 'Task-based / Like & Subscribe' Advance-Fee Scam. Legitimate employers never ask employees to deposit money or recharge crypto wallets to receive earnings.",
    key_indicators: [
      "Advance deposit requested to 'unlock VIP task level'",
      "Suspicious '.club' domain hosted on disposable infrastructure",
      "Unrealistic earning claims for zero-skill micro tasks"
    ]
  },
  {
    scenario: "Income Tax Department notification email regarding tax refund approval.",
    sender_or_medium: "Email from: 'refund-desk@incometax-gov-filing.cc'",
    url_or_content: "http://incometax-gov-filing.cc/refund/claim_bank_details.php",
    is_phishing: true,
    category: "Tax / Government Impersonation",
    explanation: "The Income Tax Department of India exclusively uses the domain 'incometax.gov.in'. Government departments never use '.cc' domains and do not collect netbanking passwords for refunds.",
    key_indicators: [
      "Fake domain 'incometax-gov-filing.cc' instead of official '.gov.in'",
      "Direct form asking for NetBanking password and debit card PIN",
      "Unsolicited instant refund claim lure"
    ]
  },
  {
    scenario: "HDFC Bank NetBanking login for updating your communication address.",
    sender_or_medium: "Browser bookmark / direct entry",
    url_or_content: "https://netbanking.hdfcbank.com/netbanking/",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is the genuine HDFC Bank NetBanking portal. The main registered domain is 'hdfcbank.com', and 'netbanking' is a legitimate corporate subdomain protected by EV TLS.",
    key_indicators: [
      "Authentic base domain 'hdfcbank.com'",
      "Valid HTTPS TLS security certificate",
      "No abnormal redirected tokens or URL obfuscations"
    ]
  },
  {
    scenario: "WhatsApp message claiming you won Kaun Banega Crorepati (KBC) lottery prize of Rs 25 Lakhs.",
    sender_or_medium: "WhatsApp audio note + poster with Rana Pratap Singh photo",
    url_or_content: "WhatsApp audio: 'Congratulations sir you won KBC 25 Lakh lottery. Call SBI manager 7089123456 to pay 12,500 tax registration fee.'",
    is_phishing: true,
    category: "Lottery / Prize Scam",
    explanation: "The KBC Lottery WhatsApp scam is a widespread advance-fee fraud. KBC never conducts lotteries via WhatsApp audio notes, and lottery prizes never require advance processing fees to a private UPI or phone number.",
    key_indicators: [
      "Demand for advance 'tax fee' to release prize",
      "Unsolicited lottery win for a contest you never entered",
      "Private mobile phone number disguised as bank manager"
    ]
  },
  {
    scenario: "GitHub password reset link requested from your authenticated browser profile.",
    sender_or_medium: "Email from: support@github.com",
    url_or_content: "https://github.com/password_reset/3f9a72b10e?token=gh_pwr_reset_valid",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is an authentic password reset workflow from GitHub. The domain is exactly 'github.com' over HTTPS with verified DKIM/SPF from github.com.",
    key_indicators: [
      "Legitimate primary domain 'github.com'",
      "Authenticated sender from official GitHub mail servers",
      "Standard cryptographic reset token"
    ]
  },
  {
    scenario: "Instagram DM claiming copyright infringement on your account; click link within 24 hours to prevent account deletion.",
    sender_or_medium: "Instagram DM from: 'instagram_copyright_appeal_helpdesk'",
    url_or_content: "https://instagram-copyright-infringement-case99.cfd/verify-appeal",
    is_phishing: true,
    category: "Social Media Impersonation",
    explanation: "Meta/Instagram never notifies users of copyright strikes via direct messages. Official appeals are done inside the native app settings. The '.cfd' domain is an illicit phishing proxy designed to steal 2FA codes.",
    key_indicators: [
      "Direct Message rather than in-app official Support Inbox notification",
      "Suspicious domain '.cfd' imitating Instagram",
      "24-hour panic deadline to bypass critical thinking"
    ]
  },
  {
    scenario: "Google Security alert informing you of a new sign-in on an unknown Windows machine.",
    sender_or_medium: "Email from: no-reply@accounts.google.com",
    url_or_content: "https://myaccount.google.com/notifications",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is a legitimate Google Security notice. The domain is genuine 'google.com' with 'myaccount' subdomain, leading to your actual security notification center.",
    key_indicators: [
      "Official domain 'google.com'",
      "Signed DKIM from google.com",
      "Navigates to safe internal settings dashboard"
    ]
  },
  {
    scenario: "SMS warning: Your Jio SIM card KYC is expired. Outgoing calls blocked tonight. Download QuickSupport app immediately.",
    sender_or_medium: "SMS from: +91 91234 56789",
    url_or_content: "http://jio-4g-sim-kyc-update.online/quicksupport.apk",
    is_phishing: true,
    category: "Banking Phishing",
    explanation: "Telecom KYC fraud attempts to trick victims into downloading remote access trojans (AnyDesk, QuickSupport, or malicious APKs) to mirror the victim's screen and intercept banking OTPs.",
    key_indicators: [
      "Requests download of an unverified .apk file or remote-control tool",
      "Fake domain '.online' mimicking Reliance Jio",
      "Sent from personal mobile number instead of telecom TRAI alphanumeric header (e.g., 'JM-JIOINF')"
    ]
  },
  {
    scenario: "National Payments Corporation of India (NPCI) official website for checking UPI transaction guides.",
    sender_or_medium: "Search result / bookmark",
    url_or_content: "https://www.npci.org.in/what-we-do/upi/product-overview",
    is_phishing: false,
    category: "Legitimate Service",
    explanation: "This is the authentic National Payments Corporation of India (NPCI) portal. Registered on 'npci.org.in' with full EV certificate validation.",
    key_indicators: [
      "Official 'npci.org.in' non-profit organization domain",
      "Valid HTTPS encryption",
      "Authentic educational product directory"
    ]
  }
];

/**
 * Returns a randomized new set of quiz questions.
 * @param count Number of questions per quiz simulation (default: 5)
 */
export function generateNewQuiz(count: number = 5): QuizQuestion[] {
  // Shuffle array using Fisher-Yates
  const shuffled = [...QUIZ_QUESTION_BANK];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure a healthy mix of phishing and legitimate questions
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((q, index) => ({
    ...q,
    id: index + 1
  }));
}

// Initial default set
export const QUIZ_QUESTIONS = generateNewQuiz(5);
