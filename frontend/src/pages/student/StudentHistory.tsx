import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRoleHistory } from '../../utils/history';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, History, Filter } from 'lucide-react';

export const StudentHistory: React.FC = () => {
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
    const q = search.toLowerCase();
    const matchesSearch =
      item.credential_id.toLowerCase().includes(q) ||
      (item.verifier_name && item.verifier_name.toLowerCase().includes(q)) ||
      (item.credential_type && item.credential_type.toLowerCase().includes(q));
    const matchesFilter = resultFilter === 'ALL' || item.verification_result === resultFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#d0def2]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-[#2563eb]" />
              <span>Verification History</span>
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1">
              Every time one of your credentials was checked, with the date, time and result
            </p>
          </div>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#f3f7fc] border border-[#d0def2] text-xs font-medium text-[#202f44] transition-colors shadow-xs"
          >
            Refresh Log
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5c769b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Credential ID, verifier, or credential type..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5c769b]" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
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
        <div className="bg-white border border-[#c8d9f0] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f6f8fc] border-b border-[#dbe6f5] text-[#4b6486] uppercase font-sans text-[11px] font-semibold tracking-wide">
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Credential ID</th>
                  <th className="py-3.5 px-4">Credential</th>
                  <th className="py-3.5 px-4">Verified By</th>
                  <th className="py-3.5 px-4">Result / Status</th>
                  <th className="py-3.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eef9]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5c769b]">
                      Loading history...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5c769b]">
                      No verification events found for your credentials.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#f3f7fc] transition-colors ${
                        item.verification_result === 'TAMPERED'
                          ? 'bg-[#fdeeed]'
                          : item.verification_result === 'REVOKED'
                          ? 'bg-[#fef4e8]'
                          : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-[#5c769b]">#{item.id}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#285773] whitespace-nowrap">
                        {item.credential_id}
                      </td>
                      <td className="py-3.5 px-4 text-[#202f44]">
                        {item.credential_type || <span className="text-[#7891b3]">—</span>}
                      </td>
                      <td className="py-3.5 px-4 text-[#202f44] font-medium">
                        {item.verifier_name || 'Public Verifier'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.verification_result} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#5c769b] text-[11px] whitespace-nowrap">
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
