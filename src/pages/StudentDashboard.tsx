import React from 'react';
import { usePortal } from '../context/PortalContext';
import { StudentNav } from '../components/StudentNav';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  UserCheck,
  Calendar,
  Layers,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (route: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    students,
    batches,
    getStudentCourseAttendance,
    getStudentLastWeekAttendance,
    switchStudentForDemo,
  } = usePortal();

  // Active student record
  const currentRoll = currentUser?.studentData?.roll_no || 'SRU2024001';
  const student =
    students.find((s) => s.roll_no.toUpperCase() === currentRoll.toUpperCase()) ||
    students[0];

  // Assigned batch details
  const assignedBatch = batches.find((b) => b.name === student.batch_id);

  // Analytics for this student
  const courseAttendance = getStudentCourseAttendance(student.roll_no);
  const lastWeekAttendance = getStudentLastWeekAttendance(student.roll_no);

  const totalHeld = courseAttendance.reduce((acc, curr) => acc + curr.held, 0);
  const totalAttended = courseAttendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = Math.round((totalAttended / totalHeld) * 1000) / 10;

  const isLowAttendance = student.attendance_pct < 75;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Student Sub-navigation bar */}
      <StudentNav activeItem="home" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Banner */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#1A3B70] text-white p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback avatar
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center font-bold text-2xl text-[#1A3B70]">
                    {student.name.charAt(0)}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-xs"></span>
              </div>

              {/* Student Identification Info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-serif text-white">
                    {student.name}
                  </h1>
                  <span className="bg-amber-400 text-slate-900 font-mono font-bold text-xs px-2.5 py-0.5 rounded shadow-xs">
                    {student.roll_no}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-blue-100 pt-1">
                  <div>
                    <span className="text-blue-300">Father's Name:</span>{' '}
                    <span className="font-medium text-white">{student.father_name}</span>
                  </div>
                  <div>
                    <span className="text-blue-300">Programme:</span>{' '}
                    <span className="font-medium text-white">B.Tech ({student.department})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-blue-300">Assigned Batch ID:</span>{' '}
                    <span className="bg-blue-900 text-amber-300 px-2 py-0.5 rounded font-mono font-bold border border-blue-400/40">
                      {student.batch_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">Academic Semester:</span>{' '}
                    <span className="font-medium text-white">{student.year_sem} (2024-25)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor Details Card */}
            <div className="bg-[#0F2C59]/80 border border-blue-400/30 rounded-lg p-3 sm:p-4 text-xs max-w-sm w-full md:w-auto">
              <div className="flex items-center gap-2 text-amber-300 font-bold mb-1.5 pb-1 border-b border-blue-800">
                <UserCheck className="w-4 h-4" />
                <span>Assigned Faculty Mentor</span>
              </div>
              <p className="font-bold text-white text-sm">{student.mentor_name}</p>
              <p className="text-blue-200 text-[11px]">Professor, Dept. of {student.department}</p>
              <div className="mt-2 space-y-0.5 text-[11px] text-blue-300">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Cabin: Block-B 304 | Ext: 412</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>mentor.{student.mentor_id.toLowerCase()}@sru.edu.in</span>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Context Ribbon */}
          <div className="bg-slate-100 px-4 sm:px-6 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#1A3B70]" />
              <span>
                Enrolled Cohort:{' '}
                <strong>{assignedBatch?.displayName || student.batch_id}</strong>
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">
                {assignedBatch?.description || 'CSE Artificial Intelligence & Machine Learning'}
              </span>
            </div>

            {/* Quick Demo Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Preview other department student:</span>
              <select
                value={student.roll_no}
                onChange={(e) => switchStudentForDemo(e.target.value)}
                aria-label="Preview student"
                className="bg-white border border-slate-300 text-slate-800 text-xs px-2 py-0.5 rounded outline-none font-mono font-medium"
              >
                <option value="SRU2024001">SRU2024001 (CSE 2-1 • 25CSE01)</option>
                <option value="25CSE0501">25CSE0501 (CSE 1-1 • 25CSE05)</option>
                <option value="25ECE0101">25ECE0101 (ECE 2-1 • 25ECE01)</option>
                <option value="25EEE0101">25EEE0101 (EEE 2-1 • 25EEE01)</option>
                <option value="25CE0101">25CE0101 (CE 2-1 • 25CE01)</option>
                <option value="25ME0101">25ME0101 (ME 2-1 • 25ME01)</option>
                <option value="25AGRI0101">25AGRI0101 (AGRI 2-1 • 25AGRI01)</option>
                <option value="25BM0101">25BM0101 (BM 2-1 • 25BM01)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top KPI Metric Cards (Green, Teal, Blue, Yellow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Attendance % (Green background #28A745) */}
          <div className="bg-[#28A745] text-white rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-green-100">
                  Aggregate Attendance %
                </p>
                <h3 className="text-3xl font-extrabold mt-1 tracking-tight">
                  {student.attendance_pct}%
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-green-100 flex items-center justify-between">
              <span>{isLowAttendance ? '⚠️ Below 75% threshold' : '✓ Eligible for Exams (≥75%)'}</span>
              <span className="font-mono font-semibold">{totalAttended}/{totalHeld} Cls</span>
            </div>
          </div>

          {/* 2. CGPA (Teal background) */}
          <div className="bg-teal-600 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-teal-100">
                  Cumulative GPA (CGPA)
                </p>
                <h3 className="text-3xl font-extrabold mt-1 tracking-tight font-mono">
                  {student.cgpa}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-teal-100 flex items-center justify-between">
              <span>Scale: 10.0</span>
              <span className="font-semibold uppercase tracking-wider">First Class with Distinction</span>
            </div>
          </div>

          {/* 3. Backlogs count (Blue background) */}
          <div className="bg-blue-600 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-blue-100">
                  Active Backlogs
                </p>
                <h3 className="text-3xl font-extrabold mt-1 tracking-tight font-mono">
                  {student.backlogs}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 text-xs text-blue-100 flex items-center justify-between">
              <span>{student.backlogs === 0 ? 'All courses cleared' : 'Supplementary reg. open'}</span>
              <span className="font-semibold">{student.backlogs === 0 ? 'CLEAN RECORD' : 'ATTENTION'}</span>
            </div>
          </div>

          {/* 4. Mentoring staff info (Yellow/Gold background) */}
          <div className="bg-amber-500 text-slate-900 rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-amber-950">
                  Mentoring Faculty Staff
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-1 tracking-tight leading-tight">
                  {student.mentor_name}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-slate-900" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 text-xs text-amber-950 flex items-center justify-between font-medium">
              <span>Batch Mentor</span>
              <span className="underline cursor-pointer">Schedule Review</span>
            </div>
          </div>
        </div>

        {/* Warning notification banner if attendance < 75% */}
        {isLowAttendance && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg shadow-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-red-900">
              <strong className="font-bold">Urgent Attendance Warning:</strong> Your current attendance percentage ({student.attendance_pct}%) is below the University mandatory minimum of 75%. You are at risk of condonation fee penalties or examination detention. Please meet your mentor <strong>{student.mentor_name}</strong> immediately.
            </div>
          </div>
        )}

        {/* Two Tables Grid: Table 1 (Last Week) & Table 2 (Course Wise) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table 1: Last Week Attendance % */}
          <div className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[#1A3B70] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wide">
                  Table 1: Last Week Attendance %
                </h3>
              </div>
              <span className="text-[11px] bg-white/20 text-blue-100 px-2 py-0.5 rounded font-mono">
                Recent 6 Days
              </span>
            </div>

            <div className="p-4 flex-1">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12 border-b">S.No</th>
                      <th className="py-2.5 px-3 border-b">Date</th>
                      <th className="py-2.5 px-3 text-center border-b">Held</th>
                      <th className="py-2.5 px-3 text-center border-b">Attend</th>
                      <th className="py-2.5 px-3 text-center border-b">%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lastWeekAttendance.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          <div>{row.date}</div>
                          <span className="text-[10px] text-slate-400">{row.day}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                          {row.held}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-700">
                          {row.attended}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              row.pct >= 75
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {row.pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
              <span>Weekly Average: <strong>83.3%</strong></span>
              <button
                type="button"
                onClick={() => onNavigate('/student/reports')}
                className="text-[#1A3B70] hover:underline font-semibold"
              >
                View Full Date Range →
              </button>
            </div>
          </div>

          {/* Table 2: Course Wise Attendance % */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
            <div className="bg-[#1A3B70] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wide">
                  Table 2: Course Wise Attendance % (Batch: {student.batch_id})
                </h3>
              </div>
              <span className="text-[11px] bg-white/20 text-blue-100 px-2 py-0.5 rounded font-mono">
                Semester 2-1
              </span>
            </div>

            <div className="p-4 flex-1">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12 border-b">S.No</th>
                      <th className="py-2.5 px-3 border-b">Course Name</th>
                      <th className="py-2.5 px-3 text-center border-b">LTP Cls</th>
                      <th className="py-2.5 px-3 text-center border-b">Held Cls</th>
                      <th className="py-2.5 px-3 text-center border-b">PR</th>
                      <th className="py-2.5 px-3 text-center border-b">%</th>
                      <th className="py-2.5 px-3 text-center border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseAttendance.map((item, idx) => {
                      const isCourseLow = item.pct < 75;
                      return (
                        <tr key={item.course.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{item.course.name}</div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {item.course.code}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                            {item.course.ltp}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                            {item.held}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-700">
                            {item.attended}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                !isCourseLow
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.pct}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {!isCourseLow ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Regular</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-600 text-[11px] font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Shortage</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* Table Total Summary Row */}
                  <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3 text-right">
                        Aggregate Total:
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{totalHeld}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-emerald-800">
                        {totalAttended}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className="bg-[#1A3B70] text-white px-2 py-0.5 rounded text-xs font-bold">
                          {overallPercentage}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs">
                        {overallPercentage >= 75 ? (
                          <span className="text-emerald-700">Eligible</span>
                        ) : (
                          <span className="text-red-700">Condonation</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#1A3B70]" />
                LTP: Lecture - Tutorial - Practical hours per week. PR: Present count.
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/student/reports')}
                className="bg-[#1A3B70] hover:bg-[#0F2C59] text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
              >
                Detailed Attendance Report →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
