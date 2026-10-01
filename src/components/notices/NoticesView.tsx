import React, { useState } from 'react';
import { Bell, Plus, Calendar, Users, AlertTriangle, X, Tag } from 'lucide-react';
import { SchoolNotice } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const NoticesView: React.FC = () => {
  const { canManage, currentUser } = useAuth();
  const { showToast } = useToast();

  const [notices, setNotices] = useState<SchoolNotice[]>(() =>
    getData<SchoolNotice[]>(STORAGE_KEYS.NOTICES, [])
  );

  const [filterAudience, setFilterAudience] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const initialForm: Partial<SchoolNotice> = {
    title: '',
    description: '',
    date: '2026-10-01',
    audience: 'Everyone',
    priority: 'Normal',
    category: 'Circular',
    postedBy: currentUser?.name || 'Principal Office',
  };
  const [formData, setFormData] = useState<Partial<SchoolNotice>>(initialForm);

  const filtered = notices.filter(
    (n) => filterAudience === 'All' || n.audience === filterAudience || n.audience === 'Everyone'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const newNotice: SchoolNotice = {
      ...formData,
      id: `not-${Date.now()}`,
    } as SchoolNotice;

    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveData(STORAGE_KEYS.NOTICES, updated);
    showToast('New school notice published on the notice board!');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">School Notice Board & Circulars</h2>
            <p className="text-xs text-slate-400">
              Official circulars, events, holidays and general school announcements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('notices') && (
            <button
              onClick={() => {
                setFormData(initialForm);
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Publish Notice
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
        {['All', 'Students', 'Teachers', 'Parents', 'Staff'].map((aud) => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterAudience === aud
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {aud}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                    n.priority === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : n.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {n.priority} Priority • {n.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{n.date}</span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-3">{n.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {n.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-600">Audience: {n.audience}</span>
              <span>Issued by: {n.postedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Publish School Circular</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="e.g. Mid Term Schedule Announcement"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={formData.audience || 'Everyone'}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    <option value="Everyone">Everyone</option>
                    <option value="Students">Students Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Staff">Staff Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority || 'Normal'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'Notice'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Notice">Notice</option>
                    <option value="Circular">Circular</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Body / Content</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Enter detailed notice content..."
                />
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
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl font-bold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
