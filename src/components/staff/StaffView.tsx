import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Printer,
  Edit2,
  Trash2,
  Phone,
  Mail,
  X,
} from 'lucide-react';
import { Staff } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const StaffView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState<Staff[]>(() =>
    getData<Staff[]>(STORAGE_KEYS.STAFF, [])
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('All');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const initialForm: Partial<Staff> = {
    name: '',
    position: 'Clerk',
    phone: '+92 300 1234567',
    email: '',
    joiningDate: '2024-01-01',
    salary: 35000,
    status: 'Active',
    address: 'Qamber, Sindh',
    gender: 'Male',
  };
  const [formData, setFormData] = useState<Partial<Staff>>(initialForm);

  const filteredStaff = staffList.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition =
      filterPosition === 'All' || st.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData(initialForm);
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (st: Staff) => {
    setEditingStaff(st);
    setFormData(st);
    setShowAddEditModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Staff name is required.');
      return;
    }

    if (editingStaff) {
      const updated = staffList.map((st) =>
        st.id === editingStaff.id ? ({ ...st, ...formData } as Staff) : st
      );
      saveData(STORAGE_KEYS.STAFF, updated);
      setStaffList(updated);
      showToast(`Staff record for ${formData.name} updated!`);
    } else {
      const newStaff: Staff = {
        ...formData,
        id: `stf-${Date.now()}`,
      } as Staff;
      const updated = [newStaff, ...staffList];
      saveData(STORAGE_KEYS.STAFF, updated);
      setStaffList(updated);
      showToast(`Staff member ${newStaff.name} added!`);
    }
    setShowAddEditModal(false);
  };

  const handleDeleteStaff = () => {
    if (!staffToDelete) return;
    const updated = staffList.filter((st) => st.id !== staffToDelete.id);
    saveData(STORAGE_KEYS.STAFF, updated);
    setStaffList(updated);
    showToast(`Staff member record removed.`);
    setStaffToDelete(null);
  };

  const handleExportCSV = () => {
    const rows = filteredStaff.map((st) => ({
      ID: st.id,
      Name: st.name,
      Position: st.position,
      Phone: st.phone,
      Email: st.email,
      'Joining Date': st.joiningDate,
      Salary: st.salary,
      Status: st.status,
      Address: st.address,
    }));
    exportToCSV('SMPS_Staff_List', rows);
    showToast('Exported staff list to CSV');
  };

  const handleExportExcel = () => {
    const rows = filteredStaff.map((st) => ({
      ID: st.id,
      Name: st.name,
      Position: st.position,
      Phone: st.phone,
      Email: st.email,
      'Joining Date': st.joiningDate,
      'Monthly Salary (PKR)': st.salary,
      Status: st.status,
      Address: st.address,
    }));
    exportToExcel('SMPS_Staff_Directory', rows, 'Staff');
    showToast('Exported staff directory to Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Support Staff Directory</h2>
              <p className="text-xs text-slate-400">
                Non-teaching personnel, administration & facility staff ({staffList.length} members)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canManage('staff') && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Staff Member
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
            placeholder="Search staff by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
          >
            <option value="All">All Staff Positions</option>
            <option value="Accountant">Accountant</option>
            <option value="Clerk">Clerk</option>
            <option value="Librarian">Librarian</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Security Guard">Security Guard</option>
            <option value="Lab Assistant">Lab Assistant</option>
            <option value="Support Staff">Support Staff</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No staff members found"
          description="Adjust your search filters or register a new staff member."
          actionText={canManage('staff') ? '+ Add Staff' : undefined}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Phone Contact</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4">Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[10px] text-slate-400">{st.email || 'Email not registered'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px]">
                        {st.position}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{st.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{st.joiningDate}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">Rs. {st.salary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right no-print">
                      {canManage('staff') && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setStaffToDelete(st)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
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
      )}

      {/* Add / Edit Staff Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="mt-4 space-y-3 text-xs">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Position</label>
                  <select
                    value={formData.position || 'Clerk'}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    <option value="Accountant">Accountant</option>
                    <option value="Clerk">Clerk</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Security Guard">Security Guard</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Support Staff">Support Staff</option>
                  </select>
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formData.salary || 0}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
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
                  onClick={() => setShowAddEditModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!staffToDelete}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${staffToDelete?.name} (${staffToDelete?.position})?`}
        confirmText="Remove Staff"
        confirmVariant="danger"
        onConfirm={handleDeleteStaff}
        onCancel={() => setStaffToDelete(null)}
      />
    </div>
  );
};
