import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Edit2, Trash2, Calendar, BookOpen, X, CheckCircle } from 'lucide-react';
import { Homework, SchoolClass, Subject, Teacher } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const HomeworkView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [homeworkList, setHomeworkList] = useState<Homework[]>(() =>
    getData<Homework[]>(STORAGE_KEYS.HOMEWORK, [])
  );
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const subjects = getData<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);

  const [filterClass, setFilterClass] = useState('All');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Homework | null>(null);

  const initialForm: Partial<Homework> = {
    title: '',
    description: '',
    class: classes[0]?.name || 'Grade 10',
    section: 'Science-A',
    subject: subjects[0]?.name || 'Mathematics',
    teacherName: teachers[0]?.name || 'Faculty Member',
    assignedDate: '2026-10-01',
    dueDate: '2026-10-04',
    status: 'Active',
  };
  const [formData, setFormData] = useState<Partial<Homework>>(initialForm);

  const filtered = homeworkList.filter(
    (h) => filterClass === 'All' || h.class === filterClass
  );

  const handleOpenAdd = () => {
    setEditingHomework(null);
    setFormData(initialForm);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (hw: Homework) => {
    setEditingHomework(hw);
    setFormData(hw);
    setShowAddEditModal(true);
  };

  const handleSaveHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingHomework) {
      const updated = homeworkList.map((h) =>
        h.id === editingHomework.id ? ({ ...h, ...formData } as Homework) : h
      );
      saveData(STORAGE_KEYS.HOMEWORK, updated);
      setHomeworkList(updated);
      showToast('Homework updated.');
    } else {
      const newHw: Homework = {
        ...formData,
        id: `hw-${Date.now()}`,
      } as Homework;
      const updated = [newHw, ...homeworkList];
      saveData(STORAGE_KEYS.HOMEWORK, updated);
      setHomeworkList(updated);
      showToast('New homework assigned to class!');
    }
    setShowAddEditModal(false);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    const updated = homeworkList.filter((h) => h.id !== itemToDelete.id);
    saveData(STORAGE_KEYS.HOMEWORK, updated);
    setHomeworkList(updated);
    showToast('Homework deleted.');
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Homework & Assignments</h2>
            <p className="text-xs text-slate-400">
              Daily syllabus coursework, assigned tasks and student submission deadlines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('homework') && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Homework
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

      {/* Homework Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title="No homework assignments found"
          description="Assign new homework or select another class filter."
          actionText={canManage('homework') ? '+ Add Homework' : undefined}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((hw) => (
            <div
              key={hw.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {hw.class} ({hw.section})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {hw.subject}
                    </span>
                  </div>

                  {canManage('homework') && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(hw)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(hw)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-slate-800 mt-3">{hw.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {hw.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due: <span className="font-bold text-rose-600">{hw.dueDate}</span></span>
                </div>
                <span className="text-[11px] text-slate-400">Teacher: {hw.teacherName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">
                {editingHomework ? 'Edit Homework' : 'Assign New Homework'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHomework} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="e.g. Science Chapter 3 Questions 1-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={formData.section || 'A'}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject || subjects[0]?.name}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Teacher</label>
                  <select
                    value={formData.teacherName || teachers[0]?.name}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Description / Instructions</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Detail instructions for students..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Date</label>
                  <input
                    type="date"
                    value={formData.assignedDate || ''}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Submission Date</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                  Save Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!itemToDelete}
        title="Delete Homework"
        message="Are you sure you want to remove this homework assignment?"
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
