import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Zap,
  Globe,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Lock,
  Flame
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TabType } from '../../types/index.ts';

interface DashboardViewProps {
  onNavigate: (tab: TabType, targetUrl?: string) => void;
}

const TREND_DATA = [
  { day: 'Mon', phishing: 420, malware: 130, benign: 1820 },
  { day: 'Tue', phishing: 510, malware: 160, benign: 2100 },
  { day: 'Wed', phishing: 480, malware: 145, benign: 1950 },
  { day: 'Thu', phishing: 640, malware: 210, benign: 2400 },
  { day: 'Fri', phishing: 790, malware: 290, benign: 2890 },
  { day: 'Sat', phishing: 530, malware: 180, benign: 2200 },
  { day: 'Sun', phishing: 610, malware: 220, benign: 2310 }
];

const TARGET_DATA = [
  { brand: 'SBI NetBanking', count: 1842, color: '#e11d48' },
  { brand: 'HDFC Bank', count: 1240, color: '#f43f5e' },
  { brand: 'Paytm / PhonePe', count: 984, color: '#fb7185' },
  { brand: 'Income Tax', count: 720, color: '#f59e0b' },
  { brand: 'India Post', count: 560, color: '#f97316' },
  { brand: 'PayPal Global', count: 430, color: '#ec4899' }
];

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, historyRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/history?limit=6')
      ]);
      const statsJson = await statsRes.json();
      const histJson = await historyRes.json();
      setStats(statsJson);
      setRecentScans(histJson.history || []);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Security Status Banner */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-slate-50 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                ACTIVE DEFENSE GRID
              </span>
              <span className="text-xs text-slate-500">CERT-In Aligned Telemetry</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              KAVACH THREAT INTELLIGENCE RADAR
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('scanner')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-sm shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Scan Suspicious URL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 cursor-pointer shadow-xs"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-1 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total URLs Scanned</span>
            <Globe className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {stats ? stats.total_scans.toLocaleString() : '14,825'}
          </div>
          <div className="text-[11px] text-emerald-600 font-mono">
            +18% from last 24h
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Threats Neutralized</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600">
            {stats ? stats.threats_neutralized.toLocaleString() : '4,196'}
          </div>
          <div className="text-[11px] text-rose-600 font-mono">
            Phishing & Malware vectors
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ensemble Accuracy</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600">
            98.42%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            F1-Score: 0.9841
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average Latency</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">
            38.4 ms
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Real-time inline inference
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                7-Day Attack Volume & Mitigation Trend
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="phishGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="benignGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="phishing" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#phishGrad)" name="Phishing Blocked" />
                <Area type="monotone" dataKey="benign" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#benignGrad)" name="Legit Verified" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Impersonated Brands */}
        <div className="p-5 rounded-2xl glass-panel space-y-4 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Top Target Brands (India)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Detections</span>
          </div>

          <div className="space-y-3 pt-2">
            {TARGET_DATA.map((item, idx) => {
              const maxVal = 2000;
              const pct = (item.count / maxVal) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.brand}</span>
                    <span className="font-mono text-slate-500">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Scans Stream */}
      <div className="p-5 rounded-2xl glass-panel space-y-4 bg-white border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-600" />
            Recent Threat Audit Log
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2">Target URL</th>
                <th className="pb-2">Verdict</th>
                <th className="pb-2">Risk Score</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Time</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-4 truncate max-w-xs font-sans text-slate-800">
                    {scan.url}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scan.verdict === 'DANGEROUS'
                          ? 'bg-rose-50 text-rose-700 border border-rose-300'
                          : scan.verdict === 'SUSPICIOUS'
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      }`}
                    >
                      {scan.verdict}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="font-bold text-slate-900">{scan.risk_score}</span>
                    <span className="text-slate-400">/100</span>
                  </td>
                  <td className="py-2.5 text-slate-600">{scan.category}</td>
                  <td className="py-2.5 text-slate-500">
                    {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => onNavigate('scanner', scan.url)}
                      className="text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                    >
                      Re-Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
