export type Role = 'student' | 'faculty' | 'admin';

export interface Student {
  id: string;
  roll_no: string; // e.g. SRU2024001
  name: string;
  father_name: string;
  batch_id: string; // e.g. 25CAIBTAIB01
  department: string; // e.g. CSE-AIML
  year_sem: string; // e.g. 2-1
  mentor_id: string;
  mentor_name: string;
  cgpa: number;
  backlogs: number;
  attendance_pct: number;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Batch {
  id: string;
  name: string; // e.g. 25CAIBTAIB01
  displayName: string; // e.g. Batch 1 (25CAIBTAIB01)
  department: string; // e.g. CSE-AIML
  year_sem: string; // e.g. 2-1
  academic_year: string; // e.g. 2024-25
  description?: string;
  created_at: string;
}

export interface Faculty {
  id: string; // e.g. FAC001
  faculty_id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  courses: string[];
}

export interface Course {
  id: string;
  code: string; // e.g. CS2101
  name: string;
  ltp: string; // e.g. 3-0-2
  department: string;
  year_sem: string;
  total_classes_held: number;
}

export interface TimetableSlot {
  id: string;
  slot_number: number;
  name: string; // e.g. Slot I
  time_range: string; // e.g. 09:00 - 09:50
  default_course_code?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  slot_id: string;
  slot_name: string;
  course_code: string;
  course_name: string;
  batch_id: string;
  student_roll_no: string;
  student_name: string;
  status: 'present' | 'absent';
  marked_by: string;
  timestamp: string;
}

export interface Circular {
  id: string;
  date: string;
  title: string;
  department: string;
  category: string;
  is_new: boolean;
  file_url?: string;
}

export interface UserSession {
  role: Role;
  username: string; // roll_no or faculty_id or admin
  name: string;
  studentData?: Student;
  facultyData?: Faculty;
}
