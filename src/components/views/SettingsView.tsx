import React, { useState } from 'react';
import { Settings, Sliders, RefreshCw, Key, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sensitivity, setSensitivity] = useState(65);
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState(false);
  const [lastCycle, setLastCycle] = useState<any>(null);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainSuccess(false);
    try {
      const res = await fetch('/api/retrain', { method: 'POST' });
      const data = await res.json();
      setLastCycle(data);
      setRetrainSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Sensitivity Configuration */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Sliders className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900 tracking-wide">
            Detection Sensitivity & Classification Thresholds
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-700 font-semibold">Dangerous Threshold:</span>
            <span className="text-rose-600 font-bold">{sensitivity} / 100</span>
          </div>
          <input
            type="range"
            min={40}
            max={85}
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full accent-rose-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Permissive (Fewer alerts)</span>
            <span>Balanced (Default 65)</span>
            <span>Strict (Zero-Trust)</span>
          </div>
        </div>
      </div>

      {/* Model Retraining Loop */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Active Learning & Retraining Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 font-semibold">Incremental Fine-Tuning</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-mono text-slate-700">
            {lastCycle ? (
              <span>Last Retrain: Cycle #{lastCycle.retrain_cycle} (Calibrated Acc: {(lastCycle.updated_metrics.calibrated_accuracy * 100).toFixed(2)}%)</span>
            ) : (
              <span>Ready for weight calibration</span>
            )}
          </div>

          <button
            onClick={handleRetrain}
            disabled={retraining}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
            <span>{retraining ? 'Fine-Tuning Weights...' : 'Trigger Model Retrain'}</span>
          </button>
        </div>

        {retrainSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ensemble weights updated successfully with new feedback samples!</span>
          </div>
        )}
      </div>

      {/* Threat Intel API Feeds */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Key className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900 tracking-wide">
            Threat Intelligence Integration Feeds
          </h2>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">Google Safe Browsing v4</span>
              <span className="text-[10px] text-slate-500">Automated threat reputation lookups</span>
            </div>
            <span className="text-emerald-600 font-bold">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">VirusTotal Multi-Vendor Engine</span>
              <span className="text-[10px] text-slate-500">72 Antivirus engine consensus</span>
            </div>
            <span className="text-emerald-600 font-bold">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">PhishTank & OpenPhish Feeds</span>
              <span className="text-[10px] text-slate-500">Live community threat intelligence</span>
            </div>
            <span className="text-emerald-600 font-bold">SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
