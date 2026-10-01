import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  HeartHandshake,
  School,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  Award,
  CreditCard,
  UserPlus,
  CalendarOff,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  moduleKey: string;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, hasAccess, logout } = useAuth();

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, moduleKey: 'dashboard' },
      ],
    },
    {
      title: 'Academics',
      items: [
        { id: 'students', label: 'Students', icon: GraduationCap, moduleKey: 'students' },
        { id: 'id_cards', label: 'Student ID Cards', icon: CreditCard, moduleKey: 'students', badge: 'ID' },
        { id: 'teachers', label: 'Teachers', icon: Users, moduleKey: 'teachers' },
        { id: 'staff', label: 'Staff Directory', icon: UserCheck, moduleKey: 'staff' },
        { id: 'parents', label: 'Parents', icon: HeartHandshake, moduleKey: 'parents' },
        { id: 'classes', label: 'Classes & Sections', icon: School, moduleKey: 'classes' },
        { id: 'subjects', label: 'Subjects', icon: BookOpen, moduleKey: 'subjects' },
        { id: 'timetable', label: 'Timetable', icon: CalendarDays, moduleKey: 'timetable' },
        { id: 'homework', label: 'Homework', icon: FileSpreadsheet, moduleKey: 'homework' },
      ],
    },
    {
      title: 'Assessment & Attendance',
      items: [
        { id: 'attendance', label: 'Attendance', icon: CalendarCheck, moduleKey: 'attendance' },
        { id: 'exams', label: 'Exams & Results', icon: Award, moduleKey: 'exams' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'fees', label: 'Fees & Finance', icon: CreditCard, moduleKey: 'fees' },
        { id: 'admissions', label: 'Admissions', icon: UserPlus, moduleKey: 'admissions', badge: 'New' },
        { id: 'leaves', label: 'Leave Requests', icon: CalendarOff, moduleKey: 'leaves' },
        { id: 'notices', label: 'Notices & Circulars', icon: Bell, moduleKey: 'notices' },
      ],
    },
    {
      title: 'System & Reports',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, moduleKey: 'reports' },
        { id: 'users', label: 'User Roles & Access', icon: ShieldCheck, moduleKey: 'users' },
        { id: 'settings', label: 'School Settings', icon: Settings, moduleKey: 'settings' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
              SM
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <div className="font-extrabold text-white text-xs tracking-wide">
                  SMPS QAMBER
                </div>
                <div className="text-[10px] text-indigo-400 font-medium truncate">
                  The Smart Modern Public School
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card Pill (When Expanded) */}
        {!isCollapsed && currentUser && (
          <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/50"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-indigo-400 capitalize font-medium">
                {currentUser.role} Account
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navSections.map((section, idx) => {
            // Filter items user can access
            const accessibleItems = section.items.filter((item) => hasAccess(item.moduleKey));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {section.title}
                  </div>
                )}
                {accessibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        onCloseMobile();
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/20">
          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 transition cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
