export type UserRole = 'admin' | 'principal' | 'teacher' | 'accountant' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  designation?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  class: string;
  section: string;
  rollNo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  admissionDate: string;
  previousSchool: string;
  bloodGroup: string;
  emergencyContact: string;
  photo: string;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  guardianName?: string;
  documents?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  fatherName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  joiningDate: string;
  designation: string;
  assignedSubjects: string[];
  assignedClasses: string[];
  salary: number;
  photo: string;
  status: 'Active' | 'On Leave' | 'Resigned';
}

export interface Staff {
  id: string;
  name: string;
  position: 'Accountant' | 'Clerk' | 'Librarian' | 'Receptionist' | 'Security Guard' | 'Lab Assistant' | 'Support Staff';
  phone: string;
  email: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  address: string;
  gender: string;
}

export interface Parent {
  id: string;
  fatherName: string;
  motherName: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  childrenAdmissionNos: string[]; // references Student.admissionNo
}

export interface SchoolClass {
  id: string;
  name: string;
  numericLevel: number;
  sections: string[];
  classTeacherId?: string;
  roomNo?: string;
  capacity?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  class: string;
  teacherId?: string;
  teacherName?: string;
  maxMarks: number;
  passingMarks: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Half Day';

export interface StudentAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  rollNo: string;
  class: string;
  section: string;
  status: 'Present' | 'Absent' | 'Leave';
  remark?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  teacherName: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface TimetableSlot {
  id: string;
  class: string;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  class: string;
  section: string;
  subject: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'Pending Review';
}

export interface Exam {
  id: string;
  name: string;
  type: 'Monthly Test' | 'Mid Term' | 'Final Term' | 'Annual Exam';
  session: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface ExamScheduleItem {
  id: string;
  examId: string;
  examName: string;
  class: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  maxMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  class: string;
  section: string;
  subjectResults: {
    subject: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
    remarks: string;
  }[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  overallGrade: string;
  passed: boolean;
  remarks: string;
}

export interface FeeStructure {
  id: string;
  class: string;
  admissionFee: number;
  tuitionFee: number;
  examFee: number;
  computerFee: number;
  transportFee: number;
  otherFee: number;
  totalMonthlyFee: number;
}

export interface FeePayment {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  class: string;
  section: string;
  month: string;
  feeType: string;
  totalAmount: number;
  discount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Online';
  paymentDate: string;
  status: 'Paid' | 'Partial' | 'Pending';
  remarks?: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  previousSchool: string;
  applyingClass: string;
  phone: string;
  email: string;
  address: string;
  applicationDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'Student' | 'Teacher' | 'Staff';
  classOrDesignation: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Emergency' | 'Medical' | 'Personal';
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
}

export interface SchoolNotice {
  id: string;
  title: string;
  description: string;
  date: string;
  audience: 'Everyone' | 'Students' | 'Teachers' | 'Parents' | 'Staff';
  priority: 'High' | 'Medium' | 'Normal';
  category: 'Notice' | 'Circular' | 'Announcement' | 'Event' | 'Holiday';
  attachmentName?: string;
  postedBy: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'fee' | 'exam' | 'attendance' | 'notice' | 'admission' | 'leave';
  read: boolean;
  link?: string;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  registrationNo: string;
  currentSession: string;
  currency: string;
  dateFormat: string;
  passingPercentage: number;
  gradingScale: {
    grade: string;
    minPercentage: number;
    maxPercentage: number;
    gpa: string;
    remarks: string;
  }[];
}
