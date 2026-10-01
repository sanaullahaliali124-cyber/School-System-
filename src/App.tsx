import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { TeachersView } from './components/teachers/TeachersView';
import { StaffView } from './components/staff/StaffView';
import { ParentsView } from './components/parents/ParentsView';
import { ClassesView } from './components/classes/ClassesView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { TimetableView } from './components/timetable/TimetableView';
import { HomeworkView } from './components/homework/HomeworkView';
import { ExamsView } from './components/exams/ExamsView';
import { FeesView } from './components/fees/FeesView';
import { AdmissionsView } from './components/admissions/AdmissionsView';
import { LeavesView } from './components/leaves/LeavesView';
import { NoticesView } from './components/notices/NoticesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { UsersView } from './components/users/UsersView';

const AppContent: React.FC = () => {
  const { isAuthenticated, hasAccess } = useAuth();

  const [currentModule, setCurrentModule] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If not logged in, render high fidelity Login Portal
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Ensure current module is accessible; otherwise fallback to dashboard
  const activeModule = hasAccess(currentModule) ? currentModule : 'dashboard';

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView onNavigate={(mod) => setCurrentModule(mod)} />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'staff':
        return <StaffView />;
      case 'parents':
        return <ParentsView />;
      case 'classes':
        return <ClassesView />;
      case 'subjects':
        return <SubjectsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'timetable':
        return <TimetableView />;
      case 'homework':
        return <HomeworkView />;
      case 'exams':
        return <ExamsView />;
      case 'fees':
        return <FeesView />;
      case 'admissions':
        return <AdmissionsView />;
      case 'leaves':
        return <LeavesView />;
      case 'notices':
        return <NoticesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      case 'users':
        return <UsersView />;
      default:
        return <DashboardView onNavigate={(mod) => setCurrentModule(mod)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Collapsible / Responsive Sidebar */}
      <Sidebar
        currentModule={activeModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Navigation */}
        <Topbar
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={(mod) => setCurrentModule(mod)}
          currentModule={activeModule}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderModuleContent()}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(mod) => setCurrentModule(mod)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
