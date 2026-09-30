import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { TamperDemoBanner } from '../../components/TamperDemoBanner';
import { fetchRoleHistory } from '../../utils/history';
import {
  Award,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Building,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats', {
        params: user?.institution_id ? { institution_id: user.institution_id } : undefined,
      });
      const base = res.data.stats;
      if (user) {
        // The stats endpoint counts verification activity globally; scope it to this institution's credentials.
        const events = (await fetchRoleHistory(user)).filter((e) => e.verification_result !== 'ISSUED');
        setStats({
          ...base,
          verification_events: events.length,
          tampered_attempts: events.filter((e) => e.verification_result === 'TAMPERED').length,
          recent_events: events.slice(0, 8),
        });
      } else {
        setStats(base);
      }
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <TamperDemoBanner onActionComplete={fetchStats} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d0def2]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>{user?.institution_name || 'Academic Institution Console'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
              Institutional Issuance &amp; Integrity Console
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1">
              Institution Code: <span className="font-mono text-[#226835] font-semibold">{user?.institution_code || 'INS-TN-2026-001'}</span> • Cryptographic Authority: Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/credentials/new"
              className="px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue New Credential</span>
            </Link>

            <Link
              to="/admin/credentials"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f3f7fc] text-[#202f44] border border-[#d0def2] font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Layers className="w-4 h-4 text-[#2563eb]" />
              <span>View Registry</span>
            </Link>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#526b8f] mb-2">
              <span className="text-xs font-medium">Total Issued</span>
              <Award className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div className="text-3xl font-normal font-serif text-[#121f32]">
              {loading ? '...' : stats?.total_credentials ?? 0}
            </div>
            <div className="text-[11px] text-[#607ba2] mt-1">In PostgreSQL Registry</div>
          </div>

          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#526b8f] mb-2">
              <span className="text-xs font-medium">Active &amp; Valid</span>
              <CheckCircle2 className="w-4 h-4 text-[#226835]" />
            </div>
            <div className="text-3xl font-normal font-serif text-[#226835]">
              {loading ? '...' : stats?.active_credentials ?? 0}
            </div>
            <div className="text-[11px] text-[#607ba2] mt-1">Cryptographically Intact</div>
          </div>

          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#526b8f] mb-2">
              <span className="text-xs font-medium">Revoked</span>
              <XCircle className="w-4 h-4 text-[#b25c10]" />
            </div>
            <div className="text-3xl font-normal font-serif text-[#b25c10]">
              {loading ? '...' : stats?.revoked_credentials ?? 0}
            </div>
            <div className="text-[11px] text-[#607ba2] mt-1">Formally Cancelled</div>
          </div>

          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-[#526b8f] mb-2">
              <span className="text-xs font-medium">Verifications</span>
              <Search className="w-4 h-4 text-[#285773]" />
            </div>
            <div className="text-3xl font-normal font-serif text-[#285773]">
              {loading ? '...' : stats?.verification_events ?? 0}
            </div>
            <div className="text-[11px] text-[#607ba2] mt-1">QR &amp; ID Inquiries</div>
          </div>

          <div className="bg-[#fdeeed] border border-[#f8cbc8] rounded-3xl p-5 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[#b92c28] mb-2">
              <span className="text-xs font-medium">Tamper Alerts</span>
              <AlertTriangle className="w-4 h-4 text-[#b92c28] animate-pulse" />
            </div>
            <div className="text-3xl font-normal font-serif text-[#b92c28]">
              {loading ? '...' : stats?.tampered_attempts ?? 0}
            </div>
            <div className="text-[11px] text-[#b92c28]/80 mt-1">SHA-256 Mismatches</div>
          </div>
        </div>

        {/* Breakdown & Recent Audit Log */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-medium text-[#121f32]">
                Credentials by Type
              </h3>
              <Layers className="w-4 h-4 text-[#5c769b]" />
            </div>

            <div className="space-y-3">
              {(stats?.type_distribution || [
                { credential_type: '12th', count: '2' },
                { credential_type: '10th', count: '1' },
                { credential_type: 'Degree', count: '1' },
                { credential_type: 'Course Certificate', count: '2' },
              ]).map((item: any) => (
                <div
                  key={item.credential_type}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]"
                >
                  <span className="text-xs font-medium text-[#202f44]">{item.credential_type}</span>
                  <span className="text-xs font-serif font-bold px-2.5 py-0.5 rounded-full bg-[#e8f4ec] text-[#226835] border border-[#cbe6d0]">
                    {item.count} Issued
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#e7eef9]">
              <Link
                to="/admin/credentials/new"
                className="w-full py-2.5 px-4 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#d0def2]"
              >
                <span>Issue Additional Credential</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2563eb]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-[#c8d9f0] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#121f32]">
                  Live Audit Feed (Recent Queries)
                </h3>
                <p className="text-[11px] text-[#556e92] mt-0.5">Real-time log of background and public checks</p>
              </div>
              <Link
                to="/admin/history"
                className="text-xs text-[#2563eb] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#e7eef9]">
              {(stats?.recent_events || []).map((ev: any) => (
                <div key={ev.id} className="py-3 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ev.verification_result} size="sm" />
                    <div>
                      <div className="font-mono font-medium text-[#121f32]">{ev.credential_id}</div>
                      <div className="text-[10px] text-[#5a7499]">
                        Queried by: {ev.verifier_name} • IP: {ev.verifier_ip || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#5a7499] font-mono text-right">
                    {new Date(ev.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
