import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Shield,
  User,
  Sparkles,
  RefreshCw,
  Minimize2,
  Maximize2,
  Minus,
  PhoneCall,
  AlertTriangle,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isFallback?: boolean;
}

interface KavachamChatbotProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
}

// Comprehensive cybersecurity knowledge engine fallback if offline or high latency
function getInstantSecurityAdvice(query: string): string {
  const q = query.toLowerCase().trim();

  if (q.startsWith('hi') || q.startsWith('hello') || q.startsWith('hey') || q === 'test' || q === 'who are you') {
    return `🛡️ **Namaste! I am Kavacham AI**, your 24/7 Cybersecurity Shield.\n\n` +
      `I specialize in detecting cyber scams, phishing lures, and digital fraud across Indian and global platforms.\n\n` +
      `• **Verify URLs:** Paste any suspicious link or domain name.\n` +
      `• **Analyze SMS/WhatsApp:** Check messages about KYC, electricity bills, or lottery prizes.\n` +
      `• **Payment Safety:** Learn why entering a UPI PIN is never required to receive money.\n` +
      `• **Incident Recovery:** Immediate countermeasures if you clicked or shared OTPs.\n\n` +
      `How can I secure you today?`;
  }

  if (q.includes('what is phishing') || q.includes('explain phishing') || q.includes('phishing meaning')) {
    return `🎣 **Understanding Phishing Attacks**:\n\n` +
      `Phishing is a deceptive technique where attackers impersonate trusted institutions (banks, courier services, tax departments) to steal passwords, debit card numbers, or OTPs.\n\n` +
      `• **Smishing:** Fake SMS claiming "Account blocked - Update KYC immediately".\n` +
      `• **Typosquatting:** Lookalike URLs like \`amaz0n.com\` or \`paytm-kyc.xyz\`.\n` +
      `• **UPI Traps:** "Collect request" links claiming to send you cashbacks.\n\n` +
      `**Golden Defense:** Legitimate institutions never create panic or demand sensitive credentials over chat or SMS.`;
  }

  if (q.includes('kyc') || q.includes('bank') || q.includes('sbi') || q.includes('hdfc') || q.includes('icici') || q.includes('pan') || q.includes('aadhaar')) {
    return `🛡️ **Kavach Critical Advisory: Fake KYC Smishing**\n\n` +
      `• **Zero Trust Rule:** Indian banks NEVER send SMS or WhatsApp links asking you to update KYC, unblock accounts, or link PAN cards.\n` +
      `• **Check the Domain:** Official bank URLs end strictly in \`.sbi\`, \`.hdfcbank.com\`, \`.icicibank.com\`, or approved banking domains—never \`.xyz\`, \`.top\`, or generic free web hosts.\n` +
      `• **Golden Hour Action:** If you submitted details, immediately call **1930** (National Cybercrime Helpline) and lock your cards via netbanking.`;
  }

  if (q.includes('upi') || q.includes('pin') || q.includes('cashback') || q.includes('refund') || q.includes('qr') || q.includes('reward')) {
    return `⚠️ **Kavach UPI Security Defense**\n\n` +
      `• **Core UPI Law:** Entering your UPI PIN is **ONLY** required for SENDING money. You NEVER need to enter a PIN to receive money, prizes, or cashbacks.\n` +
      `• **Reverse Charge Scams:** Fraudsters send collect requests masked as "Payment of Rs 2,000 received - Enter PIN to claim". Approving this immediately debits your account.\n` +
      `• **Action:** Reject the collect request immediately inside your UPI application and report the VPA address.`;
  }

  if (q.includes('click') || q.includes('opened') || q.includes('password') || q.includes('entered') || q.includes('compromised') || q.includes('hacked')) {
    return `🚨 **Emergency Incident Containment Steps**\n\n` +
      `1. **Disconnect Network:** Turn on Airplane Mode or disconnect Wi-Fi and mobile data immediately to halt data exfiltration.\n` +
      `2. **Lock Financials:** From an alternate trusted device, log in to your banking app to freeze netbanking access and debit/credit cards.\n` +
      `3. **Rotate Credentials:** Change your master Google/Apple account password and primary email credentials.\n` +
      `4. **Report to Authorities:** Call national helpline **1930** or file a report at **https://cybercrime.gov.in** within 24 hours.`;
  }

  if (q.includes('apk') || q.includes('app') || q.includes('download') || q.includes('install') || q.includes('file')) {
    return `⚠️ **Malicious APK Sideloading Warning**\n\n` +
      `• Fraudsters send APK files disguised as "Electricity Bill Helper.apk", "SBI Yono Update.apk", or "Courier Tracking.apk".\n` +
      `• Once installed, these grant full accessibility permissions, intercepting two-factor OTPs and recording screen activity.\n` +
      `• **Action:** Delete the APK immediately. If installed, boot your device in Safe Mode, uninstall the application, and run a malware audit.`;
  }

  if (q.includes('typo') || q.includes('punycode') || q.includes('fake url') || q.includes('domain') || q.includes('spot') || q.includes('http') || q.includes('.xyz') || q.includes('.top')) {
    return `🔍 **Kavach Threat Diagnostic: Detecting Fake URLs**\n\n` +
      `• **Typosquatting:** Watch for letter substitution like \`amaz0n.com\`, \`paytmm.com\`, or \`gov-in[.]org\`.\n` +
      `• **Subdomain Trickery:** \`sbi.co.in.verification-portal.xyz\` is hosted on \`verification-portal.xyz\`, NOT SBI.\n` +
      `• **High-Risk TLDs:** Check for suspicious extensions like \`.top\`, \`.xyz\`, \`.click\`, \`.work\`, and \`.live\`.\n` +
      `• Use Kavach's **URL Scanner** tab for full 18-feature ML risk scoring!`;
  }

  return `🛡️ **Kavach Cyber Defense Analysis**\n\n` +
    `• Always verify the exact domain stem in your browser address bar before entering credentials or phone numbers.\n` +
    `• Never share OTPs or click unverified links received via SMS, WhatsApp, or Telegram.\n` +
    `• For financial cyber fraud in India, dial **1930** immediately or register an official incident at **https://cybercrime.gov.in**.\n` +
    `• Paste any specific link or message here for instant threat breakdown.`;
}

