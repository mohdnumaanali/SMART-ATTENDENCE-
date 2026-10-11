import React, { useState, useEffect, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { TimetableSlot } from '../types';
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
  Sparkles,
  Info,
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

  // Dynamic Selection Toolbar States
  const [selectedDept, setSelectedDept] = useState('CSE-AIML');
  const [selectedYearSem, setSelectedYearSem] = useState('2-1');
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS2101');
  // Default to first batch '25CAIBTAIB01'
  const [selectedBatch, setSelectedBatch] = useState<string>('25CAIBTAIB01');

  // Timetable Slot Selection (Slots I through VIII)
  const [activeSlotId, setActiveSlotId] = useState<string>('slot-1');
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Search filter inside roster
  const [searchQuery, setSearchQuery] = useState('');

  // Save feedback state
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Roster attendance status map: { [roll_no]: boolean } (true = present, false = absent)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({});

  // Dynamic batch options based on department & sem
  const batchOptions = useMemo(() => {
    return batches.filter(
      (b) => b.department === selectedDept || selectedDept === 'ALL'
    );
  }, [batches, selectedDept]);

  // Filter students based strictly on dynamic Batch selection & Department
  const filteredStudents = useMemo(() => {
    let result = students;

    // Filter by Dept
    if (selectedDept && selectedDept !== 'ALL') {
      result = result.filter((s) => s.department === selectedDept);
    }

    // Filter by Batch (CRITICAL REQUIREMENT)
    if (selectedBatch && selectedBatch !== 'ALL' && selectedBatch !== 'All Batches') {
      result = result.filter(
        (s) => s.batch_id.toLowerCase() === selectedBatch.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.roll_no.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [students, selectedDept, selectedBatch, searchQuery]);

  // Initialize or update attendance map when roster changes
  useEffect(() => {
    setAttendanceMap((prev) => {
      const next: Record<string, boolean> = { ...prev };
      // Default new students in view to present (true)
      filteredStudents.forEach((s) => {
        if (next[s.roll_no] === undefined) {
          next[s.roll_no] = true;
        }
      });
      return next;
    });
  }, [filteredStudents]);

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

  // Selected Slot details
  const activeSlot = slots.find((s) => s.id === activeSlotId) || slots[0];
  const selectedCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  // Save Attendance to Database / Context
  const handleSaveAttendance = () => {
    const rosterData = filteredStudents.map((s) => ({
      rollNo: s.roll_no,
      name: s.name,
      isPresent: attendanceMap[s.roll_no] !== false,
    }));

    saveAttendanceForRoster(
      selectedBatch,
      activeSlot,
      selectedCourseCode,
      date,
      rosterData
    );

    setSaveSuccessMessage(
      `Attendance for ${activeSlot.name} (${selectedCourse.name}) successfully recorded! ${presentCount} Present, ${absentCount} Absent persisted to database.`
    );

    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Title & Faculty Header */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Faculty Attendance Portal
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentUser?.name || 'Dr. K. Venkataswamy'} ({currentUser?.username || 'FAC001'})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A3B70] mt-1">
              Mark Student Period Attendance
            </h1>
            <p className="text-xs text-slate-600">
              Department of {selectedDept} • Timetable Slots I through VIII
            </p>
          </div>

          <div className="flex items-center gap-3">
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
              <span>Save Attendance</span>
            </button>
          </div>
        </div>

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

        {/* 1. DYNAMIC SELECTION TOOLBAR (Batch & Filters Selection) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-xs font-bold text-[#1A3B70] uppercase tracking-wider">
            <Filter className="w-4 h-4" />
            <span>Academic Selection & Batch Filter Toolbar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>Department:</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-medium"
              >
                <option value="CSE-AIML">CSE-AIML (Artificial Intelligence)</option>
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="ALL">All Departments</option>
              </select>
            </div>

            {/* Year/Semester Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Year / Semester:</span>
              </label>
              <select
                value={selectedYearSem}
                onChange={(e) => setSelectedYearSem(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-medium"
              >
                <option value="2-1">II Year - I Semester (2-1)</option>
                <option value="2-2">II Year - II Semester (2-2)</option>
                <option value="3-1">III Year - I Semester (3-1)</option>
                <option value="3-2">III Year - II Semester (3-2)</option>
                <option value="4-1">IV Year - I Semester (4-1)</option>
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
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Batch Dropdown (CRITICAL REQUIREMENT) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>Select Batch (Section/Lab):</span>
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-[#1A3B70] outline-none bg-blue-50/50 font-bold text-[#1A3B70]"
              >
                <option value="ALL">All Batches (Combined Class - {students.length} Students)</option>
                {batchOptions.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.displayName}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-blue-700 mt-1 block">
                {selectedBatch === 'ALL'
                  ? 'Showing all batches combined'
                  : `Roster filtered strictly to batch: ${selectedBatch}`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. TIMETABLE PERIOD SLOTS (Slots I through VIII) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1A3B70]" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                Daily Timetable Slots (Click checkbox to activate period)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Active Lecture Period: <strong className="text-[#1A3B70]">{activeSlot.name} ({activeSlot.time_range})</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {slots.map((slot) => {
              const isSelected = activeSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setActiveSlotId(slot.id)}
                  className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-[#1A3B70] bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#1A3B70]' : 'text-slate-800'}`}>
                      {slot.name}
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setActiveSlotId(slot.id)}
                      className="w-4 h-4 text-[#1A3B70] rounded border-slate-300 focus:ring-[#1A3B70] cursor-pointer"
                    />
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    {slot.time_range}
                  </div>
                  <div className="mt-1">
                    <span className={`text-[9px] px-1 py-0.2 rounded font-semibold uppercase ${isSelected ? 'bg-[#1A3B70] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {isSelected ? 'ACTIVE' : 'READY'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. ACTION BAR & LIVE COUNTER METRICS */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Action Buttons: Check All & UnCheck All (Red Button) */}
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

            {/* Quick search input within roster */}
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
              <span className="text-slate-500">Roster Total:</span>{' '}
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

        {/* 4. STUDENT ROSTER ATTENDANCE TABLE */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm tracking-wide">
                Student Attendance Roster — {selectedBatch === 'ALL' ? 'All Batches' : `Batch: ${selectedBatch}`}
              </h3>
            </div>
            <div className="text-xs text-blue-200 flex items-center gap-2 font-mono">
              <span>Selected Course: {selectedCourse.code} ({selectedCourse.name})</span>
              <span>•</span>
              <span>{activeSlot.name}</span>
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
                  <th className="py-3 px-4 text-center w-36">Batch ID</th>
                  <th className="py-3 px-4 text-center w-28">Cum. %</th>
                  <th className="py-3 px-4 text-center w-36">Status Checkbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No students found for Batch: <strong>{selectedBatch}</strong>.
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
              Showing <strong>{filteredStudents.length}</strong> of {students.length} total students
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
                <span>Save Attendance Records</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
