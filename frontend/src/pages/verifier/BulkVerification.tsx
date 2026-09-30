import React, { useState } from 'react';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { TamperDemoBanner } from '../../components/TamperDemoBanner';
import {
  FileSpreadsheet,
  Upload,
  Download,
  ArrowRight,
} from 'lucide-react';

export const BulkVerification: React.FC = () => {
  const [csvText, setCsvText] = useState<string>(
    `credential_id\nCRED-2026-8F42A91D\nCRED-2024-4B11E29C\nCRED-2026-9C33D10A\nCRED-2026-TAMPERDEMO\nCRED-2025-REVOKED7\nCRED-2023-EXPIRED9\nCRED-UNKNOWN-999`
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkResult, setBulkResult] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const sample = `credential_id\nCRED-2026-8F42A91D\nCRED-2024-4B11E29C\nCRED-2026-9C33D10A\nCRED-2026-TAMPERDEMO\nCRED-2025-REVOKED7\nCRED-2023-EXPIRED9\nCRED-UNKNOWN-999`;
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_credentials_for_verification.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRunVerification = async () => {
    if (!csvText.trim()) return;

    const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
    const ids: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes('credential_id') || line.toLowerCase().includes('id')) {
        continue;
      }
      const firstCol = line.split(',')[0].trim();
      if (firstCol) {
        ids.push(firstCol);
      }
    }

    if (ids.length === 0) {
      alert('No valid Credential IDs found in CSV input');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/verify/bulk', { credential_ids: ids });
      setBulkResult(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Bulk verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportResultsCsv = () => {
    if (!bulkResult || !bulkResult.results) return;

    let csvContent = 'data:text/csv;charset=utf-8,Credential ID,Student Name,Credential Type,Result,Details\n';
    bulkResult.results.forEach((row: any) => {
      csvContent += `"${row.credential_id}","${row.student_name || 'N/A'}","${row.credential_type || 'N/A'}","${row.result}","${row.details}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verification_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <TamperDemoBanner onActionComplete={() => bulkResult && handleRunVerification()} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#d0def2]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-[#2563eb]" />
              <span>Bulk Credential Verification</span>
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1">
              Verify batches of student credential IDs via CSV file upload or text list
            </p>
          </div>

          <button
            onClick={handleDownloadSampleCsv}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f3f7fc] border border-[#d0def2] text-xs font-medium text-[#202f44] flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-[#2563eb]" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* Upload & Input Area */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#3a4f6d] uppercase tracking-wider mb-2">
                Upload CSV File
              </label>
              <div className="border-2 border-dashed border-[#d0def2] hover:border-[#2563eb] rounded-3xl p-6 text-center transition-colors bg-[#f6f8fc] relative">
                <Upload className="w-8 h-8 text-[#2563eb] mx-auto mb-2" />
                <p className="text-xs font-medium text-[#121f32] mb-1">
                  Click to browse or drop CSV file here
                </p>
                <p className="text-[11px] text-[#5c769b] mb-3">
                  Format: <code>credential_id</code> column
                </p>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-[#3a4f6d] uppercase tracking-wider">
                  Or Paste Credential IDs (One Per Line)
                </label>
                <button
                  onClick={() =>
                    setCsvText(
                      `credential_id\nCRED-2026-8F42A91D\nCRED-2024-4B11E29C\nCRED-2026-9C33D10A\nCRED-2026-TAMPERDEMO\nCRED-2025-REVOKED7\nCRED-2023-EXPIRED9\nCRED-UNKNOWN-999`
                    )
                  }
                  className="text-[11px] text-[#2563eb] hover:underline font-medium"
                >
                  Load Demo Batch
                </button>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={6}
                className="w-full p-3 bg-[#f6f8fc] border border-[#d0def2] rounded-2xl text-xs font-mono text-[#285773] placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                placeholder="credential_id&#10;CRED-2026-001&#10;CRED-2026-002"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e7eef9] flex justify-end">
            <button
              onClick={handleRunVerification}
              disabled={loading}
              className="py-3 px-8 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? 'Evaluating Cryptographic Signatures...' : 'Execute Bulk Verification Batch'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {bulkResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-3xl bg-white border border-[#c8d9f0] text-center shadow-xs">
                <span className="text-[10px] text-[#5c769b] uppercase tracking-wider block mb-1">
                  Uploaded
                </span>
                <span className="text-2xl font-normal font-serif text-[#121f32]">
                  {bulkResult.summary?.total}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-[#cbe6d0] text-center shadow-xs">
                <span className="text-[10px] text-[#226835] uppercase tracking-wider block mb-1 font-medium">
                  Valid ✓
                </span>
                <span className="text-2xl font-normal font-serif text-[#226835]">
                  {bulkResult.summary?.valid}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-[#fdeeed] border border-[#f8cbc8] text-center shadow-xs">
                <span className="text-[10px] text-[#b92c28] uppercase tracking-wider block mb-1 font-medium">
                  Tampered !
                </span>
                <span className="text-2xl font-normal font-serif text-[#b92c28]">
                  {bulkResult.summary?.tampered}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-[#fef4e8] border border-[#fae0c2] text-center shadow-xs">
                <span className="text-[10px] text-[#b25c10] uppercase tracking-wider block mb-1 font-medium">
                  Revoked ✕
                </span>
                <span className="text-2xl font-normal font-serif text-[#b25c10]">
                  {bulkResult.summary?.revoked}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-[#fcf7e8] border border-[#f5e9bd] text-center shadow-xs">
                <span className="text-[10px] text-[#8e6b12] uppercase tracking-wider block mb-1 font-medium">
                  Expired ⏱
                </span>
                <span className="text-2xl font-normal font-serif text-[#8e6b12]">
                  {bulkResult.summary?.expired}
                </span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-[#c8d9f0] text-center shadow-xs">
                <span className="text-[10px] text-[#5c769b] uppercase tracking-wider block mb-1">
                  Not Found ?
                </span>
                <span className="text-2xl font-normal font-serif text-[#5c769b]">
                  {bulkResult.summary?.not_found}
                </span>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-[#c8d9f0] rounded-3xl overflow-hidden shadow-xs">
              <div className="p-4 bg-[#f6f8fc] border-b border-[#dbe6f5] flex justify-between items-center">
                <h3 className="text-xs font-semibold text-[#121f32] uppercase tracking-wider font-sans">
                  Batch Evaluation Results
                </h3>
                <button
                  onClick={handleExportResultsCsv}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f3f7fc] border border-[#d0def2] text-xs font-medium text-[#2563eb] flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f6f8fc] border-b border-[#dbe6f5] text-[#4b6486] uppercase font-sans text-[11px] font-semibold tracking-wide">
                      <th className="py-3 px-4">Credential ID</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Credential Type</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7eef9]">
                    {bulkResult.results.map((row: any, idx: number) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#f3f7fc] transition-colors ${
                          row.result === 'TAMPERED'
                            ? 'bg-[#fdeeed]'
                            : row.result === 'REVOKED'
                            ? 'bg-[#fef4e8]'
                            : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-[#285773]">
                          {row.credential_id}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#121f32]">
                          {row.student_name || <span className="text-[#7891b3]">—</span>}
                        </td>
                        <td className="py-3 px-4 text-[#3b6fd8]">
                          {row.credential_type || <span className="text-[#7891b3]">—</span>}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={row.result} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-[#3b6fd8]">{row.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
