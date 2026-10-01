import React from 'react';
import { X, Printer, School, CheckCircle2, Receipt } from 'lucide-react';
import { FeePayment, SchoolSettings } from '../../types';
import { getData, STORAGE_KEYS } from '../../services/storage';

interface FeeReceiptModalProps {
  payment: FeePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !payment) return null;

  const settings = getData<SchoolSettings>(STORAGE_KEYS.SETTINGS, {
    schoolName: 'THE SMART MODERN PUBLIC SCHOOL QAMBER',
    tagline: 'Excellence in Education, Character Building & Modern Innovation',
    logoUrl: '',
    address: 'Main By-pass Road, Qamber, Sindh, Pakistan',
    phone: '+92 74 1234567',
    email: 'info@smartmodernqamber.edu.pk',
    website: 'www.smartmodernqamber.edu.pk',
    principalName: 'Prof. Ghulam Rasool Chandio',
    registrationNo: 'SED-QBR-2018-4429',
    currentSession: '2026–2027',
    currency: 'PKR',
    dateFormat: 'DD/MM/YYYY',
    passingPercentage: 50,
    gradingScale: [],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Controls (Hidden in Print) */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Official Fee Challan & Payment Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Challan / Receipt
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt */}
        <div className="p-8 overflow-y-auto flex-1 print-area bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-xs">
                SM
              </div>
              <div className="text-left">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                  {settings.schoolName}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  {settings.address} • Phone: {settings.phone} • Reg: {settings.registrationNo}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs px-2 pt-2 border-t border-slate-200">
              <span className="font-bold text-emerald-700 uppercase tracking-wider">
                FEE PAYMENT RECEIPT (OFFICE & STUDENT COPY)
              </span>
              <span className="font-mono text-slate-500">Date: {payment.paymentDate}</span>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Invoice No</span>
              <p className="font-mono font-bold text-slate-900">{payment.invoiceNo}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fee Month</span>
              <p className="font-bold text-slate-800">{payment.month}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Payment Method</span>
              <p className="font-semibold text-slate-800">{payment.paymentMethod}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Payment Status</span>
              <p className="font-bold text-emerald-700 uppercase">{payment.status}</p>
            </div>
          </div>

          {/* Student Particulars */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs mb-5">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Student Full Name:</span>
              <span className="font-bold text-slate-900">{payment.studentName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Admission / Student ID:</span>
              <span className="font-semibold text-indigo-700">{payment.admissionNo}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Class & Section:</span>
              <span className="font-bold text-slate-800">{payment.class} - {payment.section}</span>
            </div>
          </div>

          {/* Fee Itemization Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden mb-5">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-800">{payment.feeType}</td>
                <td className="py-2 px-3 text-right font-mono font-semibold">
                  Rs. {payment.totalAmount.toLocaleString()}
                </td>
              </tr>
              {payment.discount > 0 && (
                <tr className="text-emerald-700">
                  <td className="py-2 px-3">Approved Concession / Scholarship Discount</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    - Rs. {payment.discount.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
              <tr>
                <td className="py-2.5 px-3 text-slate-900">Total Net Payable:</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">
                  Rs. {(payment.totalAmount - payment.discount).toLocaleString()}
                </td>
              </tr>
              <tr className="text-emerald-800 text-sm">
                <td className="py-2.5 px-3">Amount Paid:</td>
                <td className="py-2.5 px-3 text-right font-mono font-black">
                  Rs. {payment.paidAmount.toLocaleString()}
                </td>
              </tr>
              {payment.remainingAmount > 0 ? (
                <tr className="text-rose-700">
                  <td className="py-2 px-3">Outstanding Balance Due:</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    Rs. {payment.remainingAmount.toLocaleString()}
                  </td>
                </tr>
              ) : (
                <tr className="text-emerald-700 text-[11px]">
                  <td className="py-1 px-3">Balance:</td>
                  <td className="py-1 px-3 text-right font-bold">NIL (Fully Cleared)</td>
                </tr>
              )}
            </tfoot>
          </table>

          {payment.remarks && (
            <div className="p-3 rounded-lg bg-slate-50 border text-[11px] text-slate-500 mb-6">
              <span className="font-bold">Transaction Note:</span> {payment.remarks}
            </div>
          )}

          {/* Footer Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-center text-xs mt-6 page-break-inside-avoid">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto max-w-[140px] flex items-end justify-center pb-1 text-slate-400 italic">
                Depositor / Guardian
              </div>
              <p className="font-bold text-slate-700 mt-2">Depositor Signature</p>
            </div>

            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mx-auto max-w-[140px] flex items-end justify-center pb-1 text-slate-500 italic font-semibold">
                Mr. Shahzaib Mangi
              </div>
              <p className="font-bold text-slate-700 mt-2">Accounts Officer Signature & Stamp</p>
              <span className="text-[10px] text-slate-400">SMPS Qamber Finance Wing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
