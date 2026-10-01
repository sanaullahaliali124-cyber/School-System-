import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, School, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@smartmodern.edu.pk');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const sampleAccounts: { role: UserRole; title: string; email: string; pass: string; badge: string; desc: string }[] = [
    { role: 'admin', title: 'Admin', email: 'admin@smartmodern.edu.pk', pass: 'admin123', badge: 'bg-purple-100 text-purple-700', desc: 'Full System Access' },
    { role: 'principal', title: 'Principal', email: 'principal@smartmodern.edu.pk', pass: 'principal123', badge: 'bg-blue-100 text-blue-700', desc: 'Executive & Academic Lead' },
    { role: 'teacher', title: 'Teacher', email: 'teacher@smartmodern.edu.pk', pass: 'teacher123', badge: 'bg-emerald-100 text-emerald-700', desc: 'Classes, Marks & Homework' },
    { role: 'accountant', title: 'Accountant', email: 'accountant@smartmodern.edu.pk', pass: 'accountant123', badge: 'bg-amber-100 text-amber-700', desc: 'Fees & Payment Records' },
    { role: 'staff', title: 'Staff', email: 'staff@smartmodern.edu.pk', pass: 'staff123', badge: 'bg-slate-100 text-slate-700', desc: 'Admissions & Records' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email or username');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Please click any sample account below for demo access.');
    }
  };

  const handleQuickLogin = (acc: typeof sampleAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    login(acc.email, acc.pass, acc.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Left Side: School Branding & Aesthetics */}
        <div className="md:col-span-5 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-indigo-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-xl" />

          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/20 shadow-lg">
              <School className="w-8 h-8 text-indigo-200" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-3 uppercase tracking-wider">
              Management Portal
            </span>

            <h1 className="text-2xl font-black tracking-tight leading-tight">
              THE SMART MODERN PUBLIC SCHOOL
            </h1>
            <p className="text-indigo-200 text-sm font-semibold mt-1">
              QAMBER, SINDH
            </p>
            <p className="text-indigo-200/80 text-xs mt-4 leading-relaxed">
              Complete Cloud-Ready Educational ERP System for streamlined school administration, academic excellence, student records, and fee management.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-indigo-700/60 text-xs text-indigo-300/90 space-y-1">
            <div className="font-semibold text-white">Govt. Reg: SED-QBR-2018-4429</div>
            <div>Academic Session 2026–2027</div>
            <div className="text-[11px] text-indigo-400 mt-2">
              Protected by Role-Based Access Control
            </div>
          </div>
        </div>

        {/* Right Side: Login Form & Quick Switcher */}
        <div className="md:col-span-7 p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Enter your authorized staff or teacher credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. admin@smartmodern.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs text-slate-600 font-medium">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Demo Accounts Quick-Select */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Demo Accounts (Click to Login Instantly)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Demo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {sampleAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition text-left cursor-pointer group"
                >
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${acc.badge} shrink-0`}>
                    {acc.title}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-700 group-hover:text-indigo-600 truncate">
                      {acc.desc}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Password Recovery</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered official email. In demo mode, a reset link simulation will be verified.
            </p>

            {forgotSuccess ? (
              <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Password reset token sent to your email! (Demo simulator)</span>
              </div>
            ) : (
              <div className="my-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@smartmodern.edu.pk"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSuccess(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
