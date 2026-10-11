import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { CaptchaCanvas } from '../components/CaptchaCanvas';
import { Role } from '../types';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Calendar,
  Lock,
  User,
  AlertCircle,
  FileText,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface LoginPageProps {
  initialRole?: Role;
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole = 'student', onNavigate }) => {
  const { login, circulars, academicYear, setAcademicYear } = usePortal();

  // Role toggle: 'student' | 'faculty' | 'admin'
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  const [username, setUsername] = useState(() => {
    if (initialRole === 'admin') return 'ADMIN';
    if (initialRole === 'faculty') return 'FAC001';
    return 'SRU2024001';
  });

  const [password, setPassword] = useState(() => {
    if (initialRole === 'admin') return 'admin123';
    if (initialRole === 'faculty') return 'faculty123';
    return 'student123';
  });

  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleToggle = (newRole: Role) => {
    setSelectedRole(newRole);
    setErrorMsg('');
    if (newRole === 'admin') {
      setUsername('ADMIN');
      setPassword('admin123');
    } else if (newRole === 'faculty') {
      setUsername('FAC001');
      setPassword('faculty123');
    } else {
      setUsername('SRU2024001');
      setPassword('student123');
    }
  };

  const handleQuickFill = (role: Role, user: string, pass: string) => {
    setSelectedRole(role);
    setUsername(user);
    setPassword(pass);
    setCaptchaInput(generatedCaptcha);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verify Captcha
    if (captchaInput.trim().toUpperCase() !== generatedCaptcha.trim().toUpperCase()) {
      setErrorMsg('Invalid CAPTCHA code. Please enter the characters shown in the canvas.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Please enter your Username / ID / Roll No.');
      return;
    }

    const result = login(selectedRole, username, password);
    if (result.success) {
      if (selectedRole === 'student') {
        onNavigate('/student/dashboard');
      } else if (selectedRole === 'faculty') {
        onNavigate('/faculty/attendance');
      } else {
        onNavigate('/admin/dashboard');
      }
    } else {
      setErrorMsg(result.message || 'Login failed. Please verify your credentials or account status.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/70 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Quick Demo Credentials Bar */}
        <div className="bg-white border border-blue-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-[#1A3B70]">Quick Demo 1-Click Access:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student', 'SRU2024001', 'student123')}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1A3B70] border border-blue-300 rounded font-medium transition-colors flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
              <span>Student: <strong>SRU2024001</strong></span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('faculty', 'FAC001', 'faculty123')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium transition-colors flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Faculty: <strong>FAC001</strong></span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'ADMIN', 'admin123')}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded font-medium transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Admin: <strong>ADMIN</strong></span>
            </button>
          </div>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Left Column: Login Form */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              {/* Login Title & Portal Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 text-[#1A3B70] font-serif font-black text-xl">
                  <span>SR UNIVERSITY</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  Single Sign-On Authentication
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure access for Students, Faculty (200 Members), and Administrators
                </p>
              </div>

              {/* 3-Way Role Toggle: Student vs Faculty vs Admin */}
              <div className="bg-slate-100 p-1 rounded-lg grid grid-cols-3 gap-1 mb-5 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('student')}
                  className={`py-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                    selectedRole === 'student'
                      ? 'bg-[#1A3B70] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleToggle('faculty')}
                  className={`py-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                    selectedRole === 'faculty'
                      ? 'bg-[#1A3B70] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleToggle('admin')}
                  className={`py-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Academic Year Dropdown for Staff View */}
                {selectedRole === 'faculty' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#1A3B70]" />
                      <span>Academic Year</span>
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] focus:border-[#1A3B70] outline-none bg-white font-medium"
                    >
                      <option value="2024-25">2024-25 (Current Academic Session)</option>
                      <option value="2025-26">2025-26 (Upcoming Academic Session)</option>
                      <option value="2023-24">2023-24 (Previous Session)</option>
                    </select>
                  </div>
                )}

                {/* Username / Roll No / ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#1A3B70]" />
                    <span>
                      {selectedRole === 'student'
                        ? 'Enrollment No / Student Roll No'
                        : selectedRole === 'faculty'
                        ? 'Faculty ID / Username (FAC001–FAC200)'
                        : 'Administrator Username (ADMIN)'}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. SRU2024001 or 25CSE0101'
                        : selectedRole === 'faculty'
                        ? 'e.g. FAC001'
                        : 'e.g. ADMIN'
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] focus:border-[#1A3B70] outline-none font-mono uppercase"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {selectedRole === 'student'
                      ? 'Default password: student123 (Changeable via Student Portal)'
                      : selectedRole === 'faculty'
                      ? '200 Faculty accounts across all departments (Default: faculty123)'
                      : 'Full control over batches, credentials, and live monitoring'}
                  </span>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#1A3B70]" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] focus:border-[#1A3B70] outline-none"
                    required
                  />
                </div>

                {/* Interactive Dynamic CAPTCHA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Security Verification (CAPTCHA)
                  </label>
                  <CaptchaCanvas
                    captchaCode={captchaInput}
                    setCaptchaCode={setCaptchaInput}
                    onCaptchaGenerated={setGeneratedCaptcha}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Type the 5 characters shown above in the box
                  </span>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  className={`w-full py-2.5 px-4 text-white font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-2 ${
                    selectedRole === 'admin'
                      ? 'bg-purple-700 hover:bg-purple-800'
                      : 'bg-[#1A3B70] hover:bg-[#0F2C59]'
                  }`}
                >
                  <span>
                    {selectedRole === 'student'
                      ? 'Sign In to Student Portal'
                      : selectedRole === 'faculty'
                      ? 'Sign In to Faculty Portal'
                      : 'Sign In to Admin Control Panel'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 text-[11px] text-slate-500 flex items-center justify-between">
              <span>SRU ERP Portal v5.0</span>
              <button
                type="button"
                onClick={() => handleRoleToggle('admin')}
                className="text-[#1A3B70] hover:underline font-semibold"
              >
                Administrator Access →
              </button>
            </div>
          </div>

          {/* Right Column: Split Layout */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between">
            {selectedRole === 'student' ? (
              /* Student View: Circulars Table */
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1A3B70]" />
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                      Latest Notifications & Circulars
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Updated Daily
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1A3B70] text-white font-semibold uppercase text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                        <th className="py-2.5 px-3 w-28">Date</th>
                        <th className="py-2.5 px-3">Notification / Subject</th>
                        <th className="py-2.5 px-3 w-28">Department</th>
                        <th className="py-2.5 px-3 w-14 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {circulars.map((circ, idx) => (
                        <tr key={circ.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {circ.date}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800">
                            <div className="flex items-center gap-1.5">
                              {circ.is_new && (
                                <span className="bg-red-500 text-white font-bold text-[9px] px-1 py-0.2 rounded uppercase shrink-0">
                                  NEW
                                </span>
                              )}
                              <span className="font-medium">{circ.title}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                            {circ.department}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-[#1A3B70] hover:text-blue-800 cursor-pointer inline-flex items-center">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Statutory Attendance Rule:</strong> Minimum 75% attendance in aggregate across all registered courses is strictly required to be eligible for End-Semester Examinations.
                  </div>
                </div>
              </div>
            ) : selectedRole === 'faculty' ? (
              /* Staff View: Faculty Information */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1A3B70]" />
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                      Faculty Attendance & Teaching Log Portal
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    200 Faculty Active
                  </span>
                </div>

                <div className="bg-gradient-to-r from-[#1A3B70] to-[#0F2C59] text-white p-5 rounded-lg shadow-sm">
                  <h4 className="text-base font-bold text-amber-300">
                    Slot-wise Attendance & Daily Session Log
                  </h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Faculty members can mark single or multiple slot blocks, select class type (Lecture / Tutorial / Practical Lab), and record what was taught today. Password can be updated directly from the Faculty Portal.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">200</span>
                      <span className="text-[10px] text-blue-200">Faculty Staff</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">216</span>
                      <span className="text-[10px] text-blue-200">Total Batches</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">6,480</span>
                      <span className="text-[10px] text-blue-200">Students Enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
                  <h5 className="font-bold text-[#1A3B70]">Faculty Portal Features:</h5>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                    <li>Multi-slot selection (e.g. Slot I + Slot II for 2-hour labs).</li>
                    <li>Class classification: Lecture (L), Tutorial (T), Practical Lab (P).</li>
                    <li>Session Teaching Notes: "What was taught today" summary.</li>
                    <li>Password Management: Change password securely at any time.</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Admin View: Overview of Administrator Controls */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-700" />
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                      Administrator Oversight & Control Center
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Admin Portal
                  </span>
                </div>

                <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 rounded-lg shadow-sm">
                  <h4 className="text-base font-bold text-amber-300">
                    Real-Time Attendance Monitoring & Credential Governance
                  </h4>
                  <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                    Full supervisory control to add/remove batches, view live completed classes saved by faculty, assign login credentials, reset passwords, and revoke accounts.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-300 text-base">Full</span>
                      <span className="text-[10px] text-purple-200">Batch Control</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-300 text-base">Real-Time</span>
                      <span className="text-[10px] text-purple-200">Live Sync</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-300 text-base">Pass Reset</span>
                      <span className="text-[10px] text-purple-200">User Security</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
                  <h5 className="font-bold text-purple-800">Admin Privileges:</h5>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                    <li>Create & delete batches across all 7 engineering departments.</li>
                    <li>Assign or revoke faculty and student login accounts instantly.</li>
                    <li>Reset user passwords or assign custom usernames.</li>
                    <li>Live attendance monitor: track completed classes and teaching notes in real time.</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <span>SR University IT Helpdesk: Ext. 402 / erp@sru.edu.in</span>
              <span className="text-[#1A3B70] font-medium">Monday - Saturday (9:00 AM - 5:00 PM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
