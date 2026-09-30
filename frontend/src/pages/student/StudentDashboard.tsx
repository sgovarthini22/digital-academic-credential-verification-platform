import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { QrModal } from '../../components/QrModal';
import {
  GraduationCap,
  Award,
  QrCode,
  Sliders,
  ExternalLink,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [consent, setConsent] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<any | null>(null);

  const studentEmail = user?.email || 'gopika.sri@student.edu';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${encodeURIComponent(studentEmail)}/credentials`);
      setCredentials(res.data.credentials || []);
      setConsent(res.data.consent?.allow_detailed_verification ?? true);
    } catch (err) {
      console.error('Failed to load student data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentEmail]);

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d0def2]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Student Digital Wallet</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
              {user?.name || 'Gopika Sri'}
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1 font-mono">
              {studentEmail} • Multi-Tier Digital Academic Credentials
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/passport"
              className="px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Open Credential Passport</span>
            </Link>

            <Link
              to="/student/consent"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f3f7fc] text-[#202f44] border border-[#d0def2] font-medium text-xs transition-colors flex items-center gap-2 shadow-xs"
            >
              <Sliders className="w-4 h-4 text-[#2563eb]" />
              <span>Manage Consent</span>
            </Link>
          </div>
        </div>

        {/* Consent Status Strip */}
        <div className="mb-8 p-4 rounded-3xl bg-white border border-[#c8d9f0] flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#e7eef9] text-[#2563eb]">
              {consent ? <Eye className="w-4 h-4 text-[#226835]" /> : <EyeOff className="w-4 h-4 text-[#b25c10]" />}
            </div>
            <div>
              <div className="font-semibold text-[#121f32]">
                Detailed Verification Access:{' '}
                <span className={consent ? 'text-[#226835]' : 'text-[#b25c10] font-mono'}>
                  {consent ? 'ENABLED (Full Disclosure)' : 'RESTRICTED (Privacy Mode)'}
                </span>
              </div>
              <div className="text-[11px] text-[#556e92]">
                {consent
                  ? 'Authorized employers and verifiers can view full grades and registration records.'
                  : 'Verifiers see only validity status and issuing institution; personal scores are redacted.'}
              </div>
            </div>
          </div>
          <Link
            to="/student/consent"
            className="text-xs text-[#2563eb] hover:underline font-medium flex items-center gap-1"
          >
            <span>Change</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Credentials Grid */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-normal text-[#121f32] mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2563eb]" />
            <span>My Issued Academic Credentials ({credentials.length})</span>
          </h2>

          {loading ? (
            <div className="text-center py-12 text-[#5c769b] text-xs">
              Loading academic credentials...
            </div>
          ) : credentials.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#d0def2] text-[#3b6fd8] text-xs">
              No credentials currently registered for this email.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((cred) => (
                <div
                  key={cred.credential_id}
                  className="bg-white border border-[#c8d9f0] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#bdcee7] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#eef3fa] text-[#226835] border border-[#d0def2]">
                        {cred.credential_type}
                      </span>
                      <StatusBadge status={cred.status} size="sm" />
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#121f32] mb-1">{cred.qualification}</h3>
                    <p className="text-xs text-[#556e92] mb-3">{cred.institution_name}</p>

                    <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5] space-y-1.5 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#5c769b]">Credential ID:</span>
                        <span className="text-[#285773] font-mono font-semibold">
                          {cred.credential_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c769b]">Register No:</span>
                        <span className="text-[#121f32] font-mono">{cred.register_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c769b]">Marks / Grade:</span>
                        <span className="text-[#226835] font-bold font-serif">{cred.marks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c769b]">Academic Year:</span>
                        <span className="text-[#121f32]">{cred.academic_year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5c769b]">Issue Date:</span>
                        <span className="text-[#3b6fd8]">{cred.issue_date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#e7eef9]">
                    <button
                      onClick={() => setSelectedQr(cred)}
                      className="flex-1 py-2 px-3 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#d0def2]"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#2563eb]" />
                      <span>View QR</span>
                    </button>
                    <Link
                      to={`/verify/${cred.credential_id}`}
                      className="p-2 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#2563eb] border border-[#d0def2] transition-colors"
                      title="Test Verification"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    </div>
  );
};