// Markdown formatter helper to render bold text, bullet points, and code nicely
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed font-sans text-xs">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Handle bullet points
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-');
        const cleanLine = isBullet ? line.trim().replace(/^[•*-]\s*/, '') : line;

        // Parse bold markup **bold**
        const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g);
        const renderedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
              <span className="text-rose-600 font-bold shrink-0 leading-tight">•</span>
              <span className="flex-1">{renderedParts}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-slate-800">
            {renderedParts}
          </p>
        );
      })}
    </div>
  );
}

export const KavachamChatbot: React.FC<KavachamChatbotProps> = ({
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
  isCollapsed = false
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (isControlled && externalSetIsOpen) {
      externalSetIsOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '🛡️ **Namaste! I am Kavacham AI**, your 24/7 Cybersecurity Shield.\n\nAsk me anything about suspicious SMS, fake KYC, UPI scams, malicious links, or emergency cyber incident recovery.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    'Fake bank KYC SMS?',
    'UPI cashback PIN scam?',
    'I clicked a suspicious link!',
    'How to spot fake domains?'
  ];

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (messages.length > 1) {
      setUnreadCount((c) => c + 1);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setLoading(true);

    let replyText = '';

    try {
      // 12-second safeguard timeout allowing ample generation time
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const res = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data && (data.reply || data.response || data.message || data.text)) {
            replyText = (data.reply || data.response || data.message || data.text || '').trim();
          }
        }
      } catch (networkErr: any) {
        clearTimeout(timeoutId);
        // Try alternate route if primary hit connection issue
        try {
          const res2 = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          });
          if (res2.ok) {
            const data2 = await res2.json().catch(() => null);
            if (data2 && (data2.reply || data2.response || data2.message || data2.text)) {
              replyText = (data2.reply || data2.response || data2.message || data2.text || '').trim();
            }
          }
        } catch {
          // fallback to knowledge engine
        }
      }

      // If empty reply from server, trigger knowledge engine
      if (!replyText) {
        replyText = getInstantSecurityAdvice(text);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackText = getInstantSecurityAdvice(text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: '🛡️ **Kavacham AI Shield Reset**.\n\nReady for your next query on cyber threats, suspicious URLs, or digital payment safety.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button - Positioned at LEFT-MOST BOTTOM */}
      {!isOpen && (
        <div className={`fixed bottom-3 left-3 z-50 flex items-center select-none ${isCollapsed ? 'w-auto' : 'w-[232px]'}`}>
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className={`group relative flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer border border-rose-400/60 ${
              isCollapsed ? 'p-3 rounded-full' : 'w-full px-3.5 py-2.5'
            }`}
            aria-label="Open Kavacham AI Chatbot"
            title="Open Kavacham Cybersecurity Shield Chatbot"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <Shield className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 border border-rose-700 rounded-full" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="font-mono tracking-wide text-xs">KAVACHAM BOT</span>
                  <span className="text-[9px] text-rose-100 font-sans font-normal -mt-0.5">
                    Cyber Shield AI • Live
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/20 text-white border border-white/30">
                AI ACTIVE
              </span>
            )}

            {unreadCount > 0 && isCollapsed && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] bg-white text-rose-700 rounded-full font-bold shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chatbot Window on Left-Most Bottom */}
      {isOpen && (
        <div
          className={`fixed bottom-3 left-3 z-50 max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized
              ? 'w-[320px] sm:w-[360px] h-[60px]'
              : isExpanded
              ? 'w-[520px] sm:w-[600px] h-[640px] max-h-[90vh]'
              : 'w-[360px] sm:w-[420px] h-[540px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white flex items-center justify-between border-b border-rose-500/30 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-wider font-mono">
                    KAVACHAM CHATBOT
                  </span>
                  <span className="text-[9px] bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 px-1.5 py-0.2 rounded-full font-sans">
                    Active
                  </span>
                </div>
                <span className="text-[10px] text-rose-100/90 font-sans">
                  Real-Time Cyber Armor
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1 hover:text-white hover:bg-white/15 rounded cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {!isMinimized && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Compact View' : 'Enlarge View'}
                  className="p-1 hover:text-white hover:bg-white/15 rounded cursor-pointer transition-colors"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Restore Window' : 'Minimize Window'}
                className="p-1 hover:text-white hover:bg-white/15 rounded cursor-pointer transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chatbot"
                className="p-1 hover:text-white hover:bg-white/15 rounded cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Message History Viewport */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${
                      m.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Shield className="w-3 h-3" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed space-y-1 shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-rose-600 text-white border border-rose-700 rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                      }`}
                    >
                      {m.sender === 'user' ? (
                        <div className="whitespace-pre-wrap font-sans text-xs">{m.text}</div>
                      ) : (
                        renderFormattedMessage(m.text)
                      )}

                      <div
                        className={`text-[9px] text-right font-mono mt-1 ${
                          m.sender === 'user' ? 'text-rose-200' : 'text-slate-400'
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-6 h-6 rounded-md bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono pl-8 py-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                    <span>Analyzing threat query with Kavach AI...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2 bg-white border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp)}
                    disabled={loading}
                    className="shrink-0 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 text-slate-700 text-[10px] font-medium border border-slate-200 transition-colors cursor-pointer"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Emergency Quick Actions Bar */}
              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <a
                  href="tel:1930"
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold hover:underline"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call 1930</span>
                </a>
                <span className="text-slate-300">•</span>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 hover:underline"
                >
                  cybercrime.gov.in
                </a>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Shield Active
                </span>
              </div>

              {/* Input Footer */}
              <div className="p-2.5 bg-white border-t border-slate-200 flex gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Kavacham about scams, links, UPI..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-900 text-xs outline-none placeholder:text-slate-400 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputMsg.trim()}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
