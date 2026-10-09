import React from 'react';
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { TabType } from '../types/index.ts';

interface HeaderProps {
  currentTab: TabType;
  onQuickScan: () => void;
  onEmergencyClick: () => void;
  isCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onQuickScan,
  onEmergencyClick,
  isCollapsed
}) => {
  const titles: Record<TabType, { title: string; subtitle: string }> = {
    dashboard: { title: 'Security Command Center', subtitle: 'Live threat intelligence telemetry & multi-source detection analytics' },
    scanner: { title: 'Deep URL & Phishing Scanner', subtitle: '60+ lexical, host, RDAP, and content features evaluated by Stacking ML Ensemble' },
    bulk: { title: 'Batch & CSV Threat Scanner', subtitle: 'High-throughput enterprise scanning up to 500 URLs with exportable audit logs' },
    email: { title: 'Email Phishing & Header Analyzer', subtitle: 'Dissects raw email MIME headers, sender spoofing, and social engineering urgency' },
    sms: { title: 'SMS & WhatsApp Fraud Analyzer', subtitle: 'Specialized detection for Indian banking KYC, electricity, lottery, and UPI scams' },
    qr: { title: 'QR Code & UPI Fraud Detector', subtitle: 'Decodes QR codes to catch malicious destinations and reverse-charge UPI scams' },
    model: { title: 'Model Diagnostics & SHAP Insights', subtitle: 'Live metrics, ROC curves, confusion matrix, and feature attribution waterfall' },
    redirect_map: { title: 'Redirect Tracer & Threat Map', subtitle: 'Hop-by-hop HTTP redirect chain tracing and global server geolocation' },
    history: { title: 'Incident & Scan History', subtitle: 'Searchable audit trail of verified scans with retraining feedback loop' },
    quiz: { title: 'Cyber Awareness Simulation', subtitle: 'Interactive training module on spotting real-world Indian & global phishing lures' },
    emergency: { title: 'Emergency Response Guide', subtitle: 'Critical containment protocol if you already clicked or submitted credentials' },
    settings: { title: 'System Configuration', subtitle: 'Engine sensitivity, API keys, retrain triggers, and theme settings' },
    about: { title: 'Architecture & Threat Intelligence', subtitle: 'Comprehensive technical documentation on KAVACH multi-layer defense engine' }
  };

  const activeInfo = titles[currentTab] || { title: 'KAVACH Armor', subtitle: 'Threat Defense' };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/95 border-b border-slate-200 backdrop-blur-md transition-all duration-300 shadow-xs"
    >
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {activeInfo.title}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Model Engine Live Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          <Activity className="w-3.5 h-3.5 text-rose-600" />
          <span>Stacking Ensemble</span>
          <span className="text-emerald-600 font-semibold">98.4% Acc</span>
        </div>

        {/* Quick Scan Action */}
        {currentTab !== 'scanner' && (
          <button
            onClick={onQuickScan}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Scan</span>
          </button>
        )}

        {/* Emergency Hotline Button */}
        <button
          onClick={onEmergencyClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold transition-all shadow-xs cursor-pointer"
          title="Emergency Help: Indian Cyber Crime Helpline 1930"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>Helpline 1930</span>
        </button>
      </div>
    </header>
  );
};
