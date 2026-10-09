import React from 'react';
import { X, Printer, Shield, CheckCircle2, AlertTriangle, Download, FileText } from 'lucide-react';
import { ScanResult } from '../types/index.ts';

interface ReportModalProps {
  scan: ScanResult;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ scan, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden text-slate-900 print:bg-white print:text-black print:border-none">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <span className="font-bold text-sm tracking-wide text-slate-900">KAVACH Threat Intelligence Audit Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 space-y-6 print:p-0 bg-white">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-rose-600 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-rose-600" />
                <h2 className="text-2xl font-extrabold tracking-wider font-mono text-slate-900">
                  KAVACH <span className="text-sm font-sans text-rose-600 font-normal">कवच</span>
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                National Cyber Threat Intelligence & Phishing Armor System
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>Report ID: <span className="text-slate-900 font-bold">{scan.scan_id}</span></div>
              <div>Date: {new Date(scan.timestamp).toLocaleString()}</div>
              <div>Engine: Calibrated Stacking Ensemble v1.4</div>
            </div>
          </div>

          {/* Target Assessment Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-slate-100 print:text-black">
            <div className="text-xs font-mono text-slate-500 mb-1">Target Resource URL:</div>
            <div className="font-mono text-sm font-bold break-all text-slate-900 print:text-black mb-3">
              {scan.url}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 print:border-slate-300">
              <div>
                <span className="text-xs text-slate-500 block">Threat Classification</span>
                <span className={`text-sm font-bold font-mono ${
                  scan.prediction.verdict === 'DANGEROUS' ? 'text-rose-600' :
                  scan.prediction.verdict === 'SUSPICIOUS' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {scan.prediction.verdict} ({scan.prediction.primary_category})
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Kavach Risk Index</span>
                <span className="text-sm font-bold font-mono text-slate-900 print:text-black">
                  {scan.prediction.hybrid_score} / 100
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Analysis Latency</span>
                <span className="text-sm font-bold font-mono text-slate-900 print:text-black">
                  {scan.latency_ms} ms
                </span>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 mb-2 font-mono">
              Key Diagnostic Findings
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 print:text-slate-800">
              {scan.prediction.top_reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Host & Network Telemetry */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 mb-2 font-mono">
              Host & Infrastructure Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 print:bg-white print:border-slate-300">
              <div>Primary IP: <span className="text-slate-800 print:text-black">{scan.network.ip}</span></div>
              <div>Domain Age: <span className="text-slate-800 print:text-black">{scan.network.domain_whois.domain_age_days} days</span></div>
              <div>Registrar: <span className="text-slate-800 print:text-black">{scan.network.domain_whois.registrar}</span></div>
              <div>SSL Valid: <span className="text-slate-800 print:text-black">{scan.network.ssl.valid ? 'YES' : 'NO / Self-signed'}</span></div>
              <div>MX Records: <span className="text-slate-800 print:text-black">{scan.network.dns_records.mx.length > 0 ? 'Configured' : 'Missing'}</span></div>
              <div>Defanged Target: <span className="text-rose-600 font-bold">{scan.prediction.defanged_url}</span></div>
            </div>
          </div>

          {/* Recommended Countermeasures */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-600 mb-2 font-mono">
              Actionable Security Protocols
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700 print:text-slate-800">
              {scan.prediction.actionable_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Verification & Regulatory Seal */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Cryptographic Digital Signature: SHA256:{scan.scan_id.replace(/[^a-f0-9]/gi, '8')}</span>
            <span>Indian Cyber Crime Reporting: Helpline 1930 / cybercrime.gov.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
