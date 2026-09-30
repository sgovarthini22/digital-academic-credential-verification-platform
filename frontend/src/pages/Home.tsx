import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Search,
  Building2,
  GraduationCap,
  Calendar,
  Check,
  Star,
  Layers,
  Sparkles,
  SlidersHorizontal,
  Bell,
  User,
  Clock,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { TamperDemoBanner } from '../components/TamperDemoBanner';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32]">
      {/* Live Tampering Demo Simulation Control */}
      <TamperDemoBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HERO CONTAINER - Soft curved sage canvas matching screenshot */}
        <section className="rounded-[2.5rem] bg-gradient-to-b from-[#cbdcf4] via-[#e6effb] to-[#f9fcff] border border-[#c8d9f0] p-6 sm:p-12 shadow-sm mb-16 relative overflow-hidden">
          
          {/* Hero Header & Headline */}
          <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#121f32] leading-[1.1] mb-5">
              Authentic Credentials Start with{' '}
              <span className="italic font-serif font-normal text-[#1e40af]">
                Effortless Verification
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#3b5b9a] font-normal leading-relaxed max-w-xl mx-auto mb-8">
              Issuance, tamper detection, student consent, and performance insights — all in one beautifully simple platform.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Link
                to="/verify"
                className="px-8 py-3.5 text-xs sm:text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full shadow-xs hover:shadow-md transition-all whitespace-nowrap"
              >
                Verify Credential Free
              </Link>
            </div>
          </div>

          {/* MARQUEE DASHBOARD CARD MOCKUP - Exactly as depicted in screenshot */}
          <div className="bg-white/95 rounded-[2rem] border border-[#cbdaf0] shadow-2xl p-4 sm:p-7 max-w-5xl mx-auto backdrop-blur-md">
            {/* Mockup Topbar */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#e7eef9]">
              <div className="flex items-center gap-6">
                <span className="font-serif text-xl font-medium tracking-tight text-[#121f32]">
                  VeriCred
                </span>

                {/* Segmented Controls / Filter Tabs */}
                <div className="hidden md:flex items-center bg-[#eef3fa] rounded-full p-1 border border-[#d5e2f5] text-[11px] font-medium text-[#2563eb]">
                  {['Overview', 'Registry', 'Issuance', 'Operations', 'Analytics'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-full transition-all ${
                        activeTab === tab
                          ? 'bg-white text-[#121f32] shadow-xs font-semibold'
                          : 'text-[#4d6688] hover:text-[#121f32]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Mockup Icons */}
              <div className="flex items-center gap-2 text-[#5c769b]">
                <div className="w-7 h-7 rounded-full bg-[#eef3fa] flex items-center justify-center text-xs">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-[#eef3fa] flex items-center justify-center text-xs">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-medium">
                  AS
                </div>
              </div>
            </div>

            {/* Mockup Dashboard Content Grid (3 Columns matching screenshot) */}
            <div className="grid lg:grid-cols-12 gap-5">
              
              {/* Left Column: Featured Certificate & Operations (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Image Card */}
                <div className="relative rounded-2xl overflow-hidden border border-[#d7e4f7] bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] h-44 group">
                  <div className="absolute inset-0 p-4 h-full flex flex-col justify-between text-white">
                    <div className="text-[11px] font-sans font-medium text-white/90">
                      Wed, May 27 • 9:45 AM
                    </div>
                    <div>
                      <div className="font-serif text-lg font-medium leading-tight">
                        Academic Registry & Degrees
                      </div>
                      <div className="text-[11px] text-white/80 mt-0.5">
                        ABC Higher Secondary & Technology Academy
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations Checklist Card */}
                <div className="p-4 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e2eaf6]">
                    <span className="font-semibold text-[#121f32]">Registry Status</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#e8f4ec] text-[#226835] border border-[#cbe6d0]">
                      Active ✓
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#3b6fd8]">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                      <span>Integrity Audit</span>
                    </span>
                    <span className="font-medium text-[#121f32]">On Schedule</span>
                  </div>

                  <div className="flex justify-between items-center text-[#3b6fd8]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                      <span>Tamper Detection</span>
                    </span>
                    <span className="font-medium text-[#226835]">100% Intact</span>
                  </div>

                  <div className="flex justify-between items-center text-[#3b6fd8]">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2563eb]" />
                      <span>Credentials Issued</span>
                    </span>
                    <span className="font-medium text-[#121f32]">128 Total</span>
                  </div>

                  <div className="flex justify-between items-center text-[#3b6fd8]">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" />
                      <span>Student Consent</span>
                    </span>
                    <span className="font-medium text-[#121f32]">All Clear</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Daily Trend & Satisfaction (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Nightly/Daily Verification Trend Card */}
                <div className="p-4 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-xs text-[#121f32]">Verification Trend</span>
                    <span className="text-[10px] text-[#556e91] bg-white px-2 py-0.5 rounded-full border border-[#d5e2f5]">
                      Monthly ▾
                    </span>
                  </div>

                  {/* Bar Chart Representation matching screenshot */}
                  <div className="h-28 flex items-end justify-between gap-1.5 pt-4 pb-1 px-1 border-b border-[#e0eaf7]">
                    {[45, 68, 92, 54, 85, 110, 78, 96, 62, 105, 88, 120].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-[#5f80af] rounded-t-sm transition-all hover:bg-[#2563eb]"
                          style={{ height: `${(h / 120) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#5a7499] pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#5f80af]" />
                      <span>Daily Lookups</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#b7cdeb]" />
                      <span>QR Scans</span>
                    </div>
                  </div>
                </div>

                {/* 2 Small Stat Boxes */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]">
                    <div className="text-[10px] text-[#556e92] font-medium">Employer Satisfaction</div>
                    <div className="text-xl font-bold font-serif text-[#121f32] mt-1">98%</div>
                    <div className="text-[10px] text-[#226835] font-medium flex items-center gap-0.5 mt-0.5">
                      <span>↑ 3%</span> <span>this month</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]">
                    <div className="text-[10px] text-[#556e92] font-medium">Avg Verification Time</div>
                    <div className="text-xl font-bold font-serif text-[#121f32] mt-1">42ms</div>
                    <div className="text-[10px] text-[#226835] font-medium flex items-center gap-0.5 mt-0.5">
                      <span>✓ 99.8%</span> <span>instant</span>
                    </div>
                  </div>
                </div>

                {/* Trend line preview */}
                <div className="p-3.5 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-[#556e92] font-medium">Integrity Consistency</div>
                    <div className="font-semibold text-[#121f32] mt-0.5">Zero Unresolved Disputes</div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#2563eb]" />
                </div>
              </div>

              {/* Right Column: Occupancy Rate / Integrity Gauge (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Arc Gauge Card matching screenshot */}
                <div className="p-4 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] text-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-[#121f32]">Integrity Rate</span>
                    <span className="text-[10px] text-[#556e91] bg-white px-2 py-0.5 rounded-full border border-[#d5e2f5]">
                      Monthly ▾
                    </span>
                  </div>

                  {/* Semicircle Gauge Visual */}
                  <div className="relative w-36 h-20 mx-auto mt-2 overflow-hidden">
                    <div className="w-36 h-36 rounded-full border-[10px] border-[#d7e5f8] border-t-[#2563eb] border-r-[#2563eb] border-l-[#2563eb] absolute top-0 left-0" />
                    <div className="absolute bottom-0 inset-x-0 text-center">
                      <span className="text-2xl font-bold font-serif text-[#121f32]">100%</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#226835] font-medium mt-1">
                    ✓ 0% Tamper Breaches
                  </div>

                  {/* Available / Occupied Stats matching screenshot */}
                  <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[#e0eaf7] text-[10px]">
                    <div>
                      <div className="text-[#5b759a]">Issued</div>
                      <div className="font-bold text-xs text-[#121f32] mt-0.5">312</div>
                    </div>
                    <div>
                      <div className="text-[#5b759a]">Active</div>
                      <div className="font-bold text-xs text-[#226835] mt-0.5">245</div>
                    </div>
                    <div>
                      <div className="text-[#5b759a]">Revoked</div>
                      <div className="font-bold text-xs text-[#b05b10] mt-0.5">6</div>
                    </div>
                  </div>
                </div>

                {/* Operations Overview Progress Bars matching screenshot */}
                <div className="p-4 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5] space-y-2.5 text-xs">
                  <div className="font-semibold text-xs text-[#121f32] pb-1 border-b border-[#e7eef9]">
                    Operations Overview
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#3b5b9a]">Degrees Ready</span>
                      <span className="font-medium text-[#121f32]">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#dae6f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563eb] rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#3b5b9a]">SHA-256 Check</span>
                      <span className="font-medium text-[#226835]">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#dae6f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#226835] rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#3b5b9a]">Student Consent Active</span>
                      <span className="font-medium text-[#121f32]">92%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#dae6f7] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5f80af] rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 - "Stay in control of every property" (matching lower part of screenshot) */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#121f32] leading-tight mb-3">
              Stay in control of{' '}
              <span className="italic font-serif font-normal text-[#1e40af]">
                every credential
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#405879] leading-relaxed">
              Manage availability, tamper detection, and verification logs from one connected workspace — keeping every institution and student on track.
            </p>
          </div>

          {/* 3 Luxury Cards in a Row (Calendar, Verified Properties/Profile, Team Tasks) */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1: Reservation & Issuance Calendar matching screenshot */}
            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-sm flex flex-col justify-between hover:border-[#bdcee7] transition-colors">
              <div>
                {/* Mini Calendar UI */}
                <div className="bg-[#f6f8fc] border border-[#dbe6f5] rounded-2xl p-4 mb-5">
                  <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-medium text-[#5c769b] mb-2">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-[11px] text-center">
                    <span className="text-[#8ca7cc]">27</span>
                    <span className="text-[#8ca7cc]">28</span>
                    <span className="text-[#8ca7cc]">29</span>
                    <span className="text-[#8ca7cc]">30</span>
                    <span className="font-medium text-[#121f32]">1</span>
                    <span className="font-medium text-[#121f32]">2</span>
                    <span className="font-medium text-[#121f32]">3</span>
                    <span className="font-medium text-[#121f32]">4</span>
                    <span className="font-medium text-[#121f32]">5</span>
                    <span className="font-medium text-[#121f32]">6</span>
                    <span className="font-medium text-[#121f32] bg-[#d7e5f8] rounded-full w-6 h-6 flex items-center justify-center mx-auto">7</span>
                    <span className="font-medium text-[#121f32]">8</span>
                    <span className="font-medium text-[#121f32]">9</span>
                    <span className="font-medium text-[#121f32]">10</span>
                    <span className="font-medium text-[#121f32]">11</span>
                    <span className="font-medium text-[#121f32]">12</span>
                    <span className="font-medium text-[#121f32]">13</span>
                    <span className="font-medium text-white bg-[#2563eb] rounded-full w-6 h-6 flex items-center justify-center mx-auto shadow-xs">14</span>
                    <span className="font-medium text-[#121f32]">15</span>
                    <span className="font-medium text-[#121f32]">16</span>
                    <span className="font-medium text-[#121f32]">17</span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif text-lg font-medium text-[#121f32] mb-1">
                    Issuance Calendar
                  </h3>
                  <p className="text-xs text-[#465d7e] leading-relaxed">
                    Keep every degree issuance, board validation, and graduation batch organized in one clear view.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Verified Properties / Student Passport matching screenshot */}
            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-sm flex flex-col justify-between hover:border-[#bdcee7] transition-colors">
              <div>
                <div className="bg-[#f6f8fc] border border-[#dbe6f5] rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-serif text-2xl font-bold text-[#121f32]">4.8</span>
                    <div className="flex text-[#b88c38] text-xs">
                      ★★★★★
                    </div>
                    <span className="text-[10px] text-[#5a7499]">from 320 verifications</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#e0eaf7] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      GS
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#121f32]">Gopika Sri</div>
                      <div className="text-[10px] text-[#5a7499]">Higher Secondary & B.Tech Candidate</div>
                      <p className="text-[11px] text-[#3b506e] mt-1 italic">
                        &quot;An absolutely seamless verification. My credentials were cryptographically confirmed in milliseconds.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif text-lg font-medium text-[#121f32] mb-1">
                    Available Credentials
                  </h3>
                  <p className="text-xs text-[#465d7e] leading-relaxed">
                    See credential validity status, cryptographic proof, and student consent permissions at a glance.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Team Tasks & Compliance Checklist matching screenshot */}
            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-sm flex flex-col justify-between hover:border-[#bdcee7] transition-colors">
              <div>
                <div className="bg-[#f6f8fc] border border-[#dbe6f5] rounded-2xl p-4 mb-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e0eaf7]">
                    <span className="flex items-center gap-2 text-[#202f44]">
                      <Check className="w-3.5 h-3.5 text-[#226835]" />
                      <span>Batch verification</span>
                    </span>
                    <span className="text-[10px] text-[#5a7499]">9/9</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e0eaf7]">
                    <span className="flex items-center gap-2 text-[#202f44]">
                      <Check className="w-3.5 h-3.5 text-[#226835]" />
                      <span>SHA-256 hash anchoring</span>
                    </span>
                    <span className="text-[10px] text-[#5a7499]">5/5</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e0eaf7]">
                    <span className="flex items-center gap-2 text-[#465d7e]">
                      <div className="w-3 h-3 rounded-sm border border-[#90abd2]" />
                      <span>Restock certificate formats</span>
                    </span>
                    <span className="text-[10px] text-[#5a7499]">1/4</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e0eaf7]">
                    <span className="flex items-center gap-2 text-[#465d7e]">
                      <div className="w-3 h-3 rounded-sm border border-[#90abd2]" />
                      <span>Inspect student consent policy</span>
                    </span>
                    <span className="text-[10px] text-[#5a7499]">0/2</span>
                  </div>

                  <div className="pt-2 text-[10px] text-[#5a7499] flex items-center justify-between">
                    <span>4 verifier teams active</span>
                    <span className="w-2 h-2 rounded-full bg-[#226835]" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-serif text-lg font-medium text-[#121f32] mb-1">
                    Team Tasks & Integrity
                  </h3>
                  <p className="text-xs text-[#465d7e] leading-relaxed">
                    Coordinate issuance, setup, and daily verification tasks across every academic department.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3 - "Everything you need, nothing you don't" (matching right page of screenshot) */}
        <section className="mb-20 p-8 sm:p-12 rounded-[2.5rem] bg-white border border-[#d0def2] shadow-sm">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Feature List */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] leading-tight mb-3">
                  Everything you need,{' '}
                  <span className="italic font-serif text-[#1e40af]">nothing you don&apos;t</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#465d7e]">
                  Built specifically to eliminate certificate fraud, manual paperwork, and delayed background screening.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#121f32]">Stay in control</h4>
                    <p className="text-xs text-[#465d7e] mt-0.5 leading-relaxed">
                      See what&apos;s happening across every degree — from active credentials and verification queries to housekeeping and tamper alerts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#121f32]">Work smarter</h4>
                    <p className="text-xs text-[#465d7e] mt-0.5 leading-relaxed">
                      Coordinate academic issuance, monitor tamper readiness, and keep every operational task moving without jumping between paper tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#e7eef9] text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#121f32]">Know what&apos;s working</h4>
                    <p className="text-xs text-[#465d7e] mt-0.5 leading-relaxed">
                      Follow verification volume, tamper alerts, average screening duration, and student privacy sentiments with clear insights built for faster decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/verifier/bulk-verification"
                  className="inline-block px-7 py-3 text-xs font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-full shadow-xs transition-colors"
                >
                  Try VeriCred Free
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Visual Card with Pins matching screenshot */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-[#c8d9f0] bg-[#f6f8fc] shadow-md">
                <div className="w-full h-80 bg-gradient-to-br from-[#dbeafe] via-[#93c5fd] to-[#2563eb]" />
                
                {/* Floating Pin Pill 1 */}
                <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#d0def2] shadow-lg flex items-center gap-2 text-xs font-medium text-[#121f32]">
                  <span className="w-2 h-2 rounded-full bg-[#226835]" />
                  <span>Credential Integrity</span>
                  <span className="font-bold font-serif text-[#226835]">100%</span>
                </div>

                {/* Floating Pin Pill 2 */}
                <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#d0def2] shadow-lg flex items-center gap-2 text-xs font-medium text-[#121f32]">
                  <QrCode className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>QR Signature</span>
                  <span className="text-[11px] text-[#3b6fd8]">Verified Instantly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - Testimonial Grid matching screenshot */}
        <section className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] leading-tight mb-2">
              Exceptional credentials, powered by{' '}
              <span className="italic font-serif text-[#1e40af]">VeriCred</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#465d7e]">
              From prestigious state universities to global tech recruiters, VeriCred helps teams verify credentials effortlessly in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-medium">
                  JC
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#121f32]">James Carter</div>
                  <div className="text-[10px] text-[#5a7499]">Registrar & Academic Dean</div>
                </div>
              </div>
              <p className="text-xs text-[#394f6d] leading-relaxed">
                &quot;VeriCred gives us a much clearer view of what&apos;s happening across our certificates. From registration to issuance, everything feels organized and easy to manage.&quot;
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#253f64] text-white flex items-center justify-center text-xs font-medium">
                  DK
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#121f32]">David Kim</div>
                  <div className="text-[10px] text-[#5a7499]">Recruitment Director</div>
                </div>
              </div>
              <p className="text-xs text-[#394f6d] leading-relaxed">
                &quot;We were up and running incredibly fast, and the transition felt smooth from day one. Bulk CSV verification saves us hours of manual emailing every single week.&quot;
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#d0def2] shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#4d6a92] text-white flex items-center justify-center text-xs font-medium">
                  EZ
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#121f32]">Emily Zhao</div>
                  <div className="text-[10px] text-[#5a7499]">Head of Talent Screening</div>
                </div>
              </div>
              <p className="text-xs text-[#394f6d] leading-relaxed">
                &quot;What I love most is how simple everything feels. We can track candidates, verify marksheets, and detect unapproved alterations without friction.&quot;
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Elegant Quiet Footer */}
      <footer className="border-t border-[#cbdaf0] py-8 text-xs text-[#4b6486] bg-[#e0eaf8]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium text-[#121f32]">
              VeriCred
            </span>
            <span className="text-[#738cb0]">·</span>
            <span>Digital Academic Credential Verification Platform</span>
          </div>
          <div>
            Built with React, Express, PostgreSQL, Node.js SHA-256, and QR Code Signatures.
          </div>
          <div className="text-[#5e799f]">
            Adhoc Softwares Prototype • 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
