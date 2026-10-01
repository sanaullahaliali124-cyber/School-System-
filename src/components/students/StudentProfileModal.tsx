import React, { useState } from 'react';
import {
  X,
  Printer,
  User,
  CalendarCheck,
  CreditCard,
  Award,
  BookOpen,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Student, StudentAttendanceRecord, FeePayment, ExamResult, Homework } from '../../types';
import { getData, STORAGE_KEYS } from '../../services/storage';
import { StudentIDCardModal } from './StudentIDCardModal';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'exams' | 'homework' | 'docs'>('overview');
  const [showIdCard, setShowIdCard] = useState(false);

  if (!isOpen || !student) return null;

  // Retrieve student's related records
  const allAttendance = getData<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []).filter(
    (a) => a.studentId === student.id
  );
  const allFees = getData<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, []).filter(
    (f) => f.studentId === student.id || f.admissionNo === student.admissionNo
  );
  const allResults = getData<ExamResult[]>(STORAGE_KEYS.RESULTS, []).filter(
    (r) => r.studentId === student.id
  );
  const allHomework = getData<Homework[]>(STORAGE_KEYS.HOMEWORK, []).filter(
    (h) => h.class === student.class
  );

  const presentCount = allAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = allAttendance.length > 0 ? Math.round((presentCount / allAttendance.length) * 100) : 95;

  const totalFeePaid = allFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalFeePending = allFees.reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Student ID: {student.admissionNo}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-semibold">{student.class} ({student.section})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIdCard(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Print ID Card
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Profile
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Profile Card Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center gap-6 shrink-0 print:text-black print:bg-none print:border-b">
          <img
            src={student.photo}
            alt={student.fullName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white/20 shadow-xl shrink-0 print:border-slate-300"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-black tracking-tight">{student.fullName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {student.status}
              </span>
            </div>
            <p className="text-indigo-200 text-xs font-medium">
              S/D of {student.fatherName} • Roll Number: <span className="font-bold text-white">{student.rollNo}</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Class & Section</span>
                <p className="font-semibold text-white">{student.class} - {student.section}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Blood Group</span>
                <p className="font-semibold text-rose-300">{student.bloodGroup}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Attendance Rate</span>
                <p className="font-semibold text-emerald-300">{attendanceRate}%</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">City</span>
                <p className="font-semibold text-white">{student.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50/50 overflow-x-auto no-print">
          {[
            { key: 'overview', label: 'Overview & Bio', icon: User },
            { key: 'attendance', label: 'Attendance Log', icon: CalendarCheck },
            { key: 'fees', label: 'Fee Ledger', icon: CreditCard },
            { key: 'exams', label: 'Exam Results', icon: Award },
            { key: 'homework', label: 'Assigned Homework', icon: BookOpen },
            { key: 'docs', label: 'Documents', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-700">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" /> Personal Information
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Date of Birth:</span>
                      <span className="font-semibold text-slate-800">{student.dob}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-semibold text-slate-800">{student.gender}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Admission Date:</span>
                      <span className="font-semibold text-slate-800">{student.admissionDate}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Previous School:</span>
                      <span className="font-semibold text-slate-800">{student.previousSchool || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Emergency Contact:</span>
                      <span className="font-semibold text-rose-600">{student.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* Parents & Guardians Details */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" /> Parent & Guardian Contact
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Father's Name:</span>
                      <span className="font-semibold text-slate-800">{student.fatherName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Mother's Name:</span>
                      <span className="font-semibold text-slate-800">{student.motherName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Primary Phone:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {student.phone}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {student.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Home Address:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 text-right">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {student.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs text-emerald-700 font-semibold">Attendance</div>
                    <div className="text-lg font-black text-emerald-900">{attendanceRate}% Present</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs text-indigo-700 font-semibold">Total Fee Paid</div>
                    <div className="text-lg font-black text-indigo-900">Rs. {totalFeePaid.toLocaleString()}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  <div>
                    <div className="text-xs text-rose-700 font-semibold">Pending Dues</div>
                    <div className="text-lg font-black text-rose-900">Rs. {totalFeePending.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Attendance Records</h4>
                <span className="text-xs text-slate-500 font-medium">
                  {presentCount} Present / {allAttendance.length || 1} Total marked
                </span>
              </div>
              {allAttendance.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No attendance records logged yet for this student.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                  {allAttendance.map((rec) => (
                    <div key={rec.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{rec.date}</span>
                        {rec.remark && <span className="text-slate-400 ml-2">({rec.remark})</span>}
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Student Fee History</h4>
                <div className="text-xs text-slate-600 font-semibold">
                  Paid: Rs. {totalFeePaid.toLocaleString()} | Due: Rs. {totalFeePending.toLocaleString()}
                </div>
              </div>
              {allFees.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No fee receipts recorded yet for this student.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden text-xs">
                  {allFees.map((fee) => (
                    <div key={fee.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-bold text-slate-800">{fee.invoiceNo} - {fee.feeType}</div>
                        <div className="text-slate-500 mt-0.5">{fee.month} • Method: {fee.paymentMethod}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">Rs. {fee.paidAmount.toLocaleString()}</div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            fee.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : fee.status === 'Partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800">Examination Results & Performance</h4>
              {allResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No examination report cards recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {allResults.map((res) => (
                    <div key={res.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-sm text-slate-800">{res.examName}</div>
                          <div className="text-xs text-slate-500">Overall: {res.percentage}% • Grade: {res.overallGrade}</div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                          Passed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {res.subjectResults.map((sub, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-xl border border-slate-100">
                            <div className="font-semibold text-slate-700 truncate">{sub.subject}</div>
                            <div className="flex justify-between items-center mt-1 text-[11px]">
                              <span className="text-slate-400">Score:</span>
                              <span className="font-bold text-indigo-600">{sub.obtainedMarks}/{sub.maxMarks}</span>
                              <span className="font-bold text-slate-800">({sub.grade})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'homework' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Homework & Class Tasks</h4>
              {allHomework.map((hw) => (
                <div key={hw.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700">{hw.subject}</span>
                    <span className="text-[10px] text-slate-400">Due: {hw.dueDate}</span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">{hw.title}</div>
                  <p className="text-slate-500 mt-0.5">{hw.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Student Physical & Digital Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(student.documents || ['Form-B.pdf', 'BirthCertificate.pdf']).map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-slate-700">{doc}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student ID Card Modal */}
      <StudentIDCardModal
        students={[student]}
        singleStudent={student}
        isOpen={showIdCard}
        onClose={() => setShowIdCard(false)}
      />
    </div>
  );
};
