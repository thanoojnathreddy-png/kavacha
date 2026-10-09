import React, { useState, useRef } from 'react';
import { QrCode, Upload, Camera, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';

export const QrScannerView: React.FC = () => {
  const [qrText, setQrText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleUpiScam = 'upi://pay?pa=refunddesk2024@okaxis&pn=ELECTRICITY_REFUND_OFFICE&am=2850&cu=INR';
  const samplePhishUrl = 'http://onlinesbi-kyc-verify.top/update.html';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);

        if (code && code.data) {
          setQrText(code.data);
          scanDecodedData(code.data);
        } else {
          setErrorMsg('No readable QR code pattern detected in image. You can also paste the QR content directly below.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const scanDecodedData = async (dataToScan: string) => {
    const trimmed = dataToScan.trim();
    if (!trimmed) return;

    setIsScanning(true);
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/scan/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: trimmed })
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'QR processing failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              QR Code Threat & UPI Reverse-Payment Shield
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Decodes QR code images and camera snapshots. Inspects web destinations and detects deceptive UPI payment requests pretending to be cashback or refunds.
        </p>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50 hover:bg-slate-100/60 transition-all flex flex-col items-center justify-center cursor-pointer space-y-3 shadow-inner"
        >
          <div className="p-3 rounded-full bg-rose-100 border border-rose-300 text-rose-600 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-sm font-semibold text-slate-900 block">Click to upload QR code image</span>
            <span className="text-xs text-slate-500">PNG, JPG, WEBP formats supported</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Manual Paste or Preset */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-mono">Or paste QR decoded string / UPI URI:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setQrText(sampleUpiScam); scanDecodedData(sampleUpiScam); }}
                className="text-rose-600 hover:underline cursor-pointer font-medium"
              >
                Sample Fake UPI QR
              </button>
              <button
                onClick={() => { setQrText(samplePhishUrl); scanDecodedData(samplePhishUrl); }}
                className="text-rose-600 hover:underline cursor-pointer font-medium"
              >
                Sample Phish QR
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="e.g. upi://pay?pa=... or https://..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs outline-none focus:bg-white focus:border-rose-500"
            />
            <button
              onClick={() => scanDecodedData(qrText)}
              disabled={isScanning || !qrText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
            >
              Scan
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="p-6 rounded-2xl glass-panel space-y-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-mono">Scan Result</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                {result.type === 'UPI_PAYMENT' ? 'UPI Payment Payload' : 'Web Resource Target'}
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-lg font-bold font-mono uppercase ${
              result.verdict === 'DANGEROUS' ? 'bg-rose-50 text-rose-700 border border-rose-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              {result.verdict} ({result.risk_score}/100)
            </span>
          </div>

          {/* UPI Specific Details */}
          {result.type === 'UPI_PAYMENT' && result.upi_details && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Payee Display Name</span>
                  <span className="text-slate-900 font-bold text-sm">{result.upi_details.payee_name || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Virtual Payment Address (VPA)</span>
                  <span className="text-rose-600 font-bold text-sm">{result.upi_details.payee_vpa || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Debit Amount</span>
                  <span className="text-slate-900 font-bold text-sm">{result.upi_details.amount || 'Custom'}</span>
                </div>
              </div>

              {/* Warning Checklist */}
              {result.upi_details.warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    UPI Fraud Warnings
                  </h4>
                  <ul className="space-y-1 text-xs text-red-900">
                    {result.upi_details.warnings.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-0.5">Recommendation:</span>
            <span>{result.recommendation || 'Proceed with caution when authorizing transactions.'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
