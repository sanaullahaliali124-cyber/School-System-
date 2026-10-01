import React, { useState, useEffect } from 'react';
import { Search, X, User, GraduationCap, Users, BookOpen, Bell, Receipt, ArrowRight } from 'lucide-react';
import { getData, STORAGE_KEYS } from '../../services/storage';
import { Student, Teacher, Staff, SchoolNotice, FeePayment } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string, entityId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const teachers = getData<Teacher[]>(STORAGE_KEYS.TEACHERS, []);
  const staff = getData<Staff[]>(STORAGE_KEYS.STAFF, []);
  const notices = getData<SchoolNotice[]>(STORAGE_KEYS.NOTICES, []);
  const fees = getData<FeePayment[]>(STORAGE_KEYS.FEE_PAYMENTS, []);

  const cleanQuery = query.trim().toLowerCase();

  const matchedStudents = cleanQuery
    ? students
        .filter(
          (s) =>
            s.fullName.toLowerCase().includes(cleanQuery) ||
            s.admissionNo.toLowerCase().includes(cleanQuery) ||
            s.class.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 4)
    : [];

  const matchedTeachers = cleanQuery
    ? teachers
        .filter(
          (t) =>
            t.name.toLowerCase().includes(cleanQuery) ||
            t.designation.toLowerCase().includes(cleanQuery) ||
            t.assignedSubjects.some((sub) => sub.toLowerCase().includes(cleanQuery))
        )
        .slice(0, 4)
    : [];

  const matchedStaff = cleanQuery
    ? staff
        .filter(
          (st) =>
            st.name.toLowerCase().includes(cleanQuery) ||
            st.position.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchedNotices = cleanQuery
    ? notices
        .filter(
          (n) =>
            n.title.toLowerCase().includes(cleanQuery) ||
            n.description.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const matchedFees = cleanQuery
    ? fees
        .filter(
          (f) =>
            f.invoiceNo.toLowerCase().includes(cleanQuery) ||
            f.studentName.toLowerCase().includes(cleanQuery)
        )
        .slice(0, 3)
    : [];

  const totalResults =
    matchedStudents.length +
    matchedTeachers.length +
    matchedStaff.length +
    matchedNotices.length +
    matchedFees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search students, teachers, staff, fees, notices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/80 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-10 text-center text-slate-400 text-xs">
              <p>Type student name, admission number, teacher name, or invoice number...</p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">Ali Raza</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">Grade 10</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">INV-2026-1001</span>
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No results found for "<span className="font-semibold text-slate-700">{query}</span>"
            </div>
          )}

          {matchedStudents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                Students ({matchedStudents.length})
              </div>
              <div className="space-y-1">
                {matchedStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      onNavigate('students', st.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-indigo-50/70 rounded-xl transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.photo}
                        alt={st.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                          {st.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Roll: {st.rollNo} • {st.class} ({st.section}) • ID: {st.admissionNo}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedTeachers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                Teachers ({matchedTeachers.length})
              </div>
              <div className="space-y-1">
                {matchedTeachers.map((tch) => (
                  <button
                    key={tch.id}
                    onClick={() => {
                      onNavigate('teachers', tch.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-emerald-50/70 rounded-xl transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={tch.photo}
                        alt={tch.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                          {tch.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {tch.designation} • {tch.assignedSubjects.join(', ')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedStaff.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                Staff ({matchedStaff.length})
              </div>
              <div className="space-y-1">
                {matchedStaff.map((stf) => (
                  <button
                    key={stf.id}
                    onClick={() => {
                      onNavigate('staff', stf.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-amber-50/70 rounded-xl transition text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-700">
                        {stf.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        Position: {stf.position} • {stf.phone}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedFees.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <Receipt className="w-3.5 h-3.5 text-purple-500" />
                Fee Payments ({matchedFees.length})
              </div>
              <div className="space-y-1">
                {matchedFees.map((fee) => (
                  <button
                    key={fee.id}
                    onClick={() => {
                      onNavigate('fees', fee.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-purple-50/70 rounded-xl transition text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-700">
                        {fee.invoiceNo} - {fee.studentName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Amount: Rs. {fee.paidAmount.toLocaleString()} • Status: {fee.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedNotices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                <Bell className="w-3.5 h-3.5 text-sky-500" />
                Notices ({matchedNotices.length})
              </div>
              <div className="space-y-1">
                {matchedNotices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onNavigate('notices', n.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 hover:bg-sky-50/70 rounded-xl transition text-left cursor-pointer group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 group-hover:text-sky-700">
                        {n.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">{n.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Global Search across all school records</span>
          <span>THE SMART MODERN PUBLIC SCHOOL QAMBER</span>
        </div>
      </div>
    </div>
  );
};
