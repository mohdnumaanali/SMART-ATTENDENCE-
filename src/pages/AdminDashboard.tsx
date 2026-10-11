import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { DEPARTMENTS, SEMESTERS } from '../data/seedData';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Layers,
  PlusCircle,
  CheckCircle2,
  FolderPlus,
  BookOpen,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Square,
  Split,
  Shuffle,
  ShieldCheck,
  Send,
  Building2,
  ChevronLeft,
  ChevronRight,
  Radio,
  KeyRound,
  UserX,
  UserCheck,
  Lock,
  Unlock,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    students,
    batches,
    faculty,
    courses,
    completedSessions,
    addBatch,
    deleteBatch,
    assignStudentToBatch,
    bulkAssignBatch,
    autoDivideStudentsIntoBatches,
    addStudent,
    addFaculty,
    addCourse,
    deleteStudent,
    updateUserCredentials,
    toggleAccountStatus,
    resetUserPassword,
    resetAllData,
    currentUser,
  } = usePortal();

  // Active Admin Sub-tab: 'monitor' | 'batches' | 'credentials' | 'alerts' | 'add-forms' | 'roster'
  const [activeTab, setActiveTab] = useState<'monitor' | 'batches' | 'credentials' | 'alerts' | 'add-forms' | 'roster'>('monitor');

  // Filter criteria for batches & roster
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('CSE');
  const [selectedSemFilter, setSelectedSemFilter] = useState<string>('ALL');
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterBatchFilter, setRosterBatchFilter] = useState('ALL');

  // Credential Management Sub-tab filter
  const [credentialRoleFilter, setCredentialRoleFilter] = useState<'faculty' | 'student'>('faculty');
  const [credentialSearch, setCredentialSearch] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUsernameInput, setEditUsernameInput] = useState('');
  const [editPasswordInput, setEditPasswordInput] = useState('');

  // Completed sessions filter
  const [monitorDeptFilter, setMonitorDeptFilter] = useState<string>('ALL');
  const [monitorSearch, setMonitorSearch] = useState<string>('');

  // Pagination for large student roster
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  // Bulk Selection for Batch Assignment
  const [selectedRollNos, setSelectedRollNos] = useState<string[]>([]);
  const [targetBulkBatch, setTargetBulkBatch] = useState<string>('25CSE01');

  // Feedback banner
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchDept, setNewBatchDept] = useState('CSE');
  const [newBatchYearSem, setNewBatchYearSem] = useState('2-1');
  const [newBatchDesc, setNewBatchDesc] = useState('');

  // New Student Form State
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdFather, setNewStdFather] = useState('');
  const [newStdBatch, setNewStdBatch] = useState('25CSE01');
  const [newStdDept, setNewStdDept] = useState('CSE');

  // New Faculty Form State
  const [newFacId, setNewFacId] = useState('');
  const [newFacName, setNewFacName] = useState('');
  const [newFacDept, setNewFacDept] = useState('CSE');
  const [newFacDesig, setNewFacDesig] = useState('Assistant Professor');
  const [newFacEmail, setNewFacEmail] = useState('');

  // New Course Form State
  const [newCrsCode, setNewCrsCode] = useState('');
  const [newCrsName, setNewCrsName] = useState('');
  const [newCrsLtp, setNewCrsLtp] = useState('3-0-2');
  const [newCrsDept, setNewCrsDept] = useState('CSE');

  // Metrics
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const lowAttendanceStudents = useMemo(
    () => students.filter((s) => s.attendance_pct < 75),
    [students]
  );
  const totalBatches = batches.length;
  const totalCompletedClasses = completedSessions.length;

  // Filtered Completed Sessions for Real-Time Monitor
  const filteredCompletedSessions = useMemo(() => {
    return completedSessions.filter((session) => {
      const matchDept = monitorDeptFilter === 'ALL' || session.department === monitorDeptFilter;
      const q = monitorSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        session.course_name.toLowerCase().includes(q) ||
        session.course_code.toLowerCase().includes(q) ||
        session.faculty_name.toLowerCase().includes(q) ||
        session.batch_id.toLowerCase().includes(q) ||
        session.topics_covered.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [completedSessions, monitorDeptFilter, monitorSearch]);

  // Compute student count per batch
  const batchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    batches.forEach((b) => {
      counts[b.name] = 0;
    });
    students.forEach((s) => {
      counts[s.batch_id] = (counts[s.batch_id] || 0) + 1;
    });
    return counts;
  }, [batches, students]);

  // Filtered Batches based on Department & Semester
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchDept = selectedDeptFilter === 'ALL' || b.department === selectedDeptFilter;
      const matchSem = selectedSemFilter === 'ALL' || b.year_sem === selectedSemFilter;
      return matchDept && matchSem;
    });
  }, [batches, selectedDeptFilter, selectedSemFilter]);

  // Filtered roster for table
  const filteredRoster = useMemo(() => {
    return students.filter((s) => {
      const matchDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
      const matchSem = selectedSemFilter === 'ALL' || s.year_sem === selectedSemFilter;
      const matchBatch =
        rosterBatchFilter === 'ALL' ||
        s.batch_id.toLowerCase() === rosterBatchFilter.toLowerCase();
      const matchSearch =
        !rosterSearch.trim() ||
        s.roll_no.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        s.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        s.batch_id.toLowerCase().includes(rosterSearch.toLowerCase());
      return matchDept && matchSem && matchBatch && matchSearch;
    });
  }, [students, selectedDeptFilter, selectedSemFilter, rosterBatchFilter, rosterSearch]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredRoster.length / PAGE_SIZE));
  const paginatedRoster = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRoster.slice(start, start + PAGE_SIZE);
  }, [filteredRoster, currentPage]);

  // Filtered Credential Users
  const credentialUsers = useMemo(() => {
    const q = credentialSearch.toLowerCase().trim();
    if (credentialRoleFilter === 'faculty') {
      return faculty.filter((f) => {
        const matchSearch =
          !q ||
          f.name.toLowerCase().includes(q) ||
          f.faculty_id.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.username.toLowerCase().includes(q);
        return matchSearch;
      });
    } else {
      return students.slice(0, 200).filter((s) => {
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.roll_no.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.batch_id.toLowerCase().includes(q);
        return matchSearch;
      });
    }
  }, [faculty, students, credentialRoleFilter, credentialSearch]);

  // Handle Create New Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    addBatch({
      name: newBatchName.trim().toUpperCase(),
      displayName: `${newBatchDept} Batch (${newBatchName.trim().toUpperCase()})`,
      department: newBatchDept,
      year_sem: newBatchYearSem,
      academic_year: '2024-25',
      description: newBatchDesc || `${newBatchDept} Section`,
    });

    setAlertMessage(`Batch ${newBatchName.toUpperCase()} created successfully!`);
    setNewBatchName('');
    setNewBatchDesc('');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Handle Bulk Reassignment
  const handleBulkReassign = () => {
    if (selectedRollNos.length === 0) {
      alert('Please select at least one student checkbox.');
      return;
    }
    bulkAssignBatch(selectedRollNos, targetBulkBatch);
    setAlertMessage(
      `Successfully reassigned ${selectedRollNos.length} students to Batch: ${targetBulkBatch}`
    );
    setSelectedRollNos([]);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Handle Select All in View
  const handleToggleSelectAll = () => {
    const currentViewRolls = paginatedRoster.map((s) => s.roll_no);
    const allSelected = currentViewRolls.every((r) => selectedRollNos.includes(r));
    if (allSelected) {
      setSelectedRollNos((prev) => prev.filter((r) => !currentViewRolls.includes(r)));
    } else {
      setSelectedRollNos((prev) => Array.from(new Set([...prev, ...currentViewRolls])));
    }
  };

  const handleToggleStudentSelection = (rollNo: string) => {
    setSelectedRollNos((prev) =>
      prev.includes(rollNo) ? prev.filter((r) => r !== rollNo) : [...prev, rollNo]
    );
  };

  // Auto-divide students of currently selected department across its batches
  const handleAutoDivide = () => {
    const targetBatches = filteredBatches.map((b) => b.name);
    if (targetBatches.length === 0) return;
    if (
      window.confirm(
        `Auto-divide ${selectedDeptFilter} students evenly across the ${targetBatches.length} batches of ${selectedDeptFilter}?`
      )
    ) {
      autoDivideStudentsIntoBatches(targetBatches);
      setAlertMessage(
        `Students distributed evenly across ${targetBatches.length} batches of ${selectedDeptFilter}!`
      );
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdRoll.trim() || !newStdName.trim()) return;

    addStudent({
      roll_no: newStdRoll.trim().toUpperCase(),
      name: newStdName.trim(),
      father_name: newStdFather.trim() || 'Parent',
      batch_id: newStdBatch,
      department: newStdDept,
      year_sem: '2-1',
      mentor_id: 'FAC001',
      mentor_name: 'Dr. Venkataswamy Kalvala',
      cgpa: 8.0,
      backlogs: 0,
      attendance_pct: 85.0,
      email: `${newStdRoll.toLowerCase()}@sru.edu.in`,
      phone: '+91 98480 00000',
      password: 'student123',
      is_active: true,
    });

    setAlertMessage(`Student ${newStdRoll.toUpperCase()} added to Batch ${newStdBatch}!`);
    setNewStdRoll('');
    setNewStdName('');
    setNewStdFather('');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Handle Add Faculty
  const handleAddFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacId.trim() || !newFacName.trim()) return;

    addFaculty({
      faculty_id: newFacId.trim().toUpperCase(),
      name: newFacName.trim(),
      department: newFacDept,
      designation: newFacDesig,
      email: newFacEmail.trim() || `${newFacId.toLowerCase()}@sru.edu.in`,
      phone: '+91 98480 11223',
      courses: ['CS2101'],
      username: newFacId.trim().toUpperCase(),
      password: 'faculty123',
      is_active: true,
    });

    setAlertMessage(`Faculty ${newFacName} registered successfully!`);
    setNewFacId('');
    setNewFacName('');
    setNewFacEmail('');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Handle Add Course
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrsCode.trim() || !newCrsName.trim()) return;

    addCourse({
      code: newCrsCode.trim().toUpperCase(),
      name: newCrsName.trim(),
      ltp: newCrsLtp,
      department: newCrsDept,
      year_sem: '2-1',
      total_classes_held: 30,
    });

    setAlertMessage(`Course ${newCrsCode.toUpperCase()} added successfully!`);
    setNewCrsCode('');
    setNewCrsName('');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Start editing credentials
  const handleStartEditCredentials = (id: string, currentUsername: string) => {
    setEditingUserId(id);
    setEditUsernameInput(currentUsername);
    setEditPasswordInput('');
  };

  // Save updated credentials
  const handleSaveCredentials = (id: string) => {
    updateUserCredentials(
      credentialRoleFilter,
      id,
      editUsernameInput,
      editPasswordInput || undefined
    );
    setAlertMessage(`Credentials updated for ID: ${id}`);
    setEditingUserId(null);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Reset user password
  const handleResetPassword = (id: string) => {
    const defaultPass = resetUserPassword(credentialRoleFilter, id);
    setAlertMessage(`Password for ${id} reset to default: ${defaultPass}`);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Admin Header with Faculty Equal Access Notice */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative Oversight & Control Center
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Real-Time Sync Active</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A3B70] mt-1">
              SRU University Administration Portal
            </h1>
            <p className="text-xs text-slate-600">
              Manage 200 Faculty • 216 Batches • 6,480 Students • Real-Time Attendance Monitoring
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/faculty/attendance')}
              className="px-3.5 py-2 bg-[#1A3B70] hover:bg-[#0F2C59] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Mark Attendance (Faculty View) →
            </button>
            <button
              type="button"
              onClick={resetAllData}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-lg border border-slate-200 transition-colors"
              title="Reset data to initial state"
            >
              Reset Seed Data
            </button>
          </div>
        </div>

        {/* Success / Info Alert */}
        {alertMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg shadow-xs flex items-center justify-between text-xs sm:text-sm text-emerald-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{alertMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlertMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TOP KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Completed Classes Tracker */}
          <div
            onClick={() => setActiveTab('monitor')}
            className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between cursor-pointer transition-all ${
              activeTab === 'monitor'
                ? 'bg-purple-900 text-white border-purple-900 ring-2 ring-purple-600'
                : 'bg-white border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider opacity-80">
                Completed Classes
              </span>
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black font-mono">{totalCompletedClasses}</h3>
              <p className="text-[10px] mt-0.5 opacity-90">Auto-updates on Save</p>
            </div>
          </div>

          {/* Total Students */}
          <div
            onClick={() => setActiveTab('roster')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-500">Total Students</span>
              <GraduationCap className="w-4 h-4 text-blue-700" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-[#1A3B70] font-mono">{totalStudents.toLocaleString()}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">30 Students / Batch</p>
            </div>
          </div>

          {/* Total Faculty (200 Members) */}
          <div
            onClick={() => setActiveTab('credentials')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-amber-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-500">Total Faculty</span>
              <Users className="w-4 h-4 text-amber-700" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-[#1A3B70] font-mono">{totalFaculty}</h3>
              <p className="text-[10px] text-amber-700 font-semibold mt-0.5">200 Accounts Configured</p>
            </div>
          </div>

          {/* Total Batches */}
          <div
            onClick={() => setActiveTab('batches')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-500">Total Batches</span>
              <Layers className="w-4 h-4 text-blue-700" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-[#1A3B70] font-mono">{totalBatches}</h3>
              <p className="text-[10px] text-blue-700 font-semibold mt-0.5">74 CSE + 142 Other Depts</p>
            </div>
          </div>

          {/* Low Attendance Alerts (< 75%) */}
          <div
            onClick={() => setActiveTab('alerts')}
            className="bg-white p-4 rounded-xl border border-red-200 shadow-xs flex flex-col justify-between cursor-pointer hover:border-red-400"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-red-600">Low Attendance (&lt;75%)</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-black text-red-600 font-mono">
                {lowAttendanceStudents.length}
              </h3>
              <p className="text-[10px] text-red-600 font-semibold underline mt-0.5">At-Risk Students</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Admin Modules */}
        <div className="bg-white border-b border-slate-200 rounded-t-xl px-4 flex space-x-2 overflow-x-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('monitor')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'monitor'
                ? 'border-purple-700 text-purple-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-700" />
            <span>1. Live Attendance Monitor & Completed Classes ({totalCompletedClasses})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'batches'
                ? 'border-[#1A3B70] text-[#1A3B70]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Batch Management ({batches.length} Batches)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'credentials'
                ? 'border-[#1A3B70] text-[#1A3B70]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>3. Faculty & Student Credentials & Revoke Accounts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alerts')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>4. Low Attendance Alerts ({lowAttendanceStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add-forms')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'add-forms'
                ? 'border-[#1A3B70] text-[#1A3B70]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>5. Add Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'border-[#1A3B70] text-[#1A3B70]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>6. Student Directory</span>
          </button>
        </div>

        {/* TAB 1: LIVE ATTENDANCE MONITOR & COMPLETED CLASSES TRACKER */}
        {activeTab === 'monitor' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-bold text-sm text-[#1A3B70]">
                    Live Attendance Stream & Completed Class Log
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Updates in real time automatically whenever any faculty marks & saves attendance with slots, class type, and teaching notes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={monitorDeptFilter}
                  onChange={(e) => setMonitorDeptFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 bg-white"
                >
                  <option value="ALL">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={monitorSearch}
                    onChange={(e) => setMonitorSearch(e.target.value)}
                    placeholder="Search course, teacher, notes..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#1A3B70] w-64"
                  />
                </div>
              </div>
            </div>

            {/* Completed Classes Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A3B70] text-white uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-28">Timestamp</th>
                    <th className="py-2.5 px-3">Faculty / Teacher</th>
                    <th className="py-2.5 px-3 text-center w-24">Dept / Sem</th>
                    <th className="py-2.5 px-3 text-center w-28">Batch</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Slot(s)</th>
                    <th className="py-2.5 px-3 text-center w-16">Type</th>
                    <th className="py-2.5 px-3 text-center w-24">Present / Total</th>
                    <th className="py-2.5 px-3">What Was Taught Today (Session Log)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompletedSessions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        No completed sessions found. As soon as faculty submits attendance, it will immediately appear here.
                      </td>
                    </tr>
                  ) : (
                    filteredCompletedSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {session.timestamp}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{session.faculty_name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{session.faculty_id}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                          {session.department} ({session.year_sem})
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-[#1A3B70] px-2 py-0.5 rounded border border-slate-200">
                            {session.batch_id}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-800 block">{session.course_name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{session.course_code}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 text-[11px]">
                          {session.slot_names}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] ${
                              session.class_type === 'P'
                                ? 'bg-teal-100 text-teal-800'
                                : session.class_type === 'T'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {session.class_type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          <span className="text-emerald-700 font-bold">{session.present_count}</span>
                          <span className="text-slate-400"> / </span>
                          <span className="text-slate-700">{session.total_students}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={session.topics_covered}>
                          <span className="italic">{session.topics_covered}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BATCH MANAGEMENT MODULE */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form: Create New Batch */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-sm font-bold text-[#1A3B70]">
                  <FolderPlus className="w-4 h-4" />
                  <span>Create New Batch</span>
                </div>

                <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Batch Name / Code (e.g. 25CSE75):
                    </label>
                    <input
                      type="text"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value.toUpperCase())}
                      placeholder="e.g. 25CSE75"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono uppercase focus:ring-2 focus:ring-[#1A3B70] outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Department:
                      </label>
                      <select
                        value={newBatchDept}
                        onChange={(e) => setNewBatchDept(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Semester:
                      </label>
                      <select
                        value={newBatchYearSem}
                        onChange={(e) => setNewBatchYearSem(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium"
                      >
                        {SEMESTERS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Batch Description:
                    </label>
                    <input
                      type="text"
                      value={newBatchDesc}
                      onChange={(e) => setNewBatchDesc(e.target.value)}
                      placeholder="e.g. Section A Laboratory Cohort"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-[#1A3B70]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Batch (30 Students Capacity)</span>
                  </button>
                </form>
              </div>

              {/* Batches Overview Table */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#1A3B70] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>
                        {selectedDeptFilter} Batches ({filteredBatches.length} Batches Found)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <select
                        value={selectedDeptFilter}
                        onChange={(e) => setSelectedDeptFilter(e.target.value)}
                        className="bg-blue-900 text-white font-bold px-2 py-1 rounded border border-blue-400 outline-none text-xs"
                      >
                        <option value="ALL">All Departments</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.code}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedSemFilter}
                        onChange={(e) => setSelectedSemFilter(e.target.value)}
                        className="bg-blue-900 text-white font-bold px-2 py-1 rounded border border-blue-400 outline-none text-xs"
                      >
                        <option value="ALL">All Semesters</option>
                        {SEMESTERS.map((s) => (
                          <option key={s} value={s}>
                            Sem {s}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleAutoDivide}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        title="Evenly divide students across active department batches"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Auto-Divide</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Batch Code</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Semester</th>
                          <th className="py-2.5 px-3 text-center">Assigned Students</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBatches.map((b) => {
                          const count = batchCounts[b.name] || b.student_count || 30;
                          return (
                            <tr key={b.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3">
                                <span className="font-mono font-bold text-[#1A3B70] block">
                                  {b.name}
                                </span>
                                <span className="text-[10px] text-slate-500">{b.description}</span>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700">
                                {b.department}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">
                                {b.year_sem}
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1A3B70]">
                                  {count} Students
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDeptFilter(b.department);
                                      setSelectedSemFilter(b.year_sem);
                                      setRosterBatchFilter(b.name);
                                      setActiveTab('roster');
                                    }}
                                    className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded font-semibold"
                                  >
                                    View 30 Roster
                                  </button>
                                  {batches.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Delete batch ${b.name}? Its students will be moved to another batch.`
                                          )
                                        ) {
                                          deleteBatch(b.id);
                                        }
                                      }}
                                      className="p-1 text-red-500 hover:text-red-700 rounded"
                                      title="Delete Batch"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                  <span>
                    Showing {filteredBatches.length} batches of {batches.length} total
                  </span>
                  <span>Every batch consists of exactly 30 students.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY & STUDENT CREDENTIALS, PASSWORD RESET & ACCOUNT REVOCATION */}
        {activeTab === 'credentials' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#1A3B70] flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-700" />
                  <span>Account Governance: Credentials, Password Resets & Account Revocation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin can assign login credentials, reset user passwords, and activate or revoke login privileges.
                </p>
              </div>

              {/* Role Toggle for Credentials view */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCredentialRoleFilter('faculty')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      credentialRoleFilter === 'faculty'
                        ? 'bg-[#1A3B70] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Faculty Accounts (200)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentialRoleFilter('student')}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      credentialRoleFilter === 'student'
                        ? 'bg-[#1A3B70] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Student Accounts ({students.length.toLocaleString()})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={credentialSearch}
                    onChange={(e) => setCredentialSearch(e.target.value)}
                    placeholder="Search name, ID, username..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#1A3B70] w-56"
                  />
                </div>
              </div>
            </div>

            {/* Credentials Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">S.No</th>
                    <th className="py-2.5 px-3 w-32">
                      {credentialRoleFilter === 'faculty' ? 'Faculty ID' : 'Roll Number'}
                    </th>
                    <th className="py-2.5 px-3">Full Name</th>
                    <th className="py-2.5 px-3 text-center">Department</th>
                    <th className="py-2.5 px-3">Assigned Username</th>
                    <th className="py-2.5 px-3">Current Password</th>
                    <th className="py-2.5 px-3 text-center">Account Status</th>
                    <th className="py-2.5 px-3 text-center w-56">Credential Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {credentialUsers.map((user: any, idx) => {
                    const isFaculty = credentialRoleFilter === 'faculty';
                    const userId = isFaculty ? user.faculty_id : user.roll_no;
                    const isActive = user.is_active !== false;
                    const isEditing = editingUserId === userId;

                    return (
                      <tr key={userId} className={`hover:bg-slate-50 ${!isActive ? 'bg-red-50/40' : ''}`}>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {userId}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {user.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                          {user.department}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editUsernameInput}
                              onChange={(e) => setEditUsernameInput(e.target.value)}
                              className="px-2 py-1 text-xs border border-blue-400 rounded outline-none font-mono font-bold"
                            />
                          ) : (
                            <span className="font-bold text-[#1A3B70]">
                              {isFaculty ? user.username : user.roll_no}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPasswordInput}
                              onChange={(e) => setEditPasswordInput(e.target.value)}
                              placeholder="New password"
                              className="px-2 py-1 text-xs border border-blue-400 rounded outline-none font-mono"
                            />
                          ) : (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {user.password || (isFaculty ? 'faculty123' : 'student123')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              <UserCheck className="w-3 h-3" />
                              <span>ACTIVE</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 text-[11px]">
                              <UserX className="w-3 h-3" />
                              <span>REVOKED</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveCredentials(userId)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingUserId(null)}
                                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px]"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStartEditCredentials(
                                      userId,
                                      isFaculty ? user.username : user.roll_no
                                    )
                                  }
                                  className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded font-semibold"
                                  title="Edit custom username / password"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleResetPassword(userId)}
                                  className="px-2 py-0.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded font-semibold flex items-center gap-1"
                                  title="Reset password to default"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Reset</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleAccountStatus(credentialRoleFilter, userId, !isActive)
                                  }
                                  className={`px-2 py-0.5 text-xs rounded font-bold border transition-colors ${
                                    isActive
                                      ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200'
                                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                                  }`}
                                  title={isActive ? 'Revoke login permission' : 'Reactivate login access'}
                                >
                                  {isActive ? 'Revoke' : 'Activate'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LOW ATTENDANCE ALERTS (< 75%) */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-xl border border-red-200 shadow-xs overflow-hidden">
            <div className="bg-red-700 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm tracking-wide">
                  Low Attendance Compliance Alert List (&lt; 75% Statutory Cutoff)
                </h3>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded font-mono font-bold">
                {lowAttendanceStudents.length} Students At Risk
              </span>
            </div>

            <div className="p-4 bg-red-50/50 border-b border-red-100 text-xs text-red-900 flex items-center justify-between">
              <span>
                These students do not meet the 75% minimum aggregate requirement. Immediate parental notification & mentor counseling required.
              </span>
              <button
                type="button"
                onClick={() =>
                  alert(`Sent bulk SMS & email alerts to all ${lowAttendanceStudents.length} parents and mentors!`)
                }
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notify All Parents & Mentors</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 uppercase font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">S.No</th>
                    <th className="p-3 w-32">Roll Number</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3 text-center">Department</th>
                    <th className="p-3 text-center">Batch ID</th>
                    <th className="p-3 text-center">Attendance %</th>
                    <th className="p-3">Assigned Mentor</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowAttendanceStudents.slice(0, 100).map((std, idx) => (
                    <tr key={std.id} className="hover:bg-red-50/40">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{std.roll_no}</td>
                      <td className="p-3 font-medium text-slate-900">{std.name}</td>
                      <td className="p-3 text-slate-500 text-xs">{std.father_name}</td>
                      <td className="p-3 text-center text-xs font-bold text-slate-700">{std.department}</td>
                      <td className="p-3 text-center font-mono font-bold text-[#1A3B70]">
                        {std.batch_id}
                      </td>
                      <td className="p-3 text-center font-mono">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          {std.attendance_pct}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 text-xs font-medium">
                        {std.mentor_name}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            alert(`Notice generated for ${std.name} (${std.roll_no}) sent to parent ${std.father_name}`)
                          }
                          className="px-2.5 py-1 text-xs bg-[#1A3B70] text-white rounded hover:bg-[#0F2C59] font-medium"
                        >
                          Send Notice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ADD RECORDS */}
        {activeTab === 'add-forms' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form 1: Add Student */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-sm font-bold text-[#1A3B70]">
                <GraduationCap className="w-4 h-4" />
                <span>Add New Student</span>
              </div>
              <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll Number:</label>
                  <input
                    type="text"
                    value={newStdRoll}
                    onChange={(e) => setNewStdRoll(e.target.value.toUpperCase())}
                    placeholder="e.g. 25CSE0131"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name:</label>
                  <input
                    type="text"
                    value={newStdName}
                    onChange={(e) => setNewStdName(e.target.value)}
                    placeholder="e.g. Rohith Varma"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name:</label>
                  <input
                    type="text"
                    value={newStdFather}
                    onChange={(e) => setNewStdFather(e.target.value)}
                    placeholder="e.g. K. V. Varma"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign to Batch:</label>
                  <select
                    value={newStdBatch}
                    onChange={(e) => setNewStdBatch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-bold text-[#1A3B70] bg-white outline-none"
                  >
                    {batches.slice(0, 50).map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.department})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded text-xs transition-colors mt-2"
                >
                  Save Student
                </button>
              </form>
            </div>

            {/* Form 2: Add Faculty */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-sm font-bold text-[#1A3B70]">
                <Users className="w-4 h-4" />
                <span>Add New Faculty Member</span>
              </div>
              <form onSubmit={handleAddFacultySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty ID:</label>
                  <input
                    type="text"
                    value={newFacId}
                    onChange={(e) => setNewFacId(e.target.value.toUpperCase())}
                    placeholder="e.g. FAC201"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty Name:</label>
                  <input
                    type="text"
                    value={newFacName}
                    onChange={(e) => setNewFacName(e.target.value)}
                    placeholder="e.g. Dr. S. Anitha"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation:</label>
                  <input
                    type="text"
                    value={newFacDesig}
                    onChange={(e) => setNewFacDesig(e.target.value)}
                    placeholder="e.g. Associate Professor"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department:</label>
                  <select
                    value={newFacDept}
                    onChange={(e) => setNewFacDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded text-xs transition-colors mt-2"
                >
                  Save Faculty
                </button>
              </form>
            </div>

            {/* Form 3: Add Course */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-sm font-bold text-[#1A3B70]">
                <BookOpen className="w-4 h-4" />
                <span>Add New Course</span>
              </div>
              <form onSubmit={handleAddCourseSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code:</label>
                  <input
                    type="text"
                    value={newCrsCode}
                    onChange={(e) => setNewCrsCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CS2109"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono uppercase focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title:</label>
                  <input
                    type="text"
                    value={newCrsName}
                    onChange={(e) => setNewCrsName(e.target.value)}
                    placeholder="e.g. REINFORCEMENT LEARNING"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department:</label>
                  <select
                    value={newCrsDept}
                    onChange={(e) => setNewCrsDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded text-xs transition-colors mt-2"
                >
                  Save Course
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: ALL STUDENTS DIRECTORY */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wide">
                  Complete University Student Directory ({students.length.toLocaleString()} Records)
                </h3>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded font-mono font-bold">
                Filtered: {filteredRoster.length} Students
              </span>
            </div>

            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Dept:</span>
                  <select
                    value={selectedDeptFilter}
                    onChange={(e) => {
                      setSelectedDeptFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Sem:</span>
                  <select
                    value={selectedSemFilter}
                    onChange={(e) => {
                      setSelectedSemFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="ALL">All Semesters</option>
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Batch:</span>
                  <select
                    value={rosterBatchFilter}
                    onChange={(e) => {
                      setRosterBatchFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1 border border-slate-300 rounded bg-white font-bold text-[#1A3B70]"
                  >
                    <option value="ALL">All Batches</option>
                    {filteredBatches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} (30 Students)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => {
                      setRosterSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search roll, name, batch..."
                    className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#1A3B70] w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">S.No</th>
                    <th className="p-3 w-32">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3 text-center">Department</th>
                    <th className="p-3 text-center">Semester</th>
                    <th className="p-3 text-center">Batch ID</th>
                    <th className="p-3 text-center">Attendance %</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRoster.map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-mono text-slate-500">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-900">{std.roll_no}</td>
                      <td className="p-3 font-medium text-slate-900">{std.name}</td>
                      <td className="p-3 text-slate-500 text-xs">{std.father_name}</td>
                      <td className="p-3 text-center font-semibold text-slate-700">{std.department}</td>
                      <td className="p-3 text-center font-mono text-slate-600">{std.year_sem}</td>
                      <td className="p-3 text-center">
                        <span className="font-mono text-xs font-bold bg-blue-50 text-[#1A3B70] px-2 py-0.5 rounded border border-blue-200">
                          {std.batch_id}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold">
                        <span className={std.attendance_pct < 75 ? 'text-red-600' : 'text-emerald-700'}>
                          {std.attendance_pct}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete student ${std.roll_no}?`)) {
                              deleteStudent(std.roll_no);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredRoster.length} students)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="font-mono font-bold px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40 flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
