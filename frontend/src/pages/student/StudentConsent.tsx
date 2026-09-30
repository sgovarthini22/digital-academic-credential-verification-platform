import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const StudentConsent: React.FC = () => {
  const { user } = useAuth();
  const [consent, setConsent] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const studentEmail = user?.email || 'gopika.sri@student.edu';

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${encodeURIComponent(studentEmail)}/credentials`);
        setConsent(res.data.consent?.allow_detailed_verification ?? true);
      } catch (err) {
        console.error('Failed to load consent', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsent();
  }, [studentEmail]);

  const handleToggle = async () => {
    try {
      setUpdating(true);
      const newStatus = !consent;
      await api.put(`/students/${encodeURIComponent(studentEmail)}/consent`, {
        allow_detailed_verification: newStatus,
      });
      setConsent(newStatus);
      setSuccessMsg(
        newStatus
          ? 'Consent updated: Full academic disclosure enabled.'
          : 'Consent updated: Privacy mode active. Personal marks and registration IDs are now redacted from public verifications.'
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert('Failed to update consent settings');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-6">
          <Link
            to="/student/dashboard"
            className="text-xs text-[#2563eb] hover:underline flex items-center gap-1 mb-2 font-medium"
          >
            ← Back to Student Dashboard
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#226835]" />
            <span>Student Consent &amp; Privacy Control</span>
          </h1>
          <p className="text-xs text-[#3b6fd8] mt-1">
            Student: <span className="text-[#121f32] font-semibold">{user?.name || 'Gopika Sri'}</span> ({studentEmail})
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#eaf4ec] border border-[#cbe5cf] text-xs text-[#226835] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#226835] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Toggle Card */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#e7eef9]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {consent ? (
                  <Eye className="w-5 h-5 text-[#226835]" />
                ) : (
                  <EyeOff className="w-5 h-5 text-[#b25c10]" />
                )}
                <h3 className="font-serif text-xl font-normal text-[#121f32]">
                  Allow Detailed Verification
                </h3>
              </div>
              <p className="text-xs text-[#3b6fd8] max-w-sm">
                Control whether third-party verifiers, employers, or institutions can view your full grades and marks.
              </p>
            </div>

            {/* Switch Button */}
            <button
              onClick={handleToggle}
              disabled={loading || updating}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563eb] ${
                consent ? 'bg-[#2563eb]' : 'bg-[#bdd2ef]'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  consent ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Detailed Explanation */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-xs">
            <div
              className={`p-4 rounded-2xl border transition-all ${
                consent
                  ? 'bg-[#eaf4ec] border-[#cbe5cf] text-[#226835]'
                  : 'bg-[#f6f8fc] border-[#dbe6f5] text-[#7891b3] opacity-60'
              }`}
            >
              <div className="font-bold text-sm mb-2 flex items-center gap-1.5 text-[#226835]">
                <CheckCircle2 className="w-4 h-4" />
                <span>When Enabled (ON)</span>
              </div>
              <p className="mb-2">Employers and verifiers can view:</p>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Verification Status (VALID / TAMPERED)</li>
                <li>Issuing Institution</li>
                <li>Credential Type &amp; Qualification</li>
                <li>Student Full Name &amp; Register Number</li>
                <li>Exact Marks / GPA / Grade</li>
                <li>Issue Date &amp; Cryptographic Hash</li>
              </ul>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                !consent
                  ? 'bg-[#fef4e8] border-[#fae0c2] text-[#b25c10]'
                  : 'bg-[#f6f8fc] border-[#dbe6f5] text-[#7891b3] opacity-60'
              }`}
            >
              <div className="font-bold text-sm mb-2 flex items-center gap-1.5 text-[#b25c10]">
                <Lock className="w-4 h-4" />
                <span>When Restricted (OFF)</span>
              </div>
              <p className="mb-2">Only minimal proof is visible:</p>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Verification Status (VALID / TAMPERED)</li>
                <li>Issuing Institution</li>
                <li>Credential Type</li>
                <li>Issue Date</li>
                <li className="text-[#b92c28] font-semibold">Student Name: REDACTED</li>
                <li className="text-[#b92c28] font-semibold">Marks &amp; Grades: REDACTED</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/verify/CRED-2026-8F42A91D"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#f3f7fc] text-[#2563eb] border border-[#d0def2] text-xs font-medium transition-colors shadow-xs"
          >
            <span>Preview How Verifiers See Your Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
