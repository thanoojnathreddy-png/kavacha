import React from 'react';
import { Info, Shield, Layers, Database, Cpu, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl glass-panel space-y-3 bg-gradient-to-r from-rose-50 via-white to-slate-50 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 border border-rose-400 flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 font-mono tracking-wide">
              KAVACH <span className="text-sm font-sans text-rose-600">कवच</span>
            </h2>
            <p className="text-xs text-slate-600">
              Your Armor Against Phishing & Advanced Social Engineering Attacks
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed pt-2">
          KAVACH is an enterprise-grade cyber defense intelligence platform developed to protect internet users and financial institutions against weaponized phishing, deceptive typosquatting, malware distributions, and localized UPI fraud schemes in India and globally.
        </p>
      </div>

      {/* Multi-Layer Architecture Grid */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-rose-600" />
          Multi-Stage Defense Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-rose-700 font-bold text-sm">Layer 1: Lexical & Brand</div>
            <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
              Extracts 60+ topological features: Shannon entropy, digit ratios, punycode (xn--), delimiter counts, and computes Damerau-Levenshtein distances against 10,000+ Tranco and Indian banking brands.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-amber-700 font-bold text-sm">Layer 2: Host & Network</div>
            <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
              Queries live DNS resolvers for A/MX/NS/TXT records, validates TLS cryptographic certificates, performs RDAP domain registration age audits, and traces HTTP redirect chains hop-by-hop.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-emerald-700 font-bold text-sm">Layer 3: Stacking Ensemble</div>
            <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
              Feeds calibrated probabilities through a soft-voting stacking ensemble combining LightGBM, XGBoost, Random Forest, and Char-Level CNN-BiLSTM, calibrated via Isotonic Regression.
            </p>
          </div>
        </div>
      </div>

      {/* Datasets & Provenance */}
      <div className="p-6 rounded-2xl glass-panel space-y-3 bg-white border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" />
          Training Corpus & Data Provenance
        </h3>
        <p className="text-xs text-slate-600">
          The models are trained and validated against 542,890 URLs aggregated from public cybersecurity intelligence sources:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-700 pt-1">
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> PhishTank Verified Active Feeds
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> OpenPhish Community Intelligence
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> URLhaus Malware Feed (abuse.ch)
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> Tranco Top 1M Legit Domain List
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> Kaggle Malicious URLs Corpus (651k)
          </li>
          <li className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
            <span className="text-rose-600 font-bold">•</span> Indian Banking & Govt Typosquatting Corpus
          </li>
        </ul>
      </div>

      {/* Ethical Use & Limitations */}
      <div className="p-6 rounded-2xl glass-panel space-y-2 bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <h4 className="font-bold text-slate-900 uppercase font-mono tracking-wider text-[11px]">
          Ethical Use & Safety Boundaries
        </h4>
        <p className="leading-relaxed">
          KAVACH operates under strict defensive guidelines. Sandboxed HTTP queries enforce strict timeouts (3.5s), strict SSRF isolation (blocking loopback and RFC 1918 private subnets), and zero client script execution. This platform is strictly designed for threat identification, incident response, and security awareness education.
        </p>
      </div>
    </div>
  );
};
