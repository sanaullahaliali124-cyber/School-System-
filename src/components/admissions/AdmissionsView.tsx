import React, { useState } from 'react';
import { UserPlus, CheckCircle, XCircle, Clock, Plus, Download, FileSpreadsheet, X, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdmissionApplication, Student, SchoolClass } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const AdmissionsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() =>
    getData<AdmissionApplication[]>(STORAGE_KEYS.ADMISSIONS, [])
  );
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const allStudents = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);

  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);

  const initialForm: Partial<AdmissionApplication> = {
    applicationNo: `APP-2026-${Math.floor(Math.random() * 900) + 100}`,
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '2015-05-15',
    gender: 'Male',
    previousSchool: 'Sunrise Primary School',
    applyingClass: classes[0]?.name || 'Grade 1',
    phone: '+92 300 1234567',
    email: '',
    address: 'Qamber, Sindh',
    applicationDate: '2026-10-01',
    status: 'Pending',
    notes: 'Written entrance test cleared with 80% score.',
  };
  const [formData, setFormData] = useState<Partial<AdmissionApplication>>(initialForm);

  const filtered = admissions.filter(
    (a) => filterStatus === 'All' || a.status === filterStatus
  );

  const handleApprove = (app: AdmissionApplication) => {
    // 1. Update application status
    const updatedApps = admissions.map((a) =>
      a.id === app.id ? { ...a, status: 'Approved' as const } : a
    );
    setAdmissions(updatedApps);
    saveData(STORAGE_KEYS.ADMISSIONS, updatedApps);

    // 2. Automatically enroll student in database
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      admissionNo: `SMP-2024-${Math.floor(Math.random() * 900) + 100}`,
      fullName: app.studentName,
      fatherName: app.fatherName,
      motherName: app.motherName,
      dob: app.dob,
      gender: app.gender,
      class: app.applyingClass,
      section: 'A',
      rollNo: String(allStudents.length + 101),
      phone: app.phone,
      email: app.email,
      address: app.address,
      city: 'Qamber',
      admissionDate: new Date().toISOString().split('T')[0],
      previousSchool: app.previousSchool,
      bloodGroup: 'B+',
      emergencyContact: app.phone,
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      documents: ['Form-B.pdf', 'BirthCertificate.pdf'],
    };

    saveData(STORAGE_KEYS.STUDENTS, [newStudent, ...allStudents]);

    // Celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`Approved! Enrolled ${app.studentName} into ${app.applyingClass}!`);
  };

  const handleReject = (app: AdmissionApplication) => {
    const updated = admissions.map((a) =>
      a.id === app.id ? { ...a, status: 'Rejected' as const } : a
    );
    setAdmissions(updated);
    saveData(STORAGE_KEYS.ADMISSIONS, updated);
    showToast(`Admission application for ${app.studentName} marked as rejected.`);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.fatherName) return;

    const newApp: AdmissionApplication = {
      ...formData,
      id: `adm-${Date.now()}`,
    } as AdmissionApplication;

    const updated = [newApp, ...admissions];
    saveData(STORAGE_KEYS.ADMISSIONS, updated);
    setAdmissions(updated);
    showToast(`New admission application registered for ${newApp.studentName}!`);
    setShowNewModal(false);
  };

  const handleExportCSV = () => {
    const rows = filtered.map((a) => ({
      'Application No': a.applicationNo,
      'Student Name': a.studentName,
      "Father's Name": a.fatherName,
      'Applying Class': a.applyingClass,
      Gender: a.gender,
      Phone: a.phone,
      'Previous School': a.previousSchool,
      Date: a.applicationDate,
      Status: a.status,
    }));
    exportToCSV('SMPS_Admissions_Report', rows);
    showToast('Exported admissions to CSV');
  };

  const handleExportExcel = () => {
    const rows = filtered.map((a) => ({
      'Application No': a.applicationNo,
      'Student Name': a.studentName,
      "Father's Name": a.fatherName,
      "Mother's Name": a.motherName,
      'Date of Birth': a.dob,
      Gender: a.gender,
      'Applying Class': a.applyingClass,
      Phone: a.phone,
      Email: a.email,
      Address: a.address,
      'Previous School': a.previousSchool,
      'Application Date': a.applicationDate,
      Status: a.status,
      Notes: a.notes || '',
    }));
    exportToExcel('SMPS_Admissions_Registry', rows, 'Admissions');
    showToast('Exported admissions registry to Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Admissions Portal</h2>
            <p className="text-xs text-slate-400">
              New applicant intake, entrance assessment evaluations and auto-enrollment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('admissions') && (
            <button
              onClick={() => {
                setFormData(initialForm);
                setShowNewModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Application
            </button>
          )}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
            title="Download formatted Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export to Excel
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-sm">
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterStatus === status
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">App No</th>
                <th className="py-3 px-4">Applicant Student</th>
                <th className="py-3 px-4">Father Name</th>
                <th className="py-3 px-4">Applying Class</th>
                <th className="py-3 px-4">Phone Contact</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{app.applicationNo}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{app.studentName}</div>
                    <div className="text-[10px] text-slate-400">{app.gender} • Prev: {app.previousSchool || 'None'}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{app.fatherName}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{app.applyingClass}</td>
                  <td className="py-3 px-4 text-slate-600">{app.phone}</td>
                  <td className="py-3 px-4 text-slate-400">{app.applicationDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        app.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {canManage('admissions') && app.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(app)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs cursor-pointer"
                        >
                          Approve & Enroll
                        </button>
                        <button
                          onClick={() => handleReject(app)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Register Admission Application</h3>
              <button onClick={() => setShowNewModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName || ''}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName || ''}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applying Class</label>
                  <select
                    value={formData.applyingClass || classes[0]?.name}
                    onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Previous School</label>
                  <input
                    type="text"
                    value={formData.previousSchool || ''}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Entrance Test Marks</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
