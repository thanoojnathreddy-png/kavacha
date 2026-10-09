import React, { useState } from 'react';
import { Layers, Upload, Download, RefreshCw, AlertTriangle, CheckCircle2, FileText, Search } from 'lucide-react';

export const BulkScannerView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const sampleCsv = `https://google.com
http://onlinesbi-kyc-verify.top/update.html
https://netbanking.hdfcbank.com/netbanking
http://paytm-kyc-completed-24hrs.tk/wallet-kyc
https://github.com
http://critical-update-patch.xyz/invoice_receipt.pdf.exe
https://www.irctc.co.in/nget/train-search
http://incometax-refund-credited-gov.xyz/refund
https://amazon.in
http://indiapost-parcels-tracking.buzz/address_update.php`;

  const handleScan = async () => {
    const urls = inputText
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (!urls.length) return;

    setIsScanning(true);
    setResults([]);
    setSummary(null);

    try {
      const res = await fetch('/api/scan/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });
      const data = await res.json();
      setResults(data.results || []);
      setSummary(data.summary || null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportCsv = () => {
    if (!results.length) return;
    const header = 'URL,Verdict,Risk Score,Category,Reason,Defanged URL\n';
    const rows = results
      .map(r => `"${r.url}","${r.verdict}","${r.risk_score}","${r.category}","${r.reasons.replace(/"/g, '""')}","${r.defanged}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kavach_bulk_scan_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => {
    const matchFilter = filter === 'ALL' || r.verdict === filter;
    const matchSearch = !search || r.url.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Upload & Input Card */}
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Batch URL & Enterprise Threat Analyzer
            </h2>
          </div>
          <button
            onClick={() => setInputText(sampleCsv)}
            className="text-xs font-mono text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Load Sample Batch
          </button>
        </div>

        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="https://example1.com&#10;https://example2.com/phish-test"
          className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-rose-500 text-slate-900 font-mono text-xs outline-none shadow-xs"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Detected URLs: {inputText.split('\n').filter(u => u.trim()).length}
          </span>

          <button
            onClick={handleScan}
            disabled={isScanning || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-xs flex items-center gap-2 cursor-pointer"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isScanning ? 'Processing Batch...' : 'Start Batch Scan'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Total Scanned</span>
            <div className="text-2xl font-bold font-mono text-slate-900">{summary.total}</div>
          </div>
          <div className="p-4 rounded-xl glass-panel bg-white border border-rose-200 shadow-sm">
            <span className="text-xs text-rose-600">Dangerous Threats</span>
            <div className="text-2xl font-bold font-mono text-rose-600">{summary.dangerous}</div>
          </div>
          <div className="p-4 rounded-xl glass-panel bg-white border border-amber-200 shadow-sm">
            <span className="text-xs text-amber-600">Suspicious Anomaly</span>
            <div className="text-2xl font-bold font-mono text-amber-600">{summary.suspicious}</div>
          </div>
          <div className="p-4 rounded-xl glass-panel bg-white border border-emerald-200 shadow-sm">
            <span className="text-xs text-emerald-600">Verified Safe</span>
            <div className="text-2xl font-bold font-mono text-emerald-600">{summary.safe}</div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="p-5 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter URL by keyword..."
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono outline-none focus:border-rose-500"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono outline-none"
              >
                <option value="ALL">All Verdicts</option>
                <option value="DANGEROUS">Dangerous Only</option>
                <option value="SUSPICIOUS">Suspicious Only</option>
                <option value="SAFE">Safe Only</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Results CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2">URL</th>
                  <th className="pb-2">Verdict</th>
                  <th className="pb-2">Risk Score</th>
                  <th className="pb-2">Primary Factor</th>
                  <th className="pb-2">Defanged URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-4 truncate max-w-xs font-sans text-slate-900">{r.url}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.verdict === 'DANGEROUS' ? 'bg-rose-50 text-rose-700 border border-rose-300' :
                        r.verdict === 'SUSPICIOUS' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      }`}>
                        {r.verdict}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-slate-900">{r.risk_score}</td>
                    <td className="py-2.5 text-slate-600 truncate max-w-xs">{r.reasons}</td>
                    <td className="py-2.5 text-slate-500 select-all">{r.defanged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
