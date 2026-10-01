import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Award,
  GraduationCap,
  X,
  CheckCircle,
} from 'lucide-react';
import { Student, SchoolClass } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { StudentProfileModal } from './StudentProfileModal';
import { StudentPromotionModal } from './StudentPromotionModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const StudentsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [students, setStudents] = useState<Student[]>(() =>
    getData<Student[]>(STORAGE_KEYS.STUDENTS, [])
  );
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form State
  const initialFormData: Partial<Student> = {
    admissionNo: `SMP-2024-0${Math.floor(Math.random() * 900) + 100}`,
    fullName: '',
    fatherName: '',
    motherName: '',
    dob: '2012-05-15',
    gender: 'Male',
    class: classes[0]?.name || 'Grade 1',
    section: 'A',
    rollNo: '101',
    phone: '+92 300 1234567',
    email: '',
    address: 'Qamber, Sindh',
    city: 'Qamber',
    admissionDate: '2026-04-01',
    previousSchool: '',
    bloodGroup: 'B+',
    emergencyContact: '+92 300 1234567',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
  };
  const [formData, setFormData] = useState<Partial<Student>>(initialFormData);

  const refreshStudents = () => {
    setStudents(getData<Student[]>(STORAGE_KEYS.STUDENTS, []));
  };

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || s.class === filterClass;
    const matchesGender = filterGender === 'All' || s.gender === filterGender;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesClass && matchesGender && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      ...initialFormData,
      admissionNo: `SMP-2024-0${Math.floor(Math.random() * 900) + 100}`,
      rollNo: String(students.length + 101),
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowAddEditModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.fatherName) {
      alert('Student Full Name and Father Name are required.');
      return;
    }

    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id ? ({ ...s, ...formData } as Student) : s
      );
      saveData(STORAGE_KEYS.STUDENTS, updated);
      setStudents(updated);
      showToast(`Student record for ${formData.fullName} updated successfully!`);
    } else {
      const newStudent: Student = {
        ...formData,
        id: `stu-${Date.now()}`,
      } as Student;
      const updated = [newStudent, ...students];
      saveData(STORAGE_KEYS.STUDENTS, updated);
      setStudents(updated);
      showToast(`New student ${newStudent.fullName} registered successfully!`);
    }

    setShowAddEditModal(false);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;
    const updated = students.filter((s) => s.id !== studentToDelete.id);
    saveData(STORAGE_KEYS.STUDENTS, updated);
    setStudents(updated);
    showToast(`Student ${studentToDelete.fullName} removed.`);
    setStudentToDelete(null);
  };

  const handleExportCSV = () => {
    const rows = filteredStudents.map((s) => ({
      'Admission No': s.admissionNo,
      'Full Name': s.fullName,
      "Father's Name": s.fatherName,
      Class: s.class,
      Section: s.section,
      'Roll No': s.rollNo,
      Gender: s.gender,
      Phone: s.phone,
      City: s.city,
      Status: s.status,
    }));
    exportToCSV('SMPS_Students_List', rows);
    showToast('Exported student list to CSV');
  };

  const handleExportExcel = () => {
    const rows = filteredStudents.map((s) => ({
      'Admission No': s.admissionNo,
      'Full Name': s.fullName,
      "Father's Name": s.fatherName,
      "Mother's Name": s.motherName,
      Class: s.class,
      Section: s.section,
      'Roll No': s.rollNo,
      Gender: s.gender,
      'Date of Birth': s.dob,
      Phone: s.phone,
      Email: s.email,
      City: s.city,
      Address: s.address,
      'Blood Group': s.bloodGroup,
      'Admission Date': s.admissionDate,
      Status: s.status,
    }));
    exportToExcel('SMPS_Students_Directory', rows, 'Students');
    showToast('Exported student directory to Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Student Directory</h2>
              <p className="text-xs text-slate-400">
                Total Enrolled: {students.length} students across all classes
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManage('students') && (
            <>
              <button
                onClick={() => setShowPromotionModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                Student Promotion
              </button>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </>
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
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 no-print">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, roll, father name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Class */}
        <div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
          >
            <option value="All">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Gender */}
        <div>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Boys (Male)</option>
            <option value="Female">Girls (Female)</option>
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No students found"
          description="Try adjusting your search criteria or register a new student."
          actionText={canManage('students') ? '+ Add Student' : undefined}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.photo}
                          alt={st.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                            {st.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {st.admissionNo} • {st.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{st.class}</span>
                      <span className="text-slate-400 ml-1">({st.section})</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{st.fatherName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">{st.rollNo}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{st.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          st.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedStudentForProfile(st)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canManage('students') && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(st)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Edit Student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStudentToDelete(st)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            <span>THE SMART MODERN PUBLIC SCHOOL QAMBER</span>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-800">
                {editingStudent ? `Edit Student: ${editingStudent.fullName}` : 'Register New Student'}
              </h3>
              <button
                onClick={() => setShowAddEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={formData.admissionNo || ''}
                    onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Raza Chandio"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Hashim"
                    value={formData.fatherName || ''}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kainat Hashim"
                    value={formData.motherName || ''}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.class || 'Grade 1'}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section || 'A'}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNo || ''}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup || 'B+'}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city || 'Qamber'}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Street / Mohalla, Qamber"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Previous School</label>
                  <input
                    type="text"
                    value={formData.previousSchool || ''}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={!!selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
      />

      {/* Promotion Modal */}
      <StudentPromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        onPromoted={refreshStudents}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!studentToDelete}
        title="Delete Student Record"
        message={`Are you sure you want to remove ${studentToDelete?.fullName} (Roll: ${studentToDelete?.rollNo})? All associated marks and records will be unlinked.`}
        confirmText="Delete Student"
        confirmVariant="danger"
        onConfirm={handleDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};
