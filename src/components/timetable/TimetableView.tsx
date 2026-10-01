import React, { useState } from 'react';
import { CalendarDays, Plus, Printer, Clock, DoorOpen, User, X } from 'lucide-react';
import { TimetableSlot, SchoolClass, Subject, Teacher } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const TimetableView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
  const subjects = getData<Subject[]>(STORAGE_KEYS.SUBJECTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);

  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.name || 'Grade 10');
  const [selectedSection, setSelectedSection] = useState<string>('Science-A');

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() =>
    getData<TimetableSlot[]>(STORAGE_KEYS.TIMETABLE, [])
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<TimetableSlot>>({
    class: selectedClass,
    section: selectedSection,
    day: 'Monday',
    period: 1,
    startTime: '08:00 AM',
    endTime: '08:45 AM',
    subject: 'Mathematics',
    teacher: teachers[0]?.name || 'Ms. Farzana Parveen',
    room: 'Room 302',
  });

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const periods = [1, 2, 3, 4, 5, 6, 7];

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      ...formData,
      id: `tt-${Date.now()}`,
      class: selectedClass,
      section: selectedSection,
    } as TimetableSlot;

    // Filter out existing slot on same day and period for this class
    const filtered = timetable.filter(
      (s) =>
        !(
          s.class === selectedClass &&
          s.section === selectedSection &&
          s.day === newSlot.day &&
          s.period === newSlot.period
        )
    );

    const updated = [...filtered, newSlot];
    saveData(STORAGE_KEYS.TIMETABLE, updated);
    setTimetable(updated);
    showToast(`Timetable updated for ${newSlot.day} Period ${newSlot.period}!`);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Weekly Class Timetable</h2>
            <p className="text-xs text-slate-400">
              Curriculum periods, room assignments and educator scheduling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('timetable') && (
            <button
              onClick={() => {
                setFormData({
                  ...formData,
                  class: selectedClass,
                  section: selectedSection,
                });
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Period Slot
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print Timetable
          </button>
        </div>
      </div>

      {/* Class & Section Selector */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-4 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-semibold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Section:</span>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-xl text-xs font-semibold"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="Science-A">Science-A</option>
            <option value="Science-B">Science-B</option>
          </select>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden print-area">
        <div className="p-4 bg-indigo-900 text-white hidden print:block text-center border-b">
          <h2 className="text-lg font-bold">THE SMART MODERN PUBLIC SCHOOL QAMBER</h2>
          <p className="text-xs">Class Timetable: {selectedClass} ({selectedSection}) - Academic Session 2026–2027</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                <th className="p-3.5 border-r border-slate-200 w-28 text-center bg-slate-100/70">Day</th>
                {periods.map((p) => (
                  <th key={p} className="p-3.5 border-r border-slate-200 min-w-36 text-center">
                    <div>Period {p}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {p === 1 && '08:00 - 08:45 AM'}
                      {p === 2 && '08:45 - 09:30 AM'}
                      {p === 3 && '09:30 - 10:15 AM'}
                      {p === 4 && '10:45 - 11:30 AM'}
                      {p === 5 && '11:30 - 12:15 PM'}
                      {p === 6 && '12:15 - 01:00 PM'}
                      {p === 7 && '01:00 - 01:45 PM'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map((day) => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-800 bg-slate-50/80 border-r border-slate-200 text-center">
                    {day}
                  </td>
                  {periods.map((p) => {
                    const slot = timetable.find(
                      (s) =>
                        s.class === selectedClass &&
                        s.section === selectedSection &&
                        s.day === day &&
                        s.period === p
                    );

                    return (
                      <td key={p} className="p-2 border-r border-slate-200 text-center align-top">
                        {slot ? (
                          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-left">
                            <div className="font-extrabold text-indigo-900 text-xs truncate">
                              {slot.subject}
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 truncate">
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{slot.teacher}</span>
                            </div>
                            <div className="text-[10px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                              <DoorOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                              <span>{slot.room}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-slate-300 font-mono text-[11px]">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Assign Timetable Period</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Day of Week</label>
                  <select
                    value={formData.day || 'Monday'}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period (1 to 7)</label>
                  <select
                    value={formData.period || 1}
                    onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    {periods.map((p) => (
                      <option key={p} value={p}>Period {p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Educator / Teacher</label>
                <select
                  value={formData.teacher || ''}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Lab</label>
                  <input
                    type="text"
                    value={formData.room || 'Room 302'}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Range</label>
                  <input
                    type="text"
                    value={formData.startTime ? `${formData.startTime} - ${formData.endTime}` : '08:00 AM - 08:45 AM'}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      setFormData({
                        ...formData,
                        startTime: parts[0]?.trim() || '08:00 AM',
                        endTime: parts[1]?.trim() || '08:45 AM',
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Save Period Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
