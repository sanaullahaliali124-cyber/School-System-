import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  School,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, AppNotification } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';

interface TopbarProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onNavigate: (module: string) => void;
  currentModule: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onNavigate,
  currentModule,
}) => {
  const { currentUser, switchRole, logout } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const notifications = getData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
    setShowNotificationMenu(false);
  };

  const roles: { role: UserRole; title: string; color: string }[] = [
    { role: 'admin', title: 'Admin (Full Access)', color: 'bg-purple-100 text-purple-700' },
    { role: 'principal', title: 'Principal (Executive)', color: 'bg-blue-100 text-blue-700' },
    { role: 'teacher', title: 'Teacher (Academics)', color: 'bg-emerald-100 text-emerald-700' },
    { role: 'accountant', title: 'Accountant (Fees)', color: 'bg-amber-100 text-amber-700' },
    { role: 'staff', title: 'Staff (Registrar/Clerk)', color: 'bg-slate-100 text-slate-700' },
  ];

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'principal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'teacher':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'accountant':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'staff':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 tracking-tight">
              <School className="w-4 h-4 text-indigo-600" />
              SMPS QAMBER
            </span>
            <span className="text-slate-300">/</span>
            <span className="capitalize font-semibold text-indigo-600">
              {currentModule.replace('-', ' ')}
            </span>
            <span className="hidden md:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Session 2026–2027
            </span>
          </div>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search students, teachers, fees, notices...</span>
              <span className="sm:hidden">Quick Search...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Role Switcher, Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowProfileMenu(false);
                setShowNotificationMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${getRoleBadge(
                currentUser?.role
              )}`}
              title="Switch demo role to inspect permissions"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="capitalize">{currentUser?.role || 'Guest'}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Active Role (Demo)
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchRole(r.role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition cursor-pointer ${
                      currentUser?.role === r.role ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.title}</span>
                    {currentUser?.role === r.role && <CheckCircle className="w-4 h-4 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationMenu(!showNotificationMenu);
                setShowRoleDropdown(false);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} new)</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition hover:bg-slate-50 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-800">{n.title}</div>
                      <p className="text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
                <div className="px-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setShowNotificationMenu(false);
                    }}
                    className="w-full py-1.5 text-center text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    View All Notifications <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowRoleDropdown(false);
                setShowNotificationMenu(false);
              }}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
            >
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
                }
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser?.name?.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {currentUser?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-800">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser?.email}</div>
                  <div className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                    {currentUser?.designation || currentUser?.role}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                  >
                    School Settings
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('reports');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                  >
                    Reports & Analytics
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-xs text-left text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
