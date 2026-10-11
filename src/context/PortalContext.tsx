import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Batch,
  Faculty,
  Course,
  TimetableSlot,
  AttendanceRecord,
  Circular,
  UserSession,
  ClassType,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_BATCHES,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_SLOTS,
  INITIAL_CIRCULARS,
  INITIAL_ATTENDANCE_RECORDS,
} from '../data/seedData';

interface SaveAttendancePayload {
  batchName: string;
  department: string;
  yearSem: string;
  courseCode: string;
  date: string;
  slotIds: string[];
  classType: ClassType;
  topicsCovered: string;
  rosterStatuses: { rollNo: string; name: string; isPresent: boolean }[];
}

interface PortalContextType {
  // State
  students: Student[];
  batches: Batch[];
  faculty: Faculty[];
  courses: Course[];
  slots: TimetableSlot[];
  circulars: Circular[];
  attendanceRecords: AttendanceRecord[];
  currentUser: UserSession | null;
  academicYear: string;
  setAcademicYear: (year: string) => void;

  // Auth
  login: (role: Role, username: string, password?: string) => boolean;
  logout: () => void;
  switchStudentForDemo: (rollNo: string) => void;

  // Batch Management
  addBatch: (batch: {
    name: string;
    displayName: string;
    department: string;
    year_sem: string;
    academic_year: string;
    description?: string;
  }) => Batch;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  assignStudentToBatch: (rollNo: string, batchName: string) => void;
  bulkAssignBatch: (rollNos: string[], batchName: string) => void;
  autoDivideStudentsIntoBatches: (batchNames: string[]) => void;
  getStudentsByBatch: (batchName: string) => Student[];

  // Entity Management
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (rollNo: string, updates: Partial<Student>) => void;
  deleteStudent: (rollNo: string) => void;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;

  // Multi-Slot Attendance Marking with L/T/P & Teaching Notes
  saveAttendanceForRoster: (payload: SaveAttendancePayload) => void;

  // Student Metrics & Course Reports
  getStudentCourseAttendance: (rollNo: string) => {
    course: Course;
    held: number;
    attended: number;
    pct: number;
  }[];
  getStudentLastWeekAttendance: (rollNo: string) => {
    date: string;
    day: string;
    held: number;
    attended: number;
    pct: number;
  }[];

  // System Helpers
  resetAllData: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'sru_portal_students_v4',
  BATCHES: 'sru_portal_batches_v4',
  FACULTY: 'sru_portal_faculty_v4',
  COURSES: 'sru_portal_courses_v4',
  ATTENDANCE: 'sru_portal_attendance_v4',
  SESSION: 'sru_portal_session_v4',
  ACADEMIC_YEAR: 'sru_portal_acad_year_v4',
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [faculty, setFaculty] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [slots] = useState<TimetableSlot[]>(INITIAL_SLOTS);
  const [circulars] = useState<Circular[]>(INITIAL_CIRCULARS);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [academicYear, setAcademicYearState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACADEMIC_YEAR) || '2024-25';
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default logged in user: Student SRU2024001
    const defaultStudent = INITIAL_STUDENTS[0];
    return {
      role: 'student',
      username: defaultStudent.roll_no,
      name: defaultStudent.name,
      studentData: defaultStudent,
    };
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {
      // ignore storage quota errors gracefully
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    } catch {
      // ignore
    }
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  // Keep currentUser.studentData updated when student record changes
  useEffect(() => {
    if (currentUser?.role === 'student' && currentUser.username) {
      const updatedStd = students.find((s) => s.roll_no.toLowerCase() === currentUser.username.toLowerCase());
      if (updatedStd && JSON.stringify(updatedStd) !== JSON.stringify(currentUser.studentData)) {
        setCurrentUser((prev) => (prev ? { ...prev, name: updatedStd.name, studentData: updatedStd } : null));
      }
    }
  }, [students, currentUser?.role, currentUser?.username]);

