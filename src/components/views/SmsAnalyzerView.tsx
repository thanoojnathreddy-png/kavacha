import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, ShieldCheck, PhoneCall, Sparkles, RefreshCw } from 'lucide-react';

export const SmsAnalyzerView: React.FC = () => {
  const [smsText, setSmsText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const presets = [
    {
      title: 'Electricity Cutoff Threat',
      text: 'Dear Consumer, Your Electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Sharma at 9876543210 or update bill at http://billpay-portal.xyz/pay'
    },
    {
      title: 'SBI / Paytm KYC Block',
      text: 'Dear Customer, Your SBI NetBanking / Paytm Wallet will be permanently blocked today due to pending KYC documents. Click here http://onlinesbi-kyc-verify.top/update.html to update your PAN and Aadhaar immediately.'
    },
    {
      title: 'UPI Cashback / Scratch Card',
      text: 'Congratulations! You have received ₹3,500 cashback reward from PhonePe / Google Pay. Click link upi://pay?pa=refundservice2024@okaxis&pn=REFUND_DESK&am=3500&cu=INR or visit http://phonepe-cashback-reward-2024.cf to receive cash in your bank account.'
    },
    {
      title: 'India Post Delivery Held',
      text: 'Your package from India Post could not be delivered due to missing house number in your shipping address. Update your address within 24 hours at http://indiapost-parcels-tracking.buzz/address_update.php to prevent return to sender.'
    }
  ];

  const handleAnalyze = async () => {
    if (!smsText.trim()) return;
    setIsScanning(true);
    setResult(null);

    try {
      const res = await fetch('/api/scan/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: smsText })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              SMS & WhatsApp Scam Analyzer (India Defense Grid)
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Tuned for prevalent Indian cyber fraud archetypes: Fake KYC suspension, Electricity bill disconnection, UPI reverse debit scams, Courier parcel traps, and KBC lotteries.
        </p>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Common Scams:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setSmsText(p.text)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-mono cursor-pointer transition-all shadow-xs"
            >
              {p.title}
            </button>
          ))}
        </div>

        <textarea
          rows={5}
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          placeholder="Paste SMS or WhatsApp message text here..."
          className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 text-slate-900 font-mono text-xs outline-none shadow-xs"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isScanning || !smsText.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-sm tracking-wide shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isScanning ? 'Scanning Pattern...' : 'Analyze Message'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="p-6 rounded-2xl glass-panel space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">Fraud Pattern Identified</span>
              <div className="text-xl font-black text-rose-600 font-mono mt-0.5">
                {result.scam_type}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs px-3 py-1 rounded-lg font-bold font-mono uppercase ${
                result.verdict === 'DANGEROUS' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                result.verdict === 'SUSPICIOUS' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                'bg-emerald-50 text-emerald-700 border border-emerald-300'
              }`}>
                {result.verdict} ({result.risk_score}/100)
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Modus Operandi Breakdown
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.fraud_explanation}
            </p>
          </div>

          {/* Flagged Links */}
          {result.extracted_urls.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Suspicious URLs Embedded in Message
              </h3>
              {result.extracted_urls.map((link: string, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs truncate font-semibold">
                  {link}
                </div>
              ))}
            </div>
          )}

          {/* Emergency Hotline Alert */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-red-600 animate-pulse shrink-0" />
              <div className="text-xs text-slate-800">
                <span className="font-bold text-slate-900 block">Immediate Fraud Intervention Helpline:</span>
                <span>{result.emergency_helpline}</span>
              </div>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 shadow-xs"
            >
              cybercrime.gov.in
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
