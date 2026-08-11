import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  CheckCheck,
  Plus,
  Settings,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsCommandPaletteOpen,
    setIsWhatsAppModalOpen,
    setIsAIAssistantOpen,
    setIsCreateTaskOpen,
    setIsRegisterModalOpen,
    setIsLoginModalOpen,
    setIsAdminPortalOpen,
    logoutUser,
    whatsAppMessages,
    sprint,
    tasks,
    setActiveTab
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // User-specific notifications filtering
  const userNotifs = notifications.filter(n => n.userId === currentUser.id || n.type === 'announcement');
  const unreadNotifs = userNotifs.filter(n => !n.read);

  // User-specific task progress
  const myTasks = tasks.filter(t => t.assignedToIds.includes(currentUser.id));
  const completedTasksCount = myTasks.filter(t => t.status === 'completed').length;
  const sprintProgress = Math.round((completedTasksCount / (myTasks.length || 1)) * 100);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand & Sprint Status */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-[1.5px] glow-blue">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  SprintSync
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Personal Hackathon Hub
              </p>
            </div>
          </div>

          {/* Active Sprint Badge */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">{sprint.name}</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${sprintProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">{sprintProgress}%</span>
          </div>
        </div>

        {/* Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 text-slate-400 text-sm transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span>Search my tasks, deadlines, or AI query...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Create Task */}
          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* AI Assistant Floating Trigger */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            title="Ask AI Productivity Assistant"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="hidden lg:inline">AI Copilot</span>
          </button>

          {/* WhatsApp Simulator Button */}
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 transition-all hover:bg-emerald-950/20"
            title="WhatsApp Notifications"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            {whatsAppMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                {whatsAppMessages.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel bg-slate-950/95 border border-slate-800 shadow-2xl p-4 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-slate-100">My Notifications</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                        {unreadNotifs.length} new
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2.5 py-3">
                    {userNotifs.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-6">No notifications yet</p>
                    ) : (
                      userNotifs.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read
                              ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                              : 'bg-slate-900 border-indigo-500/30 hover:border-indigo-500/60 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-slate-200">{n.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-400 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/40"
              />
              <span className="text-xs font-semibold text-slate-200 hidden md:block max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel bg-slate-950/95 border border-slate-800 shadow-2xl p-3 z-50 space-y-1"
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-2">
                    <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">@{currentUser.username}</p>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-md mt-1 inline-block">
                      {currentRole === 'admin' ? 'Shiv Admin Portal' : 'Personal Workspace'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRegisterModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>Create New Workspace</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4 text-purple-400" />
                    <span>Switch User Account</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1.5 px-3 py-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>

                    <button
                      onClick={() => {
                        setIsAdminPortalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="text-[10px] text-slate-600 hover:text-indigo-400 underline px-2 py-1"
                      title="Shiv Restricted Admin Access"
                    >
                      Admin
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </header>
  );
};
