import {
  Student,
  Teacher,
  Staff,
  Parent,
  SchoolClass,
  Subject,
  StudentAttendanceRecord,
  TeacherAttendanceRecord,
  TimetableSlot,
  Homework,
  Exam,
  ExamScheduleItem,
  ExamResult,
  FeeStructure,
  FeePayment,
  AdmissionApplication,
  LeaveRequest,
  SchoolNotice,
  AppNotification,
  SchoolSettings,
  User,
  UserRole,
} from '../types';

import {
  initialSettings,
  initialUsers,
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialStaff,
  initialParents,
  initialStudents,
  initialFeeStructures,
  initialFeePayments,
  initialAttendance,
  initialTeacherAttendance,
  initialTimetable,
  initialHomework,
  initialExams,
  initialExamSchedule,
  initialExamResults,
  initialAdmissions,
  initialLeaves,
  initialNotices,
  initialNotifications,
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'sms_qamber_settings',
  USERS: 'sms_qamber_users',
  STUDENTS: 'sms_qamber_students',
  TEACHERS: 'sms_qamber_teachers',
  STAFF: 'sms_qamber_staff',
  PARENTS: 'sms_qamber_parents',
  CLASSES: 'sms_qamber_classes',
  SUBJECTS: 'sms_qamber_subjects',
  ATTENDANCE: 'sms_qamber_attendance',
  TEACHER_ATTENDANCE: 'sms_qamber_teacher_attendance',
  TIMETABLE: 'sms_qamber_timetable',
  HOMEWORK: 'sms_qamber_homework',
  EXAMS: 'sms_qamber_exams',
  EXAM_SCHEDULE: 'sms_qamber_exam_schedule',
  RESULTS: 'sms_qamber_results',
  FEE_STRUCTURES: 'sms_qamber_fee_structures',
  FEE_PAYMENTS: 'sms_qamber_fee_payments',
  ADMISSIONS: 'sms_qamber_admissions',
  LEAVES: 'sms_qamber_leaves',
  NOTICES: 'sms_qamber_notices',
  NOTIFICATIONS: 'sms_qamber_notifications',
  CURRENT_USER: 'sms_qamber_current_user',
};

export { STORAGE_KEYS };

export function getData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

// Initial bootstrap check
export function initializeStorageIfEmpty(): void {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    saveData(STORAGE_KEYS.SETTINGS, initialSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveData(STORAGE_KEYS.USERS, initialUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    saveData(STORAGE_KEYS.CLASSES, initialClasses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    saveData(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    saveData(STORAGE_KEYS.TEACHERS, initialTeachers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
    saveData(STORAGE_KEYS.STAFF, initialStaff);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARENTS)) {
    saveData(STORAGE_KEYS.PARENTS, initialParents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    saveData(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURES)) {
    saveData(STORAGE_KEYS.FEE_STRUCTURES, initialFeeStructures);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEE_PAYMENTS)) {
    saveData(STORAGE_KEYS.FEE_PAYMENTS, initialFeePayments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    saveData(STORAGE_KEYS.ATTENDANCE, initialAttendance);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHER_ATTENDANCE)) {
    saveData(STORAGE_KEYS.TEACHER_ATTENDANCE, initialTeacherAttendance);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TIMETABLE)) {
    saveData(STORAGE_KEYS.TIMETABLE, initialTimetable);
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK)) {
    saveData(STORAGE_KEYS.HOMEWORK, initialHomework);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    saveData(STORAGE_KEYS.EXAMS, initialExams);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAM_SCHEDULE)) {
    saveData(STORAGE_KEYS.EXAM_SCHEDULE, initialExamSchedule);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    saveData(STORAGE_KEYS.RESULTS, initialExamResults);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMISSIONS)) {
    saveData(STORAGE_KEYS.ADMISSIONS, initialAdmissions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
    saveData(STORAGE_KEYS.LEAVES, initialLeaves);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    saveData(STORAGE_KEYS.NOTICES, initialNotices);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    saveData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }
}

