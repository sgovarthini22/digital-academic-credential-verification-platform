import React, { useState } from 'react';
import { ClipboardCheck, Search } from 'lucide-react';
import { TEST_SECTIONS } from '../utils/testCases';

const DEMO_ACCOUNTS = [
  { role: 'Institution / Admin', email: 'admin@abcschool.edu' },
  { role: 'Student', email: 'gopika.sri@student.edu' },
  { role: 'Employer / Verifier', email: 'verifier@talentcorp.com' },
];

const DEMO_IDS = [
  { id: 'CRED-2026-8F42A91D', result: 'VALID' },
  { id: 'CRED-2026-TAMPERDEMO', result: 'VALID → TAMPERED after demo tamper' },
  { id: 'CRED-2025-REVOKED7', result: 'REVOKED' },
  { id: 'CRED-2023-EXPIRED9', result: 'EXPIRED' },
  { id: 'CRED-NONEXISTENT-404', result: 'NOT FOUND' },
];

type Mark = '' | 'PASS' | 'FAIL';
const STORAGE_KEY = 'testCaseResults';

const loadMarks = (): Record<string, Mark> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const TestCases: React.FC = () => {
  const [marks, setMarks] = useState<Record<string, Mark>>(loadMarks);
  const [search, setSearch] = useState('');

  const setMark = (id: string, value: Mark) => {
    const next = { ...marks, [id]: value };
    setMarks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetAll = () => {
    setMarks({});
    localStorage.removeItem(STORAGE_KEY);
  };

  const all = TEST_SECTIONS.flatMap((s) => s.cases);
  const passed = all.filter((c) => marks[c.id] === 'PASS').length;
  const failed = all.filter((c) => marks[c.id] === 'FAIL').length;

  const q = search.toLowerCase();
  const matches = (c: (typeof all)[number]) =>
    !q ||
    c.id.toLowerCase().includes(q) ||
    c.scenario.toLowerCase().includes(q) ||
    c.steps.toLowerCase().includes(q) ||
    c.expected.toLowerCase().includes(q);

  return (
    <div className="min-h-screen bg-[#e7eef9] text-[#121f32] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#d0def2]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#121f32] tracking-tight flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-[#2563eb]" />
              <span>User Test Cases</span>
            </h1>
            <p className="text-xs text-[#3b6fd8] mt-1">
              {all.length} cases • Passed {passed} • Failed {failed} • Pending {all.length - passed - failed}
            </p>
          </div>
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#f3f7fc] border border-[#d0def2] text-xs font-medium text-[#202f44] transition-colors shadow-xs"
          >
            Reset Results
          </button>
        </div>

        {/* Test data */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#121f32] mb-3">Demo Accounts</h3>
            <p className="text-[11px] text-[#556e92] mb-3">
              Password for all: <span className="font-mono font-semibold text-[#121f32]">Password@123</span>
            </p>
            <div className="space-y-2 text-xs">
              {DEMO_ACCOUNTS.map((a) => (
                <div key={a.email} className="flex justify-between p-3 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]">
                  <span className="font-medium text-[#202f44]">{a.role}</span>
                  <span className="font-mono text-[#285773]">{a.email}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#c8d9f0] rounded-3xl p-6 shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#121f32] mb-3">Demo Credential IDs</h3>
            <div className="space-y-2 text-xs">
              {DEMO_IDS.map((d) => (
                <div key={d.id} className="flex justify-between gap-3 p-3 rounded-2xl bg-[#f6f8fc] border border-[#dbe6f5]">
                  <span className="font-mono text-[#285773]">{d.id}</span>
                  <span className="text-[#202f44] text-right">{d.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5c769b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test cases..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] placeholder:text-[#7891b3] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
          />
        </div>

        {TEST_SECTIONS.map((section) => {
          const cases = section.cases.filter(matches);
          if (cases.length === 0) return null;
          return (
            <div key={section.title} className="mb-8">
              <h2 className="font-serif text-2xl font-normal text-[#121f32] mb-3">{section.title}</h2>
              <div className="bg-white border border-[#c8d9f0] rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#f6f8fc] border-b border-[#dbe6f5] text-[#4b6486] uppercase font-sans text-[11px] font-semibold tracking-wide">
                        <th className="py-3.5 px-4">ID</th>
                        <th className="py-3.5 px-4">Scenario</th>
                        <th className="py-3.5 px-4">Steps</th>
                        <th className="py-3.5 px-4">Expected Result</th>
                        <th className="py-3.5 px-4">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7eef9]">
                      {cases.map((c) => {
                        const mark = marks[c.id] || '';
                        return (
                          <tr
                            key={c.id}
                            className={`align-top hover:bg-[#f3f7fc] transition-colors ${
                              mark === 'FAIL' ? 'bg-[#fdeeed]' : mark === 'PASS' ? 'bg-[#f3faf5]' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-semibold text-[#285773] whitespace-nowrap">{c.id}</td>
                            <td className="py-3.5 px-4 font-medium text-[#121f32]">{c.scenario}</td>
                            <td className="py-3.5 px-4 text-[#202f44] min-w-[260px]">{c.steps}</td>
                            <td className="py-3.5 px-4 text-[#202f44] min-w-[220px]">{c.expected}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={mark}
                                onChange={(e) => setMark(c.id, e.target.value as Mark)}
                                className="px-3 py-1.5 bg-white border border-[#d0def2] rounded-full text-xs text-[#121f32] focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                              >
                                <option value="">Pending</option>
                                <option value="PASS">Pass</option>
                                <option value="FAIL">Fail</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
