import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Download,
  Printer,
  Edit2,
  Trash2,
  Phone,
  Mail,
  BookOpen,
  School,
  X,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { Teacher } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV } from '../../services/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const TeachersView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>(() =>
    getData<Teacher[]>(STORAGE_KEYS.TEACHERS, [])
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState<Teacher | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const initialForm: Partial<Teacher> = {
    name: '',
    fatherName: '',
    gender: 'Male',
    dob: '1990-01-01',
    cnic: '43202-0000000-1',
    phone: '+92 300 1234567',
    email: '',
    address: 'Qamber, Sindh',
    qualification: 'M.Sc, B.Ed',
    experience: '5 Years',
    joiningDate: '2024-01-01',
    designation: 'Subject Educator',
    assignedSubjects: ['Mathematics'],
    assignedClasses: ['Grade 9', 'Grade 10'],
    salary: 60000,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
  };
  const [formData, setFormData] = useState<Partial<Teacher>>(initialForm);

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      filterSubject === 'All' || t.assignedSubjects.includes(filterSubject);
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(initialForm);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setFormData(tch);
    setShowAddEditModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation) {
      alert('Teacher Name and Designation are required.');
      return;
    }

    if (editingTeacher) {
      const updated = teachers.map((t) =>
        t.id === editingTeacher.id ? ({ ...t, ...formData } as Teacher) : t
      );
      saveData(STORAGE_KEYS.TEACHERS, updated);
      setTeachers(updated);
      showToast(`Teacher profile for ${formData.name} updated!`);
    } else {
      const newTeacher: Teacher = {
        ...formData,
        id: `tch-${Date.now()}`,
      } as Teacher;
      const updated = [newTeacher, ...teachers];
      saveData(STORAGE_KEYS.TEACHERS, updated);
      setTeachers(updated);
      showToast(`Teacher ${newTeacher.name} successfully inducted!`);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteTeacher = () => {
    if (!teacherToDelete) return;
    const updated = teachers.filter((t) => t.id !== teacherToDelete.id);
    saveData(STORAGE_KEYS.TEACHERS, updated);
    setTeachers(updated);
    showToast(`Teacher record deleted.`);
    setTeacherToDelete(null);
  };

  const handleExportCSV = () => {
    const rows = filteredTeachers.map((t) => ({
      ID: t.id,
      Name: t.name,
      Designation: t.designation,
      CNIC: t.cnic,
      Phone: t.phone,
      Email: t.email,
      Qualification: t.qualification,
      Experience: t.experience,
      Subjects: t.assignedSubjects.join(', '),
      Classes: t.assignedClasses.join(', '),
      Salary: t.salary,
      Status: t.status,
    }));
    exportToCSV('SMPS_Teachers_Directory', rows);
    showToast('Exported teachers directory to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Faculty & Teachers</h2>
              <p className="text-xs text-slate-400">
                Active Educators: {teachers.filter((t) => t.status === 'Active').length} | Total Staff: {teachers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('teachers') && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Teacher
            </button>
          )}
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 no-print">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teacher by name or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teachers found"
          description="Try changing filters or add a new teacher to the faculty directory."
          actionText={canManage('teachers') ? '+ Add Teacher' : undefined}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((tch) => (
            <div
              key={tch.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tch.photo}
                      alt={tch.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{tch.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{tch.designation}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tch.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tch.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 no-print">
                    <button
                      onClick={() => setSelectedTeacherForProfile(tch)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {canManage('teachers') && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(tch)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTeacherToDelete(tch)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      <span className="font-semibold text-slate-700">Subjects:</span>{' '}
                      {tch.assignedSubjects.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      <span className="font-semibold text-slate-700">Classes:</span>{' '}
                      {tch.assignedClasses.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{tch.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{tch.qualification}</span>
                <span className="font-bold text-slate-800 shrink-0">Rs. {tch.salary.toLocaleString()} /mo</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teacher Profile Quick View Modal */}
      {selectedTeacherForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherForProfile.photo}
                  alt={selectedTeacherForProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTeacherForProfile.name}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{selectedTeacherForProfile.designation}</p>
                  <p className="text-[11px] text-slate-400">CNIC: {selectedTeacherForProfile.cnic}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacherForProfile(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2.5 text-xs text-slate-600 border-t pt-4">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Qualification:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.qualification}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.experience}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Joining Date:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.joiningDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Phone & Email:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Assigned Subjects:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.assignedSubjects.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Assigned Classes:</span>
                <span className="font-semibold text-slate-800">{selectedTeacherForProfile.assignedClasses.join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Monthly Compensation:</span>
                <span className="font-bold text-emerald-700">Rs. {selectedTeacherForProfile.salary.toLocaleString()} PKR</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTeacherForProfile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-800">
                {editingTeacher ? `Edit Faculty: ${editingTeacher.name}` : 'Induct New Faculty Member'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNIC / ID Number</label>
                  <input
                    type="text"
                    value={formData.cnic || ''}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
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
                  <label className="block font-bold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formData.salary || 0}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience || ''}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Subjects (comma separated)</label>
                  <input
                    type="text"
                    value={formData.assignedSubjects?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedSubjects: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Classes (comma separated)</label>
                  <input
                    type="text"
                    value={formData.assignedClasses?.join(', ') || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedClasses: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-xs"
                >
                  {editingTeacher ? 'Update Teacher' : 'Induct Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!teacherToDelete}
        title="Remove Faculty Member"
        message={`Are you sure you want to remove ${teacherToDelete?.name}?`}
        confirmText="Remove Teacher"
        confirmVariant="danger"
        onConfirm={handleDeleteTeacher}
        onCancel={() => setTeacherToDelete(null)}
      />
    </div>
  );
};
