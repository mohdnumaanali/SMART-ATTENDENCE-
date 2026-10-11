import React, { useState, useEffect } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentReports } from './pages/StudentReports';
import { FacultyAttendance } from './pages/FacultyAttendance';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { currentUser } = usePortal();

  // Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/student/reports')) return '/student/reports';
    if (path.startsWith('/student')) return '/student/dashboard';
    if (path.startsWith('/faculty')) return '/faculty/attendance';
    if (path.startsWith('/admin')) return '/admin/dashboard';
    if (path.startsWith('/login')) return '/login';
    // Default to student dashboard if logged in as student, or login
    return '/login';
  });

  // Track initial role for login page
  const [loginInitialRole, setLoginInitialRole] = useState<'student' | 'faculty' | 'admin'>('student');

  // Handle browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path && path !== '/') {
        setCurrentPath(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    if (route.includes('?role=')) {
      const [path, query] = route.split('?');
      const roleParam = query.replace('role=', '') as 'student' | 'faculty' | 'admin';
      setLoginInitialRole(roleParam);
      setCurrentPath(path);
      window.history.pushState({}, '', route);
      return;
    }

    setCurrentPath(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine top header tab
  let activeHeaderTab = 'STUDENT';
  if (currentPath === '/login') {
    activeHeaderTab = loginInitialRole === 'faculty' ? 'STAFF' : 'STUDENT';
  } else if (currentPath === '/faculty/attendance') {
    activeHeaderTab = 'STAFF';
  } else if (currentPath === '/admin/dashboard') {
    activeHeaderTab = 'admin-dashboard';
  } else {
    activeHeaderTab = 'STUDENT';
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Dark Blue SRU University Header (#1A3B70) */}
      <Header currentTab={activeHeaderTab} onNavigate={handleNavigate} />

      {/* Main Page View */}
      <div className="flex-1">
        {currentPath === '/login' && (
          <LoginPage initialRole={loginInitialRole} onNavigate={handleNavigate} />
        )}

        {currentPath === '/student/dashboard' && (
          <StudentDashboard onNavigate={handleNavigate} />
        )}

        {currentPath === '/student/reports' && (
          <StudentReports onNavigate={handleNavigate} />
        )}

        {currentPath === '/faculty/attendance' && (
          <FacultyAttendance onNavigate={handleNavigate} />
        )}

        {currentPath === '/admin/dashboard' && (
          <AdminDashboard onNavigate={handleNavigate} />
        )}
      </div>

      {/* SRU University Footer */}
      <footer className="bg-[#0F2C59] text-blue-200 border-t border-blue-900 text-xs py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-white tracking-wide">
              SR University, Warangal — Smart Attendance Management & ERP Portal
            </p>
            <p className="text-[11px] text-blue-300 mt-0.5">
              Approved by AICTE | Accredited with 'A+' Grade | UGC Recognized Private University
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => handleNavigate('/login')}
              className="hover:text-amber-300 underline"
            >
              Portal Login
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/faculty/attendance')}
              className="hover:text-amber-300 underline"
            >
              Faculty Roster
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/admin/dashboard')}
              className="hover:text-amber-300 underline"
            >
              Admin Dashboard
            </button>
            <span>© 2026 SRU. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  );
}
