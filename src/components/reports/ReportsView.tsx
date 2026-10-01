import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, Printer, Filter, Users, CreditCard, Award, CalendarCheck } from 'lucide-react';
import {
  Student,
  Teacher,
  Staff,
  FeePayment,
  ExamResult,
  StudentAttendanceRecord,
} from '../../types';
import { getData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { useToast } from '../common/Toast';

export const ReportsView: React.FC = () => {
  const { showToast } = useToast();

  const [selectedReport, setSelectedReport] = useState<
    'students' | 'fees' | 'exams' | 'attendance' | 'staff'
  >('students');

  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  const staff = getData<Staff[]>(STORAGE_KEYS.STAFF, []);
  const feePayments = getData<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, []);
  const examResults = getData<ExamResult[]>(STORAGE_KEYS.RESULTS, []);
  const attendance = getData<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);

  const handleExport = () => {
    if (selectedReport === 'students') {
      const rows = students.map((s) => ({
        AdmissionNo: s.admissionNo,
        Name: s.fullName,
        FatherName: s.fatherName,
        Class: s.class,
        Section: s.section,
        RollNo: s.rollNo,
        Gender: s.gender,
        Phone: s.phone,
        Status: s.status,
      }));
      exportToCSV('SMPS_Student_Report', rows);
    } else if (selectedReport === 'fees') {
      const rows = feePayments.map((f) => ({
        Invoice: f.invoiceNo,
        Student: f.studentName,
        Class: f.class,
        Month: f.month,
        Total: f.totalAmount,
        Discount: f.discount,
        Paid: f.paidAmount,
        Remaining: f.remainingAmount,
        Status: f.status,
      }));
      exportToCSV('SMPS_Fee_Collection_Report', rows);
    } else if (selectedReport === 'exams') {
      const rows = examResults.map((r) => ({
        Exam: r.examName,
        Student: r.studentName,
        Class: r.class,
        Score: `${r.totalObtainedMarks}/${r.totalMaxMarks}`,
        Percentage: `${r.percentage}%`,
        Grade: r.overallGrade,
        Passed: r.passed ? 'Yes' : 'No',
      }));
      exportToCSV('SMPS_Academic_Results_Report', rows);
    } else if (selectedReport === 'attendance') {
      const rows = attendance.map((a) => ({
        Date: a.date,
        Student: a.studentName,
        Class: a.class,
        Section: a.section,
        Roll: a.rollNo,
        Status: a.status,
      }));
      exportToCSV('SMPS_Attendance_Report', rows);
    } else if (selectedReport === 'staff') {
      const rows = [...teachers.map(t => ({ Name: t.name, Role: t.designation, Phone: t.phone, Salary: t.salary })), ...staff.map(s => ({ Name: s.name, Role: s.position, Phone: s.phone, Salary: s.salary }))];
      exportToCSV('SMPS_Human_Resources_Report', rows);
    }
    showToast('Report generated and exported to CSV!');
  };

  const handleExportExcel = () => {
    if (selectedReport === 'students') {
      const rows = students.map((s) => ({
        'Admission No': s.admissionNo,
        'Full Name': s.fullName,
        "Father's Name": s.fatherName,
        Class: s.class,
        Section: s.section,
        'Roll No': s.rollNo,
        Gender: s.gender,
        Phone: s.phone,
        Status: s.status,
      }));
      exportToExcel('SMPS_Students_Report', rows, 'Students');
    } else if (selectedReport === 'fees') {
      const rows = feePayments.map((f) => ({
        'Invoice No': f.invoiceNo,
        'Student Name': f.studentName,
        Class: f.class,
        Month: f.month,
        'Total (PKR)': f.totalAmount,
        'Discount (PKR)': f.discount,
        'Paid (PKR)': f.paidAmount,
        'Remaining (PKR)': f.remainingAmount,
        Status: f.status,
      }));
      exportToExcel('SMPS_Fee_Collection_Report', rows, 'Fee Records');
    } else if (selectedReport === 'exams') {
      const rows = examResults.map((r) => ({
        Exam: r.examName,
        'Student Name': r.studentName,
        Class: r.class,
        'Total Marks': r.totalMaxMarks,
        'Obtained Marks': r.totalObtainedMarks,
        Percentage: `${r.percentage}%`,
        Grade: r.overallGrade,
        Passed: r.passed ? 'Yes' : 'No',
      }));
      exportToExcel('SMPS_Academic_Results_Report', rows, 'Exam Results');
    } else if (selectedReport === 'attendance') {
      const rows = attendance.map((a) => ({
        Date: a.date,
        'Student Name': a.studentName,
        Class: a.class,
        Section: a.section,
        'Roll No': a.rollNo,
        Status: a.status,
      }));
      exportToExcel('SMPS_Attendance_Report', rows, 'Attendance');
    } else if (selectedReport === 'staff') {
      const rows = [
        ...teachers.map((t) => ({ Name: t.name, Department: 'Academic Faculty', Role: t.designation, Phone: t.phone, 'Salary (PKR)': t.salary })),
        ...staff.map((s) => ({ Name: s.name, Department: 'Administration/Support', Role: s.position, Phone: s.phone, 'Salary (PKR)': s.salary })),
      ];
      exportToExcel('SMPS_Human_Resources_Report', rows, 'Faculty & Staff');
    }
    showToast('Report generated and exported to Excel (.xlsx)!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Reports & Analytics Hub</h2>
            <p className="text-xs text-slate-400">
              Generate administrative ledgers, exam performance summaries and financial audit reports
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            title="Download formatted Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export to Excel
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Report
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 no-print">
        {[
          { key: 'students', label: 'Student Directory', icon: Users },
          { key: 'fees', label: 'Fee Collection', icon: CreditCard },
          { key: 'exams', label: 'Academic Results', icon: Award },
          { key: 'attendance', label: 'Attendance Audit', icon: CalendarCheck },
          { key: 'staff', label: 'Staff & Payroll', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedReport === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedReport(tab.key as any)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
              <div className="truncate">
                <div className="text-xs font-bold truncate">{tab.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Selected Report View */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden print-area">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 capitalize">
              {selectedReport} Report • THE SMART MODERN PUBLIC SCHOOL QAMBER
            </h3>
            <p className="text-xs text-slate-400">Academic Session 2026–2027</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {selectedReport === 'students' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Father Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-indigo-700">{s.admissionNo}</td>
                    <td className="p-3 font-bold text-slate-800">{s.fullName}</td>
                    <td className="p-3">{s.fatherName}</td>
                    <td className="p-3 font-semibold">{s.class}</td>
                    <td className="p-3">{s.section}</td>
                    <td className="p-3 font-mono">{s.rollNo}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'fees' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Gross Total</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3 font-bold text-emerald-700">Paid Amount</th>
                  <th className="p-3 font-bold text-rose-600">Remaining Balance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feePayments.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold">{f.invoiceNo}</td>
                    <td className="p-3 font-bold text-slate-800">{f.studentName}</td>
                    <td className="p-3">{f.class}</td>
                    <td className="p-3">{f.month}</td>
                    <td className="p-3 font-mono">Rs. {f.totalAmount.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-700">Rs. {f.discount.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">Rs. {f.paidAmount.toLocaleString()}</td>
                    <td className="p-3 font-mono font-bold text-rose-600">Rs. {f.remainingAmount.toLocaleString()}</td>
                    <td className="p-3 font-bold">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'exams' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Exam Name</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Total Score</th>
                  <th className="p-3">Percentage</th>
                  <th className="p-3">Overall Grade</th>
                  <th className="p-3">Final Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-700">{r.examName}</td>
                    <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="p-3">{r.class}</td>
                    <td className="p-3 font-mono">{r.totalObtainedMarks} / {r.totalMaxMarks}</td>
                    <td className="p-3 font-bold">{r.percentage}%</td>
                    <td className="p-3 font-black text-indigo-700">{r.overallGrade}</td>
                    <td className="p-3 font-bold text-emerald-700">{r.passed ? 'PASSED' : 'FAILED'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'attendance' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium">{a.date}</td>
                    <td className="p-3 font-bold text-slate-900">{a.studentName}</td>
                    <td className="p-3">{a.class}</td>
                    <td className="p-3">{a.section}</td>
                    <td className="p-3 font-mono">{a.rollNo}</td>
                    <td className="p-3 font-bold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'staff' && (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Designation / Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Monthly Compensation</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{t.name} (Faculty)</td>
                    <td className="p-3 text-indigo-700 font-semibold">{t.designation}</td>
                    <td className="p-3">{t.phone}</td>
                    <td className="p-3 font-mono font-bold">Rs. {t.salary.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-700">{t.status}</td>
                  </tr>
                ))}
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{s.name} (Support)</td>
                    <td className="p-3 text-purple-700 font-semibold">{s.position}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3 font-mono font-bold">Rs. {s.salary.toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-700">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
