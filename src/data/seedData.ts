import { Student, Batch, Faculty, Course, TimetableSlot, Circular, AttendanceRecord } from '../types';

export const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering', batchCount: 74 },
  { code: 'ECE', name: 'Electronics & Communication Engineering', batchCount: 30 },
  { code: 'EEE', name: 'Electrical & Electronics Engineering', batchCount: 24 },
  { code: 'CE', name: 'Civil Engineering', batchCount: 24 },
  { code: 'ME', name: 'Mechanical Engineering', batchCount: 24 },
  { code: 'AGRI', name: 'Agricultural Engineering', batchCount: 20 },
  { code: 'BM', name: 'Biomedical Engineering', batchCount: 20 },
];

export const SEMESTERS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'FAC001',
    faculty_id: 'FAC001',
    name: 'Dr. K. Venkataswamy',
    department: 'CSE',
    designation: 'Professor & Head of Department',
    email: 'k.venkataswamy@sru.edu.in',
    phone: '+91 98480 12345',
    courses: ['CS2101', 'CS2103'],
  },
  {
    id: 'FAC002',
    faculty_id: 'FAC002',
    name: 'Dr. M. Sujatha',
    department: 'CSE',
    designation: 'Associate Professor',
    email: 'm.sujatha@sru.edu.in',
    phone: '+91 94401 54321',
    courses: ['CS2102', 'CS2105'],
  },
  {
    id: 'FAC003',
    faculty_id: 'FAC003',
    name: 'Dr. P. Ramesh Babu',
    department: 'ECE',
    designation: 'Assistant Professor',
    email: 'p.rameshbabu@sru.edu.in',
    phone: '+91 98665 99881',
    courses: ['EC2101', 'EC2102'],
  },
  {
    id: 'FAC004',
    faculty_id: 'FAC004',
    name: 'Dr. V. Nageshwar Rao',
    department: 'EEE',
    designation: 'Professor',
    email: 'v.nageshwar@sru.edu.in',
    phone: '+91 94901 88776',
    courses: ['EE2101'],
  },
  {
    id: 'FAC005',
    faculty_id: 'FAC005',
    name: 'Dr. B. Shravan Kumar',
    department: 'CE',
    designation: 'Associate Professor',
    email: 'b.shravan@sru.edu.in',
    phone: '+91 98492 44332',
    courses: ['CE2101'],
  },
  {
    id: 'FAC006',
    faculty_id: 'FAC006',
    name: 'Dr. T. Praveen Reddy',
    department: 'ME',
    designation: 'Associate Professor',
    email: 't.praveen@sru.edu.in',
    phone: '+91 98485 11990',
    courses: ['ME2101'],
  },
  {
    id: 'FAC007',
    faculty_id: 'FAC007',
    name: 'Dr. G. Lakshmi',
    department: 'AGRI',
    designation: 'Assistant Professor',
    email: 'g.lakshmi@sru.edu.in',
    phone: '+91 99081 22334',
    courses: ['AG2101'],
  },
  {
    id: 'FAC008',
    faculty_id: 'FAC008',
    name: 'Dr. S. Devender',
    department: 'BM',
    designation: 'Assistant Professor',
    email: 's.devender@sru.edu.in',
    phone: '+91 97011 33445',
    courses: ['BM2101'],
  },
];

// Slots with start_time and end_time ONLY (no subject names)
export const INITIAL_SLOTS: TimetableSlot[] = [
  { id: 'slot-1', slot_number: 1, name: 'Slot I', start_time: '09:30', end_time: '10:30', time_range: '09:30–10:30' },
  { id: 'slot-2', slot_number: 2, name: 'Slot II', start_time: '10:30', end_time: '11:30', time_range: '10:30–11:30' },
  { id: 'slot-3', slot_number: 3, name: 'Slot III', start_time: '11:30', end_time: '12:30', time_range: '11:30–12:30' },
  { id: 'slot-4', slot_number: 4, name: 'Slot IV', start_time: '12:30', end_time: '01:30', time_range: '12:30–01:30' },
  { id: 'slot-5', slot_number: 5, name: 'Slot V', start_time: '01:30', end_time: '02:30', time_range: '01:30–02:30' },
  { id: 'slot-6', slot_number: 6, name: 'Slot VI', start_time: '02:30', end_time: '03:30', time_range: '02:30–03:30' },
  { id: 'slot-7', slot_number: 7, name: 'Slot VII', start_time: '03:30', end_time: '04:30', time_range: '03:30–04:30' },
  { id: 'slot-8', slot_number: 8, name: 'Slot VIII', start_time: '04:30', end_time: '05:30', time_range: '04:30–05:30' },
];

