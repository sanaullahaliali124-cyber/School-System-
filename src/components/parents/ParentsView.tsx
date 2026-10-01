import React, { useState } from 'react';
import {
  HeartHandshake,
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  X,
  Eye,
} from 'lucide-react';
import { Parent, Student } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const ParentsView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [parents, setParents] = useState<Parent[]>(() =>
    getData<Parent[]>(STORAGE_KEYS.PARENTS, [])
  );
  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<Parent>>({
    fatherName: '',
    motherName: '',
    phone: '+92 300 1234567',
    email: '',
    address: 'Qamber, Sindh',
    occupation: 'Business',
    childrenAdmissionNos: [],
  });

  const filteredParents = parents.filter(
    (p) =>
      p.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fatherName) {
      alert('Father/Guardian Name is required.');
      return;
    }

    const newParent: Parent = {
      ...formData,
      id: `par-${Date.now()}`,
    } as Parent;

    const updated = [newParent, ...parents];
    saveData(STORAGE_KEYS.PARENTS, updated);
    setParents(updated);
    showToast(`Parent record for ${newParent.fatherName} added.`);
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const rows = filteredParents.map((p) => ({
      ID: p.id,
      'Father Name': p.fatherName,
      'Mother Name': p.motherName,
      Phone: p.phone,
      Email: p.email,
      Occupation: p.occupation,
      Address: p.address,
      Children: p.childrenAdmissionNos.join(', '),
    }));
    exportToCSV('SMPS_Parents_List', rows);
    showToast('Exported parent list to CSV');
  };

  const handleExportExcel = () => {
    const rows = filteredParents.map((p) => ({
      ID: p.id,
      "Father's Name": p.fatherName,
      "Mother's Name": p.motherName,
      Phone: p.phone,
      Email: p.email,
      Occupation: p.occupation,
      Address: p.address,
      'Associated Children (Admission Nos)': p.childrenAdmissionNos.join(', '),
    }));
    exportToExcel('SMPS_Parents_Directory', rows, 'Parents');
    showToast('Exported parents directory to Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Parents & Guardians</h2>
            <p className="text-xs text-slate-400">
              Registered families and guardians ({parents.length} total)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('parents') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Parent
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

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by parent name, occupation, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredParents.map((parent) => {
          // Find matching students
          const linkedStudents = students.filter((s) =>
            parent.childrenAdmissionNos.includes(s.admissionNo)
          );

          return (
            <div
              key={parent.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{parent.fatherName}</h3>
                    <p className="text-xs text-slate-500">Mother: {parent.motherName}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                      {parent.occupation}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedParent(parent)}
                    className="p-1.5 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{parent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{parent.address}</span>
                  </div>
                </div>

                {/* Linked Children List */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Enrolled Children ({linkedStudents.length})
                  </span>
                  <div className="space-y-1.5">
                    {linkedStudents.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-semibold text-slate-800">{child.fullName}</span>
                        </div>
                        <span className="text-[11px] text-indigo-600 font-bold">
                          {child.class} ({child.section})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent Detail Modal */}
      {selectedParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-800">{selectedParent.fatherName}</h3>
                <p className="text-xs text-slate-400">Guardian Profile</p>
              </div>
              <button onClick={() => setSelectedParent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs text-slate-600">
              <p><span className="font-bold">Mother Name:</span> {selectedParent.motherName}</p>
              <p><span className="font-bold">Occupation:</span> {selectedParent.occupation}</p>
              <p><span className="font-bold">Phone:</span> {selectedParent.phone}</p>
              <p><span className="font-bold">Email:</span> {selectedParent.email || 'None'}</p>
              <p><span className="font-bold">Address:</span> {selectedParent.address}</p>
            </div>
            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setSelectedParent(null)}
                className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Register New Guardian / Parent</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveParent} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={formData.fatherName || ''}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mother Name</label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation || ''}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
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
                  className="px-5 py-2 bg-pink-600 text-white rounded-xl font-bold"
                >
                  Save Parent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
