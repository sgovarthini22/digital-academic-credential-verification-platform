import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Building2, GraduationCap, Briefcase } from 'lucide-react';

export const dashboardFor = (role: UserRole) =>
  role === 'INSTITUTION' ? '/admin/dashboard' : role === 'STUDENT' ? '/student/dashboard' : '/verifier/dashboard';

const DEMO_ACCOUNTS: { role: UserRole; label: string; email: string; Icon: React.ElementType }[] = [
  { role: 'INSTITUTION', label: 'Institution / Admin', email: 'admin@abcschool.edu', Icon: Building2 },
  { role: 'STUDENT', label: 'Student', email: 'gopika.sri@student.edu', Icon: GraduationCap },
  { role: 'VERIFIER', label: 'Employer / Verifier', email: 'verifier@talentcorp.com', Icon: Briefcase },
];

export const Login: React.FC = () => {
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email.trim(), password);
      if (remember) localStorage.setItem('rememberedEmail', email.trim());
      else localStorage.removeItem('rememberedEmail');
      navigate(dashboardFor(user.role));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setError(null);
    try {
      await switchDemoUser(role);
      navigate(dashboardFor(role));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Demo login failed. Is the backend running?');
    }
  };

  const inputCls =
    'w-full pl-11 pr-11 py-3.5 bg-[#f6f8fc] border border-[#d0def2] rounded-2xl text-[#121f32] text-sm placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-[#e7eef9]">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-[#d0def2] shadow-xl p-7 sm:p-9">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-normal text-[#121f32] tracking-tight">
            Veri<span className="italic text-[#38547a]">Cred</span>
          </h1>
          <p className="text-xs text-[#5c769b] mt-1">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-[#fdeeed] border border-[#f8cbc8] text-xs text-[#b92c28]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#243751] mb-2">Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7891b3] pointer-events-none" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username"
                autoComplete="username"
                className={inputCls}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#243751] mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7891b3] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputCls}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7891b3] hover:text-[#243751]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3a4f6d] cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-[#2563eb]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgot((s) => !s)}
              className="font-semibold text-[#2563eb] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {showForgot && (
            <div className="p-3 rounded-2xl bg-[#eff4fb] border border-[#d0def2] text-xs text-[#3a4f6d]">
              Please contact your institution administrator to reset your password.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-2xl text-base shadow-lg shadow-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#e7eef9]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7891b3]">
              Hackathon Demo Access
            </span>
            <span className="text-[10px] font-semibold text-[#2563eb] bg-[#e3ecfd] rounded-full px-2.5 py-1">
              1-Click Sign In
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {DEMO_ACCOUNTS.map(({ role, label, email: demoEmail, Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleDemo(role)}
                className="p-3 rounded-2xl bg-[#f6f8fc] hover:bg-[#e7eef9] border border-[#d0def2] flex flex-col items-center text-center transition-colors"
              >
                <Icon className="w-4 h-4 text-[#2563eb] mb-2" />
                <span className="font-semibold text-[#121f32] text-xs leading-tight">{label}</span>
                <span className="text-[10px] text-[#7891b3] mt-1 w-full truncate">{demoEmail}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#5c769b]">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-[#2563eb] hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};
