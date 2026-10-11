import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { StudentNav } from '../components/StudentNav';
import {
  Calendar,
  Filter,
  CheckCircle2,
  Printer,
  Download,
  AlertTriangle,
  Layers,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';

interface StudentReportsProps {
  onNavigate: (route: string) => void;
}

export const StudentReports: React.FC<StudentReportsProps> = ({ onNavigate }) => {
  const { currentUser, students, batches, courses, getStudentCourseAttendance } = usePortal();

  const currentRoll = currentUser?.studentData?.roll_no || 'SRU2024001';
  const student =
    students.find((s) => s.roll_no.toUpperCase() === currentRoll.toUpperCase()) ||
    students[0];
  const assignedBatch = batches.find((b) => b.name === student.batch_id);

  // Filters
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-10-10');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [filterSubmitted, setFilterSubmitted] = useState(false);

  const baseAttendance = getStudentCourseAttendance(student.roll_no);

  // Apply course filter
  const displayedAttendance = baseAttendance.filter((item) => {
    if (selectedCourseFilter === 'ALL') return true;
    return item.course.code === selectedCourseFilter;
  });

  const totalHeld = displayedAttendance.reduce((acc, curr) => acc + curr.held, 0);
  const totalAttended = displayedAttendance.reduce((acc, curr) => acc + curr.attended, 0);
  const totalAbsent = totalHeld - totalAttended;
  const aggregatePct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <StudentNav activeItem="attendance" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <button
                type="button"
                onClick={() => onNavigate('/student/dashboard')}
                className="hover:text-[#1A3B70] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Attendance Reports</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A3B70]">
              Cumulative Course-Wise Attendance Report
            </h1>
            <p className="text-xs text-slate-600">
              Department of {student.department} | Batch: <strong className="text-blue-900">{student.batch_id}</strong> | Semester: {student.year_sem}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={() => alert(`Official Attendance Transcript for ${student.roll_no} downloaded.`)}
              className="px-3 py-1.5 bg-[#1A3B70] hover:bg-[#0F2C59] text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Student Quick Bio Card with dynamic Batch reflection */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1A3B70] text-white flex items-center justify-center font-bold text-lg">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">{student.name}</span>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                  {student.roll_no}
                </span>
              </div>
              <p className="text-xs text-slate-500">Father's Name: {student.father_name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Assigned Batch</span>
              <span className="font-mono font-bold text-[#1A3B70] text-sm">
                {student.batch_id}
              </span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Cohort Section</span>
              <span className="font-semibold text-slate-800">
                {assignedBatch?.displayName || 'Section A'}
              </span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Faculty Mentor</span>
              <span className="font-semibold text-slate-800">{student.mentor_name}</span>
            </div>
          </div>
        </div>

        {/* Filter Section: Date Pickers + Green Submit Button */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#1A3B70]" />
            <span>Attendance Query & Date Range Filter</span>
          </div>

          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* From Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Select From Date:</span>
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                <span>Select To Date:</span>
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none"
                required
              />
            </div>

            {/* Course Filter Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>Filter by Course:</span>
              </label>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1A3B70] outline-none bg-white font-medium"
              >
                <option value="ALL">All Enrolled Courses (7)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Green Submit Button (#28A745) */}
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#28A745] hover:bg-green-700 text-white font-bold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </form>

          {filterSubmitted && (
            <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in duration-150">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Report generated successfully for date range: <strong>{fromDate}</strong> to <strong>{toDate}</strong> ({displayedAttendance.length} courses loaded).
              </span>
            </div>
          )}
        </div>

        {/* Results Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-[11px] uppercase font-bold text-slate-500 block">Total Classes Held</span>
            <span className="font-mono font-black text-xl text-slate-800">{totalHeld}</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-[11px] uppercase font-bold text-emerald-600 block">Classes Attended</span>
            <span className="font-mono font-black text-xl text-emerald-700">{totalAttended}</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-[11px] uppercase font-bold text-red-500 block">Classes Absent</span>
            <span className="font-mono font-black text-xl text-red-600">{totalAbsent}</span>
          </div>
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-center shadow-2xs">
            <span className="text-[11px] uppercase font-bold text-blue-700 block">Report Aggregate %</span>
            <span className="font-mono font-black text-xl text-[#1A3B70]">{aggregatePct}%</span>
          </div>
        </div>

        {/* Results Table: S.No, Course Name, LTP Cls, Held Cls, Present count, Absent, % */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="bg-[#1A3B70] text-white px-5 py-3.5 flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-wide">
              Course-wise Attendance Breakdown (Semester 2-1)
            </h3>
            <span className="text-xs bg-white/15 text-blue-100 px-2.5 py-0.5 rounded font-mono">
              Batch: {student.batch_id}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-center w-14">S.No</th>
                  <th className="py-3 px-4">Course Name & Code</th>
                  <th className="py-3 px-4 text-center">LTP Cls</th>
                  <th className="py-3 px-4 text-center">Held Cls</th>
                  <th className="py-3 px-4 text-center text-emerald-700 font-bold">Present</th>
                  <th className="py-3 px-4 text-center text-red-600 font-bold">Absent</th>
                  <th className="py-3 px-4 text-center font-bold">Percentage</th>
                  <th className="py-3 px-4 text-center">Exam Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedAttendance.map((item, idx) => {
                  const absent = item.held - item.attended;
                  const isEligible = item.pct >= 75;
                  const isCondonation = item.pct >= 65 && item.pct < 75;

                  return (
                    <tr key={item.course.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.course.name}</div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.course.code}</span>
                          <span>•</span>
                          <span>Dept: {item.course.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {item.course.ltp}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                        {item.held}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                        {item.attended}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-red-600">
                        {absent}
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            isEligible
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCondonation
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-xs">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Eligible
                          </span>
                        ) : isCondonation ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Condonation (Fee)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Detained
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Grand Total Row */}
              <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right">
                    Grand Total:
                  </td>
                  <td className="py-3 px-4 text-center font-mono">{totalHeld}</td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-700">
                    {totalAttended}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-red-600">
                    {totalAbsent}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="bg-[#1A3B70] text-white px-2.5 py-1 rounded text-xs font-bold">
                      {aggregatePct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    {aggregatePct >= 75 ? (
                      <span className="text-emerald-700 font-bold">EXAM ELIGIBLE</span>
                    ) : (
                      <span className="text-red-700 font-bold">CONDONATION REQUIRED</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Regulations Note */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">SR University Attendance Rule Guidelines:</p>
          <p>1. 75% aggregate attendance is mandatory for appearing in the End Semester University Examinations.</p>
          <p>2. Condonation of shortage of attendance in aggregate up to 10% (65% and above and below 75%) may be granted on medical grounds upon payment of prescribed condonation fee.</p>
          <p>3. Students whose attendance is less than 65% are not eligible to write their end examinations and are detained.</p>
        </div>
      </main>
    </div>
  );
};
