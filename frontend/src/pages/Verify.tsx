import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { QrScanner } from '../components/QrScanner';
import { StatusBadge } from '../components/StatusBadge';
import { TamperDemoBanner } from '../components/TamperDemoBanner';
import {
  Search,
  QrCode,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  GraduationCap,
  Hash,
  Copy,
  Check,
  Building,
  User,
  ExternalLink,
  Camera,
} from 'lucide-react';

export const Verify: React.FC = () => {
  const { credentialId: paramId } = useParams<{ credentialId?: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const [inputCredentialId, setInputCredentialId] = useState<string>(paramId || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Field Comparison Form State
  const [activeTab, setActiveTab] = useState<'verification' | 'comparison'>('verification');
  const [compareData, setCompareData] = useState({
    student_name: '',
    register_number: '',
    credential_type: '12th',
    academic_year: '2025-2026',
    marks: '',
    issue_date: '',
  });
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [compareLoading, setCompareLoading] = useState<boolean>(false);

  const performVerification = async (id: string) => {
    if (!id || !id.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCompareResult(null);
    try {
      const res = await api.get(`/verify/${encodeURIComponent(id.trim())}`, {
        params: user?.name ? { verifier_name: user.name } : undefined,
      });
      setResult(res.data);
      if (res.data.student_name) {
        setCompareData({
          student_name: res.data.student_name,
          register_number: res.data.register_number,
          credential_type: res.data.credential_type,
          academic_year: res.data.academic_year,
          marks: res.data.marks,
          issue_date: res.data.issue_date,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for the session to resolve so the check is attributed to the signed-in verifier
    if (paramId && !authLoading) {
      setInputCredentialId(paramId);
      performVerification(paramId);
    }
  }, [paramId, authLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCredentialId.trim()) return;
    openCredential(inputCredentialId.trim());
  };

  // Changing the route re-runs the paramId effect, which performs the verification once.
  // Only verify directly when the route would not change (same ID re-submitted).
  const openCredential = (id: string) => {
    if (id === paramId) {
      performVerification(id);
    } else {
      navigate(`/verify/${encodeURIComponent(id)}`);
    }
  };

  const handleQuickSelect = (id: string) => {
    setInputCredentialId(id);
    openCredential(id);
  };

  const handleScanned = (id: string) => {
    setShowScanner(false);
    setInputCredentialId(id);
    openCredential(id);
  };

  const handleCompareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCredentialId.trim()) return;
    setCompareLoading(true);
    try {
      const res = await api.post('/verify/compare', {
        credential_id: inputCredentialId.trim(),
        ...compareData,
      });
      setCompareResult(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Comparison failed');
    } finally {
      setCompareLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <TamperDemoBanner onActionComplete={() => inputCredentialId && performVerification(inputCredentialId)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#121f32] tracking-tight mb-2">
            {t.verifyTitle}
          </h1>
          <p className="text-[#3b6fd8] text-xs sm:text-sm max-w-xl mx-auto">
            {t.verifySubtitle}
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="bg-white rounded-3xl border border-[#c8d9f0] p-6 sm:p-8 shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5c769b]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputCredentialId}
                onChange={(e) => setInputCredentialId(e.target.value)}
                placeholder={t.credentialIdPlaceholder}
                className="w-full pl-10 pr-4 py-3 bg-[#f6f8fc] border border-[#d0def2] rounded-full text-[#121f32] font-mono text-xs sm:text-sm placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <QrCode className="w-4 h-4" />
              )}
              <span>{t.verifyButton}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="px-5 py-3 bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] border border-[#d0def2] font-medium rounded-full text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Camera className="w-4 h-4 text-[#2563eb]" />
              <span>Scan QR</span>
            </button>
          </form>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[#fdeeed] border border-[#f8cbc8] text-xs text-[#b92c28]">
              {error}
            </div>
          )}

          {/* Quick Demo Pre-sets */}
          <div className="pt-3 border-t border-[#e7eef9]">
            <div className="text-[10px] uppercase font-sans tracking-wider text-[#5c769b] mb-2 font-medium">
              Instant Demo Presets:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSelect('CRED-2026-8F42A91D')}
                className="px-3 py-1 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] border border-[#d0def2] text-[#226835] font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#226835]" />
                <span>VALID (12th Marksheet)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('CRED-2026-TAMPERDEMO')}
                className="px-3 py-1 rounded-full bg-[#fdeeed] hover:bg-[#fbdad7] border border-[#f8cbc8] text-[#b92c28] font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#b92c28] animate-ping" />
                <span>TAMPER DEMO RECORD</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('CRED-2025-REVOKED7')}
                className="px-3 py-1 rounded-full bg-[#fef4e8] hover:bg-[#fae2c6] border border-[#fae0c2] text-[#b25c10] font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#b25c10]" />
                <span>REVOKED (Course Cert)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('CRED-2023-EXPIRED9')}
                className="px-3 py-1 rounded-full bg-[#fcf7e8] hover:bg-[#f6ebd0] border border-[#f5e9bd] text-[#8e6b12] font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#8e6b12]" />
                <span>EXPIRED (Past Date)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('CRED-NONEXISTENT-404')}
                className="px-3 py-1 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] border border-[#d0def2] text-[#4f6686] font-mono text-[11px] transition-colors flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#768fb1]" />
                <span>NOT FOUND</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Verification Details vs Field Comparison */}
        {result && (
          <div className="flex border-b border-[#d0def2] mb-6 gap-3">
            <button
              onClick={() => setActiveTab('verification')}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'verification'
                  ? 'border-[#2563eb] text-[#121f32]'
                  : 'border-transparent text-[#4d6688] hover:text-[#121f32]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
              <span>Cryptographic Verification</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'comparison'
                  ? 'border-[#2563eb] text-[#121f32]'
                  : 'border-transparent text-[#4d6688] hover:text-[#121f32]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-[#2563eb]" />
              <span>{t.certificateComparison}</span>
            </button>
          </div>
        )}

        {/* RESULT PRESENTATION */}
        {result && activeTab === 'verification' && (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div
              className={`rounded-3xl p-6 sm:p-8 border shadow-xs relative overflow-hidden ${
                result.verification_status === 'VALID'
                  ? 'bg-white border-[#cbe6d0]'
                  : result.verification_status === 'TAMPERED'
                  ? 'bg-[#fdeeed] border-[#f8cbc8]'
                  : result.verification_status === 'REVOKED'
                  ? 'bg-[#fef4e8] border-[#fae0c2]'
                  : result.verification_status === 'EXPIRED'
                  ? 'bg-[#fcf7e8] border-[#f5e9bd]'
                  : 'bg-white border-[#d0def2]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={result.verification_status} size="lg" />
                    <span className="font-mono text-xs text-[#3b5b9a] font-semibold">
                      {result.credential_id}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#121f32] mb-1">
                    {result.verification_status === 'VALID' && (language === 'ta' ? 'சான்றிதழ் உண்மையானது மற்றும் செல்லுபடியாகும்' : 'Cryptographically Valid & Authentic')}
                    {result.verification_status === 'TAMPERED' && (language === 'ta' ? 'பாதுகாப்பு எச்சரிக்கை: ஆவணத்தில் மாற்றம் செய்யப்பட்டுள்ளது!' : 'Security Alert: Credential Data Has Been Modified')}
                    {result.verification_status === 'REVOKED' && (language === 'ta' ? 'அதிகாரப்பூர்வமாக ரத்து செய்யப்பட்ட சான்றிதழ்' : 'Revoked by Issuing Institution')}
                    {result.verification_status === 'EXPIRED' && (language === 'ta' ? 'சான்றிதழ் காலாவதியானது' : 'Validity Period Has Ended')}
                    {result.verification_status === 'NOT_FOUND' && (language === 'ta' ? 'பதிவேட்டில் சான்றிதழ் கிடைக்கவில்லை' : 'No Credential Found in Registry')}
                  </h3>
                  <p className="text-xs text-[#3b5b9a] max-w-xl">{result.message}</p>
                </div>

                {result.qr_code_data && (
                  <div className="bg-white p-2 rounded-2xl border border-[#d0def2] shadow-sm shrink-0 hidden sm:block">
                    <img
                      src={result.qr_code_data}
                      alt="QR"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Revocation Specific Notice */}
              {result.verification_status === 'REVOKED' && (
                <div className="mt-4 pt-4 border-t border-[#fae0c2] grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#b25c10] font-semibold">Revocation Reason:</span>{' '}
                    <span className="text-[#121f32]">{result.revocation_reason}</span>
                  </div>
                  <div>
                    <span className="text-[#b25c10] font-semibold">Revocation Date:</span>{' '}
                    <span className="text-[#121f32]">
                      {result.revoked_at ? new Date(result.revoked_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Student Consent Notice */}
              {result.student_consent_restricted && (
                <div className="mt-4 pt-4 border-t border-[#d0def2] text-xs text-[#226835] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563eb] shrink-0" />
                  <span>{t.consentRestrictedNotice}</span>
                </div>
              )}
            </div>

            {/* Credential Data Card */}
            {result.verification_status !== 'NOT_FOUND' && !result.student_consent_restricted && (
              <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e7eef9]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#2563eb]" />
                    <h4 className="font-serif text-xl font-medium text-[#121f32]">
                      {result.qualification || result.credential_type}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#eef3fa] text-[#226835] border border-[#d0def2]">
                    {result.credential_type}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.studentName}</div>
                    <div className="text-sm font-semibold text-[#121f32]">{result.student_name}</div>
                  </div>

                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.registerNumber}</div>
                    <div className="text-sm font-mono font-semibold text-[#121f32]">
                      {result.register_number}
                    </div>
                  </div>

                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.institution}</div>
                    <div className="text-sm font-semibold text-[#121f32]">
                      {result.institution_name}{' '}
                      {result.institution_code && (
                        <span className="text-[#5c769b] font-mono text-xs">
                          ({result.institution_code})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.academicYear}</div>
                    <div className="text-sm font-semibold text-[#121f32]">{result.academic_year}</div>
                  </div>

                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.marks}</div>
                    <div className="text-sm font-bold font-serif text-[#226835] text-base">{result.marks}</div>
                  </div>

                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="text-[#526b8f] mb-1 font-medium">{t.issueDate}</div>
                    <div className="text-sm font-semibold text-[#121f32]">{result.issue_date}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cryptographic SHA-256 Integrity Verification Card */}
            {(result.stored_hash || result.current_hash) && (
              <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e7eef9]">
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-[#2563eb]" />
                    <h4 className="text-xs font-bold text-[#121f32] uppercase tracking-wider font-mono">
                      {t.cryptographicIntegrity}
                    </h4>
                  </div>
                  {result.verification_status === 'VALID' ? (
                    <span className="text-xs text-[#226835] font-mono font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> HASH MATCH 100%
                    </span>
                  ) : result.verification_status === 'TAMPERED' ? (
                    <span className="text-xs text-[#b92c28] font-mono font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> HASH MISMATCH
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3 text-xs font-mono">
                  {/* Stored Hash */}
                  <div className="bg-[#f6f8fc] p-3.5 rounded-2xl border border-[#dbe6f5]">
                    <div className="flex items-center justify-between text-[#526b8f] mb-1">
                      <span className="text-[11px] font-semibold text-[#121f32]">
                        {t.storedHash}
                      </span>
                      <button
                        onClick={() => copyToClipboard(result.stored_hash)}
                        className="text-[#526b8f] hover:text-[#121f32] flex items-center gap-1"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-[#226835]" /> : <Copy className="w-3 h-3" />}
                        <span className="text-[10px]">Copy</span>
                      </button>
                    </div>
                    <div className="text-[#226835] font-mono break-all text-xs font-medium">
                      {result.stored_hash}
                    </div>
                  </div>

                  {/* Recomputed Hash */}
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      result.verification_status === 'TAMPERED'
                        ? 'bg-[#fdeeed] border-[#f8cbc8]'
                        : 'bg-[#f6f8fc] border-[#dbe6f5]'
                    }`}
                  >
                    <div className="text-[#526b8f] mb-1 text-[11px] font-semibold text-[#121f32]">
                      {t.computedHash}
                    </div>
                    <div
                      className={`break-all text-xs font-medium ${
                        result.verification_status === 'TAMPERED'
                          ? 'text-[#b92c28] font-bold'
                          : 'text-[#285773]'
                      }`}
                    >
                      {result.current_hash}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] text-[11px] text-[#3b6fd8] leading-relaxed">
                  <span className="font-semibold text-[#121f32]">Architecture Explanation:</span>{' '}
                  {t.hashMatchExplanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIELD COMPARISON TAB */}
        {result && activeTab === 'comparison' && (
          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="mb-4">
              <h3 className="font-serif text-2xl font-normal text-[#121f32] mb-1">
                {t.certificateComparison}
              </h3>
              <p className="text-xs text-[#3b6fd8]">{t.compareExplanation}</p>
            </div>

            <form onSubmit={handleCompareSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Student Name</label>
                  <input
                    type="text"
                    value={compareData.student_name}
                    onChange={(e) => setCompareData({ ...compareData, student_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Register Number</label>
                  <input
                    type="text"
                    value={compareData.register_number}
                    onChange={(e) => setCompareData({ ...compareData, register_number: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Credential Type</label>
                  <select
                    value={compareData.credential_type}
                    onChange={(e) => setCompareData({ ...compareData, credential_type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium"
                  >
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Degree">Degree</option>
                    <option value="Course Certificate">Course Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Academic Year</label>
                  <input
                    type="text"
                    value={compareData.academic_year}
                    onChange={(e) => setCompareData({ ...compareData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Marks / Grade</label>
                  <input
                    type="text"
                    value={compareData.marks}
                    onChange={(e) => setCompareData({ ...compareData, marks: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#3b5b9a] mb-1 font-medium">Submitted Issue Date</label>
                  <input
                    type="text"
                    value={compareData.issue_date}
                    onChange={(e) => setCompareData({ ...compareData, issue_date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={compareLoading}
                className="w-full py-2.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs transition-colors shadow-xs disabled:opacity-50"
              >
                {compareLoading ? 'Comparing...' : 'Run Field-Level Comparison'}
              </button>
            </form>

            {/* Comparison Results */}
            {compareResult && (
              <div className="mt-6 pt-6 border-t border-[#e7eef9]">
                <div
                  className={`p-4 rounded-2xl border mb-4 font-bold text-xs flex items-center justify-between ${
                    compareResult.overall_match
                      ? 'bg-[#eaf4ec] border-[#cbe5cf] text-[#226835]'
                      : 'bg-[#fdeeed] border-[#f8cbc8] text-[#b92c28]'
                  }`}
                >
                  <span>
                    {compareResult.overall_match ? t.fieldLevelMatch : t.fieldLevelMismatch}
                  </span>
                  <span className="font-mono text-sm uppercase">
                    {compareResult.result}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {Object.entries(compareResult.field_comparisons || {}).map(([key, val]: [string, any]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]"
                    >
                      <div className="capitalize text-[#121f32] font-medium">
                        {key.replace('_', ' ')}
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div className="text-[#526b8f]">
                          Submitted: <span className="text-[#121f32] font-mono">{val.submitted}</span>
                        </div>
                        <div className="text-[#526b8f]">
                          Registry: <span className="text-[#226835] font-mono">{val.original}</span>
                        </div>
                        <div className="w-16 text-right">
                          {val.match ? (
                            <span className="text-[#226835] font-bold font-mono">MATCH ✓</span>
                          ) : (
                            <span className="text-[#b92c28] font-bold font-mono">MISMATCH ✕</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#f6f8fc] text-[11px] text-[#3b6fd8] border border-[#dbe6f5]">
                  {compareResult.explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showScanner && <QrScanner onDetected={handleScanned} onClose={() => setShowScanner(false)} />}
    </div>
  );
};
