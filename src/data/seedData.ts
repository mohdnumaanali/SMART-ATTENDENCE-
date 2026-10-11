import { Student, Batch, Faculty, Course, TimetableSlot, Circular, AttendanceRecord } from '../types';

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch-1',
    name: '25CAIBTAIB01',
    displayName: 'Batch 1 (25CAIBTAIB01)',
    department: 'CSE-AIML',
    year_sem: '2-1',
    academic_year: '2024-25',
    description: 'B.Tech CSE with Artificial Intelligence & Machine Learning - Section A',
    created_at: '2024-07-15',
  },
  {
    id: 'batch-2',
    name: '25CAIBTAIB02',
    displayName: 'Batch 2 (25CAIBTAIB02)',
    department: 'CSE-AIML',
    year_sem: '2-1',
    academic_year: '2024-25',
    description: 'B.Tech CSE with Artificial Intelligence & Machine Learning - Section B',
    created_at: '2024-07-15',
  },
  {
    id: 'batch-3',
    name: '25CAIBTAIB03',
    displayName: 'Batch 3 (25CAIBTAIB03)',
    department: 'CSE-AIML',
    year_sem: '2-1',
    academic_year: '2024-25',
    description: 'B.Tech CSE with Artificial Intelligence & Machine Learning - Section C',
    created_at: '2024-07-15',
  },
  {
    id: 'batch-4',
    name: '25ECEBTECB01',
    displayName: 'Batch ECE-A (25ECEBTECB01)',
    department: 'ECE',
    year_sem: '2-1',
    academic_year: '2024-25',
    description: 'B.Tech Electronics & Communication Engineering',
    created_at: '2024-07-16',
  },
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'FAC001',
    faculty_id: 'FAC001',
    name: 'Dr. K. Venkataswamy',
    department: 'CSE-AIML',
    designation: 'Professor & Head of Department',
    email: 'k.venkataswamy@sru.edu.in',
    phone: '+91 98480 12345',
    courses: ['CS2101', 'CS2103'],
  },
  {
    id: 'FAC002',
    faculty_id: 'FAC002',
    name: 'Dr. M. Sujatha',
    department: 'CSE-AIML',
    designation: 'Associate Professor',
    email: 'm.sujatha@sru.edu.in',
    phone: '+91 94401 54321',
    courses: ['CS2102', 'CS2105'],
  },
  {
    id: 'FAC003',
    faculty_id: 'FAC003',
    name: 'Dr. P. Ramesh Babu',
    department: 'CSE-AIML',
    designation: 'Assistant Professor',
    email: 'p.rameshbabu@sru.edu.in',
    phone: '+91 98665 99881',
    courses: ['CS2104', 'CS2106'],
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'CS2101',
    name: 'AI ASSISTED CODING',
    ltp: '3-0-2',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 36,
  },
  {
    id: 'c2',
    code: 'CS2102',
    name: 'CLOUD COMPUTING',
    ltp: '3-1-0',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 32,
  },
  {
    id: 'c3',
    code: 'CS2103',
    name: 'MACHINE LEARNING TECHNIQUES',
    ltp: '3-0-2',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 38,
  },
  {
    id: 'c4',
    code: 'CS2104',
    name: 'DATA STRUCTURES & ALGORITHMS',
    ltp: '3-1-2',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 42,
  },
  {
    id: 'c5',
    code: 'CS2105',
    name: 'DATABASE MANAGEMENT SYSTEMS',
    ltp: '3-0-2',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 34,
  },
  {
    id: 'c6',
    code: 'CS2106',
    name: 'FULL STACK WEB DEVELOPMENT',
    ltp: '2-0-4',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 30,
  },
  {
    id: 'c7',
    code: 'CS2107',
    name: 'PROBABILITY & STATISTICS',
    ltp: '3-1-0',
    department: 'CSE-AIML',
    year_sem: '2-1',
    total_classes_held: 28,
  },
];

