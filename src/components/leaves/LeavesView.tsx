import React, { useState } from 'react';
import { CalendarOff, Plus, CheckCircle, XCircle, Clock, X } from 'lucide-react';
import { LeaveRequest } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const LeavesView: React.FC = () => {
  const { currentUser, canManage } = useAuth();
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() =>
    getData<LeaveRequest[]>(STORAGE_KEYS.LEAVES, [])
  );

  const [filterType, setFilterType] = useState('All');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const initialForm: Partial<LeaveRequest> = {
    applicantName: currentUser?.name || 'Applicant',
    applicantType: 'Teacher',
    classOrDesignation: 'Educator',
    leaveType: 'Casual Leave',
    fromDate: '2026-10-02',
    toDate: '2026-10-03',
    totalDays: 2,
    reason: 'Family domestic engagement',
    status: 'Pending',
    appliedDate: '2026-10-01',
  };
  const [formData, setFormData] = useState<Partial<LeaveRequest>>(initialForm);

  const filtered = leaves.filter(
    (l) => filterType === 'All' || l.applicantType === filterType
  );

  const handleApprove = (leave: LeaveRequest) => {
    const updated = leaves.map((l) =>
      l.id === leave.id
        ? {
            ...l,
            status: 'Approved' as const,
            approvedBy: currentUser?.name || 'School Principal',
          }
        : l
    );
    setLeaves(updated);
    saveData(STORAGE_KEYS.LEAVES, updated);
    showToast(`Leave application for ${leave.applicantName} approved!`);
  };

  const handleReject = (leave: LeaveRequest) => {
    const updated = leaves.map((l) =>
      l.id === leave.id ? { ...l, status: 'Rejected' as const } : l
    );
    setLeaves(updated);
    saveData(STORAGE_KEYS.LEAVES, updated);
    showToast(`Leave rejected.`);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.reason) return;

    const newLeave: LeaveRequest = {
      ...formData,
      id: `lev-${Date.now()}`,
      applicantId: currentUser?.id || 'usr-auto',
    } as LeaveRequest;

    const updated = [newLeave, ...leaves];
    setLeaves(updated);
    saveData(STORAGE_KEYS.LEAVES, updated);
    showToast(`Leave application submitted for review.`);
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Leave Management</h2>
            <p className="text-xs text-slate-400">
              Absence requests and medical clearances for students, faculty and staff
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-md">
        {['All', 'Student', 'Teacher', 'Staff'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterType === type
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {type} Leaves
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Role / Department</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{l.applicantName}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                      {l.applicantType} • {l.classOrDesignation}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{l.leaveType}</td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {l.fromDate} to {l.toDate} ({l.totalDays} days)
                  </td>
                  <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                    {l.reason}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        l.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : l.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {canManage('leaves') && l.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(l)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(l)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {l.approvedBy ? `Approved by ${l.approvedBy.split(' ')[0]}` : '—'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Submit Leave Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  required
                  value={formData.applicantName || ''}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicant Type</label>
                  <select
                    value={formData.applicantType || 'Teacher'}
                    onChange={(e) => setFormData({ ...formData, applicantType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={formData.leaveType || 'Casual Leave'}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Medical">Medical Emergency</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.fromDate || ''}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.toDate || ''}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  value={formData.reason || ''}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white rounded-xl font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
