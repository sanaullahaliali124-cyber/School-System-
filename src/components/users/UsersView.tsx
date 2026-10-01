import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2, Key, CheckCircle, XCircle, X } from 'lucide-react';
import { User, UserRole } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { initialUsers } from '../../data/initialData';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const UsersView: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>(() =>
    getData<User[]>(STORAGE_KEYS.USERS, initialUsers)
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'teacher',
    designation: 'Educator',
    phone: '+92 300 1234567',
    status: 'active',
  });

  const matrix = [
    { module: 'Dashboard', admin: 'Full', principal: 'Full', teacher: 'Limited', accountant: 'Limited', staff: 'Limited' },
    { module: 'Students', admin: 'Full', principal: 'Full', teacher: 'Assigned', accountant: 'View', staff: 'View' },
    { module: 'Teachers', admin: 'Full', principal: 'Full', teacher: 'View', accountant: 'View', staff: 'Limited' },
    { module: 'Attendance', admin: 'Full', principal: 'Full', teacher: 'Manage', accountant: 'View', staff: 'View' },
    { module: 'Fees & Finance', admin: 'Full', principal: 'View', teacher: 'View', accountant: 'Full', staff: 'Limited' },
    { module: 'Exams & Results', admin: 'Full', principal: 'Full', teacher: 'Manage', accountant: 'View', staff: 'View' },
    { module: 'Reports', admin: 'Full', principal: 'Full', teacher: 'Limited', accountant: 'Fee Reports', staff: 'Limited' },
    { module: 'Settings', admin: 'Full', principal: 'Limited', teacher: 'No', accountant: 'No', staff: 'No' },
  ];

  const handleToggleStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'active' ? ('inactive' as const) : ('active' as const) } : u
    );
    setUsers(updated);
    saveData(STORAGE_KEYS.USERS, updated);
    showToast('User account status updated.');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser: User = {
      ...formData,
      id: `usr-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    } as User;

    const updated = [...users, newUser];
    setUsers(updated);
    saveData(STORAGE_KEYS.USERS, updated);
    showToast(`User account for ${newUser.name} created!`);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">User Accounts & Role Permissions</h2>
            <p className="text-xs text-slate-400">
              Manage system credentials, portal access privileges and role-based access control (RBAC)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add System User
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-bold text-sm text-slate-800">Authorized System Users</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b font-bold text-[11px] uppercase">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Last Login</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-xl object-cover border"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="capitalize font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{u.designation}</td>
                  <td className="p-3">{u.phone}</td>
                  <td className="p-3 text-slate-400">{u.lastLogin || 'Recent'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border hover:bg-slate-50 transition"
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800">
          Role-Based Access Control (RBAC) Permission Matrix
        </h3>
        <p className="text-xs text-slate-400">
          Enforced permission levels across modules according to official school security hierarchy
        </p>

        <div className="overflow-x-auto border rounded-2xl">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b font-bold text-[11px] uppercase">
              <tr>
                <th className="p-3">Module</th>
                <th className="p-3 text-purple-700">Admin</th>
                <th className="p-3 text-blue-700">Principal</th>
                <th className="p-3 text-emerald-700">Teacher</th>
                <th className="p-3 text-amber-700">Accountant</th>
                <th className="p-3 text-slate-700">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{row.module}</td>
                  <td className="p-3 font-semibold text-purple-800 bg-purple-50/20">{row.admin}</td>
                  <td className="p-3 font-semibold text-blue-800">{row.principal}</td>
                  <td className="p-3 font-semibold text-emerald-800">{row.teacher}</td>
                  <td className="p-3 font-semibold text-amber-800">{row.accountant}</td>
                  <td className="p-3 font-semibold text-slate-700">{row.staff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Provision User Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 mt-4 text-xs">
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
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="name@smartmodern.edu.pk"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={formData.role || 'teacher'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  >
                    <option value="admin">Admin</option>
                    <option value="principal">Principal</option>
                    <option value="teacher">Teacher</option>
                    <option value="accountant">Accountant</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
