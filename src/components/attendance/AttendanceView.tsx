import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Download,
  Users,
  Save,
  Check,
  X,
  Filter,
} from 'lucide-react';
import {
  Student,
  SchoolClass,
  StudentAttendanceRecord,
  Teacher,
  TeacherAttendanceRecord,
  AttendanceStatus,
} from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const AttendanceView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'reports'>('students');

  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const allStudents = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);

  // Filter selections
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-01');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Grade 10');
  const [selectedSection, setSelectedSection] = useState<string>('Science-A');

  // Student Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>(() =>
    getData<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, [])
  );

  // Teacher Attendance State
  const [teacherRecords, setTeacherRecords] = useState<TeacherAttendanceRecord[]>(() =>
    getData<TeacherAttendanceRecord[]>(STORAGE_KEYS.TEACHER_ATTENDANCE, [])
  );

  // Filter students for selected class & section
  const currentStudents = allStudents.filter(
    (s) => s.class === selectedClass && (s.section === selectedSection || selectedSection === 'All')
  );

  // Map student attendance for the selected date
  const getStudentStatus = (studentId: string): 'Present' | 'Absent' | 'Leave' => {
    const found = attendanceRecords.find(
      (a) => a.date === selectedDate && a.studentId === studentId
    );
    return found ? found.status : 'Present';
  };

  const handleSetStudentStatus = (student: Student, status: 'Present' | 'Absent' | 'Leave') => {
    const existingIndex = attendanceRecords.findIndex(
      (a) => a.date === selectedDate && a.studentId === student.id
    );

    let updated: StudentAttendanceRecord[];
    if (existingIndex >= 0) {
      updated = [...attendanceRecords];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status,
      };
    } else {
      const newRec: StudentAttendanceRecord = {
        id: `att-${Date.now()}-${student.id}`,
        date: selectedDate,
        studentId: student.id,
        studentName: student.fullName,
        rollNo: student.rollNo,
        class: student.class,
        section: student.section,
        status,
      };
      updated = [newRec, ...attendanceRecords];
    }

    setAttendanceRecords(updated);
    saveData(STORAGE_KEYS.ATTENDANCE, updated);
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    let updated = [...attendanceRecords];
    currentStudents.forEach((student) => {
      const idx = updated.findIndex(
        (a) => a.date === selectedDate && a.studentId === student.id
      );
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], status };
      } else {
        updated.push({
          id: `att-${Date.now()}-${student.id}`,
          date: selectedDate,
          studentId: student.id,
          studentName: student.fullName,
          rollNo: student.rollNo,
          class: student.class,
          section: student.section,
          status,
        });
      }
    });

    setAttendanceRecords(updated);
    saveData(STORAGE_KEYS.ATTENDANCE, updated);
    showToast(`Marked all ${currentStudents.length} students as ${status}!`);
  };

  const handleSaveAttendance = () => {
    saveData(STORAGE_KEYS.ATTENDANCE, attendanceRecords);
    showToast(`Daily attendance saved for ${selectedClass} (${selectedSection}) on ${selectedDate}!`);
  };

  // Teacher Attendance Handler
  const getTeacherStatus = (teacherId: string): AttendanceStatus => {
    const found = teacherRecords.find(
      (t) => t.date === selectedDate && t.teacherId === teacherId
    );
    return found ? found.status : 'Present';
  };

  const handleSetTeacherStatus = (teacher: Teacher, status: AttendanceStatus) => {
    const existingIndex = teacherRecords.findIndex(
      (t) => t.date === selectedDate && t.teacherId === teacher.id
    );

    let updated: TeacherAttendanceRecord[];
    if (existingIndex >= 0) {
      updated = [...teacherRecords];
      updated[existingIndex] = { ...updated[existingIndex], status };
    } else {
      updated = [
        {
          id: `tatt-${Date.now()}-${teacher.id}`,
          date: selectedDate,
          teacherId: teacher.id,
          teacherName: teacher.name,
          status,
        },
        ...teacherRecords,
      ];
    }
    setTeacherRecords(updated);
    saveData(STORAGE_KEYS.TEACHER_ATTENDANCE, updated);
  };

  // Metrics for Current Selection
  const presentCount = currentStudents.filter((s) => getStudentStatus(s.id) === 'Present').length;
  const absentCount = currentStudents.filter((s) => getStudentStatus(s.id) === 'Absent').length;
  const leaveCount = currentStudents.filter((s) => getStudentStatus(s.id) === 'Leave').length;
  const totalInClass = currentStudents.length || 1;
  const presentPct = Math.round((presentCount / totalInClass) * 100);

  const handleExportAttendanceCSV = () => {
    const rows = currentStudents.map((s) => ({
      Date: selectedDate,
      'Admission No': s.admissionNo,
      'Full Name': s.fullName,
      'Roll No': s.rollNo,
      Class: s.class,
      Section: s.section,
      Status: getStudentStatus(s.id),
    }));
    exportToCSV(`SMPS_Attendance_${selectedClass}_${selectedDate}`, rows);
    showToast('Exported attendance to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Attendance System</h2>
            <p className="text-xs text-slate-400">
              Daily student roll calls, faculty registers and comprehensive monthly percentages
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl no-print">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'students'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Attendance
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher Attendance
          </button>
        </div>
      </div>

      {activeTab === 'students' && (
        <>
          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 no-print">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="Science-A">Science-A</option>
                <option value="Science-B">Science-B</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleExportAttendanceCSV}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Present</span>
                <p className="text-xl font-black text-emerald-600">{presentCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Absent</span>
                <p className="text-xl font-black text-rose-600">{absentCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Leave</span>
                <p className="text-xl font-black text-amber-600">{leaveCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Attendance Rate</span>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-black text-slate-800">{presentPct}%</p>
                  <div className="w-20 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${presentPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {canManage('attendance') && (
              <div className="flex items-center gap-2 w-full md:w-auto justify-end no-print">
                <button
                  onClick={() => handleMarkAll('Present')}
                  className="px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('Absent')}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 cursor-pointer"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Attendance
                </button>
              </div>
            )}
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentStudents.map((st) => {
                    const status = getStudentStatus(st.id);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{st.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{st.class}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{st.section}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button
                              onClick={() => handleSetStudentStatus(st, 'Present')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleSetStudentStatus(st, 'Absent')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                status === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleSetStudentStatus(st, 'Leave')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                status === 'Leave'
                                  ? 'bg-amber-500 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              Leave
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Register Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-semibold"
              />
            </div>
            <button
              onClick={() => showToast('Teacher attendance register updated!')}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Faculty Register
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Assigned Subjects</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((tch) => {
                    const status = getTeacherStatus(tch.id);
                    return (
                      <tr key={tch.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{tch.name}</td>
                        <td className="py-3 px-4 text-slate-600">{tch.designation}</td>
                        <td className="py-3 px-4 text-slate-600">{tch.assignedSubjects.join(', ')}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {(['Present', 'Absent', 'Leave', 'Half Day'] as AttendanceStatus[]).map(
                              (st) => (
                                <button
                                  key={st}
                                  onClick={() => handleSetTeacherStatus(tch, st)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                    status === st
                                      ? st === 'Present'
                                        ? 'bg-emerald-600 text-white'
                                        : st === 'Absent'
                                        ? 'bg-rose-600 text-white'
                                        : st === 'Leave'
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-indigo-600 text-white'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  {st}
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
