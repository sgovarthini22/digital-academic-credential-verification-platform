import React from 'react';
import { X, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  studentName: string;
  qrCodeDataUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  credentialId,
  studentName,
  qrCodeDataUrl,
}) => {
  if (!isOpen) return null;

  const downloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `QR-${credentialId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyUrl = `${window.location.origin}/verify/${credentialId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Digital QR Signature</h3>
        <p className="text-xs text-slate-400 mb-4">{studentName}</p>

        {/* QR container */}
        <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4">
          <img
            src={qrCodeDataUrl}
            alt={`QR code for ${credentialId}`}
            className="w-48 h-48 mx-auto object-contain"
          />
        </div>

        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 mb-4 text-left">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
            Unique Credential ID
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400 select-all">{credentialId}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadQr}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Open verification page in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
