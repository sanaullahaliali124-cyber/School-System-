import React, { useState } from 'react';
import { X, Printer, School, Phone, Calendar, Heart, Shield, QrCode } from 'lucide-react';
import { Student, SchoolSettings } from '../../types';
import { getData, STORAGE_KEYS } from '../../services/storage';

interface StudentIDCardModalProps {
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
  singleStudent?: Student | null;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  students,
  isOpen,
  onClose,
  singleStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [cardSide, setCardSide] = useState<'both' | 'front' | 'back'>('both');

  if (!isOpen) return null;

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

  // Determine which students to render cards for
  const targetStudents = singleStudent
    ? [singleStudent]
    : selectedClass === 'All'
    ? students
    : students.filter((s) => s.class === selectedClass);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ID
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">
                {singleStudent ? `Student ID Card: ${singleStudent.fullName}` : 'Official Student ID Cards Generator'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {targetStudents.length} ID Card{targetStudents.length > 1 ? 's' : ''} ready for printing on PVC or card stock
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!singleStudent && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Filter Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="All">All Classes ({students.length})</option>
                  {Array.from(new Set(students.map((s) => s.class))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button
                onClick={() => setCardSide('both')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  cardSide === 'both' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Front & Back
              </button>
              <button
                onClick={() => setCardSide('front')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  cardSide === 'front' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Front Only
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print ID Cards
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable ID Cards Canvas */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-100/60 print-area print:p-0 print:bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {targetStudents.map((st) => (
              <div
                key={st.id}
                className="flex flex-col sm:flex-row gap-4 p-3 bg-white/40 rounded-3xl border border-slate-200/60 shadow-xs print:shadow-none print:border-none print:p-0 print:m-2 page-break-inside-avoid"
              >
                {/* ID Card Front Side */}
                {(cardSide === 'both' || cardSide === 'front') && (
                  <div className="w-[310px] h-[480px] bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 rounded-2xl shadow-xl overflow-hidden relative border-2 border-indigo-400/40 flex flex-col justify-between text-white shrink-0 print:border-slate-400 print:shadow-none">
                    {/* Top School Header */}
                    <div className="p-3 text-center bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-800 border-b border-indigo-500/40 relative">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white text-indigo-950 flex items-center justify-center font-black text-xs shadow-xs">
                          SM
                        </div>
                        <div className="text-left">
                          <h4 className="text-[11px] font-black uppercase tracking-tight text-white leading-tight">
                            THE SMART MODERN
                          </h4>
                          <p className="text-[9px] font-extrabold text-amber-300 tracking-wider">
                            PUBLIC SCHOOL QAMBER
                          </p>
                        </div>
                      </div>
                      <div className="text-[8px] text-indigo-200 mt-1 font-medium">
                        Reg: {settings.registrationNo} • Session {settings.currentSession}
                      </div>
                    </div>

                    {/* Student Identity Badge */}
                    <div className="text-center pt-2">
                      <span className="inline-block px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-amber-400 text-slate-950 shadow-xs">
                        STUDENT IDENTITY CARD
                      </span>
                    </div>

                    {/* Photo Container */}
                    <div className="flex justify-center my-1">
                      <div className="relative">
                        <img
                          src={
                            st.photo ||
                            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={st.fullName}
                          className="w-24 h-28 rounded-xl object-cover border-2 border-amber-300 shadow-md ring-2 ring-indigo-900/50"
                        />
                        <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] border border-white shadow-xs">
                          {st.bloodGroup || 'B+'}
                        </span>
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="px-4 text-center">
                      <h3 className="text-base font-black tracking-tight text-white leading-snug">
                        {st.fullName}
                      </h3>
                      <p className="text-[11px] text-indigo-200 font-semibold mt-0.5">
                        S/O / D/O: {st.fatherName}
                      </p>

                      <div className="mt-2.5 p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 grid grid-cols-2 gap-1.5 text-left text-[10px]">
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Admission No</span>
                          <span className="font-mono font-bold text-amber-300">{st.admissionNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Roll Number</span>
                          <span className="font-mono font-bold text-white">{st.rollNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Class & Sec</span>
                          <span className="font-bold text-white">{st.class} ({st.section})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Emergency Phone</span>
                          <span className="font-semibold text-indigo-200">{st.phone || st.emergencyContact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Hologram Bar / Signature */}
                    <div className="px-4 pb-3 pt-1 border-t border-white/10 flex items-center justify-between text-[8px]">
                      <div>
                        <div className="h-5 border-b border-dashed border-slate-400 w-20 flex items-end justify-center text-slate-300 italic text-[7px]">
                          Prof. G.R. Chandio
                        </div>
                        <span className="text-slate-400 font-bold block mt-0.5">Principal Sign</span>
                      </div>

                      <div className="text-right">
                        <span className="text-amber-300 font-bold block">VALID UPTO</span>
                        <span className="text-slate-300 font-mono">31-MAR-2027</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ID Card Back Side */}
                {(cardSide === 'both' || cardSide === 'back') && (
                  <div className="w-[310px] h-[480px] bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative border-2 border-slate-700/60 flex flex-col justify-between text-slate-200 p-4 shrink-0 print:border-slate-400 print:shadow-none text-[10px]">
                    {/* Magnetic Stripe / Tech Stripe */}
                    <div className="-mx-4 -mt-4 h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
                      <span className="text-[9px] font-mono text-slate-500 font-bold">SMPS-QBR-{st.rollNo}</span>
                      <span className="text-[8px] text-indigo-400 font-bold">OFFICIAL STUDENT PASS</span>
                    </div>

                    {/* Terms & Regulations */}
                    <div className="space-y-2 mt-2">
                      <h5 className="font-black text-xs text-white uppercase tracking-wider text-center border-b border-slate-800 pb-1">
                        Instructions & Guidelines
                      </h5>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[9px] leading-tight">
                        <li>This card is non-transferable and must be displayed on campus at all times.</li>
                        <li>Loss of this card must be reported immediately to the school administration office.</li>
                        <li>Duplicate card will be issued upon payment of PKR 500 replacement fee.</li>
                        <li>Required for library book checkouts, computer lab entry, and examination halls.</li>
                      </ol>
                    </div>

                    {/* Emergency Contacts & Address */}
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[9px] space-y-1">
                      <div className="font-bold text-amber-300 uppercase text-[8px]">
                        Campus Address & Helpline:
                      </div>
                      <p className="text-slate-300">{settings.address}</p>
                      <p className="text-indigo-300 font-medium">Helpline: {settings.phone}</p>
                      <p className="text-slate-400 font-mono">Web: {settings.website}</p>
                    </div>

                    {/* Barcode Simulation & Seal */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        {/* Barcode simulation */}
                        <div className="flex gap-[2px] items-center h-8 bg-white p-1 rounded">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 2, 1, 4, 2, 1].map((w, idx) => (
                            <div
                              key={idx}
                              className="bg-black h-full"
                              style={{ width: `${w}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 block mt-0.5 tracking-widest text-center">
                          *{st.admissionNo}*
                        </span>
                      </div>

                      <div className="w-12 h-12 rounded-full border border-indigo-500/40 flex items-center justify-center text-[7px] font-black text-indigo-300 uppercase text-center rotate-[-12deg]">
                        SMPS SEAL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
