import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { ClassType } from '../types';
import { DEPARTMENTS, SEMESTERS } from '../data/seedData';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import {
  Calendar,
  Clock,
  CheckCheck,
  XCircle,
  Save,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Layers,
  BookOpen,
  Edit3,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
  BarChart3,
  KeyRound,
} from 'lucide-react';

interface FacultyAttendanceProps {
  onNavigate: (route: string) => void;
}

export const FacultyAttendance: React.FC<FacultyAttendanceProps> = ({ onNavigate }) => {
  const {
    students,
    batches,
    courses,
    slots,
    currentUser,
    saveAttendanceForRoster,
  } = usePortal();

  // Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Dynamic Selection Toolbar States
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedYearSem, setSelectedYearSem] = useState('2-1');

  // Filter batches dynamically for selected department & semester
  const availableBatches = useMemo(() => {
    return batches.filter(
      (b) => b.department === selectedDept && b.year_sem === selectedYearSem
    );
  }, [batches, selectedDept, selectedYearSem]);

  // Selected Batch (defaults to first batch of filtered department/semester)
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  useEffect(() => {
    if (availableBatches.length > 0) {
      setSelectedBatch(availableBatches[0].name);
    } else {
      setSelectedBatch('ALL');
    }
  }, [availableBatches]);

  // Filter courses relevant to department & semester
  const availableCourses = useMemo(() => {
    const list = courses.filter(
      (c) => c.department === selectedDept && (c.year_sem === selectedYearSem || !c.year_sem)
    );
    if (list.length > 0) return list;
    return courses.filter((c) => c.department === selectedDept);
  }, [courses, selectedDept, selectedYearSem]);

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CS2101');

  useEffect(() => {
    if (availableCourses.length > 0) {
      setSelectedCourseCode(availableCourses[0].code);
    }
  }, [availableCourses]);

  // Timetable Slot Selection (ALLOW MULTIPLE SLOTS FOR A SINGLE PERIOD!)
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>(['slot-1']);
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Class Type: Lecture (L), Tutorial (T), Practical Lab (P)
  const [classType, setClassType] = useState<ClassType>('L');

  // "What was taught today" text box
  const [topicsCovered, setTopicsCovered] = useState<string>('');

  // Search filter inside roster
  const [searchQuery, setSearchQuery] = useState('');

  // Save feedback state
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Roster attendance status map: { [roll_no]: boolean } (true = present, false = absent)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});

  // Faculty should ONLY see students relevant to their department/semester filters!
  const filteredStudents = useMemo(() => {
    // 1. Strict Department Filter
    let result = students.filter((s) => s.department === selectedDept);

    // 2. Strict Semester Filter
    if (selectedYearSem) {
      result = result.filter((s) => s.year_sem === selectedYearSem);
    }

    // 3. Batch Filter (defaults to 30 students of selected batch)
    if (selectedBatch && selectedBatch !== 'ALL' && selectedBatch !== 'All Batches') {
      result = result.filter(
        (s) => s.batch_id.toLowerCase() === selectedBatch.toLowerCase()
      );
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.roll_no.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [students, selectedDept, selectedYearSem, selectedBatch, searchQuery]);

  // Initialize roster status when students change
  useEffect(() => {
    setAttendanceMap((prev) => {
      const next: Record<string, boolean> = { ...prev };
      filteredStudents.forEach((s) => {
        if (next[s.roll_no] === undefined) {
          next[s.roll_no] = true; // Default present
        }
      });
      return next;
    });
  }, [filteredStudents]);

  // Multi-slot toggle
  const toggleSlotSelection = (slotId: string) => {
    setSelectedSlotIds((prev) => {
      if (prev.includes(slotId)) {
        if (prev.length === 1) return prev; // Keep at least one slot
        return prev.filter((id) => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  // Action: Check All
  const handleCheckAll = () => {
    setAttendanceMap((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        next[s.roll_no] = true;
      });
      return next;
    });
  };

  // Action: UnCheck All (Red Button)
  const handleUnCheckAll = () => {
    setAttendanceMap((prev) => {
      const next = { ...prev };
      filteredStudents.forEach((s) => {
        next[s.roll_no] = false;
      });
      return next;
    });
  };

  // Toggle single student
  const toggleStudentStatus = (rollNo: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [rollNo]: !prev[rollNo],
    }));
  };

  // Live KPI metrics for current roster
  const totalRosterCount = filteredStudents.length;
  const presentCount = filteredStudents.filter((s) => attendanceMap[s.roll_no] !== false).length;
  const absentCount = totalRosterCount - presentCount;
  const attendanceRate = totalRosterCount > 0 ? Math.round((presentCount / totalRosterCount) * 100) : 0;

  // Selected course details
  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || availableCourses[0];

  // Save Attendance to Database / Context
  const handleSaveAttendance = () => {
    setValidationError(null);

    if (selectedSlotIds.length === 0) {
      setValidationError('Please select at least one timetable slot.');
      return;
    }

    if (!topicsCovered.trim()) {
      setValidationError('Please enter "What was taught today" before submitting attendance.');
      return;
    }

    const rosterData = filteredStudents.map((s) => ({
      rollNo: s.roll_no,
      name: s.name,
      isPresent: attendanceMap[s.roll_no] !== false,
    }));

    saveAttendanceForRoster({
      batchName: selectedBatch,
      department: selectedDept,
      yearSem: selectedYearSem,
      courseCode: selectedCourseCode,
      date,
      slotIds: selectedSlotIds,
      classType,
      topicsCovered: topicsCovered.trim(),
      rosterStatuses: rosterData,
    });

    const slotNamesText = slots
      .filter((s) => selectedSlotIds.includes(s.id))
      .map((s) => s.name)
      .join(', ');

    setSaveSuccessMessage(
      `Attendance recorded for ${slotNamesText} (${classType === 'L' ? 'Lecture' : classType === 'T' ? 'Tutorial' : 'Practical Lab'})! Batch: ${selectedBatch} — ${presentCount} Present, ${absentCount} Absent.`
    );

    // Keep topicsCovered or clear
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Equal Access Faculty Banner */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Faculty Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentUser?.name || 'Dr. K. Venkataswamy'} ({currentUser?.username || 'FAC001'})
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                Equal Faculty Permissions
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A3B70] mt-1">
              Mark Student Attendance & Session Log
            </h1>
            <p className="text-xs text-slate-600">
              Department of {selectedDept} • Semester {selectedYearSem} • Batch: <strong className="text-blue-900">{selectedBatch}</strong> ({totalRosterCount} Students)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Update your faculty account password"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/admin/dashboard')}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              title="All faculty have equal access to Admin dashboard metrics & batch management"
            >
              <BarChart3 className="w-4 h-4 text-purple-700" />
              <span>Admin Dashboard & Metrics →</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar className="w-4 h-4 text-blue-700" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs font-semibold bg-transparent border-none outline-none cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveAttendance}
              className="bg-[#28A745] hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Submit Attendance</span>
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg shadow-xs flex items-center justify-between text-xs sm:text-sm text-emerald-900 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{saveSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r-lg text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* 1. DYNAMIC SELECTION TOOLBAR (Department, Semester, Course, Batch) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A3B70] uppercase tracking-wider">
              <Filter className="w-4 h-4" />
              <span>Academic Filter Toolbar (Shows Department & Semester Specific Students)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Available Batches for {selectedDept} {selectedYearSem}: <strong>{availableBatches.length}</strong> (30 students each)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Dropdown (74 CSE, 20-30 other depts) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>Department:</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-bold text-slate-800"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code} - {dept.name} ({dept.batchCount} Batches)
                  </option>
                ))}
              </select>
            </div>

            {/* Year/Semester Dropdown (1-1 to 4-2) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Semester:</span>
              </label>
              <select
                value={selectedYearSem}
                onChange={(e) => setSelectedYearSem(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-medium"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Course/Subject Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>Course / Subject:</span>
              </label>
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-medium"
              >
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Dropdown (Dynamically populated from 74 CSE or other batches) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>Batch (30 Students per Batch):</span>
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-blue-600 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-blue-50/60 font-bold text-[#1A3B70]"
              >
                {availableBatches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.student_count} Students)
                  </option>
                ))}
                <option value="ALL">All Batches in {selectedDept} {selectedYearSem} Combined</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. TIMETABLE SLOTS (Multiple Slots Allowed for Single Period, Start/End Time Only!) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1A3B70]" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                Timetable Slots (Multiple slots can be selected for a double period or lab!)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Selected Slots:</span>
              <span className="font-bold font-mono text-[#1A3B70] bg-blue-100 px-2 py-0.5 rounded">
                {selectedSlotIds.length} Slot(s) Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {slots.map((slot) => {
              const isChecked = selectedSlotIds.includes(slot.id);
              return (
                <div
                  key={slot.id}
                  onClick={() => toggleSlotSelection(slot.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isChecked
                      ? 'border-[#1A3B70] bg-blue-50 shadow-xs ring-1 ring-[#1A3B70]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isChecked ? 'text-[#1A3B70]' : 'text-slate-800'}`}>
                      {slot.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSlotSelection(slot.id)}
                      className="w-4 h-4 text-[#1A3B70] rounded border-slate-300 focus:ring-[#1A3B70] cursor-pointer"
                    />
                  </div>
                  {/* Start time and End time ONLY (no subject names) */}
                  <div className="mt-2 text-xs font-mono font-semibold text-slate-700">
                    {slot.start_time}–{slot.end_time}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                        isChecked ? 'bg-[#1A3B70] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isChecked ? 'SELECTED' : 'OFF'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. FACULTY ATTENDANCE OPTIONS: Class Type (L/T/P) & "What was taught today" Textbox */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-[#1A3B70] uppercase tracking-wide">
            <Edit3 className="w-4 h-4" />
            <span>Session Classification & Teaching Log</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Class Type Selection: Lecture (L), Tutorial (T), Practical Lab (P) */}
            <div className="md:col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Type of Class for Attendance:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setClassType('L')}
                  className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-all border ${
                    classType === 'L'
                      ? 'bg-[#1A3B70] text-white border-[#1A3B70] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm font-black">L</span>
                  <span className="text-[10px] font-normal">Lecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassType('T')}
                  className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-all border ${
                    classType === 'T'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm font-black">T</span>
                  <span className="text-[10px] font-normal">Tutorial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClassType('P')}
                  className={`py-2 px-1 text-center rounded-md font-bold text-xs transition-all border ${
                    classType === 'P'
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm font-black">P</span>
                  <span className="text-[10px] font-normal">Practical Lab</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Selected: <strong>{classType === 'L' ? 'Lecture (Theory)' : classType === 'T' ? 'Tutorial (Problem Solving)' : 'Practical Laboratory Experiment'}</strong>
              </p>
            </div>

            {/* "What was taught today" Textbox */}
            <div className="md:col-span-8 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>What was taught today (Session Topics & Learning Outcomes):</span>
                <span className="text-[11px] font-normal text-slate-400">Required before submission</span>
              </label>
              <textarea
                value={topicsCovered}
                onChange={(e) => setTopicsCovered(e.target.value)}
                placeholder="e.g. Unit 3: Graph Traversal Algorithms — BFS & DFS implementation with queue/stack, cycle detection, and time complexity analysis..."
                rows={3}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1A3B70] bg-white text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* 4. ACTION BAR & LIVE COUNTER METRICS */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCheckAll}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1A3B70] border border-blue-300 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-blue-700" />
              <span>Check All (Present)</span>
            </button>

            <button
              type="button"
              onClick={handleUnCheckAll}
              className="px-3.5 py-2 bg-[#DC3545] hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <XCircle className="w-4 h-4" />
              <span>UnCheck All (Absent)</span>
            </button>

            {/* Quick search input */}
            <div className="relative ml-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Roll No or Name..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1A3B70] w-48 sm:w-60"
              />
            </div>
          </div>

          {/* Live Attendance Metric Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500">Roster Students:</span>{' '}
              <strong className="font-mono text-slate-800 font-bold">{totalRosterCount}</strong>
            </div>

            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
              <span>Present:</span>{' '}
              <strong className="font-mono font-bold text-emerald-700">{presentCount}</strong>
            </div>

            <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 text-red-800">
              <span>Absent:</span>{' '}
              <strong className="font-mono font-bold text-red-600">{absentCount}</strong>
            </div>

            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-900">
              <span>Attendance Rate:</span>{' '}
              <strong className="font-mono font-bold">{attendanceRate}%</strong>
            </div>
          </div>
        </div>

        {/* 5. STUDENT ROSTER ATTENDANCE TABLE */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm tracking-wide">
                Student Attendance Roster — Batch: {selectedBatch} ({selectedDept} Sem {selectedYearSem})
              </h3>
            </div>
            <div className="text-xs text-blue-200 flex items-center gap-2 font-mono">
              <span>Class Type: [{classType}]</span>
              <span>•</span>
              <span>{selectedCourse?.name || selectedCourseCode}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-center w-14">S.No</th>
                  <th className="py-3 px-4 w-36">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-slate-500">Father's Name</th>
                  <th className="py-3 px-4 text-center w-28">Dept / Sem</th>
                  <th className="py-3 px-4 text-center w-36">Batch ID</th>
                  <th className="py-3 px-4 text-center w-28">Cum. %</th>
                  <th className="py-3 px-4 text-center w-36">Status Checkbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No students found for Department: <strong>{selectedDept}</strong>, Semester: <strong>{selectedYearSem}</strong>, Batch: <strong>{selectedBatch}</strong>.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std, idx) => {
                    const isPresent = attendanceMap[std.roll_no] !== false;
                    return (
                      <tr
                        key={std.id}
                        onClick={() => toggleStudentStatus(std.roll_no)}
                        className={`cursor-pointer transition-colors ${
                          isPresent ? 'hover:bg-emerald-50/40' : 'bg-red-50/30 hover:bg-red-50/60'
                        }`}
                      >
                        <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                          {std.roll_no}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{std.name}</span>
                            {std.attendance_pct < 75 && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-semibold">
                                &lt;75% Alert
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 text-xs">
                          {std.father_name}
                        </td>
                        <td className="py-2.5 px-4 text-center text-xs font-mono text-slate-600">
                          {std.department} ({std.year_sem})
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className="font-mono text-xs bg-slate-100 text-[#1A3B70] px-2 py-0.5 rounded font-semibold border border-slate-200">
                            {std.batch_id}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-xs">
                          <span className={std.attendance_pct < 75 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                            {std.attendance_pct}%
                          </span>
                        </td>
                        <td
                          className="py-2.5 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="checkbox"
                              checked={isPresent}
                              onChange={() => toggleStudentStatus(std.roll_no)}
                              aria-label={`Mark attendance for ${std.name}`}
                              className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span
                              onClick={() => toggleStudentStatus(std.roll_no)}
                              className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer select-none ${
                                isPresent
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {isPresent ? 'PRESENT' : 'ABSENT'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Persistent Save Button */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Showing <strong>{filteredStudents.length}</strong> students for Batch: <strong>{selectedBatch}</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCheckAll}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="bg-[#28A745] hover:bg-green-700 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Submit Attendance & Teaching Log</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
