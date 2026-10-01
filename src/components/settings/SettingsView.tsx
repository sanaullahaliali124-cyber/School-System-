import React, { useState } from 'react';
import { Settings, School, Calendar, Award, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { SchoolSettings } from '../../types';
import { getData, saveData, STORAGE_KEYS, resetAllDataToDemo } from '../../services/storage';
import { initialSettings } from '../../data/initialData';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<SchoolSettings>(() =>
    getData<SchoolSettings>(STORAGE_KEYS.SETTINGS, initialSettings)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveData(STORAGE_KEYS.SETTINGS, settings);
    showToast('School profile & system parameters updated!');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to the default demo state? All your custom added students and transactions will be re-seeded.'
      )
    ) {
      resetAllDataToDemo();
      setSettings(initialSettings);
      showToast('All LocalStorage demo collections re-seeded successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">School & System Settings</h2>
            <p className="text-xs text-slate-400">
              Configure institution credentials, academic sessions, grading thresholds and demo datasets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-seed Demo Data
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* School Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <School className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-800">Institution Identity & Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official School Name</label>
              <input
                type="text"
                required
                value={settings.schoolName}
                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Principal Name</label>
              <input
                type="text"
                required
                value={settings.principalName}
                onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">School Registration No.</label>
              <input
                type="text"
                value={settings.registrationNo}
                onChange={(e) => setSettings({ ...settings, registrationNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Active Academic Session</label>
              <select
                value={settings.currentSession}
                onChange={(e) => setSettings({ ...settings, currentSession: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-semibold"
              >
                <option value="2025–2026">2025–2026</option>
                <option value="2026–2027">2026–2027</option>
                <option value="2027–2028">2027–2028</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Phone Numbers</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website URL</label>
              <input
                type="text"
                value={settings.website}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Physical Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Grading Scale & Passing Threshold */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-800">Academic Grading Scale & Standards</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum Passing Percentage</label>
              <input
                type="number"
                value={settings.passingPercentage}
                onChange={(e) => setSettings({ ...settings, passingPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Currency</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Date Format</label>
              <input
                type="text"
                value={settings.dateFormat}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Min %</th>
                  <th className="p-3">Max %</th>
                  <th className="p-3">GPA Equivalent</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settings.gradingScale.map((scale, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-indigo-700 text-sm">{scale.grade}</td>
                    <td className="p-3 font-semibold">{scale.minPercentage}%</td>
                    <td className="p-3 font-semibold">{scale.maxPercentage}%</td>
                    <td className="p-3 font-mono">{scale.gpa}</td>
                    <td className="p-3">{scale.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {canManage('settings') && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