export const INITIAL_COURSES: Course[] = [
  // CSE Courses
  { id: 'c1', code: 'CS2101', name: 'AI ASSISTED CODING', ltp: '3-0-2', department: 'CSE', year_sem: '2-1', total_classes_held: 36 },
  { id: 'c2', code: 'CS2102', name: 'CLOUD COMPUTING & VIRTUALIZATION', ltp: '3-1-0', department: 'CSE', year_sem: '2-1', total_classes_held: 32 },
  { id: 'c3', code: 'CS2103', name: 'MACHINE LEARNING TECHNIQUES', ltp: '3-0-2', department: 'CSE', year_sem: '2-1', total_classes_held: 38 },
  { id: 'c4', code: 'CS2104', name: 'DATA STRUCTURES & ALGORITHMS', ltp: '3-1-2', department: 'CSE', year_sem: '2-1', total_classes_held: 42 },
  { id: 'c5', code: 'CS2105', name: 'DATABASE MANAGEMENT SYSTEMS', ltp: '3-0-2', department: 'CSE', year_sem: '2-1', total_classes_held: 34 },
  { id: 'c6', code: 'CS2106', name: 'FULL STACK WEB DEVELOPMENT', ltp: '2-0-4', department: 'CSE', year_sem: '2-1', total_classes_held: 30 },
  { id: 'c7', code: 'CS2201', name: 'OPERATING SYSTEMS & LINUX INTERNALS', ltp: '3-0-2', department: 'CSE', year_sem: '2-2', total_classes_held: 35 },
  { id: 'c8', code: 'CS3101', name: 'DISTRIBUTED SYSTEMS & BIG DATA', ltp: '3-0-2', department: 'CSE', year_sem: '3-1', total_classes_held: 36 },
  { id: 'c9', code: 'CS1101', name: 'PROGRAMMING FOR PROBLEM SOLVING', ltp: '3-0-2', department: 'CSE', year_sem: '1-1', total_classes_held: 40 },
  { id: 'c10', code: 'CS4101', name: 'CYBER SECURITY & CRYPTOGRAPHY', ltp: '3-1-0', department: 'CSE', year_sem: '4-1', total_classes_held: 28 },

  // ECE Courses
  { id: 'c11', code: 'EC2101', name: 'SIGNALS AND SYSTEMS', ltp: '3-1-0', department: 'ECE', year_sem: '2-1', total_classes_held: 34 },
  { id: 'c12', code: 'EC2102', name: 'ANALOG CIRCUITS & LAB', ltp: '3-0-2', department: 'ECE', year_sem: '2-1', total_classes_held: 36 },
  { id: 'c13', code: 'EC3101', name: 'VLSI DESIGN & EMBEDDED SYSTEMS', ltp: '3-0-2', department: 'ECE', year_sem: '3-1', total_classes_held: 35 },

  // EEE Courses
  { id: 'c14', code: 'EE2101', name: 'ELECTRICAL MACHINES-I', ltp: '3-1-2', department: 'EEE', year_sem: '2-1', total_classes_held: 38 },
  { id: 'c15', code: 'EE2102', name: 'POWER ELECTRONICS & DRIVES', ltp: '3-0-2', department: 'EEE', year_sem: '2-1', total_classes_held: 32 },

  // CE Courses
  { id: 'c16', code: 'CE2101', name: 'STRENGTH OF MATERIALS', ltp: '3-1-0', department: 'CE', year_sem: '2-1', total_classes_held: 35 },
  { id: 'c17', code: 'CE2102', name: 'SURVEYING & GEOMATICS', ltp: '3-0-2', department: 'CE', year_sem: '2-1', total_classes_held: 34 },

  // ME Courses
  { id: 'c18', code: 'ME2101', name: 'THERMODYNAMICS & FLUID MECHANICS', ltp: '3-1-2', department: 'ME', year_sem: '2-1', total_classes_held: 36 },
  { id: 'c19', code: 'ME2102', name: 'KINEMATICS OF MACHINERY', ltp: '3-0-2', department: 'ME', year_sem: '2-1', total_classes_held: 32 },

  // AGRI Courses
  { id: 'c20', code: 'AG2101', name: 'FARM MACHINERY & POWER', ltp: '3-0-2', department: 'AGRI', year_sem: '2-1', total_classes_held: 30 },
  { id: 'c21', code: 'AG2102', name: 'SOIL & WATER CONSERVATION ENGG', ltp: '3-1-0', department: 'AGRI', year_sem: '2-1', total_classes_held: 32 },

  // BM Courses
  { id: 'c22', code: 'BM2101', name: 'BIOMEDICAL INSTRUMENTATION', ltp: '3-0-2', department: 'BM', year_sem: '2-1', total_classes_held: 34 },
  { id: 'c23', code: 'BM2102', name: 'PHYSIOLOGY & MEDICAL PHYSICS', ltp: '3-1-0', department: 'BM', year_sem: '2-1', total_classes_held: 30 },
];

