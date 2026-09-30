import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: 'Autonomous College',
    institution_code: '',
    email: '',
    phone: '',
    address: '',
    password: 'Password@123',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/institutions', formData);
      await login(formData.email, formData.password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#e7eef9]">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight">
            Register Academic Institution
          </h2>
          <p className="text-xs text-[#3b6fd8] mt-1">
            Enroll your school, college, or university to digitally issue verifiable academic credentials
          </p>
        </div>

        <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-[#fdeeed] border border-[#f8cbc8] text-xs text-[#b92c28]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#3a4f6d] font-medium mb-1">Institution Name *</label>
              <input
                type="text"
                value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                placeholder="e.g. Erode Sengunthar Engineering College (Autonomous)"
                className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Institution Type *</label>
                <select
                  value={formData.institution_type}
                  onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="Higher Secondary School">Higher Secondary School</option>
                  <option value="Arts & Science College">Arts & Science College</option>
                  <option value="Engineering & Technology College">Engineering & Technology</option>
                  <option value="Autonomous College">Autonomous College</option>
                  <option value="University">University</option>
                  <option value="Vocational / Polytechnic Institute">Polytechnic / Vocational</option>
                  <option value="Certification Academy">Certification Academy</option>
                </select>
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Institution Code *</label>
                <input
                  type="text"
                  value={formData.institution_code}
                  onChange={(e) => setFormData({ ...formData, institution_code: e.target.value.toUpperCase() })}
                  placeholder="e.g. INS-TN-2026-002"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Official Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@esec.edu"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#3a4f6d] font-medium mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94432 11000"
                  className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#3a4f6d] font-medium mb-1">Campus Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                placeholder="Perundurai, Erode District, Tamil Nadu - 638057"
                className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-[#3a4f6d] font-medium mb-1">Administrative Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-[#f6f8fc] border border-[#d0def2] rounded-xl text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] text-[11px] text-[#3b6fd8] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#226835] mt-0.5 shrink-0" />
              <span>
                Registered institutions are automatically provisioned with <strong>ACTIVE</strong> issuing privileges and cryptographic signing authority.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-full text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Institution...' : 'Complete Registration & Open Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#e7eef9] text-center text-xs text-[#3b6fd8]">
            Already registered?{' '}
            <Link to="/login" className="text-[#2563eb] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
