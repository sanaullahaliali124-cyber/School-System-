import React, { useState } from 'react';
import { School, Plus, Edit2, Trash2, Users, GraduationCap, X, DoorOpen } from 'lucide-react';
import { SchoolClass, Teacher, Student } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const ClassesView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [classes, setClasses] = useState<SchoolClass[]>(() =>
    getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, [])
  );
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

  const initialForm: Partial<SchoolClass> = {
    name: 'Grade 11',
    numericLevel: 11,
    sections: ['A', 'B'],
    classTeacherId: teachers[0]?.id || '',
    roomNo: 'Room 401',
    capacity: 40,
  };
  const [formData, setFormData] = useState<Partial<SchoolClass>>(initialForm);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData(initialForm);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (cls: SchoolClass) => {
    setEditingClass(cls);
    setFormData(cls);
    setShowAddEditModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingClass) {
      const updated = classes.map((c) =>
        c.id === editingClass.id ? ({ ...c, ...formData } as SchoolClass) : c
      );
      saveData(STORAGE_KEYS.CLASSES, updated);
      setClasses(updated);
      showToast(`Class ${formData.name} updated!`);
    } else {
      const newClass: SchoolClass = {
        ...formData,
        id: `cls-${Date.now()}`,
      } as SchoolClass;
      const updated = [...classes, newClass];
      saveData(STORAGE_KEYS.CLASSES, updated);
      setClasses(updated);
      showToast(`New class ${newClass.name} added!`);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteClass = () => {
    if (!classToDelete) return;
    const updated = classes.filter((c) => c.id !== classToDelete.id);
    saveData(STORAGE_KEYS.CLASSES, updated);
    setClasses(updated);
    showToast(`Class deleted.`);
    setClassToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Classes & Sections</h2>
            <p className="text-xs text-slate-400">
              Grade levels, sections, assigned class educators & student capacity
            </p>
          </div>
        </div>

        {canManage('classes') && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Class
          </button>
        )}
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const teacher = teachers.find((t) => t.id === cls.classTeacherId);
          const enrolledCount = students.filter((s) => s.class === cls.name).length;

          return (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center text-lg border border-blue-100">
                      {cls.numericLevel}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-800">{cls.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <DoorOpen className="w-3.5 h-3.5" />
                        <span>{cls.roomNo || 'Main Block'}</span>
                      </div>
                    </div>
                  </div>

                  {canManage('classes') && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(cls)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setClassToDelete(cls)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sections List */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Sections ({cls.sections.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.sections.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                      >
                        Section {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Class Incharge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Incharge Teacher:</span>
                  <span className="font-semibold text-slate-800 truncate">
                    {teacher?.name || 'Assigned by Principal'}
                  </span>
                </div>
              </div>

              {/* Footer Capacity */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                  <GraduationCap className="w-4 h-4" />
                  <span>{enrolledCount} Enrolled</span>
                </div>
                <span className="text-slate-400">Capacity: {cls.capacity || 40} Seats</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">
                {editingClass ? 'Edit Class Details' : 'Add New Class'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Level (Number)</label>
                  <input
                    type="number"
                    value={formData.numericLevel || 1}
                    onChange={(e) => setFormData({ ...formData, numericLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sections (comma separated)</label>
                <input
                  type="text"
                  value={formData.sections?.join(', ') || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sections: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="A, B, C"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Class Incharge Teacher</label>
                <select
                  value={formData.classTeacherId || ''}
                  onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  <option value="">Select Incharge Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={formData.roomNo || ''}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                    placeholder="Room 101"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity || 40}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!classToDelete}
        title="Delete Class"
        message={`Are you sure you want to delete ${classToDelete?.name}?`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteClass}
        onCancel={() => setClassToDelete(null)}
      />
    </div>
  );
};
