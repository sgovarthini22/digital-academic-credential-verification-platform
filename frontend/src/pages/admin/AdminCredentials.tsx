import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { StatusBadge } from '../../components/StatusBadge';
import { QrModal } from '../../components/QrModal';
import { TamperDemoBanner } from '../../components/TamperDemoBanner';
import {
  Search,
  PlusCircle,
  QrCode,
  XCircle,
  ExternalLink,
  AlertOctagon,
  Filter,
} from 'lucide-react';

export const AdminCredentials: React.FC = () => {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // QR Modal
  const [selectedQr, setSelectedQr] = useState<any | null>(null);

  // Revocation Modal
  const [revokeTarget, setRevokeTarget] = useState<any | null>(null);
  const [revocationReason, setRevocationReason] = useState('');
  const [revoking, setRevoking] = useState(false);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/credentials');
      setCredentials(res.data.credentials || []);
    } catch (err) {
      console.error('Failed to fetch credentials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeTarget || !revocationReason.trim()) return;
    setRevoking(true);
    try {
      await api.post(`/credentials/${revokeTarget.credential_id}/revoke`, {
        revocation_reason: revocationReason.trim(),
      });
      setRevokeTarget(null);
      setRevocationReason('');
      fetchCredentials();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Revocation failed');
    } finally {
      setRevoking(false);
    }
  };

  const filtered = credentials.filter((c) => {
    const matchesSearch =
      c.student_name.toLowerCase().includes(search.toLowerCase()) ||
      c.register_number.toLowerCase().includes(search.toLowerCase()) ||
      c.credential_id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.credential_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <TamperDemoBanner onActionComplete={fetchCredentials} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#d0def2]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
              Issued Credential Registry
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1">
              All academic credentials cryptographically anchored in PostgreSQL database
            </p>
          </div>

          <Link
            to="/admin/credentials/new"
            className="px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue New Credential</span>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5c769b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, register number, or Credential ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5c769b]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            >
              <option value="ALL">All Types</option>
              <option value="10th">10th</option>
              <option value="12th">12th</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
              <option value="Course Certificate">Course Certificate</option>
            </select>
          </div>
        </div>

        {/* Credentials Table */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f6f8fc] border-b border-[#dbe6f5] text-[#4b6486] uppercase font-sans text-[11px] font-semibold tracking-wide">
                  <th className="py-3.5 px-4">Credential ID</th>
                  <th className="py-3.5 px-4">Student &amp; Reg No.</th>
                  <th className="py-3.5 px-4">Type &amp; Qualification</th>
                  <th className="py-3.5 px-4">Marks / Grade</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eef9]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#5c769b]">
                      Loading registered credentials...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#5c769b]">
                      No credentials found matching your query.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cred) => (
                    <tr
                      key={cred.credential_id}
                      className={`hover:bg-[#f3f7fc] transition-colors ${
                        cred.is_test_record ? 'bg-[#fcf8ee]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#285773] whitespace-nowrap">
                        {cred.credential_id}
                        {cred.is_test_record && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-[#fdeeed] text-[#b92c28] text-[10px] font-sans font-medium">
                            TEST RECORD
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#121f32]">{cred.student_name}</div>
                        <div className="text-[11px] font-mono text-[#5c769b]">
                          {cred.register_number}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#202f44]">{cred.qualification}</div>
                        <div className="text-[11px] text-[#2563eb]">{cred.credential_type}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#121f32] font-serif text-sm">
                        {cred.marks}
                      </td>
                      <td className="py-3.5 px-4 text-[#3b6fd8] whitespace-nowrap">
                        {cred.issue_date}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={cred.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedQr(cred)}
                            className="p-1.5 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#2563eb] border border-[#d0def2] transition-colors"
                            title="View / Download QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>

                          <Link
                            to={`/verify/${cred.credential_id}`}
                            className="p-1.5 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#2563eb] border border-[#d0def2] transition-colors"
                            title="Verify Publicly"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {cred.status !== 'REVOKED' && (
                            <button
                              onClick={() => setRevokeTarget(cred)}
                              className="px-2.5 py-1 rounded-full bg-[#fef4e8] hover:bg-[#fae2c6] text-[#b25c10] border border-[#fae0c2] text-[11px] font-semibold transition-colors flex items-center gap-1"
                              title="Officially revoke credential"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedQr && (
        <QrModal
          isOpen={Boolean(selectedQr)}
          onClose={() => setSelectedQr(null)}
          credentialId={selectedQr.credential_id}
          studentName={selectedQr.student_name}
          qrCodeDataUrl={selectedQr.qr_code_data}
        />
      )}

      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#c8d9f0] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-[#fdeeed] text-[#b92c28] flex items-center justify-center mb-3">
              <AlertOctagon className="w-5 h-5" />
            </div>

            <h3 className="font-serif text-xl font-normal text-[#121f32] mb-1">
              Revoke Credential Confirmation
            </h3>
            <p className="text-xs text-[#3b6fd8] mb-4">
              Are you sure you want to revoke this credential? Its verification status will permanently reflect{' '}
              <span className="text-[#b25c10] font-bold">REVOKED</span> while preserving the original record for compliance.
            </p>

            <form onSubmit={handleRevokeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#202f44] font-medium mb-1">
                  Revocation Reason *
                </label>
                <textarea
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g. Disciplinary revocation, board cancellation, or clerical issuance error"
                  rows={3}
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-2xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRevokeTarget(null)}
                  className="flex-1 py-2 px-3 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revoking}
                  className="flex-1 py-2 px-3 rounded-full bg-[#b92c28] hover:bg-[#a12420] text-white font-medium transition-colors disabled:opacity-50"
                >
                  {revoking ? 'Revoking...' : 'Confirm Revocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
