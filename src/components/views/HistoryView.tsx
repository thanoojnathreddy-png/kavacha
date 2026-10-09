import React, { useEffect, useState } from 'react';
import { History, Search, Trash2, Download, RefreshCw, ExternalLink, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ScanRecord, TabType } from '../../types/index.ts';

interface HistoryViewProps {
  onReScan: (url: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onReScan }) => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/history?limit=100&filter=${filter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter, search]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
      setHistory(history.filter(h => h.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear your local scan history?')) return;
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kavach_scan_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Persistent Threat Audit Trail & Scan History
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              disabled={!history.length}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={!history.length}
              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by URL or category..."
              className="w-full px-4 py-2 pl-9 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs outline-none focus:border-rose-500 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono outline-none"
            >
              <option value="ALL">All Threat Verdicts</option>
              <option value="DANGEROUS">Dangerous (Malicious)</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="SAFE">Verified Safe</option>
            </select>

            <button
              onClick={fetchHistory}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2">Target URL</th>
                <th className="pb-2">Verdict</th>
                <th className="pb-2">Risk Score</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Scanned At</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-4 truncate max-w-sm font-sans text-slate-900">
                    {record.url}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        record.verdict === 'DANGEROUS'
                          ? 'bg-rose-50 text-rose-700 border border-rose-300'
                          : record.verdict === 'SUSPICIOUS'
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      }`}
                    >
                      {record.verdict}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className="font-bold text-slate-900">{record.risk_score}</span>
                    <span className="text-slate-400">/100</span>
                  </td>
                  <td className="py-2.5 text-slate-600">{record.category}</td>
                  <td className="py-2.5 text-slate-500">
                    {new Date(record.created_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right space-x-2">
                    <button
                      onClick={() => onReScan(record.url)}
                      className="text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                    >
                      Scan Again
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No scan records found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
