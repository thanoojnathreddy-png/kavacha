import React, { useState } from 'react';
import {
  Search,
  Shield,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  FileText,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ExternalLink,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { ThreatGauge } from '../ThreatGauge.tsx';
import { UrlAnatomy } from '../UrlAnatomy.tsx';
import { ShapWaterfall } from '../ShapWaterfall.tsx';
import { ReportModal } from '../ReportModal.tsx';
import { ScanResult } from '../../types/index.ts';

interface UrlScannerViewProps {
  initialUrl?: string;
}

export const UrlScannerView: React.FC<UrlScannerViewProps> = ({ initialUrl = '' }) => {
  const [urlInput, setUrlInput] = useState(initialUrl || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'network' | 'content' | 'intel' | 'shap'>('overview');
  const [copiedDefanged, setCopiedDefanged] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const samplePresets = [
    { label: 'Official HDFC Bank', url: 'https://netbanking.hdfcbank.com/netbanking', type: 'legit' },
    { label: 'SBI Typosquatting Phish', url: 'http://onlinesbi-kyc-verify.top/update.html', type: 'phish' },
    { label: 'Paytm KYC Urgency Scam', url: 'http://paytm-kyc-completed-24hrs.tk/wallet-kyc', type: 'phish' },
    { label: 'Executable Payload (.pdf.exe)', url: 'http://critical-update-patch.xyz/invoice_receipt.pdf.exe', type: 'malware' },
    { label: 'IRCTC Refund Trap', url: 'http://irctc-ticket-refund-portal.rest/cancel', type: 'phish' }
  ];

  const handleScan = async (targetToScan?: string) => {
    const target = (targetToScan || urlInput).trim();
    if (!target) return;

    setIsScanning(true);
    setErrorMsg('');
    setFeedbackGiven(false);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Scan analysis failed');
      }

      setScanResult(data);
      setUrlInput(target);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network connection failed during analysis');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyDefanged = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult.prediction.defanged_url);
    setCopiedDefanged(true);
    setTimeout(() => setCopiedDefanged(false), 2000);
  };

  const handleFeedback = async (isAccurate: boolean) => {
    if (!scanResult || feedbackGiven) return;
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: scanResult.scan_id,
          url: scanResult.url,
          is_accurate: isAccurate,
          suggested_verdict: isAccurate ? scanResult.prediction.verdict : (scanResult.prediction.verdict === 'SAFE' ? 'DANGEROUS' : 'SAFE')
        })
      });
      setFeedbackGiven(true);
    } catch {
      // Non-fatal
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Hero Input Box */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-wide">
            Inspect URL or Suspicious Web Link
          </h2>
        </div>

        {/* Input Bar */}
        <div className="relative flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Paste target link e.g. https://example.com/verify-account"
              className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-slate-900 text-sm font-mono placeholder:text-slate-400 transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={isScanning || !urlInput.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Deep Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono">Test Presets:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleScan(preset.url)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-[11px] font-mono cursor-pointer flex items-center gap-1.5"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${preset.type === 'legit' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {preset.label}
            </button>
          ))}
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Radar Scanning Sweep Overlay */}
      {isScanning && (
        <div className="p-12 rounded-2xl glass-panel flex flex-col items-center justify-center space-y-4 relative overflow-hidden bg-white border border-slate-200 shadow-sm">
          <div className="relative w-32 h-32 rounded-full border-2 border-rose-500/30 flex items-center justify-center">
            {/* Radar sweep hand */}
            <div className="absolute inset-0 rounded-full border-t-2 border-rose-600 animate-radar" />
            {/* Concentric rings */}
            <div className="w-20 h-20 rounded-full border border-rose-500/20" />
            <div className="w-10 h-10 rounded-full border border-rose-500/30" />
            <Shield className="w-6 h-6 text-rose-600 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900 font-mono tracking-wider">
              RUNNING KAVACH MULTI-STAGE DIAGNOSTICS
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Extracting 60+ topological features, resolving DNS MX/A/TXT records, checking TLS certificates, and computing SHAP attributions...
            </p>
          </div>
        </div>
      )}

      {/* Scan Results Panel */}
      {scanResult && !isScanning && (
        <div className="space-y-6">
          {/* Top Controls & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl glass-panel-subtle bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 truncate max-w-xl">
              <span className="text-slate-400">Target:</span>
              <span className="text-slate-900 font-semibold truncate">{scanResult.url}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyDefanged}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Copy safe defanged URL with [.] brackets"
              >
                {copiedDefanged ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDefanged ? 'Copied' : 'Copy Defanged URL'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Audit Report</span>
              </button>
            </div>
          </div>

          {/* Verdict Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shield Gauge */}
            <div className="lg:col-span-1">
              <ThreatGauge
                score={scanResult.prediction.hybrid_score}
                verdict={scanResult.prediction.verdict}
                category={scanResult.prediction.primary_category}
              />
            </div>

            {/* Diagnostics Summary & Top Reasons */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${scanResult.prediction.verdict === 'DANGEROUS' ? 'text-rose-600' : 'text-emerald-600'}`} />
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                    Executive Threat Summary
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Latency: <span className="text-slate-800 font-semibold">{scanResult.latency_ms}ms</span>
                </span>
              </div>

              {/* Top Flagged Reasons */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                  Top Flagged Identifiers:
                </span>
                <div className="space-y-1.5">
                  {scanResult.prediction.top_reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Steps */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-xs font-mono uppercase text-slate-500 tracking-wider">
                  Recommended Action Protocols:
                </span>
                <div className="space-y-1.5">
                  {scanResult.prediction.actionable_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Loop for Retraining */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Is this analysis accurate?</span>
                <div className="flex items-center gap-2">
                  {feedbackGiven ? (
                    <span className="text-emerald-600 font-mono flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> Logged for fine-tuning
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleFeedback(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" /> Yes
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <ThumbsDown className="w-3 h-3" /> No (Correct)
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* URL Anatomy Component */}
          <UrlAnatomy
            url={scanResult.url}
            typosquattingTarget={scanResult.typosquatting.targetBrand}
            isDangerous={scanResult.prediction.verdict === 'DANGEROUS'}
          />

          {/* Deep Inspection Tabs */}
          <div className="rounded-2xl glass-panel overflow-hidden bg-white border border-slate-200 shadow-sm">
            {/* Tabs Header */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100/80 p-1.5 gap-1.5">
              {[
                { id: 'overview', label: 'Probabilities' },
                { id: 'shap', label: 'SHAP Waterfall' },
                { id: 'network', label: 'Network & SSL' },
                { id: 'technical', label: '60+ Feature Matrix' },
                { id: 'content', label: 'Sandbox & Content' },
                { id: 'intel', label: 'Threat Intel Feeds' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-rose-700 border border-slate-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {/* 1. Probabilities */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 font-mono">
                    Multi-Class Output Distribution (Calibrated Softmax)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500">Benign</span>
                      <div className="text-xl font-bold font-mono text-emerald-600">
                        {(scanResult.prediction.class_probabilities.benign * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500">Phishing</span>
                      <div className="text-xl font-bold font-mono text-rose-600">
                        {(scanResult.prediction.class_probabilities.phishing * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500">Malware</span>
                      <div className="text-xl font-bold font-mono text-amber-600">
                        {(scanResult.prediction.class_probabilities.malware * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs text-slate-500">Defacement</span>
                      <div className="text-xl font-bold font-mono text-purple-600">
                        {(scanResult.prediction.class_probabilities.defacement * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. SHAP Waterfall */}
              {activeTab === 'shap' && (
                <ShapWaterfall contributions={scanResult.prediction.shap_waterfall} />
              )}

              {/* 3. Network & SSL */}
              {activeTab === 'network' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-2">DNS Records Telemetry</div>
                    <div>A Records: <span className="text-slate-700">{scanResult.network.dns_records.a.join(', ') || 'None'}</span></div>
                    <div>MX Records: <span className="text-slate-700">{scanResult.network.dns_records.mx.join(', ') || 'No MX configured'}</span></div>
                    <div>NS Records: <span className="text-slate-700">{scanResult.network.dns_records.ns.join(', ') || 'Default NS'}</span></div>
                    <div>DNS TTL: <span className="text-slate-700">{scanResult.network.dns_ttl} seconds</span></div>
                    <div>Resolved IP: <span className="text-rose-600 font-bold">{scanResult.network.ip}</span></div>
                    <div>Geo Location: <span className="text-slate-700">{scanResult.network.geolocation.city}, {scanResult.network.geolocation.country} ({scanResult.network.geolocation.asn})</span></div>
                  </div>

                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm mb-2">SSL / TLS Certificate</div>
                    <div>Valid Certificate: <span className={scanResult.network.ssl.valid ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>{scanResult.network.ssl.valid ? 'YES' : 'INVALID / UNTRUSTED'}</span></div>
                    <div>Issuer: <span className="text-slate-700">{scanResult.network.ssl.issuer}</span></div>
                    <div>Subject: <span className="text-slate-700">{scanResult.network.ssl.subject}</span></div>
                    <div>Days Remaining: <span className="text-slate-700">{scanResult.network.ssl.days_remaining} days</span></div>
                    <div>Self-Signed Flag: <span className="text-slate-700">{scanResult.network.ssl.is_self_signed ? 'YES (High Risk)' : 'NO'}</span></div>
                    <div>Domain Age (RDAP): <span className="text-slate-700">{scanResult.network.domain_whois.domain_age_days} days</span></div>
                    <div>Registrar: <span className="text-slate-700">{scanResult.network.domain_whois.registrar}</span></div>
                  </div>
                </div>
              )}

              {/* 4. 60+ Feature Matrix */}
              {activeTab === 'technical' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500">
                    Complete vector of numerical features extracted for ML inference:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs font-mono max-h-96 overflow-y-auto">
                    {Object.entries(scanResult.features).map(([k, v]) => (
                      <div key={k} className="p-2 rounded bg-slate-50 border border-slate-200">
                        <div className="text-slate-500 truncate text-[11px]">{k}</div>
                        <div className="text-slate-900 font-bold">{typeof v === 'number' ? v.toFixed(3) : v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Sandbox Content */}
              {activeTab === 'content' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900 text-sm">Sandboxed DOM Inspection (No Script Execution)</div>
                    <div>Page Title: <span className="text-slate-800">{scanResult.network.content_analysis.page_title}</span></div>
                    <div>Password Input Fields: <span className={scanResult.network.content_analysis.has_password_field ? 'text-rose-600 font-bold' : 'text-slate-700'}>{scanResult.network.content_analysis.has_password_field ? 'PRESENT (Credential Harvester)' : 'None'}</span></div>
                    <div>HTML Forms: <span className="text-slate-700">{scanResult.network.content_analysis.form_count}</span></div>
                    <div>External Action Form Target: <span className={scanResult.network.content_analysis.external_form_action ? 'text-rose-600 font-bold' : 'text-slate-700'}>{scanResult.network.content_analysis.external_form_action ? 'YES' : 'NO'}</span></div>
                    <div>Embedded iFrames: <span className="text-slate-700">{scanResult.network.content_analysis.iframe_count}</span></div>
                    <div>Context Menu Disabled: <span className="text-slate-700">{scanResult.network.content_analysis.disables_right_click ? 'YES' : 'NO'}</span></div>
                  </div>
                </div>
              )}

              {/* 6. Threat Intel */}
              {activeTab === 'intel' && (
                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-slate-500">Google Safe Browsing</span>
                      <div className={`text-base font-bold ${scanResult.threat_intel.threat_feeds.google_safe_browsing === 'MALICIOUS' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {scanResult.threat_intel.threat_feeds.google_safe_browsing}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-slate-500">VirusTotal Multi-Vendor</span>
                      <div className={`text-base font-bold ${scanResult.threat_intel.threat_feeds.virustotal.positives > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {scanResult.threat_intel.threat_feeds.virustotal.positives} / 72 Flagged
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-slate-500">PhishTank Community Feed</span>
                      <div className={`text-base font-bold ${scanResult.threat_intel.threat_feeds.phishtank.verified ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {scanResult.threat_intel.threat_feeds.phishtank.verified ? 'VERIFIED PHISH' : 'CLEAN'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Official Report Modal */}
      {showReportModal && scanResult && (
        <ReportModal scan={scanResult} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};
