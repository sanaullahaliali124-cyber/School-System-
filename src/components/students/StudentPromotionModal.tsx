import React, { useState } from 'react';
import { X, Award, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { Student, SchoolClass } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { useToast } from '../common/Toast';

interface StudentPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromoted: () => void;
}

export const StudentPromotionModal: React.FC<StudentPromotionModalProps> = ({
  isOpen,
  onClose,
  onPromoted,
}) => {
  const { showToast } = useToast();
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const allStudents = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);

  const [fromClass, setFromClass] = useState<string>(classes[0]?.name || 'Grade 1');
  const [toClass, setToClass] = useState<string>(classes[1]?.name || 'Grade 2');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Filter students in the selected fromClass
  const eligibleStudents = allStudents.filter((s) => s.class === fromClass && s.status === 'Active');

  const handleSelectAll = () => {
    if (selectedStudentIds.length === eligibleStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(eligibleStudents.map((s) => s.id));
    }
  };

  const handleToggle = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handlePromote = () => {
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student to promote.');
      return;
    }

    const updated = allStudents.map((s) => {
      if (selectedStudentIds.includes(s.id)) {
        return {
          ...s,
          class: toClass,
        };
      }
      return s;
    });

    saveData(STORAGE_KEYS.STUDENTS, updated);
    showToast(`Successfully promoted ${selectedStudentIds.length} student(s) to ${toClass}!`);
    onPromoted();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Academic Student Promotion</h3>
              <p className="text-xs text-slate-400">Promote students to next class level</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Selectors */}
        <div className="grid grid-cols-2 gap-4 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Current Class</label>
            <select
              value={fromClass}
              onChange={(e) => {
                setFromClass(e.target.value);
                setSelectedStudentIds([]);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Promote To Class</label>
            <select
              value={toClass}
              onChange={(e) => setToClass(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student list */}
        <div className="flex items-center justify-between py-2 text-xs">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
          >
            {selectedStudentIds.length === eligibleStudents.length && eligibleStudents.length > 0 ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All ({eligibleStudents.length})
          </button>
          <span className="text-slate-500 font-semibold">{selectedStudentIds.length} Selected</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 border rounded-2xl p-2 my-2 text-xs">
          {eligibleStudents.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No active students in {fromClass}</div>
          ) : (
            eligibleStudents.map((st) => (
              <label
                key={st.id}
                className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(st.id)}
                    onChange={() => handleToggle(st.id)}
                    className="rounded text-indigo-600 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{st.fullName}</div>
                    <div className="text-[11px] text-slate-400">Roll: {st.rollNo} • {st.admissionNo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                  <span>{st.class}</span> <ArrowRight className="w-3 h-3" /> <span>{toClass}</span>
                </div>
              </label>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlePromote}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer"
          >
            Promote Selected ({selectedStudentIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};
