import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Download,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Palette,
} from 'lucide-react';
import { Student, SchoolSettings, SchoolClass } from '../../types';
import { getData, STORAGE_KEYS, exportToExcel } from '../../services/storage';
import { useToast } from '../common/Toast';

export const StudentIDCardsStudioView: React.FC = () => {
  const { showToast } = useToast();

  const students = getData<Student[]>(STORAGE_KEYS.STUDENTS, []);
  const classes = getData<SchoolClass[]>(STORAGE_KEYS.CLASSES, []);
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

  // State Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [cardTheme, setCardTheme] = useState<'navy' | 'emerald' | 'crimson' | 'slate'>('navy');
  const [cardSide, setCardSide] = useState<'both' | 'front' | 'back'>('both');
  const [validUntil, setValidUntil] = useState('31-MAR-2027');
  const [showQrBarcode, setShowQrBarcode] = useState(true);
  const [showPrincipalSign, setShowPrincipalSign] = useState(true);

  // Selected Student IDs for printing
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(() =>
    students.map((s) => s.id)
  );

  // Filtered student list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || s.class === filterClass;
    const matchesGender = filterGender === 'All' || s.gender === filterGender;
    return matchesSearch && matchesClass && matchesGender;
  });

  // Target students to display ID cards for
  const displayedStudents = filteredStudents.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const ids = filteredStudents.map((s) => s.id);
    setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...ids])));
    showToast(`Selected all ${filteredStudents.length} students for ID card printing`);
  };

  const handleDeselectAll = () => {
    setSelectedStudentIds([]);
    showToast('Cleared student selection');
  };

  const handlePrint = () => {
    if (displayedStudents.length === 0) {
      alert('Please select at least one student to print ID cards.');
      return;
    }
    window.print();
  };

  const handleExportExcel = () => {
    const rows = displayedStudents.map((st) => ({
      'Card ID': `CRD-${st.rollNo}-${st.admissionNo}`,
      'Admission No': st.admissionNo,
      'Student Name': st.fullName,
      'Father Name': st.fatherName,
      Class: st.class,
      Section: st.section,
      'Roll No': st.rollNo,
      Gender: st.gender,
      'Blood Group': st.bloodGroup || 'B+',
      'Emergency Contact': st.phone || st.emergencyContact,
      Session: settings.currentSession,
      'Valid Upto': validUntil,
      'Campus Address': st.address || 'Qamber, Sindh',
    }));
    exportToExcel('SMPS_Student_ID_Cards_Registry', rows, 'ID Card Registry');
    showToast('Exported student ID cards list to Excel (.xlsx)');
  };

  // Color theme definitions
  const themeStyles = {
    navy: {
      cardGradient: 'from-indigo-900 via-indigo-950 to-slate-950',
      headerBg: 'from-indigo-800 via-indigo-700 to-indigo-800',
      border: 'border-indigo-400/40',
      accentText: 'text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950',
      tagText: 'text-indigo-200',
      secondaryText: 'text-indigo-200',
      sealBorder: 'border-indigo-500/40',
      sealText: 'text-indigo-300',
    },
    emerald: {
      cardGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      headerBg: 'from-emerald-800 via-teal-700 to-emerald-800',
      border: 'border-emerald-400/40',
      accentText: 'text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950',
      tagText: 'text-emerald-200',
      secondaryText: 'text-emerald-200',
      sealBorder: 'border-emerald-500/40',
      sealText: 'text-emerald-300',
    },
    crimson: {
      cardGradient: 'from-rose-950 via-slate-950 to-slate-950',
      headerBg: 'from-rose-900 via-rose-800 to-rose-900',
      border: 'border-rose-400/40',
      accentText: 'text-amber-300',
      badgeBg: 'bg-amber-400 text-slate-950',
      tagText: 'text-rose-200',
      secondaryText: 'text-rose-200',
      sealBorder: 'border-rose-500/40',
      sealText: 'text-rose-300',
    },
    slate: {
      cardGradient: 'from-slate-900 via-slate-950 to-black',
      headerBg: 'from-slate-800 via-slate-700 to-slate-800',
      border: 'border-cyan-400/40',
      accentText: 'text-cyan-300',
      badgeBg: 'bg-cyan-400 text-slate-950',
      tagText: 'text-cyan-200',
      secondaryText: 'text-slate-300',
      sealBorder: 'border-cyan-500/40',
      sealText: 'text-cyan-300',
    },
  };

  const currentTheme = themeStyles[cardTheme];

  return (
    <div className="space-y-6">
      {/* Top Banner (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-800">
                Official Student ID Cards Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] tracking-wide uppercase">
                PVC Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generate, customize, and batch-print official identity cards for The Smart Modern Public School Qamber
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
            title="Download ID cardholder directory in Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export to Excel
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print ID Cards ({displayedStudents.length})
          </button>
        </div>
      </div>

      {/* Control Studio Bar (Hidden in Print) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 no-print">
        {/* Row 1: Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name, roll, father..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
            >
              <option value="All">All Classes ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Valid Upto (e.g. 31-MAR-2027)"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-semibold border border-slate-200 focus:outline-none"
              title="Card Validity Expiry Date"
            />
          </div>
        </div>

        {/* Row 2: Customization & Appearance Options */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Card Side Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Card Sides:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCardSide('both')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  cardSide === 'both' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front & Back
              </button>
              <button
                onClick={() => setCardSide('front')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  cardSide === 'front' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front Only
              </button>
              <button
                onClick={() => setCardSide('back')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  cardSide === 'back' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Back Only
              </button>
            </div>
          </div>

          {/* Theme Palette */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-indigo-500" /> Color Theme:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { key: 'navy', label: 'Navy & Gold', color: 'bg-indigo-900' },
                { key: 'emerald', label: 'Emerald', color: 'bg-emerald-800' },
                { key: 'crimson', label: 'Crimson', color: 'bg-rose-900' },
                { key: 'slate', label: 'Dark Slate', color: 'bg-slate-900' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setCardTheme(t.key as any)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    cardTheme === t.key
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Selection Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllFiltered}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" /> Select All ({filteredStudents.length})
            </button>
            <button
              onClick={handleDeselectAll}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showQrBarcode}
              onChange={(e) => setShowQrBarcode(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include QR / Barcode Verification</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showPrincipalSign}
              onChange={(e) => setShowPrincipalSign(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Include Principal Signature & Seal</span>
          </label>
        </div>
      </div>

      {/* Cards Canvas Container */}
      <div className="bg-slate-200/50 p-6 sm:p-8 rounded-3xl border border-slate-200 print:bg-white print:p-0 print:border-none">
        {displayedStudents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Student Selected for ID Cards</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Please check the student checkboxes or click "Select All" above to render cards.
            </p>
            <button
              onClick={handleSelectAllFiltered}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Select All Students
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 justify-items-center print:block">
            {displayedStudents.map((st) => (
              <div
                key={st.id}
                className="flex flex-col sm:flex-row gap-5 p-4 bg-white/70 backdrop-blur-xs rounded-3xl border border-slate-300/70 shadow-sm print:shadow-none print:border-none print:p-0 print:m-4 page-break-inside-avoid relative group"
              >
                {/* Checkbox badge (Hidden in print) */}
                <button
                  onClick={() => toggleSelectStudent(st.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-indigo-600 hover:bg-white shadow-xs border border-slate-200 no-print z-10 cursor-pointer"
                  title="Toggle card selection"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>

                {/* Card Front Side */}
                {(cardSide === 'both' || cardSide === 'front') && (
                  <div
                    className={`w-[315px] h-[485px] bg-gradient-to-b ${currentTheme.cardGradient} rounded-2xl shadow-xl overflow-hidden relative border-2 ${currentTheme.border} flex flex-col justify-between text-white shrink-0 print:border-slate-400 print:shadow-none transition-transform hover:scale-[1.01]`}
                  >
                    {/* Top School Header */}
                    <div
                      className={`p-3 text-center bg-gradient-to-r ${currentTheme.headerBg} border-b border-white/10 relative`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                          SM
                        </div>
                        <div className="text-left">
                          <h4 className="text-[11px] font-black uppercase tracking-tight text-white leading-tight">
                            THE SMART MODERN
                          </h4>
                          <p className={`text-[9px] font-extrabold ${currentTheme.accentText} tracking-wider`}>
                            PUBLIC SCHOOL QAMBER
                          </p>
                        </div>
                      </div>
                      <div className={`text-[8px] ${currentTheme.tagText} mt-1 font-medium`}>
                        Reg: {settings.registrationNo} • Session {settings.currentSession}
                      </div>
                    </div>

                    {/* Student Identity Badge */}
                    <div className="text-center pt-2">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase ${currentTheme.badgeBg} shadow-xs`}
                      >
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
                      <p className={`text-[11px] ${currentTheme.secondaryText} font-semibold mt-0.5`}>
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
                          <span className={`font-semibold ${currentTheme.tagText}`}>
                            {st.phone || st.emergencyContact}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Hologram Bar / Signature */}
                    <div className="px-4 pb-3 pt-1 border-t border-white/10 flex items-center justify-between text-[8px]">
                      <div>
                        {showPrincipalSign ? (
                          <>
                            <div className="h-5 border-b border-dashed border-slate-400 w-20 flex items-end justify-center text-slate-300 italic text-[7px]">
                              {settings.principalName.split(' ')[1] || 'G.R. Chandio'}
                            </div>
                            <span className="text-slate-400 font-bold block mt-0.5">Principal Sign</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-bold block mt-3">Authorized Sign</span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-amber-300 font-bold block">VALID UPTO</span>
                        <span className="text-slate-300 font-mono">{validUntil}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Back Side */}
                {(cardSide === 'both' || cardSide === 'back') && (
                  <div className="w-[315px] h-[485px] bg-slate-900 rounded-2xl shadow-xl overflow-hidden relative border-2 border-slate-700/60 flex flex-col justify-between text-slate-200 p-4 shrink-0 print:border-slate-400 print:shadow-none text-[10px]">
                    {/* Magnetic Stripe / Tech Stripe */}
                    <div className="-mx-4 -mt-4 h-9 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
                      <span className="text-[9px] font-mono text-slate-500 font-bold">
                        SMPS-QBR-{st.rollNo}
                      </span>
                      <span className="text-[8px] text-indigo-400 font-bold">
                        OFFICIAL STUDENT PASS
                      </span>
                    </div>

                    {/* Terms & Regulations */}
                    <div className="space-y-2 mt-2">
                      <h5 className="font-black text-xs text-white uppercase tracking-wider text-center border-b border-slate-800 pb-1">
                        Instructions & Guidelines
                      </h5>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[9px] leading-tight">
                        <li>This identity card is non-transferable and must be worn inside campus at all times.</li>
                        <li>Loss of this card must be immediately reported to the Administration Office.</li>
                        <li>Card replacement fee is PKR 500 for duplicate card re-issuance.</li>
                        <li>Compulsory for library borrowings, science laboratory access and exam hall entrance.</li>
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
                      {showQrBarcode ? (
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
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono">{st.admissionNo}</span>
                      )}

                      <div
                        className={`w-12 h-12 rounded-full border ${currentTheme.sealBorder} flex items-center justify-center text-[7px] font-black ${currentTheme.sealText} uppercase text-center rotate-[-12deg]`}
                      >
                        SMPS SEAL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
