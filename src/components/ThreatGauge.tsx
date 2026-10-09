import React, { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

interface ThreatGaugeProps {
  score: number; // 0 to 100
  verdict: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS';
  category?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThreatGauge: React.FC<ThreatGaugeProps> = ({
  score,
  verdict,
  category = 'Phishing',
  size = 'md'
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Smooth count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Color schemes based on verdict & score
  let bgGlow = 'rgba(34, 197, 94, 0.12)';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs';

  if (verdict === 'DANGEROUS') {
    bgGlow = 'rgba(225, 29, 72, 0.18)';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs';
  } else if (verdict === 'SUSPICIOUS') {
    bgGlow = 'rgba(245, 158, 11, 0.15)';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs';
  }

  // Calculate arc stroke offset for SVG circle / shield perimeter
  const strokeDash = 283;
  const strokeOffset = strokeDash - (strokeDash * displayScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel relative overflow-hidden bg-white border border-slate-200 shadow-sm">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at center, ${bgGlow} 0%, transparent 70%)`
        }}
      />

      {/* Shield SVG Gauge Container */}
      <div className="relative w-44 h-44 flex items-center justify-center mb-4">
        {/* SVG Circular Metric Ring */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-slate-200 fill-none"
            strokeWidth="7"
          />
          {/* Animated Risk Arc */}
          <circle
            cx="50"
            cy="50"
            r="42"
            className={`fill-none transition-all duration-500 ${
              verdict === 'DANGEROUS'
                ? 'stroke-rose-600'
                : verdict === 'SUSPICIOUS'
                ? 'stroke-amber-500'
                : 'stroke-emerald-500'
            }`}
            strokeWidth="8"
            strokeDasharray={strokeDash}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Shield Indicator with Score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {verdict === 'DANGEROUS' ? (
            <ShieldAlert className="w-6 h-6 text-rose-600 mb-0.5 animate-bounce" />
          ) : verdict === 'SUSPICIOUS' ? (
            <ShieldQuestion className="w-6 h-6 text-amber-500 mb-0.5" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
          )}

          <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
            {displayScore}
            <span className="text-xs text-slate-400 font-sans font-normal ml-0.5">/100</span>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            Kavach Risk
          </div>
        </div>
      </div>

      {/* Large Verdict Badge */}
      <div className={`px-4 py-1.5 rounded-xl border text-sm font-bold tracking-wider font-mono uppercase mb-2 ${badgeColor}`}>
        {verdict === 'DANGEROUS' && '🚨 DANGEROUS THREAT'}
        {verdict === 'SUSPICIOUS' && '⚠️ SUSPICIOUS ANOMALY'}
        {verdict === 'SAFE' && '✅ VERIFIED SAFE'}
      </div>

      {/* Threat Category */}
      <div className="text-xs text-slate-500 font-mono">
        Classification: <span className="text-slate-800 font-semibold">{category}</span>
      </div>
    </div>
  );
};
