import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRoleHistory } from '../../utils/history';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, History, Download, Filter } from 'lucide-react';

export const VerifierHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      if (!user) return;
      setHistory(await fetchRoleHistory(user));
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.credential_id.toLowerCase().includes(search.toLowerCase()) ||
      (item.verifier_name && item.verifier_name.toLowerCase().includes(search.toLowerCase())) ||
      (item.student_name && item.student_name.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = resultFilter === 'ALL' || item.verification_result === resultFilter;
    return matchesSearch && matchesFilter;
  });

  const exportCsv = () => {
    let csv = 'data:text/csv;charset=utf-8,ID,Credential ID,Student,Verifier,Result,Timestamp\n';
    filtered.forEach((item) => {
      csv += `"${item.id}","${item.credential_id}","${item.student_name || 'N/A'}","${item.verifier_name}","${item.verification_result}","${item.verified_at}"\n`;
    });
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `verifier_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-400" />
              <span>Verifier Screening Activity Log</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Searchable compliance ledger of candidate credential authentications
            </p>
          </div>
          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Credential ID or candidate name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="ALL">All Results</option>
              <option value="VALID">VALID</option>
              <option value="TAMPERED">TAMPERED</option>
              <option value="REVOKED">REVOKED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="NOT_FOUND">NOT FOUND</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Credential ID</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Verifier Agent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      Loading verification log...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        item.verification_result === 'TAMPERED'
                          ? 'bg-rose-950/20'
                          : item.verification_result === 'REVOKED'
                          ? 'bg-amber-950/15'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-slate-500">#{item.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {item.credential_id}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {item.student_name || <span className="text-slate-600">—</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.verifier_name || 'Authorized Verifier'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.verification_result} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(item.verified_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
