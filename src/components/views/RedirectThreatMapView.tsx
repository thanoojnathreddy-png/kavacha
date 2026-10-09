import React, { useState } from 'react';
import { Compass, Globe, ArrowRight, Server, ShieldAlert, CheckCircle2, Shield } from 'lucide-react';

interface Hop {
  hop: number;
  url: string;
  status: number;
  latency_ms: number;
  ip: string;
  location: string;
  isMalicious?: boolean;
}

const SAMPLE_REDIRECT_CHAINS: Record<string, Hop[]> = {
  shortener: [
    { hop: 1, url: 'http://bit.ly/sbi-urgent-alert', status: 301, latency_ms: 34, ip: '67.199.248.10', location: 'United States' },
    { hop: 2, url: 'http://tinyurl.com/sbi-verify-kyc', status: 302, latency_ms: 48, ip: '104.20.73.118', location: 'Cloudflare Edge' },
    { hop: 3, url: 'http://onlinesbi-kyc-verify.top/update.html', status: 200, latency_ms: 112, ip: '185.220.101.42', location: 'Frankfurt, Germany', isMalicious: true }
  ],
  upi: [
    { hop: 1, url: 'http://t.co/phonepe-cashback-3500', status: 301, latency_ms: 28, ip: '104.244.42.1', location: 'United States' },
    { hop: 2, url: 'http://phonepe-reward-claim.cf/claim-upi', status: 200, latency_ms: 95, ip: '194.87.144.5', location: 'Moscow, Russia', isMalicious: true }
  ],
  legit: [
    { hop: 1, url: 'http://hdfcbank.com', status: 301, latency_ms: 22, ip: '175.100.160.10', location: 'Mumbai, India' },
    { hop: 2, url: 'https://www.hdfcbank.com/', status: 302, latency_ms: 18, ip: '175.100.160.10', location: 'Mumbai, India' },
    { hop: 3, url: 'https://netbanking.hdfcbank.com/netbanking', status: 200, latency_ms: 45, ip: '175.100.160.15', location: 'Mumbai, India' }
  ]
};

const GEO_SERVERS = [
  { city: 'Mumbai', country: 'India', coords: { x: 70, y: 52 }, threat_count: 1420, benign_count: 5800, asn: 'AS55836 Reliance Jio' },
  { city: 'Frankfurt', country: 'Germany', coords: { x: 51, y: 32 }, threat_count: 1890, benign_count: 3200, asn: 'AS24940 Hetzner Online' },
  { city: 'Ashburn', country: 'United States', coords: { x: 26, y: 38 }, threat_count: 2100, benign_count: 9400, asn: 'AS13335 Cloudflare' },
  { city: 'Moscow', country: 'Russia', coords: { x: 62, y: 26 }, threat_count: 1640, benign_count: 1100, asn: 'AS48282 Selectel' },
  { city: 'Singapore', country: 'Singapore', coords: { x: 77, y: 60 }, threat_count: 780, benign_count: 3400, asn: 'AS16509 Amazon.com' }
];

export const RedirectThreatMapView: React.FC = () => {
  const [activeChainKey, setActiveChainKey] = useState<'shortener' | 'upi' | 'legit'>('shortener');
  const chain = SAMPLE_REDIRECT_CHAINS[activeChainKey];

  return (
    <div className="space-y-6">
      {/* Redirect Tracer Section */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Multi-Hop Redirect Chain Tracer
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Sample Chains:</span>
            <button
              onClick={() => setActiveChainKey('shortener')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeChainKey === 'shortener' ? 'bg-rose-50 text-rose-700 border border-rose-300 font-semibold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Shortener Phish
            </button>
            <button
              onClick={() => setActiveChainKey('upi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeChainKey === 'upi' ? 'bg-rose-50 text-rose-700 border border-rose-300 font-semibold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              UPI Fraud Link
            </button>
            <button
              onClick={() => setActiveChainKey('legit')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeChainKey === 'legit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Authentic Bank
            </button>
          </div>
        </div>

        {/* Timeline Visualizer */}
        <div className="space-y-4 pt-4">
          {chain.map((hop, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Timeline Connector Line */}
              {idx < chain.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200 -mb-4" />
              )}

              {/* Hop Badge */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                hop.isMalicious
                  ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
                {hop.hop}
              </div>

              {/* Hop Card */}
              <div className={`flex-1 p-3.5 rounded-xl border text-xs font-mono space-y-1.5 shadow-xs ${
                hop.isMalicious
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      hop.status === 200 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      HTTP {hop.status}
                    </span>
                    <span className="text-slate-500 font-sans">{hop.location}</span>
                  </div>
                  <span className="text-slate-400">{hop.latency_ms} ms</span>
                </div>

                <div className="font-bold truncate text-slate-900 break-all">
                  {hop.url}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>IP: {hop.ip}</span>
                  {hop.isMalicious && (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Malicious Payload Landing Target
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Geolocation World Map */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Global Malicious Infrastructure Distribution
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Active Threat Servers Monitored
          </span>
        </div>

        {/* World Map SVG Canvas */}
        <div className="relative w-full h-80 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center p-4 shadow-inner">
          {/* Subtle Grid */}
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

          {/* World map stylized continents vector */}
          <svg className="w-full h-full opacity-40 stroke-slate-400 fill-slate-200" viewBox="0 0 100 60">
            <path d="M 12 18 Q 20 12 30 18 Q 35 28 25 38 Q 15 32 12 18 Z" />
            <path d="M 22 38 Q 30 40 32 52 Q 24 55 20 45 Z" />
            <path d="M 45 16 Q 58 14 62 25 Q 52 32 45 22 Z" />
            <path d="M 46 28 Q 56 30 55 45 Q 46 48 44 35 Z" />
            <path d="M 64 16 Q 85 14 88 32 Q 74 38 65 24 Z" />
            <path d="M 65 42 Q 75 42 75 52 Q 65 55 64 48 Z" />
            <path d="M 80 44 Q 90 44 88 54 Q 78 52 80 44 Z" />
          </svg>

          {/* Server Hotspot Markers */}
          {GEO_SERVERS.map((srv, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${srv.coords.x}%`, top: `${srv.coords.y}%` }}
            >
              {/* Radar Ping Pulse */}
              <div className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
              <div className="relative w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-[0_0_8px_#e11d48]" />

              {/* Tooltip on hover */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 w-48 p-2.5 rounded-xl bg-white border border-slate-300 shadow-xl text-[11px] font-mono text-slate-800 pointer-events-none">
                <div className="font-bold text-slate-900 text-xs">{srv.city}, {srv.country}</div>
                <div className="text-slate-500 text-[10px]">{srv.asn}</div>
                <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between">
                  <span className="text-rose-600 font-bold">{srv.threat_count} Threats</span>
                  <span className="text-emerald-600 font-bold">{srv.benign_count} Legit</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Server breakdown cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs font-mono">
          {GEO_SERVERS.map((srv, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block truncate">{srv.city}</span>
              <span className="text-[10px] text-slate-500 block">{srv.country}</span>
              <span className="text-rose-600 font-bold mt-1 block">{srv.threat_count} flagged</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
