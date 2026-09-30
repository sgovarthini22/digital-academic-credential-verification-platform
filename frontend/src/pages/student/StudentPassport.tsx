import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Award,
  CheckCircle2,
  Minus,
  ExternalLink,
  GraduationCap,
  ArrowRight,
  Info,
} from 'lucide-react';

export const StudentPassport: React.FC = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const studentName = user?.name || 'Gopika Sri';
  const studentEmail = user?.email || 'gopika.sri@student.edu';

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${encodeURIComponent(studentEmail)}/credentials`);
        setCredentials(res.data.credentials || []);
      } catch (err) {
        console.error('Failed to load passport', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPassport();
  }, [studentEmail]);

  const tiers = [
    { key: '10th', label: '10th (Secondary Certificate)' },
    { key: '12th', label: '12th (Higher Secondary Certificate)' },
    { key: 'Diploma', label: 'Diploma / Vocational Certificate' },
    { key: 'Degree', label: 'Degree (Undergraduate / Postgraduate)' },
    { key: 'Course Certificate', label: 'Professional / Course Certificate' },
  ];

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#121f32] tracking-tight">
            Academic Credential Passport
          </h1>
          <p className="text-xs sm:text-sm text-[#2563eb] font-medium mt-1">
            {studentName} • <span className="font-mono text-[#3b6fd8]">{studentEmail}</span>
          </p>
        </div>

        {/* Passport Card */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden mb-6">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#e7eef9]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#eef3fa] border border-[#d0def2] flex items-center justify-center text-[#2563eb]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-normal text-[#121f32]">{studentName}</h3>
                <span className="text-xs text-[#3b6fd8]">Digital Academic Identity</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-sans uppercase tracking-wider text-[#5c769b] block">
                Verification Ledger
              </span>
              <span className="text-xs text-[#226835] font-serif font-bold">
                Independently Anchored
              </span>
            </div>
          </div>

          {/* Tier Rows */}
          <div className="space-y-3">
            {tiers.map((tier) => {
              const matchedCred = credentials.find((c) => c.credential_type === tier.key);

              return (
                <div
                  key={tier.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    matchedCred
                      ? 'bg-[#f6f8fc] border-[#dbe6f5]'
                      : 'bg-white/40 border-[#e7eef9] text-[#7891b3]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          matchedCred
                            ? 'bg-[#e8f4ec] text-[#226835] border border-[#cbe6d0]'
                            : 'bg-[#f6f8fc] text-[#7891b3] border border-[#dbe6f5]'
                        }`}
                      >
                        {matchedCred ? <CheckCircle2 className="w-5 h-5 text-[#226835]" /> : <Minus className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-[#121f32] flex items-center gap-2">
                          <span>{tier.key}</span>
                          <span className="text-xs font-normal text-[#556e92]">
                            ({tier.label.split('(')[1]?.replace(')', '') || tier.key})
                          </span>
                        </div>
                        {matchedCred ? (
                          <div className="text-xs text-[#3b6fd8] mt-0.5">
                            {matchedCred.qualification} • {matchedCred.institution_name}
                          </div>
                        ) : (
                          <div className="text-xs text-[#7891b3] italic">Not issued yet</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {matchedCred ? (
                        <>
                          <StatusBadge status={matchedCred.status} size="md" />
                          <Link
                            to={`/verify/${matchedCred.credential_id}`}
                            className="p-1.5 rounded-full bg-white hover:bg-[#e7eef9] text-[#2563eb] border border-[#d0def2] transition-colors"
                            title="Verify Passport Entry"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </>
                      ) : (
                        <span className="text-xs font-mono text-[#7891b3] uppercase tracking-widest px-3 py-1">
                          —
                        </span>
                      )}
                    </div>
                  </div>

                  {matchedCred && (
                    <div className="mt-3 pt-3 border-t border-[#e0eaf7] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-[#3b6fd8]">
                      <div>
                        ID: <span className="text-[#285773] font-semibold">{matchedCred.credential_id}</span>
                      </div>
                      <div>
                        REG: <span className="text-[#121f32]">{matchedCred.register_number}</span>
                      </div>
                      <div>
                        SCORE: <span className="text-[#226835] font-bold">{matchedCred.marks}</span>
                      </div>
                      <div>
                        YEAR: <span className="text-[#121f32]">{matchedCred.academic_year}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-[#e7eef9] flex items-start gap-2.5 text-xs text-[#3b6fd8]">
            <Info className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#121f32]">Design Specification Note:</strong> In strict alignment with credential standards, the passport does <em>not</em> calculate an arbitrary aggregate &quot;trust score&quot;. Each qualification is independently certified and audited on its individual SHA-256 cryptographic merits.
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <Link
            to="/student/dashboard"
            className="text-[#3b6fd8] hover:text-[#121f32] transition-colors"
          >
            ← Return to Student Dashboard
          </Link>
          <Link
            to="/student/consent"
            className="text-[#2563eb] hover:underline font-medium flex items-center gap-1"
          >
            <span>Manage Disclosure Consent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
