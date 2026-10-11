import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Lock, CheckCircle2, AlertCircle, X, KeyRound } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, changeCurrentUserPassword } = usePortal();

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Verify current password
    const expectedCurrentPassword =
      currentUser?.role === 'student'
        ? currentUser.studentData?.password || 'student123'
        : currentUser?.facultyData?.password || 'faculty123';

    if (currentPasswordInput.trim() !== expectedCurrentPassword) {
      setErrorMsg('Current password does not match. Please verify and try again.');
      return;
    }

    if (newPasswordInput.trim().length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    const ok = changeCurrentUserPassword(newPasswordInput.trim());
    if (ok) {
      setSuccessMsg('Your password has been changed successfully! Use your new password for future logins.');
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2000);
    } else {
      setErrorMsg('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-wide">
              Change Account Password — {currentUser?.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Current Password:
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Enter your current password"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Default password is:{' '}
              <strong>{currentUser?.role === 'student' ? 'student123' : 'faculty123'}</strong>
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Password:
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Confirm New Password:
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="Re-type new password"
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