export const INITIAL_SLOTS: TimetableSlot[] = [
  { id: 'slot-1', slot_number: 1, name: 'Slot I', time_range: '09:00 - 09:50', default_course_code: 'CS2101' },
  { id: 'slot-2', slot_number: 2, name: 'Slot II', time_range: '09:50 - 10:40', default_course_code: 'CS2102' },
  { id: 'slot-3', slot_number: 3, name: 'Slot III', time_range: '10:50 - 11:40', default_course_code: 'CS2103' },
  { id: 'slot-4', slot_number: 4, name: 'Slot IV', time_range: '11:40 - 12:30', default_course_code: 'CS2104' },
  { id: 'slot-5', slot_number: 5, name: 'Slot V', time_range: '01:20 - 02:10', default_course_code: 'CS2105' },
  { id: 'slot-6', slot_number: 6, name: 'Slot VI', time_range: '02:10 - 03:00', default_course_code: 'CS2106' },
  { id: 'slot-7', slot_number: 7, name: 'Slot VII', time_range: '03:10 - 04:00', default_course_code: 'CS2101' },
  { id: 'slot-8', slot_number: 8, name: 'Slot VIII', time_range: '04:00 - 04:50', default_course_code: 'CS2107' },
];

export const INITIAL_CIRCULARS: Circular[] = [
  {
    id: 'circ-1',
    date: '10-Oct-2026',
    title: 'Mid-Semester Examinations Schedule & Timetable - B.Tech (II, III & IV Year)',
    department: 'Controller of Examinations',
    category: 'Examination',
    is_new: true,
  },
  {
    id: 'circ-2',
    date: '08-Oct-2026',
    title: 'Mandatory 75% Attendance Requirement for Semester End University Exams',
    department: 'Dean Academics',
    category: 'Academic',
    is_new: true,
  },
  {
    id: 'circ-3',
    date: '04-Oct-2026',
    title: 'Smart India Hackathon (SIH) 2026 - Institutional Screening Round',
    department: 'Centre for Innovation',
    category: 'Event',
    is_new: false,
  },
  {
    id: 'circ-4',
    date: '01-Oct-2026',
    title: 'Campus Recruitment Training (CRT) Sessions for Batch 2025-26',
    department: 'Placement Cell',
    category: 'Placement',
    is_new: false,
  },
  {
    id: 'circ-5',
    date: '28-Sep-2026',
    title: 'Notification regarding Dussehra & Diwali Vacation Schedule',
    department: 'Registrar Office',
    category: 'General',
    is_new: false,
  },
];

// Helper to generate realistic 100 students
const firstNames = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Divya', 'Karthik', 'Pooja',
  'Sai Krishna', 'Kavya', 'Rahul', 'Deepika', 'Manish', 'Anjali', 'Arjun', 'Bhavana', 'Chaitanya', 'Harini',
  'Varun', 'Swathi', 'Pranav', 'Naveen', 'Keerthana', 'Tarun', 'Sowmya', 'Siddharth', 'Meghana', 'Ganesh',
  'Sanjana', 'Abhishek', 'Ramya', 'Kishore', 'Niharika', 'Venkatesh', 'Aishwarya', 'Akash', 'Shravani', 'Surya',
  'Harshitha', 'Nikhil', 'Tejaswi', 'Vinay', 'Pranathi', 'Srikanth', 'Lavanya', 'Ajay', 'Sirisha', 'Sharath',
  'Manasa', 'Vamsi', 'Anusha', 'Ravi Teja', 'Sravani', 'Prasad', 'Sandhya', 'Bhargav', 'Roopa', 'Suresh',
  'Geetha', 'Dileep', 'Gayatri', 'Kalyan', 'Pavani', 'Charan', 'Preethi', 'Manoj', 'Akhila', 'Goutham',
  'Madhavi', 'Rajesh', 'Vani', 'Dinesh', 'Kusuma', 'Gopi', 'Pallavi', 'Vijay', 'Hemalatha', 'Ashok',
  'Sony', 'Narasimha', 'Sujatha', 'Lokesh', 'Jyothi', 'Hemanth', 'Sirisha', 'Naresh', 'Saritha', 'Jagadeesh',
  'Bindu', 'Satish', 'Usha', 'Chandra', 'Shalini', 'Kiran', 'Sireesha', 'Pavan', 'Supraja', 'Anand'
];

const lastNames = [
  'Sharma', 'Rao', 'Verma', 'Patel', 'Reddy', 'Kulkarni', 'Singh', 'Nair', 'Iyer', 'Joshi',
  'Chowdary', 'Gupta', 'Naidu', 'Bhat', 'Menon', 'Goud', 'Varma', 'Mishra', 'Prasad', 'Rathod'
];

const fatherFirstNames = [
  'Ramesh', 'Srinivas', 'Rajesh', 'Suresh', 'Venkat', 'Prakash', 'Mahendra', 'Gopal', 'Narayana', 'Satyanarayana',
  'Krishna Murthy', 'Chandra Sekhar', 'Govinda Rao', 'Subba Rao', 'Ramana Murthy', 'Mohan', 'Baskaran', 'Bhaskar', 'Sudhakar', 'Anjaneyulu'
];

