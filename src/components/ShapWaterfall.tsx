import React from 'react';
import { ShapContribution } from '../types/index.ts';
import { ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface ShapWaterfallProps {
  contributions: ShapContribution[];
  baseLogit?: number;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  contributions,
  baseLogit = -1.85
}) => {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="p-4 rounded-xl glass-panel text-sm text-neutral-400">
        No feature SHAP attribution metrics available for this URL.
      </div>
    );
  }

  const maxAbs = Math.max(...contributions.map(c => Math.abs(c.contribution)), 0.1);

  return (
    <div className="p-5 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">
            Explainable AI: SHAP Feature Attribution Waterfall
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" />
            Increases Risk (+ϕ)
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            Decreases Risk (-ϕ)
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        SHAP (SHapley Additive exPlanations) computes the exact marginal game-theoretic contribution of each engineered feature relative to the population baseline expectation <span className="font-mono text-slate-800 font-bold">E[f(x)] = {baseLogit}</span>.
      </p>

      {/* Waterfall Rows */}
      <div className="space-y-2.5">
        {contributions.map((item, idx) => {
          const isPositive = item.contribution > 0;
          const barWidth = Math.min((Math.abs(item.contribution) / maxAbs) * 100, 100);

          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.label}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-700">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono font-bold">
                  {isPositive ? (
                    <span className="text-rose-600 flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      +{item.contribution.toFixed(3)}
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center">
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      {item.contribution.toFixed(3)}
                    </span>
                  )}
                </div>
              </div>

              {/* Bar track */}
              <div className="relative h-2 w-full rounded-full bg-slate-200 overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPositive ? 'bg-gradient-to-r from-rose-600 to-red-500' : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-600 font-sans">
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
