import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { CaptchaCanvas } from '../components/CaptchaCanvas';
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
  initialRole?: 'student' | 'faculty' | 'admin';
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole = 'student', onNavigate }) => {
  const { login, circulars, academicYear, setAcademicYear } = usePortal();

  // Role toggle: 'student' | 'faculty'
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty'>(
    initialRole === 'faculty' ? 'faculty' : 'student'
  );

  const [username, setUsername] = useState(
    initialRole === 'faculty' ? 'FAC001' : 'SRU2024001'
  );
  const [password, setPassword] = useState('student123');
  const [captchaInput, setCaptchaInput] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleToggle = (newRole: 'student' | 'faculty') => {
    setSelectedRole(newRole);
    setErrorMsg('');
    if (newRole === 'faculty') {
      setUsername('FAC001');
      setPassword('faculty123');
    } else {
      setUsername('SRU2024001');
      setPassword('student123');
    }
  };

  const handleQuickFill = (role: 'student' | 'faculty' | 'admin', user: string, pass: string) => {
    if (role === 'admin') {
      login('admin', 'ADMIN');
      onNavigate('/admin/dashboard');
      return;
    }
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
      setErrorMsg('Please enter your Enrollment No / Username');
      return;
    }

    const success = login(selectedRole, username, password);
    if (success) {
      if (selectedRole === 'student') {
        onNavigate('/student/dashboard');
      } else {
        onNavigate('/faculty/attendance');
      }
    } else {
      setErrorMsg('User not found. Please check your credentials or click a quick demo login.');
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
              <div className="mb-6">
                <div className="flex items-center gap-2 text-[#1A3B70] font-serif font-black text-xl">
                  <span>SR UNIVERSITY</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  Single Sign-On Authentication
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to access Attendance, Academics & Performance Analytics
                </p>
              </div>

              {/* Role Toggle Switch: Student vs Staff */}
              <div className="bg-slate-100 p-1 rounded-lg flex items-center mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('student')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'student'
                      ? 'bg-[#1A3B70] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleToggle('faculty')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'faculty'
                      ? 'bg-[#1A3B70] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Staff Login</span>
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

                {/* Username / Enrollment No */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#1A3B70]" />
                    <span>
                      {selectedRole === 'student' ? 'Enrollment No / Roll No' : 'Staff Employee ID / Username'}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={selectedRole === 'student' ? 'e.g. SRU2024001' : 'e.g. FAC001'}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] focus:border-[#1A3B70] outline-none font-mono uppercase"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {selectedRole === 'student'
                      ? '100 student records available (SRU2024001 to SRU2024100)'
                      : 'Faculty ID: FAC001 (Dr. Venkataswamy) or FAC002, FAC003'}
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
                    placeholder="Enter your password"
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
                    Type the 5 characters shown above in the box (case insensitive)
                  </span>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-2"
                >
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 text-[11px] text-slate-500 flex items-center justify-between">
              <span>SRU ERP Portal v3.4.2</span>
              <button
                type="button"
                onClick={() => {
                  login('admin', 'ADMIN');
                  onNavigate('/admin/dashboard');
                }}
                className="text-[#1A3B70] hover:underline font-semibold"
              >
                Admin Portal Login →
              </button>
            </div>
          </div>

          {/* Right Column: Split Layout (Circulars for Student OR Staff Banner for Staff) */}
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
                    <strong>Statutory Attendance Rule:</strong> Minimum 75% attendance in aggregate across all registered theory & laboratory courses is strictly required to be eligible for End-Semester Examinations.
                  </div>
                </div>
              </div>
            ) : (
              /* Staff View: Faculty Banner & Guidelines */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1A3B70]" />
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                      Faculty Attendance Guidelines & Information
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Staff Portal
                  </span>
                </div>

                {/* Staff Banner Card */}
                <div className="bg-gradient-to-r from-[#1A3B70] to-[#0F2C59] text-white p-5 rounded-lg shadow-sm">
                  <h4 className="text-base font-bold text-amber-300">
                    Real-time Slot-wise Attendance Submission
                  </h4>
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Faculty members must submit student attendance for every assigned period (Slots I through VIII) within 15 minutes of lecture completion. Dynamic batch filtering allows marking individual lab and lecture sections.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">8</span>
                      <span className="text-[10px] text-blue-200">Daily Slots</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">100</span>
                      <span className="text-[10px] text-blue-200">Total Enrolled</span>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <span className="block font-black text-amber-400 text-base">3</span>
                      <span className="text-[10px] text-blue-200">Lab Batches</span>
                    </div>
                  </div>
                </div>

                {/* Important Staff Reminders */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-xs text-slate-700">
                  <h5 className="font-bold text-[#1A3B70]">Daily Checklist for Faculty:</h5>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                    <li>Select designated Department & Year/Semester before marking roster.</li>
                    <li>Choose specific <strong>Batch (e.g. 25CAIBTAIB01)</strong> for lab hours or <strong>All Batches</strong> for combined lectures.</li>
                    <li>Verify timetable slot period checkbox before saving attendance.</li>
                    <li>Utilize "Check All" / "UnCheck All" buttons for high-efficiency marking.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* University Helpline footer */}
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
