import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  QrCode,
  FileSpreadsheet,
  FileCheck2,
  History,
  ArrowRight,
} from 'lucide-react';
import { TamperDemoBanner } from '../../components/TamperDemoBanner';

export const VerifierDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickId, setQuickId] = useState('');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickId.trim()) {
      navigate(`/verify/${encodeURIComponent(quickId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <TamperDemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="pb-6 mb-8 border-b border-[#d0def2]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Authorized Background Verifier Workspace</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
            {user?.name || 'Talent Background Verification Portal'}
          </h1>
          <p className="text-xs text-[#3b6fd8] mt-1">
            Enterprise validation suite for employers, recruitment agencies, and academic screening
          </p>
        </div>

        {/* Quick ID lookup form */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="font-serif text-2xl font-normal text-[#121f32] mb-1 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#2563eb]" />
            <span>Instant Single Credential Verification</span>
          </h2>
          <p className="text-xs text-[#3b6fd8] mb-4">
            Enter a student’s Credential ID or scan their QR code to verify cryptographic authenticity.
          </p>

          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={quickId}
              onChange={(e) => setQuickId(e.target.value)}
              placeholder="e.g. CRED-2026-8F42A91D"
              className="flex-1 px-4 py-3 bg-[#f6f8fc] border border-[#d0def2] rounded-full text-[#121f32] font-mono text-xs placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <button
              type="submit"
              className="px-7 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs transition-colors flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
            >
              <span>Verify Single Credential</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3 Core Verifier Tools */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white border border-[#c8d9f0] flex flex-col justify-between hover:border-[#bdcee7] transition-colors shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#121f32] mb-2">Bulk CSV Verification</h3>
              <p className="text-xs text-[#3b6fd8] leading-relaxed mb-6">
                Upload a CSV spreadsheet containing hundreds of Credential IDs. The platform evaluates all IDs against PostgreSQL and exports a verified report.
              </p>
            </div>
            <Link
              to="/verifier/bulk-verification"
              className="w-full py-2.5 px-4 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] border border-[#d0def2] text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Bulk Verifier</span>
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#c8d9f0] flex flex-col justify-between hover:border-[#bdcee7] transition-colors shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#121f32] mb-2">Field-Level Comparison</h3>
              <p className="text-xs text-[#3b6fd8] leading-relaxed mb-6">
                Input physical certificate fields (name, marks, year, institution) and compare directly with the original institutional record.
              </p>
            </div>
            <Link
              to="/verify?tab=compare"
              className="w-full py-2.5 px-4 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] border border-[#d0def2] text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Comparison Engine</span>
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#c8d9f0] flex flex-col justify-between hover:border-[#bdcee7] transition-colors shadow-xs">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center mb-4">
                <History className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#121f32] mb-2">Verification Audit Log</h3>
              <p className="text-xs text-[#3b6fd8] leading-relaxed mb-6">
                Search and export the complete audit record of all past verification checks conducted across the platform.
              </p>
            </div>
            <Link
              to="/verifier/history"
              className="w-full py-2.5 px-4 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] border border-[#d0def2] text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>View Verification Log</span>
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
