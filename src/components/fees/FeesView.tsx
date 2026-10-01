import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Printer,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt,
  X,
  DollarSign,
} from 'lucide-react';
import { FeeStructure, FeePayment, Student, SchoolClass } from '../../types';
import { getData, saveData, STORAGE_KEYS, exportToCSV, exportToExcel } from '../../services/storage';
import { FeeReceiptModal } from './FeeReceiptModal';
import { useToast } from '../common/Toast';
import { useAuth } from '../../context/AuthContext';

export const FeesView: React.FC = () => {
  const { canManage } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'payments' | 'pending' | 'structure'>('payments');

  const [feePayments, setFeePayments] = useState<FeePayment[]>(() =>
    getData<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, [])
  );
  const feeStructures = getData<FeeStructure[]>(STORAGE_KEYS.FEE_STRUCTURES, []);
  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<FeePayment | null>(null);

  // Form for Collecting Fee
  const initialForm: Partial<FeePayment> = {
    invoiceNo: `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`,
    studentId: students[0]?.id || '',
    studentName: students[0]?.fullName || '',
    admissionNo: students[0]?.admissionNo || '',
    class: students[0]?.class || 'Grade 10',
    section: students[0]?.section || 'Science-A',
    month: 'October 2026',
    feeType: 'Monthly Tuition & Computer Fee',
    totalAmount: 11700,
    discount: 0,
    paidAmount: 11700,
    remainingAmount: 0,
    paymentMethod: 'Cash',
    paymentDate: '2026-10-01',
    status: 'Paid',
    remarks: 'Fee payment accepted at front desk',
  };
  const [formData, setFormData] = useState<Partial<FeePayment>>(initialForm);

  // Summary figures
  const totalCollected = feePayments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalPending = feePayments.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);
  const totalDiscounts = feePayments.reduce((acc, curr) => acc + (curr.discount || 0), 0);

  // Filtered payments
  const filteredPayments = feePayments.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || p.class === filterClass;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const pendingPayments = feePayments.filter(
    (p) => p.status === 'Pending' || p.status === 'Partial'
  );

  const handleStudentSelectInForm = (studentId: string) => {
    const st = students.find((s) => s.id === studentId);
    if (!st) return;

    // Find class fee structure
    const fs = feeStructures.find((f) => f.class === st.class);
    const amount = fs ? fs.totalMonthlyFee : 11700;

    setFormData({
      ...formData,
      studentId: st.id,
      studentName: st.fullName,
      admissionNo: st.admissionNo,
      class: st.class,
      section: st.section,
      totalAmount: amount,
      discount: 0,
      paidAmount: amount,
      remainingAmount: 0,
    });
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.totalAmount) return;

    const netPayable = (formData.totalAmount || 0) - (formData.discount || 0);
    const paid = formData.paidAmount || 0;
    const remaining = Math.max(0, netPayable - paid);
    const status = remaining === 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending';

    const newPayment: FeePayment = {
      ...formData,
      id: `pay-${Date.now()}`,
      remainingAmount: remaining,
      status,
    } as FeePayment;

    const updated = [newPayment, ...feePayments];
    saveData(STORAGE_KEYS.FEE_PAYMENTS, updated);
    setFeePayments(updated);
    showToast(`Fee payment of Rs. ${paid.toLocaleString()} recorded!`);
    setShowCollectModal(false);
    setSelectedPaymentForReceipt(newPayment);
  };

  const handleExportCSV = () => {
    const rows = filteredPayments.map((p) => ({
      Invoice: p.invoiceNo,
      'Student Name': p.studentName,
      'Admission No': p.admissionNo,
      Class: p.class,
      Month: p.month,
      'Total (PKR)': p.totalAmount,
      'Discount (PKR)': p.discount,
      'Paid (PKR)': p.paidAmount,
      'Remaining (PKR)': p.remainingAmount,
      Method: p.paymentMethod,
      Date: p.paymentDate,
      Status: p.status,
    }));
    exportToCSV('SMPS_Fee_Payments_Report', rows);
    showToast('Exported fee payments to CSV');
  };

  const handleExportExcel = () => {
    const rows = filteredPayments.map((p) => ({
      Invoice: p.invoiceNo,
      'Student Name': p.studentName,
      'Admission No': p.admissionNo,
      Class: p.class,
      Section: p.section,
      Month: p.month,
      'Fee Particulars': p.feeType,
      'Total Amount (PKR)': p.totalAmount,
      'Scholarship/Discount (PKR)': p.discount,
      'Paid Amount (PKR)': p.paidAmount,
      'Remaining Due (PKR)': p.remainingAmount,
      'Payment Method': p.paymentMethod,
      'Receipt Date': p.paymentDate,
      Status: p.status,
      Remarks: p.remarks || '',
    }));
    exportToExcel('SMPS_Fee_Collections_Report', rows, 'Fee Payments');
    showToast('Exported fee collection to Excel (.xlsx)');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Fee & Financial Management</h2>
            <p className="text-xs text-slate-400">
              Fee collection counter, printable challan receipts, tuition schedules and outstanding dues
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl no-print">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fee Transactions
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Dues ({pendingPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'structure'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fee Structures
            </button>
          </div>

          {canManage('fees') && (
            <button
              onClick={() => {
                setFormData(initialForm);
                setShowCollectModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Collect Fee
            </button>
          )}
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Fee Collected
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              Rs. {totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Session 2026-2027 Inflows</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Outstanding / Pending
            </span>
            <div className="text-2xl font-black text-rose-600 mt-1">
              Rs. {totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Unpaid tuition invoices</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Discounts & Scholarships
            </span>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              Rs. {totalDiscounts.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Fee waivers and relief</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab 1: Fee Transactions List */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 no-print">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by invoice no, student name, or admission no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="w-full py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                title="Download formatted Excel spreadsheet (.xlsx)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export to Excel
              </button>
              <button
                onClick={handleExportCSV}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Export CSV"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Invoice</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Paid Amount</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.invoiceNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.studentName}</div>
                        <div className="text-[10px] text-slate-400">{p.admissionNo}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{p.class}</td>
                      <td className="py-3 px-4 text-slate-600">{p.month}</td>
                      <td className="py-3 px-4 font-mono font-extrabold text-emerald-700">
                        Rs. {p.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        {p.remainingAmount > 0 ? `Rs. ${p.remainingAmount.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'Partial'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPaymentForReceipt(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pending Dues */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Pending & Partial Fee Balances</h3>
              <p className="text-xs text-slate-400">Total outstanding invoices: {pendingPayments.length}</p>
            </div>
            <button
              onClick={() => showToast('Fee reminder notifications dispatched to parent registered mobile numbers!')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Send SMS Reminders to All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Invoice</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Outstanding Due</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.invoiceNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.studentName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{p.class}</td>
                    <td className="py-3 px-4 text-slate-500">{p.month}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">Rs. {p.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                      Rs. {p.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-rose-600">
                      Rs. {p.remainingAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setFormData({
                            ...p,
                            invoiceNo: `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`,
                            paidAmount: p.remainingAmount,
                            remainingAmount: 0,
                            status: 'Paid',
                          });
                          setShowCollectModal(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
                      >
                        Collect Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Fee Structure */}
      {activeTab === 'structure' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">Official Class-wise Fee Structure (2026–2027)</h3>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" /> Print Structure
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Admission Fee</th>
                  <th className="py-3 px-4">Tuition Fee</th>
                  <th className="py-3 px-4">Exam Fee</th>
                  <th className="py-3 px-4">Computer Lab</th>
                  <th className="py-3 px-4">Transport Fee</th>
                  <th className="py-3 px-4 font-extrabold text-slate-800 text-right">Total Monthly (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {feeStructures.map((fs) => (
                  <tr key={fs.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{fs.class}</td>
                    <td className="py-3 px-4 font-mono">Rs. {fs.admissionFee.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">Rs. {fs.tuitionFee.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">Rs. {fs.examFee.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">Rs. {fs.computerFee.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono">Rs. {fs.transportFee.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-indigo-700 text-right">
                      Rs. {fs.totalMonthlyFee.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-800">Collect Student Fee</h3>
              <button onClick={() => setShowCollectModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={formData.studentId || ''}
                  onChange={(e) => handleStudentSelectInForm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} (Roll: {st.rollNo} • {st.class})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNo || ''}
                    onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Month</label>
                  <input
                    type="text"
                    required
                    value={formData.month || 'October 2026'}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Description / Type</label>
                <input
                  type="text"
                  value={formData.feeType || 'Monthly Tuition & Computer Fee'}
                  onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Fee (PKR)</label>
                  <input
                    type="number"
                    value={formData.totalAmount || 0}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount (PKR)</label>
                  <input
                    type="number"
                    value={formData.discount || 0}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paid Now (PKR)</label>
                  <input
                    type="number"
                    value={formData.paidAmount || 0}
                    onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-indigo-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod || 'Cash'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold"
                  >
                    <option value="Cash">Cash at Counter</option>
                    <option value="Bank Transfer">Bank Transfer (Meezan/HBL)</option>
                    <option value="Online">Online / Portal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={formData.paymentDate || '2026-10-01'}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks || ''}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Optional payment notes"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Confirm & Print Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <FeeReceiptModal
        payment={selectedPaymentForReceipt}
        isOpen={!!selectedPaymentForReceipt}
        onClose={() => setSelectedPaymentForReceipt(null)}
      />
    </div>
  );
};
