import React, { useState } from 'react';
import {
  Award,
  Calendar,
  FileCheck,
  Plus,
  Printer,
  Download,
  Eye,
  CheckCircle,
  Save,
  BookOpen,
  X,
} from 'lucide-react';
import {
  Exam,
  ExamScheduleItem,
  ExamResult,
  SchoolClass,
  Subject,
  Student,
  SchoolSettings,
} from '../../types';
import {
  getData,
  saveData,
  STORAGE_KEYS,
  calculateGrade,
  exportToCSV,
} from '../../services/storage';
import { ReportCardModal } from './ReportCardModal';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const ExamsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'schedule' | 'marks-entry' | 'results'>('results');

  const exams = getData<Exam[]>(STORAGE_KEYS.EXAMS, []);
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>(() =>
    getData<ExamScheduleItem[]>(STORAGE_KEYS.EXAM_SCHEDULE, [])
  );
  const [results, setResults] = useState<ExamResult[]>(() =>
    getData<ExamResult[]>(STORAGE_KEYS.RESULTS, [])
  );
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const subjects = getData<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const settings = getData<SchoolSettings>(STORAGE_KEYS.SETTINGS, {} as any);

  // Filter & Selection States
  const [selectedExam, setSelectedExam] = useState<string>(exams[0]?.name || 'Mid Term Examinations 2026');
  const [selectedClass, setSelectedClass] = useState<string>('Grade 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Selected Report Card to View/Print
  const [selectedResultForCard, setSelectedResultForCard] = useState<ExamResult | null>(null);

  // Marks Entry Working State
  // List of students in the selected class
  const classStudents = students.filter((s) => s.class === selectedClass);
  const [marksInput, setMarksInput] = useState<Record<string, number>>({});

  // Initialize or update marks inputs
  const handleLoadMarksRoster = () => {
    const existing = results.filter((r) => r.examName === selectedExam && r.class === selectedClass);
    const initialMarks: Record<string, number> = {};
    classStudents.forEach((st) => {
      const studentResult = existing.find((r) => r.studentId === st.id);
      const subResult = studentResult?.subjectResults.find((s) => s.subject === selectedSubject);
      initialMarks[st.id] = subResult ? subResult.obtainedMarks : 85;
    });
    setMarksInput(initialMarks);
    showToast(`Loaded roster of ${classStudents.length} students for ${selectedSubject}`);
  };

  const handleSaveMarks = () => {
    let updatedResults = [...results];

    classStudents.forEach((st) => {
      const score = marksInput[st.id] ?? 80;
      const { grade, remarks, passed } = calculateGrade(score, settings);

      let studentResult = updatedResults.find(
        (r) => r.examName === selectedExam && r.studentId === st.id
      );

      if (studentResult) {
        // Update or add subject
        const subIdx = studentResult.subjectResults.findIndex((s) => s.subject === selectedSubject);
        if (subIdx >= 0) {
          studentResult.subjectResults[subIdx] = {
            subject: selectedSubject,
            maxMarks: 100,
            obtainedMarks: score,
            grade,
            remarks,
          };
        } else {
          studentResult.subjectResults.push({
            subject: selectedSubject,
            maxMarks: 100,
            obtainedMarks: score,
            grade,
            remarks,
          });
        }

        // Recalculate totals
        const totalMax = studentResult.subjectResults.reduce((acc, curr) => acc + curr.maxMarks, 0);
        const totalObt = studentResult.subjectResults.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
        const pct = Math.round((totalObt / totalMax) * 1000) / 10;
        const overall = calculateGrade(pct, settings);

        studentResult.totalMaxMarks = totalMax;
        studentResult.totalObtainedMarks = totalObt;
        studentResult.percentage = pct;
        studentResult.overallGrade = overall.grade;
        studentResult.passed = overall.passed;
      } else {
        // Create new record
        const newRes: ExamResult = {
          id: `res-${Date.now()}-${st.id}`,
          examId: 'ex-auto',
          examName: selectedExam,
          studentId: st.id,
          studentName: st.fullName,
          rollNo: st.rollNo,
          class: st.class,
          section: st.section,
          subjectResults: [
            {
              subject: selectedSubject,
              maxMarks: 100,
              obtainedMarks: score,
              grade,
              remarks,
            },
          ],
          totalMaxMarks: 100,
          totalObtainedMarks: score,
          percentage: score,
          overallGrade: grade,
          passed,
          remarks: 'Good scholastic performance.',
        };
        updatedResults.push(newRes);
      }
    });

    setResults(updatedResults);
    saveData(STORAGE_KEYS.RESULTS, updatedResults);
    showToast(`Saved marks for ${selectedSubject} in ${selectedExam}!`);
    setActiveTab('results');
  };

  const handleExportResultsCSV = () => {
    const rows = results.map((r) => ({
      Exam: r.examName,
      'Student Name': r.studentName,
      Class: r.class,
      Section: r.section,
      'Roll No': r.rollNo,
      'Total Marks': r.totalMaxMarks,
      'Obtained Marks': r.totalObtainedMarks,
      Percentage: `${r.percentage}%`,
      Grade: r.overallGrade,
      Result: r.passed ? 'PASSED' : 'FAILED',
    }));
    exportToCSV('SMPS_Exam_Results', rows);
    showToast('Exported results to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Examinations & Results</h2>
            <p className="text-xs text-slate-400">
              Exam datesheets, marks entry, auto-grading calculations and printable official report cards
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl no-print">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'results'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Results & Report Cards
          </button>
          {canManage('exams') && (
            <button
              onClick={() => {
                setActiveTab('marks-entry');
                handleLoadMarksRoster();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'marks-entry'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Marks Entry
            </button>
          )}
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exam Date Sheets
          </button>
        </div>
      </div>

      {/* Tab 1: Results and Printable Report Cards */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs no-print">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
              >
                <option value="All">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportResultsCSV}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export Results
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Total Score</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Outcome</th>
                    <th className="py-3 px-4 text-right">Official Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results
                    .filter((r) => selectedClass === 'All' || r.class === selectedClass)
                    .map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{res.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{res.studentName}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{res.class} ({res.section})</td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {res.totalObtainedMarks} / {res.totalMaxMarks}
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-slate-900">
                          {res.percentage}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded font-black text-xs ${
                            res.overallGrade.startsWith('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {res.overallGrade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            res.passed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {res.passed ? 'PASSED' : 'NEEDS IMP.'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedResultForCard(res)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" /> View Report Card
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Marks Entry Roster */}
      {activeTab === 'marks-entry' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleLoadMarksRoster}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Load Roster
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Entering Marks: {selectedSubject} (Max: 100)
                </h3>
                <p className="text-xs text-slate-400">Class: {selectedClass}</p>
              </div>
              <button
                onClick={handleSaveMarks}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save All Marks & Calculate Grades
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Max Marks</th>
                    <th className="py-3 px-4">Obtained Marks (0-100)</th>
                    <th className="py-3 px-4 text-center">Calculated Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((st) => {
                    const score = marksInput[st.id] ?? 80;
                    const { grade } = calculateGrade(score, settings);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700">{st.rollNo}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{st.fullName}</td>
                        <td className="py-3 px-4">{st.section}</td>
                        <td className="py-3 px-4 font-medium text-slate-500">100</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={score}
                            onChange={(e) =>
                              setMarksInput({
                                ...marksInput,
                                [st.id]: Math.min(100, Math.max(0, Number(e.target.value))),
                              })
                            }
                            className="w-24 px-3 py-1.5 border border-slate-200 rounded-xl font-bold text-indigo-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded font-black text-xs bg-indigo-50 text-indigo-700">
                            {grade}
                          </span>
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

      {/* Tab 3: Exam Schedules */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Exam Schedules & Date Sheets</h3>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" /> Print Date Sheet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Examination</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Room / Hall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{sch.date}</td>
                    <td className="py-3 px-4 font-semibold text-indigo-700">{sch.examName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{sch.class}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{sch.subject}</td>
                    <td className="py-3 px-4 text-slate-600">{sch.startTime} - {sch.endTime}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{sch.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Report Card Modal */}
      <ReportCardModal
        result={selectedResultForCard}
        isOpen={!!selectedResultForCard}
        onClose={() => setSelectedResultForCard(null)}
      />
    </div>
  );
};
