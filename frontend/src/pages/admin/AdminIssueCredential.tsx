import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import {
  FilePlus2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminIssueCredential: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    student_name: 'Gopika Sri',
    register_number: 'REG2026001',
    student_email: 'gopika.sri@student.edu',
    credential_type: '12th',
    qualification: 'Higher Secondary Certificate (HSC) - Bio-Maths',
    academic_year: '2025-2026',
    issue_date: '2026-04-30',
    marks: '550/600',
    expiry_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedResult, setIssuedResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/credentials', formData);
      setIssuedResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue credential');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForNew = () => {
    setIssuedResult(null);
    setFormData({
      student_name: '',
      register_number: '',
      student_email: '',
      credential_type: 'Degree',
      qualification: 'Bachelor of Engineering in Computer Science',
      academic_year: '2022-2026',
      issue_date: new Date().toISOString().split('T')[0],
      marks: '8.85 CGPA',
      expiry_date: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <Link
            to="/admin/credentials"
            className="text-xs text-[#2563eb] hover:underline flex items-center gap-1 mb-2 font-medium"
          >
            ← Back to Registry
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
            Issue Digital Academic Credential
          </h1>
          <p className="text-xs text-[#3b6fd8] mt-1">
            Issuing authority:{' '}
            <span className="text-[#121f32] font-semibold">
              {user?.institution_name || 'Academic Institution'}
            </span>{' '}
            ({user?.institution_code || 'INS-TN-2026-001'})
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#fdeeed] border border-[#f8cbc8] text-xs text-[#b92c28]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Gopika Sri"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Register / Roll Number *</label>
                <input
                  type="text"
                  value={formData.register_number}
                  onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                  placeholder="e.g. REG2026001"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Student Email *</label>
                <input
                  type="email"
                  value={formData.student_email}
                  onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                  placeholder="gopika.sri@student.edu"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Credential Type *</label>
                <select
                  value={formData.credential_type}
                  onChange={(e) => setFormData({ ...formData, credential_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="10th">10th (Secondary School Leaving Certificate)</option>
                  <option value="12th">12th (Higher Secondary Certificate)</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Degree">Degree (Undergraduate / Postgraduate)</option>
                  <option value="Course Certificate">Course Certificate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#3a4f6d] font-medium mb-1">Qualification / Major *</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Higher Secondary Certificate (HSC) - Bio-Maths"
                className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Academic Year *</label>
                <input
                  type="text"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  placeholder="2025-2026"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Marks / Grade *</label>
                <input
                  type="text"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  placeholder="e.g. 550/600 or 8.92 CGPA"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#3a4f6d] font-medium mb-1">
                Validity / Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <span className="text-[10px] text-[#5a7499] mt-1 block">
                Standard academic degrees typically do not expire.
              </span>
            </div>

            {/* Cryptographic Pipeline Summary */}
            <div className="p-4 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] text-[11px] text-[#3b6fd8] space-y-1">
              <div className="font-semibold text-[#121f32] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Automated Cryptographic Pipeline upon Issuance:</span>
              </div>
              <div>• Generates unique Credential ID formatted as <code>CRED-2026-XXXXXXXX</code></div>
              <div>• Computes deterministic 256-bit SHA-256 digest &amp; anchors in PostgreSQL</div>
              <div>• Encodes verification URL into local high-resolution QR signature</div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Generating Hash & QR Signature...' : 'Issue Credential & Anchor in Database'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {issuedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#c8d9f0] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f4ec] text-[#226835] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#121f32]">Credential Successfully Issued!</h3>
              <p className="text-xs text-[#3b6fd8]">
                Anchored with SHA-256 and QR code generated
              </p>
            </div>

            {/* QR preview */}
            <div className="bg-[#f6f8fc] border border-[#dbe6f5] p-3 rounded-2xl mx-auto w-44 h-44 mb-4 flex items-center justify-center">
              <img
                src={issuedResult.credential?.qr_code_data}
                alt="QR Code"
                className="w-40 h-40 object-contain"
              />
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#f6f8fc] p-4 rounded-2xl border border-[#dbe6f5] mb-4">
              <div className="flex justify-between">
                <span className="text-[#5c769b]">CREDENTIAL ID:</span>
                <span className="text-[#285773] font-bold">
                  {issuedResult.credential?.credential_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5c769b]">STUDENT:</span>
                <span className="text-[#121f32]">{issuedResult.credential?.student_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5c769b]">TYPE:</span>
                <span className="text-[#121f32]">{issuedResult.credential?.credential_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5c769b]">MARKS:</span>
                <span className="text-[#226835] font-bold">
                  {issuedResult.credential?.marks}
                </span>
              </div>
              <div className="pt-2 border-t border-[#e0eaf7]">
                <span className="text-[#5c769b] block mb-0.5 text-[10px]">
                  ORIGINAL SHA-256 HASH:
                </span>
                <span className="text-[#2563eb] break-all text-[10px]">
                  {issuedResult.canonical_hash}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleResetForNew}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#eef3fa] hover:bg-[#dae6f7] text-[#202f44] text-xs font-medium transition-colors"
              >
                Issue Another
              </button>
              <Link
                to={`/verify/${issuedResult.credential?.credential_id}`}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium text-center transition-colors shadow-xs"
              >
                Verify Live
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
