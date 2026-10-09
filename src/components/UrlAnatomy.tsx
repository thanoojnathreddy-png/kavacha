import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface UrlAnatomyProps {
  url: string;
  typosquattingTarget?: string;
  isDangerous?: boolean;
}

export const UrlAnatomy: React.FC<UrlAnatomyProps> = ({
  url,
  typosquattingTarget = '',
  isDangerous = false
}) => {
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : 'http://' + url);
  } catch {
    parsed = new URL('http://unknown.target');
  }

  const protocol = parsed.protocol.replace(':', '');
  const hostname = parsed.hostname;
  const path = parsed.pathname;
  const search = parsed.search;

  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';
  const domainStem = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  const subdomains = parts.length > 2 ? parts.slice(0, parts.length - 2).join('.') : '';

  const isProtocolInsecure = protocol === 'http';
  const isSuspiciousTld = ['xyz', 'top', 'tk', 'ml', 'ga', 'cf', 'gq', 'buzz', 'fit', 'surf', 'cam', 'club'].includes(tld);
  const isSubdomainSuspicious = subdomains.includes('login') || subdomains.includes('verify') || subdomains.includes('sbi') || subdomains.includes('bank') || subdomains.includes('secure');
  const isStemSuspicious = Boolean(typosquattingTarget) || domainStem.includes('-') || domainStem.includes('kyc');
  const isQuerySuspicious = search.includes('redirect') || search.includes('next=http') || search.includes('token') || search.includes('key');

  return (
    <div className="p-5 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">URL Anatomy Decomposition</h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Length: <span className="text-slate-800 font-semibold">{url.length} chars</span>
        </span>
      </div>

      {/* Visual Color-Coded Segments */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto font-mono text-sm leading-relaxed whitespace-nowrap shadow-inner">
        {/* Protocol */}
        <span
          className={`px-1.5 py-0.5 rounded font-semibold ${
            isProtocolInsecure
              ? 'bg-rose-100 text-rose-700 border border-rose-300'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          }`}
          title={isProtocolInsecure ? 'Insecure plain HTTP!' : 'Encrypted HTTPS'}
        >
          {protocol}://
        </span>

        {/* Subdomain */}
        {subdomains && (
          <span
            className={`px-1.5 py-0.5 rounded ${
              isSubdomainSuspicious
                ? 'bg-rose-100 text-rose-700 font-bold border border-rose-300'
                : 'text-sky-700'
            }`}
            title="Subdomain hierarchy"
          >
            {subdomains}.
          </span>
        )}

        {/* Domain Stem */}
        <span
          className={`px-1.5 py-0.5 rounded font-bold ${
            isStemSuspicious
              ? 'bg-rose-100 text-rose-700 border border-rose-300 underline decoration-rose-500'
              : 'text-purple-700'
          }`}
          title={typosquattingTarget ? `Typosquatting imitation of ${typosquattingTarget}` : 'Primary domain'}
        >
          {domainStem}
        </span>

        {/* TLD */}
        <span
          className={`px-1.5 py-0.5 rounded font-semibold ${
            isSuspiciousTld
              ? 'bg-rose-100 text-rose-700 border border-rose-300'
              : 'text-blue-700'
          }`}
          title={isSuspiciousTld ? 'High-risk abused TLD' : 'Top Level Domain'}
        >
          .{tld}
        </span>

        {/* Path */}
        {path && (
          <span
            className={`px-1 py-0.5 rounded ${
              path.toLowerCase().includes('kyc') || path.toLowerCase().includes('login') || path.includes('.exe')
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'text-slate-600'
            }`}
            title="Path resource"
          >
            {path}
          </span>
        )}

        {/* Query */}
        {search && (
          <span
            className={`px-1 py-0.5 rounded ${
              isQuerySuspicious
                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                : 'text-slate-500'
            }`}
            title="Query parameters"
          >
            {search}
          </span>
        )}
      </div>

      {/* Anatomy Segment Legend & Risk Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className={`w-2 h-2 rounded-full ${isProtocolInsecure ? 'bg-rose-600 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-slate-500">Scheme:</span>
          <span className="text-slate-900 font-semibold">{protocol.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className={`w-2 h-2 rounded-full ${isSuspiciousTld ? 'bg-rose-600' : 'bg-blue-500'}`} />
          <span className="text-slate-500">TLD Risk:</span>
          <span className={isSuspiciousTld ? 'text-rose-600 font-bold' : 'text-slate-700'}>
            .{tld} {isSuspiciousTld ? '(High)' : '(Low)'}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className={`w-2 h-2 rounded-full ${isStemSuspicious ? 'bg-rose-600' : 'bg-purple-600'}`} />
          <span className="text-slate-500">Brand Check:</span>
          <span className={isStemSuspicious ? 'text-rose-600 font-bold' : 'text-slate-700'}>
            {typosquattingTarget ? `Imitating ${typosquattingTarget.toUpperCase()}` : 'Authentic'}
          </span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-500">Entropy:</span>
          <span className="text-slate-900 font-semibold">Normalized</span>
        </div>
      </div>
    </div>
  );
};
