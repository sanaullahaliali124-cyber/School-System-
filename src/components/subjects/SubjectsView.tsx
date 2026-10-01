import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, X, Award } from 'lucide-react';
import { Subject, SchoolClass, Teacher } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const SubjectsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getData<Subject[]>(STORAGE_KEYS.SUBJECTS, [])
  );
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);

  const [filterClass, setFilterClass] = useState('All');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const initialForm: Partial<Subject> = {
    name: 'Computer Science & AI',
    code: 'CS-01',
    class: classes[0]?.name || 'Grade 10',
    teacherName: teachers[0]?.name || 'Teacher Incharge',
    maxMarks: 100,
    passingMarks: 50,
  };
  const [formData, setFormData] = useState<Partial<Subject>>(initialForm);

  const filteredSubjects = subjects.filter(
    (s) => filterClass === 'All' || s.class === filterClass
  );

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData(initialForm);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setFormData(sub);
    setShowAddEditModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingSubject) {
      const updated = subjects.map((s) =>
        s.id === editingSubject.id ? ({ ...s, ...formData } as Subject) : s
      );
      saveData(STORAGE_KEYS.SUBJECTS, updated);
      setSubjects(updated);
      showToast(`Subject ${formData.name} updated.`);
    } else {
      const newSubject: Subject = {
        ...formData,
        id: `sub-${Date.now()}`,
      } as Subject;
      const updated = [...subjects, newSubject];
      saveData(STORAGE_KEYS.SUBJECTS, updated);
      setSubjects(updated);
      showToast(`New subject ${newSubject.name} registered.`);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteSubject = () => {
    if (!subjectToDelete) return;
    const updated = subjects.filter((s) => s.id !== subjectToDelete.id);
    saveData(STORAGE_KEYS.SUBJECTS, updated);
    setSubjects(updated);
    showToast(`Subject removed.`);
    setSubjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Academic Subjects</h2>
            <p className="text-xs text-slate-400">
              Curriculum courses, subject codes, assigned teachers and passing benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('subjects') && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          )}
        </div>
      </div>

      {/* Class filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-xs">
        <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Filter by Class</label>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
        >
          <option value="All">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Assigned Educator</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Pass Marks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{sub.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{sub.class}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{sub.teacherName || 'TBD'}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{sub.maxMarks}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{sub.passingMarks}</td>
                  <td className="py-3 px-4 text-right">
                    {canManage('subjects') && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSubjectToDelete(sub)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">
                {editingSubject ? 'Edit Subject' : 'Add Subject'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.class || classes[0]?.name}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                <select
                  value={formData.teacherName || ''}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  <option value="">Select Faculty Member</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={formData.maxMarks || 100}
                    onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={formData.passingMarks || 50}
                    onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!subjectToDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete ${subjectToDelete?.name}?`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteSubject}
        onCancel={() => setSubjectToDelete(null)}
      />
    </div>
  );
};
