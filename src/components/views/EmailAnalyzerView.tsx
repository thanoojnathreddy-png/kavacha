import React, { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

export const EmailAnalyzerView: React.FC = () => {
  const [emailText, setEmailText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sampleEmail = `From: "State Bank Security Department" <security-alerts@onlinesbi-alerts-verification.xyz>
Reply-To: support-desk-urgent@gmail.com
Subject: URGENT: Your SBI NetBanking Access Has Been Temporarily Restricted
Date: Today

Dear Customer,

We detected unauthorized access to your netbanking account from an unknown IP address. For your security, your account access has been suspended within 24 hours.

To reactivate your account and verify your PAN/Aadhaar credentials immediately, click the secure verification link below:
http://onlinesbi-kyc-verify.top/update.html

Failure to authenticate within 24 hours will result in permanent account termination and legal action under banking regulations.

Thank you,
SBI Security Operations`;

  const handleAnalyze = async () => {
    if (!emailText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch('/api/scan/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_content: emailText })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Email Phishing & Header Social Engineering Analyzer
            </h2>
          </div>
          <button
            onClick={() => setEmailText(sampleEmail)}
            className="text-xs font-mono text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Load Phishing Sample
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Paste the raw email body or complete MIME headers. The analyzer extracts embedded URLs, identifies sender spoofing mismatches, and flags coercive urgency triggers.
        </p>

        <textarea
          rows={8}
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste full email text or headers here..."
          className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 text-slate-900 font-mono text-xs outline-none shadow-xs"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !emailText.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-sm tracking-wide shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Analyzing Headers...' : 'Analyze Email'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Report */}
      {result && (
        <div className="p-6 rounded-2xl glass-panel space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">Email Phishing Score</span>
              <div className="text-2xl font-black font-mono text-slate-900 flex items-center gap-2">
                <span>{result.risk_score} / 100</span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                  result.verdict === 'DANGEROUS' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                  result.verdict === 'SUSPICIOUS' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}>
                  {result.verdict}
                </span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              Extracted Links: <span className="text-slate-900 font-bold">{result.extracted_urls.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgency & Social Engineering Triggers */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono">
                Social Engineering Triggers Detected
              </h3>
              {result.urgency_indicators.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {result.urgency_indicators.map((ind: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-slate-500">No overt urgency intimidation keywords flagged.</div>
              )}
            </div>

            {/* Header & Sender Spoofing Discrepancies */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
                Sender & Header Discrepancies
              </h3>
              {result.spoofing_flags.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {result.spoofing_flags.map((flag: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-slate-500">No header discrepancies detected.</div>
              )}
            </div>
          </div>

          {/* Extracted URLs List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Extracted Hyperlinks ({result.extracted_urls.length})
            </h3>
            <div className="space-y-2">
              {result.extracted_urls.map((link: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-700 truncate max-w-lg font-semibold">{link}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-300 text-[10px] font-bold">
                    FLAGGED TARGET
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-rose-200 text-xs text-slate-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Recommended Response:</span>
              <span>{result.recommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
