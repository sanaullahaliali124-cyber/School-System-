import React, { useEffect, useRef } from 'react';
import {
  GraduationCap,
  Users,
  UserCheck,
  School,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  UserPlus,
  Award,
  Bell,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Plus,
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { StatCard } from '../common/StatCard';
import { getData, STORAGE_KEYS } from '../../services/storage';
import {
  Student,
  Teacher,
  Staff,
  SchoolClass,
  StudentAttendanceRecord,
  FeePayment,
  AdmissionApplication,
  Exam,
  SchoolNotice,
} from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DashboardViewProps {
  onNavigate: (module: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  // Load live data from LocalStorage
  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  const staff = getData<Staff[]>(STORAGE_KEYS.STAFF, []);
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const attendance = getData<StudentAttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
  const feePayments = getData<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, []);
  const admissions = getData<AdmissionApplication[]>(STORAGE_KEYS.ADMISSIONS, []);
  const exams = getData<Exam[]>(STORAGE_KEYS.EXAMS, []);
  const notices = getData<SchoolNotice[]>(STORAGE_KEYS.NOTICES, []);

  // Compute metrics
  const totalStudents = students.length;
  const boysCount = students.filter((s) => s.gender === 'Male').length;
  const girlsCount = students.filter((s) => s.gender === 'Female').length;

  const totalTeachers = teachers.length;
  const totalStaff = staff.length;
  const totalClasses = classes.length;

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const leaveCount = attendance.filter((a) => a.status === 'Leave').length;
  const attendanceTotal = presentCount + absentCount + leaveCount || 1;
  const attendancePct = Math.round((presentCount / attendanceTotal) * 100);

  const totalCollectedFee = feePayments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalPendingFee = feePayments.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending').length;
  const upcomingExams = exams.filter((e) => e.status === 'Upcoming');

  // Chart Refs
  const studentChartRef = useRef<HTMLCanvasElement | null>(null);
  const attendanceChartRef = useRef<HTMLCanvasElement | null>(null);
  const feeChartRef = useRef<HTMLCanvasElement | null>(null);
  const admissionChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let studentChart: Chart | null = null;
    let attendanceChart: Chart | null = null;
    let feeChart: Chart | null = null;
    let admissionChart: Chart | null = null;

    // 1. Student Gender Doughnut Chart
    if (studentChartRef.current) {
      studentChart = new Chart(studentChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Boys', 'Girls'],
          datasets: [
            {
              data: [boysCount, girlsCount],
              backgroundColor: ['#4f46e5', '#ec4899'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11, family: 'Plus Jakarta Sans' } },
            },
          },
          cutout: '70%',
        },
      });
    }

    // 2. Attendance Bar Chart
    if (attendanceChartRef.current) {
      attendanceChart = new Chart(attendanceChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Present', 'Absent', 'Leave'],
          datasets: [
            {
              label: "Today's Count",
              data: [presentCount, absentCount, leaveCount],
              backgroundColor: ['#10b981', '#f43f5e', '#f59e0b'],
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              ticks: { font: { size: 10 } },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 11, weight: 'bold' } },
            },
          },
        },
      });
    }

    // 3. Fee Collection Pie Chart
    if (feeChartRef.current) {
      feeChart = new Chart(feeChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Collected (PKR)', 'Pending Dues (PKR)'],
          datasets: [
            {
              data: [totalCollectedFee, totalPendingFee],
              backgroundColor: ['#059669', '#e11d48'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11, family: 'Plus Jakarta Sans' } },
            },
          },
        },
      });
    }

    // 4. Admission Trends Bar/Line Chart
    if (admissionChartRef.current) {
      admissionChart = new Chart(admissionChartRef.current, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Admissions 2026',
              data: [4, 8, 15, 22, 12, admissions.length],
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#4f46e5',
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              ticks: { font: { size: 10 } },
            },
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } },
            },
          },
        },
      });
    }

    return () => {
      studentChart?.destroy();
      attendanceChart?.destroy();
      feeChart?.destroy();
      admissionChart?.destroy();
    };
  }, [boysCount, girlsCount, presentCount, absentCount, leaveCount, totalCollectedFee, totalPendingFee, admissions.length]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs text-indigo-200 border border-white/10 mb-3">
              <School className="w-3.5 h-3.5 text-indigo-300" />
              THE SMART MODERN PUBLIC SCHOOL QAMBER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || 'Administrator'}
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Academic Session 2026–2027 • Qamber Branch Portal. All educational metrics, attendance records, and finance ledgers are synchronized.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('id_cards')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              title="Generate and print official student ID cards"
            >
              <CreditCard className="w-4 h-4" /> Student ID Cards
            </button>
            <button
              onClick={() => onNavigate('students')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Student
            </button>
            <button
              onClick={() => onNavigate('fees')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Collect Fee
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl border border-indigo-400/30 transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Mark Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          subValue={`${boysCount} Boys • ${girlsCount} Girls`}
          icon={GraduationCap}
          change="+8.4%"
          changeType="positive"
          color="indigo"
          onClick={() => onNavigate('students')}
        />
        <StatCard
          label="Total Faculty"
          value={totalTeachers}
          subValue="10 Full-time Teachers"
          icon={Users}
          change="+2"
          changeType="positive"
          color="emerald"
          onClick={() => onNavigate('teachers')}
        />
        <StatCard
          label="Support Staff"
          value={totalStaff}
          subValue="Accounts, Admin & Lab"
          icon={UserCheck}
          change="Optimal"
          changeType="neutral"
          color="purple"
          onClick={() => onNavigate('staff')}
        />
        <StatCard
          label="Total Classes"
          value={totalClasses}
          subValue="Grade 1 to Grade 10"
          icon={School}
          change="100% Filled"
          changeType="neutral"
          color="sky"
          onClick={() => onNavigate('classes')}
        />
      </div>

      {/* Secondary Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Attendance"
          value={`${attendancePct}%`}
          subValue={`${presentCount} Present • ${absentCount} Absent • ${leaveCount} Leave`}
          icon={CheckCircle}
          change={presentCount > 10 ? 'High' : 'Normal'}
          changeType="positive"
          color="emerald"
          onClick={() => onNavigate('attendance')}
        />
        <StatCard
          label="Fee Collection"
          value={`Rs. ${totalCollectedFee.toLocaleString()}`}
          subValue="October 2026 Collection"
          icon={CreditCard}
          change="+12.5%"
          changeType="positive"
          color="indigo"
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          label="Pending Dues"
          value={`Rs. ${totalPendingFee.toLocaleString()}`}
          subValue="Outstanding Student Fees"
          icon={Clock}
          change="-4.2%"
          changeType="negative"
          color="rose"
          onClick={() => onNavigate('fees')}
        />
        <StatCard
          label="New Admissions"
          value={admissions.length}
          subValue={`${pendingAdmissions} Pending Review`}
          icon={UserPlus}
          change="+4 this week"
          changeType="positive"
          color="amber"
          onClick={() => onNavigate('admissions')}
        />
      </div>

      {/* 4 Interactive Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Student Gender Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Student Demographics</h3>
              <p className="text-xs text-slate-400">Boys vs Girls enrolled</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              Total: {totalStudents}
            </span>
          </div>
          <div className="h-64 relative">
            <canvas ref={studentChartRef} />
          </div>
          <div className="flex justify-around text-center mt-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Boys</span>
              <p className="font-bold text-slate-800">{boysCount} ({Math.round((boysCount / totalStudents) * 100)}%)</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Girls</span>
              <p className="font-bold text-slate-800">{girlsCount} ({Math.round((girlsCount / totalStudents) * 100)}%)</p>
            </div>
          </div>
        </div>

        {/* Chart 2: Daily Attendance Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Today's Attendance Overview</h3>
              <p className="text-xs text-slate-400">Students distribution</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Full Sheet <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 relative">
            <canvas ref={attendanceChartRef} />
          </div>
          <div className="flex justify-around text-center mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="text-emerald-600">
              <span className="text-slate-400 font-medium">Present</span>
              <p className="font-bold">{presentCount}</p>
            </div>
            <div className="text-rose-600">
              <span className="text-slate-400 font-medium">Absent</span>
              <p className="font-bold">{absentCount}</p>
            </div>
            <div className="text-amber-600">
              <span className="text-slate-400 font-medium">Leave</span>
              <p className="font-bold">{leaveCount}</p>
            </div>
          </div>
        </div>

        {/* Chart 3: Fee Collection vs Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly Fee Financial Summary</h3>
              <p className="text-xs text-slate-400">Collected vs Outstanding dues</p>
            </div>
            <button
              onClick={() => onNavigate('fees')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Manage Fees <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 relative">
            <canvas ref={feeChartRef} />
          </div>
          <div className="flex justify-around text-center mt-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Collected</span>
              <p className="font-bold text-emerald-600">Rs. {totalCollectedFee.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Pending</span>
              <p className="font-bold text-rose-600">Rs. {totalPendingFee.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Chart 4: Admission Growth */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly Admissions Trend</h3>
              <p className="text-xs text-slate-400">Applications and intake graph</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" /> +24% YoY
            </span>
          </div>
          <div className="h-64 relative">
            <canvas ref={admissionChartRef} />
          </div>
          <div className="text-center mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Steady enrollment growth throughout the 2026 academic admissions cycle.
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Notices & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Notices Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">School Notice Board</h3>
                <p className="text-xs text-slate-400">Important administrative circulars</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('notices')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      notice.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : notice.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {notice.priority} Priority • {notice.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{notice.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-1">
                  {notice.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {notice.description}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 font-medium">
                  Audience: <span className="font-semibold text-slate-600">{notice.audience}</span> • Posted by: {notice.postedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Examination Schedule</h3>
                <p className="text-xs text-slate-400">Assessments & Board Prep</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Exam Center <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        exam.status === 'Ongoing'
                          ? 'bg-emerald-100 text-emerald-700'
                          : exam.status === 'Upcoming'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {exam.status}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{exam.name}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Dates: <span className="font-medium text-slate-700">{exam.startDate}</span> to{' '}
                    <span className="font-medium text-slate-700">{exam.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Session: {exam.session} • Type: {exam.type}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('exams')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0"
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
