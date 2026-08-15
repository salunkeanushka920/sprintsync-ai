import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { TeamMembersView } from './components/members/TeamMembersView';
import { StandupModule } from './components/standup/StandupModule';
import { GitHubIntegration } from './components/github/GitHubIntegration';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SprintTimeline } from './components/calendar/SprintTimeline';
import { SprintWorkspacesView } from './components/calendar/SprintWorkspacesView';
import { WhatsAppSimulator } from './components/notifications/WhatsAppSimulator';
import { SettingsView } from './components/settings/SettingsView';
import { ProfileSettings } from './components/user/ProfileSettings';
import { AttendanceModule } from './components/attendance/AttendanceModule';

import { CommandPalette } from './components/ai/CommandPalette';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { AdminAuthModal } from './components/auth/AdminAuthModal';
import { UserLoginModal } from './components/auth/UserLoginModal';
import { MultiStepRegisterModal } from './components/auth/MultiStepRegisterModal';
import { AdminLoginPortal } from './components/auth/AdminLoginPortal';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    currentUser,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isAdminPortalOpen,
    setIsAdminPortalOpen
  } = useApp();

  const isLight = currentUser?.themePreference === 'light';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentRole === 'admin' ? <AdminDashboard /> : <UserDashboard />;
      case 'profile':
        return <ProfileSettings />;
      case 'kanban':
        return <KanbanBoard />;
      case 'attendance':
        return <AttendanceModule />;
      case 'members':
        return <TeamMembersView />;
      case 'standup':
        return <StandupModule />;
      case 'github':
        return <GitHubIntegration />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'timeline':
        return <SprintTimeline />;
      case 'sprints':
        return <SprintWorkspacesView />;
      case 'whatsapp':
        return <WhatsAppSimulator />;
      case 'settings':
        return <SettingsView />;
      default:
        return currentRole === 'admin' ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'light-theme bg-slate-100 text-slate-900' : 'bg-[#0B1020] text-slate-100'} flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300`}>
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Collapsible Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 pb-28 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentRole}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Command Palette Overlay */}
      <CommandPalette />

      {/* AI Assistant Modal Overlay */}
      <AIAssistantModal />

      {/* Admin Password Security Modal */}
      <AdminAuthModal />

      {/* User Login Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onOpenAdminPortal={() => {
          setIsLoginModalOpen(false);
          setIsAdminPortalOpen(true);
        }}
      />

      {/* Multi-step Registration Wizard */}
      <MultiStepRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Dedicated Shiv Admin Portal */}
      <AdminLoginPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* Quick WhatsApp Modal Popup if opened from Navbar */}
      <AnimatePresence>
        {isWhatsAppModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl glass-panel bg-slate-950/95 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <WhatsAppSimulator />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { LandingAuthPage } from './components/auth/LandingAuthPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <MainLayout /> : <LandingAuthPage />;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