  const setAcademicYear = (year: string) => {
    setAcademicYearState(year);
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_YEAR, year);
  };

  // Auth functions
  const login = (role: Role, username: string, _password?: string): boolean => {
    const cleanUser = username.trim().toUpperCase();

    if (role === 'admin') {
      const adminSession: UserSession = {
        role: 'admin',
        username: 'ADMIN',
        name: 'System Administrator (Dean Academics)',
      };
      setCurrentUser(adminSession);
      return true;
    }

    if (role === 'faculty') {
      const foundFaculty = faculty.find(
        (f) => f.faculty_id.toUpperCase() === cleanUser || f.email.toUpperCase() === cleanUser
      ) || faculty[0];

      const facultySession: UserSession = {
        role: 'faculty',
        username: foundFaculty.faculty_id,
        name: foundFaculty.name,
        facultyData: foundFaculty,
      };
      setCurrentUser(facultySession);
      return true;
    }

    if (role === 'student') {
      const foundStudent = students.find((s) => s.roll_no.toUpperCase() === cleanUser) || students[0];
      const studentSession: UserSession = {
        role: 'student',
        username: foundStudent.roll_no,
        name: foundStudent.name,
        studentData: foundStudent,
      };
      setCurrentUser(studentSession);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchStudentForDemo = (rollNo: string) => {
    const found = students.find((s) => s.roll_no.toUpperCase() === rollNo.toUpperCase());
    if (found) {
      setCurrentUser({
        role: 'student',
        username: found.roll_no,
        name: found.name,
        studentData: found,
      });
    }
  };

  // Batch Management functions
  const addBatch = (batchData: {
    name: string;
    displayName: string;
    department: string;
    year_sem: string;
    academic_year: string;
    description?: string;
  }): Batch => {
    const newBatch: Batch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      student_count: 30,
      created_at: new Date().toISOString().split('T')[0],
    };
    setBatches((prev) => [...prev, newBatch]);
    return newBatch;
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBatch = (id: string) => {
    const batchToDelete = batches.find((b) => b.id === id);
    if (!batchToDelete) return;
    const remaining = batches.filter((b) => b.id !== id);
    const fallbackBatchName = remaining.length > 0 ? remaining[0].name : 'Unassigned';
    setStudents((prev) =>
      prev.map((s) => (s.batch_id === batchToDelete.name ? { ...s, batch_id: fallbackBatchName } : s))
    );
    setBatches(remaining);
  };

  const assignStudentToBatch = (rollNo: string, batchName: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.roll_no === rollNo ? { ...s, batch_id: batchName } : s))
    );
  };

  const bulkAssignBatch = (rollNos: string[], batchName: string) => {
    const rollSet = new Set(rollNos.map((r) => r.toUpperCase()));
    setStudents((prev) =>
      prev.map((s) => (rollSet.has(s.roll_no.toUpperCase()) ? { ...s, batch_id: batchName } : s))
    );
  };

  const autoDivideStudentsIntoBatches = (batchNames: string[]) => {
    if (batchNames.length === 0) return;
    setStudents((prev) => {
      return prev.map((s, idx) => {
        const assignedBatch = batchNames[idx % batchNames.length];
        return { ...s, batch_id: assignedBatch };
      });
    });
  };

  const getStudentsByBatch = (batchName: string): Student[] => {
    if (!batchName || batchName === 'All Batches' || batchName === 'ALL') {
      return students;
    }
    return students.filter(
      (s) => s.batch_id.toLowerCase() === batchName.toLowerCase()
    );
  };

  // Entity Management
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const updateStudent = (rollNo: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.roll_no === rollNo ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (rollNo: string) => {
    setStudents((prev) => prev.filter((s) => s.roll_no !== rollNo));
  };

  const addFaculty = (facultyData: Omit<Faculty, 'id'>) => {
    const newFac: Faculty = {
      ...facultyData,
      id: facultyData.faculty_id,
    };
    setFaculty((prev) => [...prev, newFac]);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  // Save Attendance for Roster supporting Multiple Slots, L/T/P, and Teaching Notes
  const saveAttendanceForRoster = (payload: SaveAttendancePayload) => {
    const {
      batchName,
      department,
      yearSem,
      courseCode,
      date,
      slotIds,
      classType,
      topicsCovered,
      rosterStatuses,
    } = payload;

    const targetCourse = courses.find((c) => c.code === courseCode);
    const courseName = targetCourse?.name || courseCode;
    const now = new Date().toISOString();

    // Compute human readable slots string e.g. "Slot I, Slot II (09:30–11:30)"
    const selectedSlotObjs = slots.filter((s) => slotIds.includes(s.id));
    const slotNamesText = selectedSlotObjs.length > 0
      ? `${selectedSlotObjs.map((s) => s.name).join(', ')} (${selectedSlotObjs[0].start_time}–${selectedSlotObjs[selectedSlotObjs.length - 1].end_time})`
      : 'Regular Period';

    const newRecords: AttendanceRecord[] = rosterStatuses.map((item) => ({
      id: `att-${Date.now()}-${item.rollNo}`,
      date,
      slot_ids: slotIds,
      slot_names: slotNamesText,
      class_type: classType,
      topics_covered: topicsCovered,
      course_code: courseCode,
      course_name: courseName,
      department,
      year_sem: yearSem,
      batch_id: batchName,
      student_roll_no: item.rollNo,
      student_name: item.name,
      status: item.isPresent ? 'present' : 'absent',
      marked_by: currentUser?.name || currentUser?.username || 'FAC001',
      timestamp: now,
    }));

    // Save attendance records
    setAttendanceRecords((prev) => [...newRecords, ...prev]);

    // Recalculate student attendance percentage
    setStudents((prev) =>
      prev.map((std) => {
        const item = rosterStatuses.find((r) => r.rollNo === std.roll_no);
        if (!item) return std;
        const currentPct = std.attendance_pct;
        const slotsCount = slotIds.length || 1;
        const delta = item.isPresent ? (0.2 * slotsCount) : (-0.4 * slotsCount);
        const updatedPct = Math.min(100, Math.max(40, Math.round((currentPct + delta) * 10) / 10));
        return {
          ...std,
          attendance_pct: updatedPct,
        };
      })
    );
  };

  // Helper calculation for student course breakdown
  const getStudentCourseAttendance = (rollNo: string) => {
    const student = students.find((s) => s.roll_no === rollNo) || students[0];
    const basePct = (student?.attendance_pct || 80) / 100;

    // Filter courses relevant to student's department or semester
    const relevantCourses = courses.filter((c) => c.department === student.department) || courses;
    const listToUse = relevantCourses.length > 0 ? relevantCourses : courses.slice(0, 7);

    return listToUse.map((course, idx) => {
      const variation = ((idx % 3) - 1) * 0.04;
      const effectivePct = Math.min(0.98, Math.max(0.48, basePct + variation));
      const held = course.total_classes_held;
      const attended = Math.round(held * effectivePct);
      const actualPct = Math.round((attended / held) * 1000) / 10;

      return {
        course,
        held,
        attended,
        pct: actualPct,
      };
    });
  };

  // Helper for last week attendance table
  const getStudentLastWeekAttendance = (rollNo: string) => {
    const student = students.find((s) => s.roll_no === rollNo) || students[0];
    const isHighAttender = (student?.attendance_pct || 80) >= 75;

    const days = [
      { date: '05-Oct-2026', day: 'Monday', held: 6, attended: isHighAttender ? 6 : 4 },
      { date: '06-Oct-2026', day: 'Tuesday', held: 7, attended: isHighAttender ? 6 : 4 },
      { date: '07-Oct-2026', day: 'Wednesday', held: 6, attended: isHighAttender ? 5 : 3 },
      { date: '08-Oct-2026', day: 'Thursday', held: 7, attended: isHighAttender ? 7 : 4 },
      { date: '09-Oct-2026', day: 'Friday', held: 6, attended: isHighAttender ? 5 : 4 },
      { date: '10-Oct-2026', day: 'Saturday', held: 4, attended: isHighAttender ? 4 : 2 },
    ];

    return days.map((d) => ({
      ...d,
      pct: Math.round((d.attended / d.held) * 1000) / 10,
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.BATCHES);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setStudents(INITIAL_STUDENTS);
    setBatches(INITIAL_BATCHES);
    setFaculty(INITIAL_FACULTY);
    setCourses(INITIAL_COURSES);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    login('student', 'SRU2024001');
  };

  return (
    <PortalContext.Provider
      value={{
        students,
        batches,
        faculty,
        courses,
        slots,
        circulars,
        attendanceRecords,
        currentUser,
        academicYear,
        setAcademicYear,
        login,
        logout,
        switchStudentForDemo,
        addBatch,
        updateBatch,
        deleteBatch,
        assignStudentToBatch,
        bulkAssignBatch,
        autoDivideStudentsIntoBatches,
        getStudentsByBatch,
        addStudent,
        updateStudent,
        deleteStudent,
        addFaculty,
        addCourse,
        saveAttendanceForRoster,
        getStudentCourseAttendance,
        getStudentLastWeekAttendance,
        resetAllData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
