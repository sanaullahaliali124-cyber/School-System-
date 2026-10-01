import React from 'react';
import { X, Printer, School, CheckCircle2, Award } from 'lucide-react';
import { ExamResult, Student, SchoolSettings } from '../../types';
import { getData, STORAGE_KEYS } from '../../services/storage';

interface ReportCardModalProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !result) return null;

  const settings = getData<SchoolSettings>(STORAGE_KEYS.SETTINGS, {
    schoolName: 'THE SMART MODERN PUBLIC SCHOOL QAMBER',
    tagline: 'Excellence in Education, Character Building & Modern Innovation',
    logoUrl: '',
    address: 'Main By-pass Road, Qamber, Sindh, Pakistan',
    phone: '+92 74 1234567',
    email: 'info@smartmodernqamber.edu.pk',
    website: 'www.smartmodernqamber.edu.pk',
    principalName: 'Prof. Ghulam Rasool Chandio',
    registrationNo: 'SED-QBR-2018-4429',
    currentSession: '2026–2027',
    currency: 'PKR',
    dateFormat: 'DD/MM/YYYY',
    passingPercentage: 50,
    gradingScale: [],
  });

  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const student = students.find((s) => s.id === result.studentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Official Student Examination Report Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 sm:p-10 overflow-y-auto flex-1 print-area bg-white text-slate-900 font-sans">
          {/* Official Letterhead */}
          <div className="border-b-4 border-indigo-900 pb-5 text-center relative">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-indigo-700">
                SM
              </div>
              <div className="text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
                  {settings.schoolName}
                </h1>
                <p className="text-xs sm:text-sm font-bold text-indigo-700">
                  {settings.tagline}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {settings.address} • Ph: {settings.phone} • Reg: {settings.registrationNo}
                </p>
              </div>
            </div>

            <div className="mt-4 inline-block px-6 py-1.5 rounded-full bg-indigo-900 text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
              ACADEMIC PERFORMANCE & PROGRESS REPORT
            </div>
          </div>

          {/* Student & Examination Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="sm:col-span-3 flex justify-center sm:justify-start">
              <img
                src={
                  student?.photo ||
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
                }
                alt={result.studentName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-300 shadow-sm"
              />
            </div>

            <div className="sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Student Name:</span>
                <p className="font-extrabold text-sm text-slate-900">{result.studentName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Father's Name:</span>
                <p className="font-bold text-slate-800">{student?.fatherName || 'Guardian'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Admission No:</span>
                <p className="font-bold text-indigo-700">{student?.admissionNo || result.studentId}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Class & Section:</span>
                <p className="font-bold text-slate-800">{result.class} - {result.section}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Roll Number:</span>
                <p className="font-mono font-bold text-slate-900">{result.rollNo}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Academic Session:</span>
                <p className="font-bold text-slate-800">{settings.currentSession}</p>
              </div>

              <div className="sm:col-span-3 pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Examination:</span>
                <span className="ml-2 font-black text-indigo-900 text-xs">{result.examName}</span>
              </div>
            </div>
          </div>

          {/* Subject-Wise Marks Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-indigo-950 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-4 border-r border-indigo-900">#</th>
                  <th className="py-2.5 px-4 border-r border-indigo-900">Subject Name</th>
                  <th className="py-2.5 px-4 border-r border-indigo-900 text-center">Max Marks</th>
                  <th className="py-2.5 px-4 border-r border-indigo-900 text-center">Pass Marks</th>
                  <th className="py-2.5 px-4 border-r border-indigo-900 text-center">Marks Obtained</th>
                  <th className="py-2.5 px-4 border-r border-indigo-900 text-center">Grade</th>
                  <th className="py-2.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.subjectResults.map((sub, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-2.5 px-4 font-mono text-slate-400 border-r border-slate-200">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-800 border-r border-slate-200">{sub.subject}</td>
                    <td className="py-2.5 px-4 text-center font-medium border-r border-slate-200">{sub.maxMarks}</td>
                    <td className="py-2.5 px-4 text-center font-medium text-slate-500 border-r border-slate-200">50</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-indigo-700 border-r border-slate-200">
                      {sub.obtainedMarks}
                    </td>
                    <td className="py-2.5 px-4 text-center font-extrabold border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 italic text-[11px]">{sub.remarks || 'Satisfactory'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-extrabold border-t-2 border-slate-300 text-slate-900 text-xs">
                  <td colSpan={2} className="py-3 px-4 uppercase tracking-wider text-right border-r border-slate-300">
                    Grand Total:
                  </td>
                  <td className="py-3 px-4 text-center border-r border-slate-300">{result.totalMaxMarks}</td>
                  <td className="py-3 px-4 text-center border-r border-slate-300">—</td>
                  <td className="py-3 px-4 text-center font-mono text-indigo-900 text-sm border-r border-slate-300">
                    {result.totalObtainedMarks}
                  </td>
                  <td className="py-3 px-4 text-center text-sm border-r border-slate-300 font-black text-indigo-900">
                    {result.overallGrade}
                  </td>
                  <td className="py-3 px-4 text-emerald-700 font-bold uppercase">
                    {result.passed ? 'PASSED & PROMOTED' : 'FAILED'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Grand Performance Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-center my-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-900/60">Percentage</span>
              <p className="text-xl font-black text-indigo-900">{result.percentage}%</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-900/60">Final Grade</span>
              <p className="text-xl font-black text-indigo-900">{result.overallGrade}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-900/60">Result Status</span>
              <p className="text-xl font-black text-emerald-700">
                {result.passed ? 'PASSED' : 'NEEDS IMP.'}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-indigo-900/60">Attendance</span>
              <p className="text-xl font-black text-slate-800">96.5%</p>
            </div>
          </div>

          {/* Educator Remarks */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 mb-10 text-xs">
            <span className="font-bold text-slate-700">Principal & Teacher Evaluation Remarks:</span>
            <p className="text-slate-600 mt-1 italic leading-relaxed">
              "{result.remarks || 'Shows strong academic aptitude, disciplined conduct, and admirable intellectual curiosity. Highly commended.'}"
            </p>
          </div>

          {/* Official Signatures & Seal */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-300 text-center text-xs mt-12 page-break-inside-avoid">
            <div>
              <div className="h-12 border-b border-dashed border-slate-400 mx-auto max-w-[160px] flex items-end justify-center pb-1 text-slate-400 italic">
                Ms. Farzana Parveen
              </div>
              <p className="font-bold text-slate-800 mt-2">Class Teacher Signature</p>
              <span className="text-[10px] text-slate-400">Senior Academic Staff</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-indigo-900/30 flex items-center justify-center text-[10px] font-black text-indigo-900 uppercase rotate-[-12deg] tracking-tight p-2 bg-indigo-50/30">
                SMPS QAMBER OFFICIAL SEAL
              </div>
              <span className="text-[10px] text-slate-400 mt-1">School Registrar Seal</span>
            </div>

            <div>
              <div className="h-12 border-b border-dashed border-slate-400 mx-auto max-w-[160px] flex items-end justify-center pb-1 text-slate-400 italic">
                Prof. G.R. Chandio
              </div>
              <p className="font-bold text-slate-800 mt-2">Principal Signature</p>
              <span className="text-[10px] text-slate-400">{settings.principalName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