export function resetAllDataToDemo(): void {
  saveData(STORAGE_KEYS.SETTINGS, initialSettings);
  saveData(STORAGE_KEYS.USERS, initialUsers);
  saveData(STORAGE_KEYS.CLASSES, initialClasses);
  saveData(STORAGE_KEYS.SUBJECTS, initialSubjects);
  saveData(STORAGE_KEYS.TEACHERS, initialTeachers);
  saveData(STORAGE_KEYS.STAFF, initialStaff);
  saveData(STORAGE_KEYS.PARENTS, initialParents);
  saveData(STORAGE_KEYS.STUDENTS, initialStudents);
  saveData(STORAGE_KEYS.FEE_STRUCTURES, initialFeeStructures);
  saveData(STORAGE_KEYS.FEE_PAYMENTS, initialFeePayments);
  saveData(STORAGE_KEYS.ATTENDANCE, initialAttendance);
  saveData(STORAGE_KEYS.TEACHER_ATTENDANCE, initialTeacherAttendance);
  saveData(STORAGE_KEYS.TIMETABLE, initialTimetable);
  saveData(STORAGE_KEYS.HOMEWORK, initialHomework);
  saveData(STORAGE_KEYS.EXAMS, initialExams);
  saveData(STORAGE_KEYS.EXAM_SCHEDULE, initialExamSchedule);
  saveData(STORAGE_KEYS.RESULTS, initialExamResults);
  saveData(STORAGE_KEYS.ADMISSIONS, initialAdmissions);
  saveData(STORAGE_KEYS.LEAVES, initialLeaves);
  saveData(STORAGE_KEYS.NOTICES, initialNotices);
  saveData(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
}

// Grade calculation helper
export function calculateGrade(
  percentage: number,
  settings: SchoolSettings = initialSettings
): { grade: string; gpa: string; remarks: string; passed: boolean } {
  const passingPct = settings.passingPercentage || 50;
  const passed = percentage >= passingPct;

  for (const scale of settings.gradingScale) {
    if (percentage >= scale.minPercentage && percentage <= scale.maxPercentage) {
      return {
        grade: scale.grade,
        gpa: scale.gpa,
        remarks: scale.remarks,
        passed,
      };
    }
  }

  return {
    grade: percentage >= 50 ? 'D' : 'F',
    gpa: '0.0',
    remarks: percentage >= 50 ? 'Satisfactory' : 'Needs Improvement',
    passed,
  };
}

// Role Permissions Matrix
export function checkPermission(
  role: UserRole,
  module:
    | 'dashboard'
    | 'students'
    | 'teachers'
    | 'staff'
    | 'parents'
    | 'classes'
    | 'subjects'
    | 'attendance'
    | 'timetable'
    | 'homework'
    | 'exams'
    | 'results'
    | 'fees'
    | 'admissions'
    | 'leaves'
    | 'notices'
    | 'notifications'
    | 'reports'
    | 'settings'
    | 'users'
): 'full' | 'manage' | 'assigned' | 'view' | 'none' {
  if (role === 'admin') return 'full';

  switch (module) {
    case 'dashboard':
      return role === 'principal' ? 'full' : 'view';

    case 'students':
      if (role === 'principal') return 'full';
      if (role === 'teacher') return 'assigned';
      if (role === 'accountant' || role === 'staff') return 'view';
      return 'none';

    case 'teachers':
      if (role === 'principal') return 'full';
      if (role === 'teacher') return 'view';
      if (role === 'accountant' || role === 'staff') return 'view';
      return 'none';

    case 'staff':
      if (role === 'principal') return 'full';
      return role === 'accountant' ? 'view' : 'none';

    case 'parents':
      if (role === 'principal') return 'full';
      return 'view';

    case 'classes':
    case 'subjects':
      if (role === 'principal') return 'full';
      return 'view';

    case 'attendance':
      if (role === 'principal') return 'full';
      if (role === 'teacher') return 'manage';
      return 'view';

    case 'timetable':
      if (role === 'principal') return 'full';
      return 'view';

    case 'homework':
      if (role === 'principal' || role === 'teacher') return 'manage';
      return 'view';

    case 'exams':
    case 'results':
      if (role === 'principal') return 'full';
      if (role === 'teacher') return 'manage';
      return 'view';

    case 'fees':
      if (role === 'accountant') return 'full';
      if (role === 'principal') return 'view';
      return 'none';

    case 'admissions':
      if (role === 'principal') return 'full';
      if (role === 'staff') return 'manage';
      return 'view';

    case 'leaves':
      if (role === 'principal') return 'full';
      return 'manage';

    case 'notices':
      if (role === 'principal') return 'full';
      return 'view';

    case 'notifications':
      return 'view';

    case 'reports':
      if (role === 'principal') return 'full';
      if (role === 'accountant') return 'view';
      return 'none';

    case 'settings':
      if (role === 'principal') return 'view';
      return 'none';

    case 'users':
      return 'none';

    default:
      return 'none';
  }
}

import * as XLSX from 'xlsx';

// CSV Export Helper
export function exportToCSV(filename: string, rows: Record<string, any>[], headers?: string[]): void {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const keys = headers || Object.keys(rows[0]);
  const csvContent = [
    keys.join(','),
    ...rows.map((row) =>
      keys
        .map((k) => {
          let cell = row[k] ?? '';
          if (typeof cell === 'object') {
            cell = JSON.stringify(cell);
          }
          cell = String(cell).replace(/"/g, '""');
          if (cell.includes(',') || cell.includes('\n') || cell.includes('"')) {
            cell = `"${cell}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Structured Excel Export Helper using xlsx
export function exportToExcel(
  filename: string,
  rows: Record<string, any>[],
  sheetName: string = 'Records'
): void {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    const columnWidths = Object.keys(rows[0]).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...rows.map((r) => String(r[key] ?? '').length)
      );
      return { wch: Math.min(Math.max(maxLen + 2, 10), 50) };
    });
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel spreadsheet:', error);
    alert('Failed to export to Excel.');
  }
}

