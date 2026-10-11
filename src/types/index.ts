export type Role = 'student' | 'faculty' | 'admin';
export type ClassType = 'L' | 'T' | 'P'; // Lecture, Tutorial, Practical Lab

export interface Student {
  id: string;
  roll_no: string; // e.g. 25CSE0101 or SRU2024001
  name: string;
  father_name: string;
  batch_id: string; // e.g. 25CSE01
  department: string; // CSE, ECE, EEE, CE, ME, AGRI, BM
  year_sem: string; // 1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2
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
  name: string; // e.g. 25CSE01
  displayName: string; // e.g. CSE Batch 01 (25CSE01)
  department: string; // CSE, ECE, EEE, CE, ME, AGRI, BM
  year_sem: string; // 1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2
  academic_year: string; // 2024-25
  student_count: number; // 30
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
  start_time: string; // e.g. 09:30
  end_time: string; // e.g. 10:30
  time_range: string; // e.g. 09:30–10:30
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  slot_ids: string[]; // Multiple slots support (e.g. ['slot-1', 'slot-2'])
  slot_names: string; // e.g. "Slot I, Slot II (09:30–11:30)"
  class_type: ClassType; // 'L' | 'T' | 'P'
  topics_covered: string; // "What was taught today" text
  course_code: string;
  course_name: string;
  department: string;
  year_sem: string;
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