export const INITIAL_STUDENTS: Student[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const roll_no = `SRU2024${num.toString().padStart(3, '0')}`;
  const fName = firstNames[index % firstNames.length];
  const lName = lastNames[index % lastNames.length];
  const fatherFName = fatherFirstNames[index % fatherFirstNames.length];
  const name = `${fName} ${lName}`;
  const father_name = `${fatherFName} ${lName}`;

  // Batch distribution:
  // 1-35 -> 25CAIBTAIB01
  // 36-70 -> 25CAIBTAIB02
  // 71-100 -> 25CAIBTAIB03
  let batch_id = '25CAIBTAIB01';
  if (num > 70) {
    batch_id = '25CAIBTAIB03';
  } else if (num > 35) {
    batch_id = '25CAIBTAIB02';
  }

  // Attendance distribution: ensure some are below 75% for low attendance alert testing
  // e.g. Roll 7, 18, 33, 49, 62, 78, 89, 94 have < 75%
  let attendance_pct = 85.5;
  if ([7, 18, 33, 49, 62, 78, 89, 94].includes(num)) {
    attendance_pct = Math.round((58 + (num % 15)) * 10) / 10;
  } else if (num % 5 === 0) {
    attendance_pct = Math.round((92 + (num % 7)) * 10) / 10;
  } else {
    attendance_pct = Math.round((76 + (num % 20)) * 10) / 10;
  }

  // CGPA between 6.5 and 9.8
  const cgpa = Math.round((6.8 + ((num * 3) % 30) / 10) * 100) / 100;
  const backlogs = [7, 33, 62, 89].includes(num) ? 2 : [18, 49, 78].includes(num) ? 1 : 0;

  const mentor = INITIAL_FACULTY[index % INITIAL_FACULTY.length];

  return {
    id: `std-${num}`,
    roll_no,
    name,
    father_name,
    batch_id,
    department: 'CSE-AIML',
    year_sem: '2-1',
    mentor_id: mentor.id,
    mentor_name: mentor.name,
    cgpa,
    backlogs,
    attendance_pct,
    email: `${roll_no.toLowerCase()}@sru.edu.in`,
    phone: `+91 9${(800000000 + num * 12345).toString().slice(0, 9)}`,
    avatar: `https://images.unsplash.com/photo-${1534528741775 + (num * 300) % 50000}?auto=format&fit=crop&w=150&q=80`,
  };
});

// Seed recent attendance records for the past week
export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-10-05',
    slot_id: 'slot-1',
    slot_name: 'Slot I',
    course_code: 'CS2101',
    course_name: 'AI ASSISTED CODING',
    batch_id: '25CAIBTAIB01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Sharma',
    status: 'present',
    marked_by: 'FAC001',
    timestamp: '2026-10-05 09:45:00',
  },
  {
    id: 'att-2',
    date: '2026-10-06',
    slot_id: 'slot-2',
    slot_name: 'Slot II',
    course_code: 'CS2102',
    course_name: 'CLOUD COMPUTING',
    batch_id: '25CAIBTAIB01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Sharma',
    status: 'present',
    marked_by: 'FAC002',
    timestamp: '2026-10-06 10:30:00',
  },
  {
    id: 'att-3',
    date: '2026-10-07',
    slot_id: 'slot-3',
    slot_name: 'Slot III',
    course_code: 'CS2103',
    course_name: 'MACHINE LEARNING TECHNIQUES',
    batch_id: '25CAIBTAIB01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Sharma',
    status: 'present',
    marked_by: 'FAC001',
    timestamp: '2026-10-07 11:35:00',
  },
  {
    id: 'att-4',
    date: '2026-10-08',
    slot_id: 'slot-4',
    slot_name: 'Slot IV',
    course_code: 'CS2104',
    course_name: 'DATA STRUCTURES & ALGORITHMS',
    batch_id: '25CAIBTAIB01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Sharma',
    status: 'absent',
    marked_by: 'FAC003',
    timestamp: '2026-10-08 12:20:00',
  },
  {
    id: 'att-5',
    date: '2026-10-09',
    slot_id: 'slot-1',
    slot_name: 'Slot I',
    course_code: 'CS2105',
    course_name: 'DATABASE MANAGEMENT SYSTEMS',
    batch_id: '25CAIBTAIB01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Sharma',
    status: 'present',
    marked_by: 'FAC002',
    timestamp: '2026-10-09 09:40:00',
  },
];
