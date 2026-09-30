import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sliders,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleDemoSwitch = async (role: UserRole) => {
    await switchDemoUser(role);
    setShowRoleMenu(false);
    if (role === 'INSTITUTION') navigate('/admin/dashboard');
    else if (role === 'STUDENT') navigate('/student/dashboard');
    else if (role === 'VERIFIER') navigate('/verifier/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#e7eef9]/90 border-b border-[#d0def2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand - Elegant Serif Wordmark matching screenshot */}
          <div className="flex items-center gap-8">
            <Link to={user ? '/home' : '/'} className="flex items-center gap-2 group">
              <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#121f32]">
                Veri<span className="italic font-serif text-[#38547a]">Cred</span>
              </span>
            </Link>

            {/* Main Nav Links matching screenshot */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#3a4f6d]">
              <Link
                to="/home"
                className={`hover:text-[#121f32] transition-colors ${
                  isActive('/home') ? 'text-[#121f32] font-semibold' : ''
                }`}
              >
                Overview
              </Link>

              <Link
                to="/verify"
                className={`hover:text-[#121f32] transition-colors ${
                  isActive('/verify') ? 'text-[#121f32] font-semibold' : ''
                }`}
              >
                Verification
              </Link>

              <Link
                to="/verifier/bulk-verification"
                className={`hover:text-[#121f32] transition-colors ${
                  isActive('/verifier/bulk-verification') ? 'text-[#121f32] font-semibold' : ''
                }`}
              >
                Bulk Verify
              </Link>

              <Link
                to="/test-cases"
                className={`hover:text-[#121f32] transition-colors ${
                  isActive('/test-cases') ? 'text-[#121f32] font-semibold' : ''
                }`}
              >
                Test Cases
              </Link>

              {user?.role === 'INSTITUTION' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/admin/dashboard') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Institution Portal
                  </Link>
                  <Link
                    to="/admin/credentials"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/admin/credentials') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Registry
                  </Link>
                  <Link
                    to="/admin/history"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/admin/history') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Audit Trail
                  </Link>
                </>
              )}

              {user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/student/dashboard') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    My Credentials
                  </Link>
                  <Link
                    to="/student/passport"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/student/passport') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Credential Passport
                  </Link>
                  <Link
                    to="/student/history"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/student/history') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    History
                  </Link>
                </>
              )}

              {user?.role === 'VERIFIER' && (
                <>
                  <Link
                    to="/verifier/dashboard"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/verifier/dashboard') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Verifier Workspace
                  </Link>
                  <Link
                    to="/verifier/history"
                    className={`hover:text-[#121f32] transition-colors ${
                      isActive('/verifier/history') ? 'text-[#121f32] font-semibold' : ''
                    }`}
                  >
                    Screening Log
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Tools matching screenshot button style */}
          <div className="flex items-center gap-3">
            {/* Language Toggle [ EN | தமிழ் ] */}
            <div className="flex items-center bg-[#d5e2f5] rounded-full p-0.5 border border-[#bdd2ef] text-[11px]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 font-medium rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-[#3a4f6d] hover:text-[#121f32]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-0.5 font-medium rounded-full transition-all ${
                  language === 'ta'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-[#3a4f6d] hover:text-[#121f32]'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Instant Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#dae6f7] hover:bg-[#cbdaf0] text-[#243751] rounded-full border border-[#bdd2ef] transition-colors"
              >
                <Sliders className="w-3 h-3 text-[#2563eb]" />
                <span>Role: {user ? user.role : 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-[#4d6688]" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#cbdaf0] shadow-xl py-1 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 border-b border-[#e8eff9] text-[10px] font-semibold text-[#50698d] uppercase tracking-wider">
                    Instant Demo Switcher
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('INSTITUTION')}
                    className="w-full text-left px-3 py-2 text-xs text-[#202f44] hover:bg-[#eff4fb] flex items-center justify-between"
                  >
                    <span>🏫 Institution Admin</span>
                    <span className="text-[10px] text-[#2563eb]">ABC School</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('STUDENT')}
                    className="w-full text-left px-3 py-2 text-xs text-[#202f44] hover:bg-[#eff4fb] flex items-center justify-between"
                  >
                    <span>🎓 Student</span>
                    <span className="text-[10px] text-[#226835]">Gopika Sri</span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('VERIFIER')}
                    className="w-full text-left px-3 py-2 text-xs text-[#202f44] hover:bg-[#eff4fb] flex items-center justify-between"
                  >
                    <span>🔍 Authorized Verifier</span>
                    <span className="text-[10px] text-[#285773]">TCS Talent</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button - Pill Style matching "Start for Free" in screenshot */}
            <Link
              to="/verify"
              className="px-5 py-2 text-xs font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full shadow-xs transition-colors whitespace-nowrap"
            >
              Verify Credential
            </Link>

            {user ? (
              <button
                onClick={logout}
                className="p-1.5 rounded-full hover:bg-[#cbdaf0] text-[#2563eb] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs font-medium text-[#3a4f6d] hover:text-[#121f32] px-2 py-1"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
