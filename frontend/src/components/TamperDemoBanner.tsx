import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { AlertOctagon, RotateCcw, ShieldAlert, ArrowRight } from 'lucide-react';

export const TamperDemoBanner: React.FC<{ onActionComplete?: () => void }> = ({ onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleTamper = async () => {
    try {
      setLoading(true);
      await api.post('/demo/tamper-test-record', {
        credential_id: 'CRED-2026-TAMPERDEMO',
        action: 'tamper',
        marks: '590/600',
      });
      setMessage('Marks altered to 590/600 in database! Stored hash unchanged.');
      onActionComplete?.();
    } catch (err: any) {
      setMessage('Failed to tamper test record');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      await api.post('/demo/tamper-test-record', {
        credential_id: 'CRED-2026-TAMPERDEMO',
        action: 'restore',
      });
      setMessage('Test record restored to authentic state (550/600).');
      onActionComplete?.();
    } catch (err: any) {
      setMessage('Failed to restore test record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#dae6f7] border-b border-[#c4d5ec] py-2 px-4 text-xs text-[#202f44]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#8a531f] shrink-0" />
          <div>
            <span className="font-semibold text-[#121f32]">
              Hackathon Live Demo Simulation Lab:
            </span>{' '}
            <span className="text-[#3c516f]">
              Test ID:{' '}
              <code className="bg-white/80 border border-[#bdcee7] px-1.5 py-0.5 rounded text-[#202f44] font-mono text-[11px]">
                CRED-2026-TAMPERDEMO
              </code>
            </span>
            {message && <span className="ml-2 font-medium text-[#226835]">({message})</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTamper}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b92c28] hover:bg-[#a12420] text-white font-medium shadow-xs transition-colors disabled:opacity-50 text-[11px]"
            title="Alters database marks to 590/600 without touching stored hash"
          >
            <AlertOctagon className="w-3 h-3" />
            <span>Simulate Tamper (590/600)</span>
          </button>

          <button
            onClick={handleRestore}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#f3f7fc] text-[#202f44] border border-[#bdcee7] font-medium transition-colors disabled:opacity-50 text-[11px]"
            title="Restore original 550/600"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restore Original</span>
          </button>

          <Link
            to="/verify/CRED-2026-TAMPERDEMO"
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium transition-colors text-[11px]"
          >
            <span>Verify Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