export const INITIAL_CIRCULARS: Circular[] = [
  {
    id: 'circ-1',
    date: '10-Oct-2026',
    title: 'Mid-Semester Examinations Schedule & Timetable - B.Tech All Branches',
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
    title: 'Multi-Disciplinary Research Colloquium for Engineering Departments',
    department: 'Dean Research',
    category: 'Research',
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

// Reusable Name pools for generating realistic 30 students per batch
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Divya', 'Karthik', 'Pooja',
  'Sai Krishna', 'Kavya', 'Rahul', 'Deepika', 'Manish', 'Anjali', 'Arjun', 'Bhavana', 'Chaitanya', 'Harini',
  'Varun', 'Swathi', 'Pranav', 'Naveen', 'Keerthana', 'Tarun', 'Sowmya', 'Siddharth', 'Meghana', 'Ganesh',
  'Sanjana', 'Abhishek', 'Ramya', 'Kishore', 'Niharika', 'Venkatesh', 'Aishwarya', 'Akash', 'Shravani', 'Surya',
  'Harshitha', 'Nikhil', 'Tejaswi', 'Vinay', 'Pranathi', 'Srikanth', 'Lavanya', 'Ajay', 'Sirisha', 'Sharath'
];

const LAST_NAMES = [
  'Reddy', 'Sharma', 'Rao', 'Verma', 'Patel', 'Kulkarni', 'Singh', 'Nair', 'Iyer', 'Joshi',
  'Chowdary', 'Gupta', 'Naidu', 'Bhat', 'Menon', 'Goud', 'Varma', 'Mishra', 'Prasad', 'Rathod'
];

const FATHER_NAMES = [
  'Ramesh', 'Srinivas', 'Rajesh', 'Suresh', 'Venkat', 'Prakash', 'Mahendra', 'Gopal', 'Narayana', 'Satyanarayana',
  'Krishna Murthy', 'Chandra Sekhar', 'Govinda Rao', 'Subba Rao', 'Ramana Murthy', 'Mohan', 'Bhaskar', 'Sudhakar'
];

/**
 * Generate Batches and Students deterministically:
 * - CSE: 74 batches (30 students each)
 * - ECE: 30 batches
 * - EEE: 24 batches
 * - CE: 24 batches
 * - ME: 24 batches
 * - AGRI: 20 batches
 * - BM: 20 batches
 * All distributed evenly across semesters 1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2!
 */
export function generateUniversityBatchesAndStudents() {
  const batches: Batch[] = [];
  const students: Student[] = [];

  let globalStudentCounter = 1;

  DEPARTMENTS.forEach((dept) => {
    const { code, batchCount } = dept;

    for (let bIndex = 1; bIndex <= batchCount; bIndex++) {
      const batchNumStr = bIndex.toString().padStart(2, '0');
      const batchName = `25${code}${batchNumStr}`; // e.g. 25CSE01 to 25CSE74

      // Distribute across 8 semesters evenly so EVERY semester has batches!
      const semesterIndex = (bIndex - 1) % SEMESTERS.length;
      const year_sem = SEMESTERS[semesterIndex];

      const batchObj: Batch = {
        id: `batch-${code}-${bIndex}`,
        name: batchName,
        displayName: `${code} Batch ${batchNumStr} (${batchName})`,
        department: code,
        year_sem,
        academic_year: '2024-25',
        student_count: 30, // exactly 30 students
        description: `B.Tech ${dept.name} - Section ${String.fromCharCode(65 + ((bIndex - 1) % 4))}`,
        created_at: '2024-07-15',
      };
      batches.push(batchObj);

      // Create exactly 30 students for this batch
      for (let sIndex = 1; sIndex <= 30; sIndex++) {
        const studentIndex = globalStudentCounter++;
        const sNumStr = sIndex.toString().padStart(2, '0');
        // Standard roll number: 25CSE0101 to 25CSE0130, or SRU2024001 for the very first student
        let roll_no = `${batchName}${sNumStr}`;
        if (code === 'CSE' && bIndex === 1 && sIndex === 1) {
          roll_no = 'SRU2024001'; // preserved for default demo student login!
        }

        const fName = FIRST_NAMES[(studentIndex + sIndex) % FIRST_NAMES.length];
        const lName = LAST_NAMES[(studentIndex * 3) % LAST_NAMES.length];
        const fatherFName = FATHER_NAMES[(studentIndex + sIndex * 2) % FATHER_NAMES.length];
        const name = `${fName} ${lName}`;
        const father_name = `${fatherFName} ${lName}`;

        // Ensure some low attendance for alerts (<75%) and realistic spread
        let attendance_pct = 85.0;
        if (sIndex === 7 || sIndex === 18) {
          attendance_pct = Math.round((58 + (sIndex % 15)) * 10) / 10; // Low attendance (<75%)
        } else if (sIndex % 4 === 0) {
          attendance_pct = Math.round((91 + (sIndex % 8)) * 10) / 10;
        } else {
          attendance_pct = Math.round((76 + (sIndex % 18)) * 10) / 10;
        }

        const cgpa = Math.round((6.8 + ((sIndex * 7) % 30) / 10) * 100) / 100;
        const backlogs = sIndex === 7 ? 2 : sIndex === 18 ? 1 : 0;
        const mentor = INITIAL_FACULTY[(sIndex + bIndex) % INITIAL_FACULTY.length];

        students.push({
          id: `std-${code}-${bIndex}-${sIndex}`,
          roll_no,
          name,
          father_name,
          batch_id: batchName,
          department: code,
          year_sem,
          mentor_id: mentor.id,
          mentor_name: mentor.name,
          cgpa,
          backlogs,
          attendance_pct,
          email: `${roll_no.toLowerCase()}@sru.edu.in`,
          phone: `+91 9${(800000000 + (studentIndex * 12345) % 100000000).toString().slice(0, 9)}`,
        });
      }
    }
  });

  return { batches, students };
}

const { batches: GENERATED_BATCHES, students: GENERATED_STUDENTS } = generateUniversityBatchesAndStudents();

export const INITIAL_BATCHES: Batch[] = GENERATED_BATCHES;
export const INITIAL_STUDENTS: Student[] = GENERATED_STUDENTS;

// Seed recent attendance records
export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-10-09',
    slot_ids: ['slot-1', 'slot-2'],
    slot_names: 'Slot I, Slot II (09:30–11:30)',
    class_type: 'P',
    topics_covered: 'Hands-on Lab: Prompt engineering and Copilot automated test generation in Python',
    course_code: 'CS2101',
    course_name: 'AI ASSISTED CODING',
    department: 'CSE',
    year_sem: '2-1',
    batch_id: '25CSE01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Reddy',
    status: 'present',
    marked_by: 'FAC001',
    timestamp: '2026-10-09 11:35:00',
  },
  {
    id: 'att-2',
    date: '2026-10-08',
    slot_ids: ['slot-1'],
    slot_names: 'Slot I (09:30–10:30)',
    class_type: 'L',
    topics_covered: 'Lecture: Virtualization vs Containerization, Docker architecture & namespaces',
    course_code: 'CS2102',
    course_name: 'CLOUD COMPUTING & VIRTUALIZATION',
    department: 'CSE',
    year_sem: '2-1',
    batch_id: '25CSE01',
    student_roll_no: 'SRU2024001',
    student_name: 'Aarav Reddy',
    status: 'present',
    marked_by: 'FAC002',
    timestamp: '2026-10-08 10:35:00',
  },
];
