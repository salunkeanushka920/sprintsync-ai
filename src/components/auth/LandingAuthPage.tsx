import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MultiStepRegisterModal } from './MultiStepRegisterModal';
import { AdminLoginPortal } from './AdminLoginPortal';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  Database,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingAuthPage: React.FC = () => {
  const {
    loginUser,
    loginAdmin,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isAdminPortalOpen,
    setIsAdminPortalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [identifier, setIdentifier] = useState('anushka@sprintsync.ai');
  const [password, setPassword] = useState('password123');
  const [adminPassword, setAdminPassword] = useState('shiv123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginUser(identifier, password);
    if (!success) {
      setErrorMsg('Invalid email/username or password! Try "anushka@sprintsync.ai" with "password123".');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(adminPassword);
    if (!success) {
      setErrorMsg('Access Denied. Invalid Admin Password. Try "shiv123" or "admin".');
    }
  };

  const handleQuickDemoLoginUser = () => {
    setIdentifier('anushka@sprintsync.ai');
    setPassword('password123');
    loginUser('anushka@sprintsync.ai', 'password123');
  };

  const handleQuickDemoLoginAdmin = () => {
    setAdminPassword('shiv123');
    loginAdmin('shiv123');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>SprintSync Hackathon Platform v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">SprintSync</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Personalized hackathon task management, real-time WhatsApp alerts, and Shiv's restricted admin control portal.
          </p>
        </div>

        {/* Main Card: Left Form, Right Credentials & Data Persistence Info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Authentic Login Form (8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-7 glass-panel bg-slate-950/95 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            {/* Tab Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveTab('user'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'user'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" /> User Workspace Login
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-300" /> Shiv Admin Portal
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form: User Login */}
            {activeTab === 'user' ? (
              <form onSubmit={handleUserSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">User Email or Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="anushka@sprintsync.ai"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 text-amber-300" /> Enter My Workspace <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Create New Account (3-Step Setup)
                  </button>
                </div>
              </form>
            ) : (
              /* Form: Admin Login */
              <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-200 text-xs">
                  👑 <strong>Shiv Admin Access</strong>: Dedicated control center for task assignment & user management.
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="Enter Shiv's admin password..."
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" /> Unlock Admin Operations
                </button>
              </form>
            )}

            {/* Quick Demo Fill Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Quick Demo Login:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLoginUser}
                  className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold hover:bg-indigo-900"
                >
                  Anushka (User)
                </button>
                <button
                  type="button"
                  onClick={handleQuickDemoLoginAdmin}
                  className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-800 text-purple-300 font-bold hover:bg-purple-900"
                >
                  Shiv (Admin)
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Credentials Box & Where Is Data Saved (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 space-y-4 flex flex-col justify-between"
          >
            {/* Quick Authentication Card */}
            <div className="glass-panel bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <KeyRound className="w-4 h-4" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                  Workspace Roles & Portals
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      👤 Anushka (Team Member)
                    </span>
                    <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-mono">
                      USER ROLE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Personal tasks, deadlines & WhatsApp alerts</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300 flex items-center gap-1.5">
                      👑 Shiv (Team Administrator)
                    </span>
                    <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded font-mono">
                      ADMIN (SHIV)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Task assignments, burndown & user controls</p>
                </div>
              </div>
            </div>

            {/* Where Is Data Saved Card */}
            <div className="glass-panel bg-gradient-to-br from-indigo-950/70 via-slate-950 to-purple-950/70 border border-indigo-500/30 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <HardDrive className="w-4 h-4" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                  Data Persistence & Storage
                </h3>
              </div>

              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Where is data saved?</strong> All user accounts, personal tasks, standups, and profile settings are stored securely in browser <strong>localStorage</strong>.
                  </span>
                </p>
                <p className="flex items-start gap-2 text-slate-400 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Data persists across page reloads & sessions, maintaining complete privacy for each user workspace.</span>
                </p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Multi-step Registration Modal */}
      <MultiStepRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => setIsRegisterModalOpen(false)}
      />

      {/* Admin Login Portal Modal */}
      <AdminLoginPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
};
