import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, CheckSquare, ExternalLink, Lock, WifiOff, RefreshCw } from 'lucide-react';

export const EmergencyGuideView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Emergency Alert Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-white border-2 border-red-500 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-8 h-8 text-red-600 animate-pulse" />
          <div>
            <h2 className="text-xl font-black text-slate-900 font-mono tracking-wide">
              EMERGENCY INCIDENT CONTAINMENT PROTOCOL
            </h2>
          </div>
        </div>

        {/* National Helpline 1930 Quick Action */}
        <div className="p-4 rounded-xl bg-white border border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-6 h-6 text-red-600" />
            <div>
              <div className="text-xs text-slate-500 font-mono">National Cyber Crime Reporting Portal</div>
              <div className="text-2xl font-black font-mono text-slate-900 tracking-wider">
                TOLL FREE: <span className="text-red-600">1930</span>
              </div>
            </div>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all"
          >
            <span>Visit cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Step-by-Step Rapid Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-rose-700 font-mono text-xs font-bold">
            <WifiOff className="w-4 h-4 text-rose-600" />
            <span>STEP 1: ISOLATE DEVICE</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Cut All Internet Connectivity Immediately</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Turn on <strong>Airplane Mode</strong> or disconnect Wi-Fi and Cellular data right now. If a malware payload (.apk / .exe / .scr) was downloaded, this halts active Command & Control communication and credential exfiltration.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 font-mono text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>STEP 2: FREEZE BANK & CARDS</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Lock NetBanking & UPI Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            From a <em>different, clean phone or device</em>, open your official banking app (SBI YONO, HDFC Mobile, etc.) and instantly toggle <strong>Debit Card Block</strong> and disable International/UPI transactions.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-sky-700 font-mono text-xs font-bold">
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <span>STEP 3: CREDENTIAL ROTATION</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Reset Passwords & Revoke Sessions</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Change passwords for your primary Gmail/Outlook account, banking accounts, and password managers. Select <strong>"Sign out of all other devices and active web sessions"</strong>.
          </p>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-2xl glass-panel space-y-2 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-mono text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>STEP 4: EVIDENCE PRESERVATION</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Gather Forensic Audit Evidence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Take screenshots of the SMS, sender number/header, phishing URL, UPI transaction ID (UTR 12-digit number), and bank statement. Do not delete the text message.
          </p>
        </div>
      </div>

      {/* Official Indian Bank Emergency Numbers */}
      <div className="p-5 rounded-2xl glass-panel space-y-3 bg-white border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
          Official Emergency Banking Hotlines (India)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">State Bank of India</span>
            <span className="text-rose-700 font-bold">1800 1234 / 1800 2100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">HDFC Bank</span>
            <span className="text-rose-700 font-bold">1800 1600 / 1800 2600</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">ICICI Bank</span>
            <span className="text-rose-700 font-bold">1800 1080</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Axis Bank</span>
            <span className="text-rose-700 font-bold">1860 419 5555</span>
          </div>
        </div>
      </div>
    </div>
  );
};
