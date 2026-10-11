import React, { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { Batch, Student } from '../types';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  Layers,
  PlusCircle,
  CheckCircle2,
  FolderPlus,
  BookOpen,
  ArrowRight,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Square,
  Split,
  Shuffle,
  ShieldCheck,
  Send,
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
    addBatch,
    deleteBatch,
    assignStudentToBatch,
    bulkAssignBatch,
    autoDivideStudentsIntoBatches,
    addStudent,
    addFaculty,
    addCourse,
    deleteStudent,
    resetAllData,
  } = usePortal();

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'batches' | 'alerts' | 'add-forms' | 'roster'>('batches');

  // Search & Batch filter for student roster
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterBatchFilter, setRosterBatchFilter] = useState('ALL');

  // Bulk Selection for Batch Assignment
  const [selectedRollNos, setSelectedRollNos] = useState<string[]>([]);
  const [targetBulkBatch, setTargetBulkBatch] = useState<string>(batches[0]?.name || '25CAIBTAIB01');

  // Feedback banner
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchDept, setNewBatchDept] = useState('CSE-AIML');
  const [newBatchYearSem, setNewBatchYearSem] = useState('2-1');
  const [newBatchDesc, setNewBatchDesc] = useState('');

  // New Student Form State
  const [newStdRoll, setNewStdRoll] = useState('');
  const [newStdName, setNewStdName] = useState('');
  const [newStdFather, setNewStdFather] = useState('');
  const [newStdBatch, setNewStdBatch] = useState(batches[0]?.name || '25CAIBTAIB01');
  const [newStdDept, setNewStdDept] = useState('CSE-AIML');

  // New Faculty Form State
  const [newFacId, setNewFacId] = useState('');
  const [newFacName, setNewFacName] = useState('');
  const [newFacDept, setNewFacDept] = useState('CSE-AIML');
  const [newFacDesig, setNewFacDesig] = useState('Assistant Professor');
  const [newFacEmail, setNewFacEmail] = useState('');

  // New Course Form State
  const [newCrsCode, setNewCrsCode] = useState('');
  const [newCrsName, setNewCrsName] = useState('');
  const [newCrsLtp, setNewCrsLtp] = useState('3-0-2');
  const [newCrsDept, setNewCrsDept] = useState('CSE-AIML');

  // Metrics
  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  const lowAttendanceStudents = useMemo(
    () => students.filter((s) => s.attendance_pct < 75),
    [students]
  );
  const totalBatches = batches.length;

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

  // Filtered roster for table
  const filteredRoster = useMemo(() => {
    return students.filter((s) => {
      const matchBatch =
        rosterBatchFilter === 'ALL' ||
        s.batch_id.toLowerCase() === rosterBatchFilter.toLowerCase();
      const matchSearch =
        !rosterSearch.trim() ||
        s.roll_no.toLowerCase().includes(rosterSearch.toLowerCase()) ||
        s.name.toLowerCase().includes(rosterSearch.toLowerCase());
      return matchBatch && matchSearch;
    });
  }, [students, rosterBatchFilter, rosterSearch]);

  // Handle Create New Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    addBatch({
      name: newBatchName.trim().toUpperCase(),
      displayName: `Batch (${newBatchName.trim().toUpperCase()})`,
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

  // Handle Select All / Deselect All for Roster
  const handleToggleSelectAll = () => {
    if (selectedRollNos.length === filteredRoster.length) {
      setSelectedRollNos([]);
    } else {
      setSelectedRollNos(filteredRoster.map((s) => s.roll_no));
    }
  };

  const handleToggleStudentSelection = (rollNo: string) => {
    setSelectedRollNos((prev) =>
      prev.includes(rollNo) ? prev.filter((r) => r !== rollNo) : [...prev, rollNo]
    );
  };

  // Handle Auto-Divide All Students evenly across batches
  const handleAutoDivide = () => {
    const batchNames = batches.map((b) => b.name);
    if (batchNames.length === 0) return;
    if (
      window.confirm(
        `Auto-divide all ${students.length} students evenly across the ${batchNames.length} batches (${batchNames.join(
          ', '
        )})?`
      )
    ) {
      autoDivideStudentsIntoBatches(batchNames);
      setAlertMessage(
        `All ${students.length} students distributed evenly across ${batchNames.length} batches!`
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
      mentor_name: 'Dr. K. Venkataswamy',
      cgpa: 8.0,
      backlogs: 0,
      attendance_pct: 85.0,
      email: `${newStdRoll.toLowerCase()}@sru.edu.in`,
      phone: '+91 98480 00000',
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

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Admin Header */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrative Control Panel
              </span>
              <span className="text-xs text-slate-500">SRU Academic Management System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A3B70] mt-1">
              Admin Dashboard & Batch Management
            </h1>
            <p className="text-xs text-slate-600">
              Manage Batches, Student Cohorts, Faculty, and Attendance Compliance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/faculty/attendance')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Faculty Attendance View →
            </button>
            <button
              type="button"
              onClick={resetAllData}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs rounded-lg border border-slate-200 transition-colors"
              title="Reset state to initial 100 students and default batches"
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

        {/* TOP KPI METRICS: Total Students, Total Faculty, Low Attendance Alerts (< 75%), Total Batches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Total Enrolled Students</p>
              <h3 className="text-3xl font-extrabold text-[#1A3B70] mt-1 font-mono">{totalStudents}</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">100 Seeded (SRU2024001 - SRU2024100)</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Total Faculty */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Teaching Faculty</p>
              <h3 className="text-3xl font-extrabold text-[#1A3B70] mt-1 font-mono">{totalFaculty}</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Active Professors & Mentors</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Low Attendance Alerts (< 75%) */}
          <div
            onClick={() => setActiveTab('alerts')}
            className="bg-white p-5 rounded-xl border border-red-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-red-400 transition-colors"
          >
            <div>
              <p className="text-xs uppercase font-bold text-red-600 flex items-center gap-1">
                <span>Low Attendance (&lt;75%)</span>
              </p>
              <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-mono">
                {lowAttendanceStudents.length}
              </h3>
              <p className="text-[11px] text-red-600 font-medium mt-1 underline">Click to view at-risk list</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Total Batches */}
          <div
            onClick={() => setActiveTab('batches')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
          >
            <div>
              <p className="text-xs uppercase font-bold text-slate-500">Total Batches / Cohorts</p>
              <h3 className="text-3xl font-extrabold text-[#1A3B70] mt-1 font-mono">{totalBatches}</h3>
              <p className="text-[11px] text-blue-700 font-medium mt-1">CSE-AIML & ECE Sections</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigation for Admin Modules */}
        <div className="bg-white border-b border-slate-200 rounded-t-xl px-4 flex space-x-2 overflow-x-auto shadow-2xs">
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
            <span>1. Batch Management ({batches.length})</span>
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
            <span>2. Low Attendance Alerts ({lowAttendanceStudents.length})</span>
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
            <span>3. Add Records (Student / Faculty / Course)</span>
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
            <span>4. All Students Directory ({students.length})</span>
          </button>
        </div>

        {/* TAB 1: BATCH MANAGEMENT MODULE (Core Requirement) */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            {/* Top Toolbar: Create New Batch & Auto-divide */}
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
                      Batch Name / Code (e.g., 25CAIBTAIB04):
                    </label>
                    <input
                      type="text"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value.toUpperCase())}
                      placeholder="e.g. 25CAIBTAIB04"
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
                        <option value="CSE-AIML">CSE-AIML</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="MECH">MECH</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Year / Semester:
                      </label>
                      <select
                        value={newBatchYearSem}
                        onChange={(e) => setNewBatchYearSem(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium"
                      >
                        <option value="2-1">2-1 (II-I)</option>
                        <option value="2-2">2-2 (II-II)</option>
                        <option value="3-1">3-1 (III-I)</option>
                        <option value="3-2">3-2 (III-II)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Batch Description / Section:
                    </label>
                    <input
                      type="text"
                      value={newBatchDesc}
                      onChange={(e) => setNewBatchDesc(e.target.value)}
                      placeholder="e.g. Artificial Intelligence Section D"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-[#1A3B70]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1A3B70] hover:bg-[#0F2C59] text-white font-bold rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Batch</span>
                  </button>
                </form>
              </div>

              {/* Batches Overview Table */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="bg-[#1A3B70] text-white px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Existing Batches & Assigned Student Headcount</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoDivide}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      title="Evenly divide 100 students across active batches"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Auto-Divide 100 Students</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Batch Name</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Year/Sem</th>
                          <th className="py-2.5 px-3 text-center">Assigned Students</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {batches.map((b) => {
                          const count = batchCounts[b.name] || 0;
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
                                      setRosterBatchFilter(b.name);
                                      setActiveTab('roster');
                                    }}
                                    className="px-2 py-0.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded"
                                  >
                                    View Roster
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
                    Total Students across all batches: <strong>{students.length}</strong>
                  </span>
                  <span>Batch changes reflect instantly across Faculty Attendance and Student views.</span>
                </div>
              </div>
            </div>

            {/* Student Batch Assignment & Bulk Reassignment Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Split className="w-4 h-4 text-[#1A3B70]" />
                  <h3 className="font-bold text-sm text-[#1A3B70]">
                    Assign, Divide or Reassign Students into Specific Batches
                  </h3>
                </div>

                {/* Bulk Actions Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-600">
                    Selected: <strong>{selectedRollNos.length}</strong> students
                  </span>

                  <select
                    value={targetBulkBatch}
                    onChange={(e) => setTargetBulkBatch(e.target.value)}
                    className="text-xs px-2.5 py-1.5 border border-slate-300 rounded font-bold text-[#1A3B70] bg-white outline-none"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.name}>
                        Move to {b.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleBulkReassign}
                    disabled={selectedRollNos.length === 0}
                    className="px-3 py-1.5 bg-[#1A3B70] hover:bg-[#0F2C59] disabled:bg-slate-300 text-white rounded text-xs font-bold transition-colors"
                  >
                    Reassign Selected
                  </button>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium flex items-center gap-1.5"
                  >
                    {selectedRollNos.length === filteredRoster.length && filteredRoster.length > 0 ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-700" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>
                      {selectedRollNos.length === filteredRoster.length
                        ? 'Deselect All'
                        : 'Select All in View'}
                    </span>
                  </button>

                  <select
                    value={rosterBatchFilter}
                    onChange={(e) => setRosterBatchFilter(e.target.value)}
                    className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="ALL">All Batches ({students.length})</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.name}>
                        Filter: {b.name} ({batchCounts[b.name] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    placeholder="Search Roll No or Name..."
                    className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#1A3B70] w-48 sm:w-60"
                  />
                </div>
              </div>

              {/* Interactive Roster Table for Batch Reassignment */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 w-10 text-center">Select</th>
                      <th className="p-2.5 w-12 text-center">S.No</th>
                      <th className="p-2.5 w-32">Roll No</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Father's Name</th>
                      <th className="p-2.5 text-center">Attendance %</th>
                      <th className="p-2.5 text-center">Current Batch</th>
                      <th className="p-2.5 text-center w-48">Reassign Individually</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRoster.map((std, idx) => {
                      const isSelected = selectedRollNos.includes(std.roll_no);
                      return (
                        <tr
                          key={std.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-blue-50/60' : ''
                          }`}
                        >
                          <td className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudentSelection(std.roll_no)}
                              aria-label={`Select ${std.name}`}
                              className="w-4 h-4 text-[#1A3B70] rounded border-slate-300 cursor-pointer"
                            />
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">
                            {std.roll_no}
                          </td>
                          <td className="p-2.5 font-medium text-slate-800">{std.name}</td>
                          <td className="p-2.5 text-slate-500">{std.father_name}</td>
                          <td className="p-2.5 text-center font-mono font-semibold">
                            <span
                              className={
                                std.attendance_pct < 75 ? 'text-red-600' : 'text-emerald-700'
                              }
                            >
                              {std.attendance_pct}%
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="font-mono text-xs font-bold bg-slate-100 text-[#1A3B70] px-2 py-0.5 rounded border border-slate-200">
                              {std.batch_id}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <select
                              value={std.batch_id}
                              onChange={(e) => assignStudentToBatch(std.roll_no, e.target.value)}
                              aria-label={`Reassign batch for ${std.name}`}
                              className="text-xs px-2 py-1 border border-slate-300 rounded font-medium bg-white focus:ring-1 focus:ring-[#1A3B70] outline-none"
                            >
                              {batches.map((b) => (
                                <option key={b.id} value={b.name}>
                                  {b.name}
                                </option>
                              ))}
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
        )}

        {/* TAB 2: LOW ATTENDANCE ALERTS (< 75%) */}
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">S.No</th>
                    <th className="p-3 w-32">Roll Number</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3 text-center">Batch ID</th>
                    <th className="p-3 text-center">Attendance %</th>
                    <th className="p-3">Assigned Mentor</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowAttendanceStudents.map((std, idx) => (
                    <tr key={std.id} className="hover:bg-red-50/40">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{std.roll_no}</td>
                      <td className="p-3 font-medium text-slate-900">{std.name}</td>
                      <td className="p-3 text-slate-500 text-xs">{std.father_name}</td>
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
                            alert(`Notice generated for ${std.name} (${std.roll_no}) sent to ${std.father_name}`)
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

        {/* TAB 3: ADD RECORDS (Students, Faculty, Courses) */}
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
                    placeholder="e.g. SRU2024101"
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
                    {batches.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.displayName}
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
                    placeholder="e.g. FAC004"
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
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
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
                    placeholder="e.g. CS2108"
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
                    placeholder="e.g. DEEP LEARNING ARCHITECTURES"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#1A3B70] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LTP Scheme:</label>
                  <input
                    type="text"
                    value={newCrsLtp}
                    onChange={(e) => setNewCrsLtp(e.target.value)}
                    placeholder="e.g. 3-0-2"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-[#1A3B70] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department:</label>
                  <select
                    value={newCrsDept}
                    onChange={(e) => setNewCrsDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white outline-none"
                  >
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
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

        {/* TAB 4: ALL STUDENTS DIRECTORY (Full 100 Students List) */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wide">
                  Complete University Student Directory (100 Records)
                </h3>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">
                Total: {students.length} Records
              </span>
            </div>

            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-700" />
                <span className="font-semibold text-slate-700">Filter Batch:</span>
                <select
                  value={rosterBatchFilter}
                  onChange={(e) => setRosterBatchFilter(e.target.value)}
                  className="px-2.5 py-1 border border-slate-300 rounded bg-white font-medium"
                >
                  <option value="ALL">All Batches</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.displayName} ({batchCounts[b.name] || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Filter by roll number or name..."
                  className="pl-8 pr-3 py-1 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#1A3B70] w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 uppercase font-semibold text-xs border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">S.No</th>
                    <th className="p-3 w-32">Roll No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Father's Name</th>
                    <th className="p-3 text-center">Batch ID</th>
                    <th className="p-3 text-center">CGPA</th>
                    <th className="p-3 text-center">Backlogs</th>
                    <th className="p-3 text-center">Attendance %</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoster.map((std, idx) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{std.roll_no}</td>
                      <td className="p-3 font-medium text-slate-900">{std.name}</td>
                      <td className="p-3 text-slate-500 text-xs">{std.father_name}</td>
                      <td className="p-3 text-center">
                        <span className="font-mono text-xs font-bold bg-blue-50 text-[#1A3B70] px-2 py-0.5 rounded border border-blue-200">
                          {std.batch_id}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono">{std.cgpa}</td>
                      <td className="p-3 text-center font-mono">{std.backlogs}</td>
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
          </div>
        )}
      </main>
    </div>
  );
};
