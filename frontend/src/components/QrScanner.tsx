import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { X, Camera } from 'lucide-react';

interface QrScannerProps {
  onDetected: (credentialId: string) => void;
  onClose: () => void;
}

// The backend encodes the QR as "/verify/<CREDENTIAL_ID>" (or a full URL ending the same way).
export const extractCredentialId = (text: string): string => {
  const trimmed = text.trim();
  const match = trimmed.match(/\/verify\/([^/?#\s]+)/i);
  return decodeURIComponent(match ? match[1] : trimmed);
};

export const QrScanner: React.FC<QrScannerProps> = ({ onDetected, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(img.data, img.width, img.height);
          if (code && code.data) {
            stopped = true;
            onDetected(extractCredentialId(code.data));
            return;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError('Camera access is not available in this browser (requires HTTPS or localhost).');
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          raf = requestAnimationFrame(tick);
        }
      } catch {
        setError('Could not access the camera. Please allow camera permission or enter the Credential ID manually.');
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-[#c8d9f0] rounded-3xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#5c769b] hover:bg-[#eef3fa] transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center mb-3">
          <Camera className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-xl font-normal text-[#121f32] mb-1">Scan Credential QR</h3>
        <p className="text-xs text-[#3b6fd8] mb-4">Point the camera at the credential's QR code.</p>

        {error ? (
          <div className="p-3 rounded-2xl bg-[#fdeeed] border border-[#f8cbc8] text-xs text-[#b92c28]">{error}</div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-[#d0def2] bg-black">
            <video ref={videoRef} muted playsInline className="w-full aspect-square object-cover" />
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
