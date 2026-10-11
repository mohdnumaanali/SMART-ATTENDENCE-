import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Batch,
  Faculty,
  Course,
  TimetableSlot,
  AttendanceRecord,
  CompletedClassSession,
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
  INITIAL_COMPLETED_SESSIONS,
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
  completedSessions: CompletedClassSession[];
  currentUser: UserSession | null;
  academicYear: string;
  setAcademicYear: (year: string) => void;

  // Auth & Password Management
  login: (role: Role, username: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchStudentForDemo: (rollNo: string) => void;
  changeCurrentUserPassword: (newPassword: string) => boolean;

  // Admin Account & Credential Management
  updateUserCredentials: (
    role: 'faculty' | 'student',
    idOrRoll: string,
    newUsername: string,
    newPassword?: string
  ) => void;
  toggleAccountStatus: (
    role: 'faculty' | 'student',
    idOrRoll: string,
    isActive: boolean
  ) => void;
  resetUserPassword: (role: 'faculty' | 'student', idOrRoll: string) => string;

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
  updateFaculty: (facultyId: string, updates: Partial<Faculty>) => void;
  deleteFaculty: (facultyId: string) => void;
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
  STUDENTS: 'sru_portal_students_v5',
  BATCHES: 'sru_portal_batches_v5',
  FACULTY: 'sru_portal_faculty_v5',
  COURSES: 'sru_portal_courses_v5',
  ATTENDANCE: 'sru_portal_attendance_v5',
  COMPLETED_SESSIONS: 'sru_portal_sessions_v5',
  SESSION: 'sru_portal_session_v5',
  ACADEMIC_YEAR: 'sru_portal_acad_year_v5',
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

  const [completedSessions, setCompletedSessions] = useState<CompletedClassSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLETED_SESSIONS;
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
      // quota safeguard
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
    } catch {
      // quota safeguard
    }
  }, [batches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    } catch {
      // quota safeguard
    }
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(completedSessions));
  }, [completedSessions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  // Keep currentUser synced
  useEffect(() => {
    if (currentUser?.role === 'student' && currentUser.username) {
      const updatedStd = students.find((s) => s.roll_no.toLowerCase() === currentUser.username.toLowerCase());
      if (updatedStd && JSON.stringify(updatedStd) !== JSON.stringify(currentUser.studentData)) {
        setCurrentUser((prev) => (prev ? { ...prev, name: updatedStd.name, studentData: updatedStd } : null));
      }
    } else if (currentUser?.role === 'faculty' && currentUser.username) {
      const updatedFac = faculty.find(
        (f) => f.faculty_id.toLowerCase() === currentUser.username.toLowerCase() || f.username.toLowerCase() === currentUser.username.toLowerCase()
      );
      if (updatedFac && JSON.stringify(updatedFac) !== JSON.stringify(currentUser.facultyData)) {
        setCurrentUser((prev) => (prev ? { ...prev, name: updatedFac.name, facultyData: updatedFac } : null));
      }
    }
  }, [students, faculty, currentUser?.role, currentUser?.username]);

  const setAcademicYear = (year: string) => {
    setAcademicYearState(year);
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_YEAR, year);
  };

  // Auth functions with active account check & password verification
  const login = (role: Role, username: string, password?: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim().toUpperCase();
    const cleanPass = (password || '').trim();

    if (role === 'admin') {
      if (cleanPass && cleanPass !== 'admin123') {
        return { success: false, message: 'Invalid Admin password. Default is: admin123' };
      }
      const adminSession: UserSession = {
        role: 'admin',
        username: 'ADMIN',
        name: 'System Administrator (Dean Academics)',
      };
      setCurrentUser(adminSession);
      return { success: true };
    }

    if (role === 'faculty') {
      const foundFaculty = faculty.find(
        (f) =>
          f.faculty_id.toUpperCase() === cleanUser ||
          f.username.toUpperCase() === cleanUser ||
          f.email.toUpperCase() === cleanUser
      );

      if (!foundFaculty) {
        return { success: false, message: `Faculty account ${cleanUser} not found.` };
      }

      if (foundFaculty.is_active === false) {
        return {
          success: false,
          message: `Account for ${foundFaculty.name} has been revoked by Administrator. Please contact Dean Academics.`,
        };
      }

      const expectedPassword = foundFaculty.password || 'faculty123';
      if (cleanPass && cleanPass !== expectedPassword) {
        return { success: false, message: 'Incorrect faculty password.' };
      }

      const facultySession: UserSession = {
        role: 'faculty',
        username: foundFaculty.faculty_id,
        name: foundFaculty.name,
        facultyData: foundFaculty,
      };
      setCurrentUser(facultySession);
      return { success: true };
    }

    if (role === 'student') {
      const foundStudent = students.find((s) => s.roll_no.toUpperCase() === cleanUser);

      if (!foundStudent) {
        return { success: false, message: `Student roll number ${cleanUser} not found.` };
      }

      if (foundStudent.is_active === false) {
        return {
          success: false,
          message: `Student account ${foundStudent.roll_no} has been suspended by Administrator.`,
        };
      }

      const expectedPassword = foundStudent.password || 'student123';
      if (cleanPass && cleanPass !== expectedPassword) {
        return { success: false, message: 'Incorrect student password.' };
      }

      const studentSession: UserSession = {
        role: 'student',
        username: foundStudent.roll_no,
        name: foundStudent.name,
        studentData: foundStudent,
      };
      setCurrentUser(studentSession);
      return { success: true };
    }

    return { success: false, message: 'Invalid role selection.' };
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

  // Change current user's password
  const changeCurrentUserPassword = (newPassword: string): boolean => {
    if (!currentUser || !newPassword.trim()) return false;

    if (currentUser.role === 'student' && currentUser.studentData) {
      const roll = currentUser.studentData.roll_no;
      setStudents((prev) =>
        prev.map((s) => (s.roll_no === roll ? { ...s, password: newPassword.trim() } : s))
      );
      setCurrentUser((prev) =>
        prev && prev.studentData
          ? { ...prev, studentData: { ...prev.studentData, password: newPassword.trim() } }
          : prev
      );
      return true;
    }

    if (currentUser.role === 'faculty' && currentUser.facultyData) {
      const fId = currentUser.facultyData.faculty_id;
      setFaculty((prev) =>
        prev.map((f) => (f.faculty_id === fId ? { ...f, password: newPassword.trim() } : f))
      );
      setCurrentUser((prev) =>
        prev && prev.facultyData
          ? { ...prev, facultyData: { ...prev.facultyData, password: newPassword.trim() } }
          : prev
      );
      return true;
    }

    return false;
  };

  // Admin Account & Credential Management
  const updateUserCredentials = (
    role: 'faculty' | 'student',
    idOrRoll: string,
    newUsername: string,
    newPassword?: string
  ) => {
    if (role === 'faculty') {
      setFaculty((prev) =>
        prev.map((f) => {
          if (f.faculty_id === idOrRoll) {
            return {
              ...f,
              username: newUsername.trim() || f.username,
              password: newPassword ? newPassword.trim() : f.password,
            };
          }
          return f;
        })
      );
    } else {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.roll_no === idOrRoll) {
            return {
              ...s,
              password: newPassword ? newPassword.trim() : s.password,
            };
          }
          return s;
        })
      );
    }
  };

  const toggleAccountStatus = (
    role: 'faculty' | 'student',
    idOrRoll: string,
    isActive: boolean
  ) => {
    if (role === 'faculty') {
      setFaculty((prev) =>
        prev.map((f) => (f.faculty_id === idOrRoll ? { ...f, is_active: isActive } : f))
      );
    } else {
      setStudents((prev) =>
        prev.map((s) => (s.roll_no === idOrRoll ? { ...s, is_active: isActive } : s))
      );
    }
  };

  const resetUserPassword = (role: 'faculty' | 'student', idOrRoll: string): string => {
    const defaultPass = role === 'faculty' ? 'faculty123' : 'student123';
    if (role === 'faculty') {
      setFaculty((prev) =>
        prev.map((f) => (f.faculty_id === idOrRoll ? { ...f, password: defaultPass } : f))
      );
    } else {
      setStudents((prev) =>
        prev.map((s) => (s.roll_no === idOrRoll ? { ...s, password: defaultPass } : s))
      );
    }
    return defaultPass;
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
      password: studentData.password || 'student123',
      is_active: studentData.is_active ?? true,
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
      username: facultyData.username || facultyData.faculty_id,
      password: facultyData.password || 'faculty123',
      is_active: facultyData.is_active ?? true,
    };
    setFaculty((prev) => [newFac, ...prev]);
  };

  const updateFaculty = (facultyId: string, updates: Partial<Faculty>) => {
    setFaculty((prev) =>
      prev.map((f) => (f.faculty_id === facultyId ? { ...f, ...updates } : f))
    );
  };

  const deleteFaculty = (facultyId: string) => {
    setFaculty((prev) => prev.filter((f) => f.faculty_id !== facultyId));
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  // Save Attendance & Instantly Push to Real-Time Completed Sessions!
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
    const now = new Date();
    const timestampStr = `${date} ${now.toTimeString().split(' ')[0]}`;

    // Compute human readable slots text e.g. "Slot I, Slot II (09:30–11:30)"
    const selectedSlotObjs = slots.filter((s) => slotIds.includes(s.id));
    const slotNamesText =
      selectedSlotObjs.length > 0
        ? `${selectedSlotObjs.map((s) => s.name).join(', ')} (${selectedSlotObjs[0].start_time}–${
            selectedSlotObjs[selectedSlotObjs.length - 1].end_time
          })`
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
      timestamp: timestampStr,
    }));

    // Save individual student attendance records
    setAttendanceRecords((prev) => [...newRecords, ...prev]);

    // Create completed session record for Admin Real-Time Tracking!
    const presentCount = rosterStatuses.filter((r) => r.isPresent).length;
    const absentCount = rosterStatuses.length - presentCount;

    const completedSession: CompletedClassSession = {
      id: `session-${Date.now()}`,
      date,
      timestamp: timestampStr,
      faculty_id: currentUser?.username || 'FAC001',
      faculty_name: currentUser?.name || 'Dr. K. Venkataswamy',
      department,
      year_sem: yearSem,
      batch_id: batchName,
      course_code: courseCode,
      course_name: courseName,
      slot_ids: slotIds,
      slot_names: slotNamesText,
      class_type: classType,
      topics_covered: topicsCovered,
      total_students: rosterStatuses.length,
      present_count: presentCount,
      absent_count: absentCount,
    };

    // Prepend to completedSessions so Admin Dashboard instantly reflects it at the top!
    setCompletedSessions((prev) => [completedSession, ...prev]);

    // Recalculate student attendance percentage
    setStudents((prev) =>
      prev.map((std) => {
        const item = rosterStatuses.find((r) => r.rollNo === std.roll_no);
        if (!item) return std;
        const currentPct = std.attendance_pct;
        const slotsCount = slotIds.length || 1;
        const delta = item.isPresent ? 0.2 * slotsCount : -0.4 * slotsCount;
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
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setStudents(INITIAL_STUDENTS);
    setBatches(INITIAL_BATCHES);
    setFaculty(INITIAL_FACULTY);
    setCourses(INITIAL_COURSES);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setCompletedSessions(INITIAL_COMPLETED_SESSIONS);
    login('student', 'SRU2024001', 'student123');
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
        completedSessions,
        currentUser,
        academicYear,
        setAcademicYear,
        login,
        logout,
        switchStudentForDemo,
        changeCurrentUserPassword,
        updateUserCredentials,
        toggleAccountStatus,
        resetUserPassword,
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
        updateFaculty,
        deleteFaculty,
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
