import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  GraduationCap,
  LogOut,
  UserCheck,
  ShieldAlert,
  Users,
  Info,
  Building2,
  Calendar,
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, logout, academicYear, setAcademicYear, students, switchStudentForDemo } = usePortal();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [quickStudentRoll, setQuickStudentRoll] = useState('');

  return (
    <>
      <header className="sticky top-0 z-40 shadow-md">
        {/* Top Dark Bar with University Crest and Top Nav Tabs */}
        <div className="bg-[#1A3B70] text-white border-b border-[#244b8d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between py-2 md:py-3 gap-2">
              {/* Brand Logo & Title */}
              <div
                onClick={() => {
                  if (currentUser?.role === 'student') onNavigate('/student/dashboard');
                  else if (currentUser?.role === 'faculty') onNavigate('/faculty/attendance');
                  else if (currentUser?.role === 'admin') onNavigate('/admin/dashboard');
                  else onNavigate('/login');
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-1.5 shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#1A3B70] flex items-center justify-center text-white font-serif font-black text-xs tracking-tighter">
                    SRU
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-bold tracking-tight text-white font-serif">
                      SR UNIVERSITY
                    </span>
                    <span className="text-[10px] uppercase font-semibold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded tracking-wider">
                      Accredited A+
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 tracking-wide">
                    Smart Attendance Management & Student Information System
                  </p>
                </div>
              </div>

              {/* Top Navigation Tabs: STAFF, STUDENT, PARENT, ABOUT US */}
              <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser?.role === 'faculty') onNavigate('/faculty/attendance');
                    else onNavigate('/login?role=faculty');
                  }}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                    currentTab === 'STAFF' || currentTab === 'faculty-attendance'
                      ? 'bg-[#0F2C59] text-amber-300 font-bold border border-amber-400/50 shadow-inner'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Staff
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentUser?.role === 'student') onNavigate('/student/dashboard');
                    else onNavigate('/login?role=student');
                  }}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                    currentTab === 'STUDENT' ||
                    currentTab === 'student-dashboard' ||
                    currentTab === 'student-reports'
                      ? 'bg-[#0F2C59] text-amber-300 font-bold border border-amber-400/50 shadow-inner'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setShowParentModal(true)}
                  className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                    showParentModal ? 'bg-[#0F2C59] text-amber-300 font-bold' : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Parent
                </button>

                <button
                  type="button"
                  onClick={() => setShowAboutModal(true)}
                  className="px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 text-blue-100 hover:bg-white/10"
                >
                  <Info className="w-3.5 h-3.5" />
                  About Us
                </button>

                {/* Admin Tab */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser?.role === 'admin') onNavigate('/admin/dashboard');
                    else onNavigate('/login?role=admin');
                  }}
                  className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 ${
                    currentTab === 'admin-dashboard'
                      ? 'bg-amber-500 text-slate-900 font-bold shadow'
                      : 'bg-white/10 hover:bg-white/20 text-blue-100'
                  }`}
                  title="Admin Batch Management & Oversight"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Sub-header: Academic Year & Active User Info */}
        <div className="bg-[#0F2C59] text-blue-100 border-b border-blue-950 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-blue-200">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 font-medium">Academic Year:</span>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  aria-label="Academic Year"
                  className="bg-[#1A3B70] text-amber-300 text-xs font-semibold px-2 py-0.5 rounded border border-blue-700 outline-none cursor-pointer"
                >
                  <option value="2024-25">2024-25 (Current)</option>
                  <option value="2025-26">2025-26 (Upcoming)</option>
                  <option value="2023-24">2023-24 (Archive)</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-2 text-slate-300">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Semester: <strong>2-1 (B.Tech Regular)</strong></span>
              </div>
            </div>

            {/* User Session Bar */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Logged in as:</span>
                  <span className="bg-[#1A3B70] text-white px-2 py-0.5 rounded font-medium border border-blue-600 flex items-center gap-1.5">
                    <span className="capitalize font-bold text-amber-300">[{currentUser.role}]</span>
                    <span className="truncate max-w-[140px]">{currentUser.name}</span>
                    <span className="text-[10px] text-blue-300">({currentUser.username})</span>
                  </span>
                </div>

                {/* Quick Student Switcher for Demo testing */}
                {currentUser.role === 'student' && (
                  <div className="hidden lg:flex items-center gap-1 bg-[#1A3B70] px-2 py-0.5 rounded border border-blue-700">
                    <span className="text-[11px] text-blue-300">Demo Switch:</span>
                    <select
                      value={currentUser.username}
                      onChange={(e) => switchStudentForDemo(e.target.value)}
                      aria-label="Demo Student Switcher"
                      className="bg-transparent text-amber-300 font-mono text-[11px] outline-none cursor-pointer"
                    >
                      {students.slice(0, 15).map((s) => (
                        <option key={s.id} value={s.roll_no} className="bg-slate-900 text-white">
                          {s.roll_no} - {s.name.split(' ')[0]} ({s.batch_id})
                        </option>
                      ))}
                      <option value="SRU2024040" className="bg-slate-900 text-white">
                        SRU2024040 (Batch 2)
                      </option>
                      <option value="SRU2024080" className="bg-slate-900 text-white">
                        SRU2024080 (Batch 3)
                      </option>
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onNavigate('/login');
                  }}
                  className="flex items-center gap-1 text-red-300 hover:text-red-100 bg-red-950/60 hover:bg-red-900 px-2.5 py-0.5 rounded border border-red-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3 py-0.5 rounded transition-colors text-xs"
                >
                  Sign In to Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Parent Portal Modal */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">SRU Parent Attendance Portal & Alerts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowParentModal(false)}
                className="text-blue-200 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm text-slate-700">
              <div className="bg-blue-50 border-l-4 border-[#1A3B70] p-3 rounded-r text-xs text-blue-900">
                Parents receive automated SMS & WhatsApp notifications every working day at 05:00 PM if their ward is marked absent for any lecture slot.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Enter Student Roll Number to Check Ward Attendance:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickStudentRoll}
                    onChange={(e) => setQuickStudentRoll(e.target.value.toUpperCase())}
                    placeholder="e.g. SRU2024001"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm uppercase font-mono focus:ring-2 focus:ring-[#1A3B70] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (quickStudentRoll) {
                        switchStudentForDemo(quickStudentRoll);
                        setShowParentModal(false);
                        onNavigate('/student/dashboard');
                      }
                    }}
                    className="bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-semibold px-4 py-2 rounded text-xs transition-colors"
                  >
                    View Status
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-700" />
                  <span>Parent Helpdesk: 0870-2818300 / 98480 54321</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-700" />
                  <span>Email: parentdesk@sru.edu.in</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 px-5 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowParentModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">About SR University Attendance System</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-blue-200 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="font-bold text-[#1A3B70] text-base mb-1">
                  SR University, Warangal (Telangana)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  SR University is a pioneering institution committed to multidisciplinary education, technological innovation, and societal impact. Accredited with A+ grade, SRU empowers students with cutting-edge experiential learning.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">Biometric & RFID Sync</span>
                  <p className="text-slate-500 text-xs mt-0.5">Automated period-wise slot recording with live synchronization.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">75% Statutory Compliance</span>
                  <p className="text-slate-500 text-xs mt-0.5">Real-time alerts for condonation & exam eligibility thresholds.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">Dynamic Batch Splitting</span>
                  <p className="text-slate-500 text-xs mt-0.5">Section and lab batch management for focused mentoring.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block text-xs">Transparent Reports</span>
                  <p className="text-slate-500 text-xs mt-0.5">Course-wise held vs present ratio with daily date filters.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Ananthasagar, Hasanparthy, Warangal Urban, Telangana 506371</span>
              </div>
            </div>
            <div className="bg-slate-100 px-5 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-1.5 bg-[#1A3B70] hover:bg-[#0F2C59] text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
