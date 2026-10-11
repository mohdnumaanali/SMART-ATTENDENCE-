import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  Home,
  BookOpen,
  User,
  CalendarCheck2,
  Award,
  MessageSquare,
  LogOut,
  X,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface StudentNavProps {
  activeItem: 'home' | 'academics' | 'profile' | 'attendance' | 'results' | 'feedback';
  onNavigate: (route: string) => void;
}

export const StudentNav: React.FC<StudentNavProps> = ({ activeItem, onNavigate }) => {
  const { currentUser, logout } = usePortal();
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, route: '/student/dashboard' },
    { id: 'academics', label: 'Academics', icon: BookOpen, isModal: true },
    { id: 'profile', label: 'Profile', icon: User, isModal: true },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2, route: '/student/reports' },
    { id: 'results', label: 'Results', icon: Award, isModal: true },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, isModal: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.route) {
      onNavigate(item.route);
    } else if (item.isModal) {
      setModalTitle(item.label);
      setFeedbackSent(false);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 shadow-xs mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-1 scrollbar-none">
            <nav className="flex space-x-1 sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1A3B70] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#1A3B70] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-[#1A3B70] hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
                title="Change your student account password"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-700" />
                <span>Change Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onNavigate('/login');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Info Modals for Academics, Profile, Results, Feedback */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#1A3B70] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-wide">
                SRU Student Portal — {modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setModalTitle(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs text-slate-700 space-y-3">
              {modalTitle === 'Academics' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Enrolled Curriculum: B.Tech (CSE-AIML) R24 Regulations</p>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 text-slate-600">
                    <p>• Semester: <strong>II Year - I Semester</strong></p>
                    <p>• Total Registered Credits: <strong>21 Credits</strong></p>
                    <p>• Total Theory Courses: <strong>5</strong> | Labs: <strong>3</strong></p>
                    <p>• Next Mid-Sem Exam Starts: <strong>14-Nov-2026</strong></p>
                  </div>
                </div>
              )}

              {modalTitle === 'Profile' && currentUser?.studentData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-12 h-12 rounded-full bg-[#1A3B70] text-white flex items-center justify-center font-bold text-base">
                      {currentUser.studentData.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{currentUser.studentData.name}</p>
                      <p className="text-slate-500 font-mono text-xs">{currentUser.studentData.roll_no}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Father's Name:</span>
                      <p className="font-medium">{currentUser.studentData.father_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Assigned Batch:</span>
                      <p className="font-semibold text-blue-700">{currentUser.studentData.batch_id}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Department:</span>
                      <p className="font-medium">{currentUser.studentData.department}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Faculty Mentor:</span>
                      <p className="font-medium">{currentUser.studentData.mentor_name}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Contact:</span>
                      <p className="font-mono">{currentUser.studentData.phone}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="font-mono truncate">{currentUser.studentData.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {modalTitle === 'Results' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Previous Semesters Performance Summary</p>
                  <table className="w-full text-left border border-slate-200 text-xs">
                    <thead className="bg-slate-100 font-semibold text-slate-700">
                      <tr>
                        <th className="p-2 border-b">Semester</th>
                        <th className="p-2 border-b">SGPA</th>
                        <th className="p-2 border-b">CGPA</th>
                        <th className="p-2 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">I Year - I Sem</td>
                        <td className="p-2 font-mono">8.42</td>
                        <td className="p-2 font-mono">8.42</td>
                        <td className="p-2 text-emerald-600 font-semibold">PASSED</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">I Year - II Sem</td>
                        <td className="p-2 font-mono">8.65</td>
                        <td className="p-2 font-mono">8.54</td>
                        <td className="p-2 text-emerald-600 font-semibold">PASSED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {modalTitle === 'Feedback' && (
                <div className="space-y-3">
                  {feedbackSent ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Thank you! Your feedback has been submitted to the Department HOD.</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-600">
                        Submit academic feedback or attendance discrepancy queries directly to your Faculty Mentor and HOD.
                      </p>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Write your feedback or query here..."
                        rows={3}
                        className="w-full p-2 border border-slate-300 rounded text-xs outline-none focus:ring-2 focus:ring-[#1A3B70]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (feedbackText.trim()) setFeedbackSent(true);
                        }}
                        className="w-full py-2 bg-[#1A3B70] text-white font-semibold rounded text-xs hover:bg-[#0F2C59]"
                      >
                        Submit Feedback
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-100 px-5 py-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTitle(null)}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-semibold text-slate-700"
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
