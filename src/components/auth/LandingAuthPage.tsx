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
  ArrowRight,
  ShieldAlert
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
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginUser(identifier, password);
    if (!success) {
      setErrorMsg('Invalid email/username or password! Please check your credentials or create a new account.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(adminPassword);
    if (!success) {
      setErrorMsg('Access Denied. Invalid Admin Password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-xl w-full mx-auto space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>SprintSync Project Workspace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight leading-[1.15]">
            Manage Sprint Deliverables, Team Tasks & WhatsApp Alerts
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Personalized project task management, real-time WhatsApp alerts, and restricted admin control portal.
          </p>
        </div>

        {/* Main Card: Centered Authentic Authentication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel bg-slate-950/95 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
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
              <ShieldCheck className="w-4 h-4 text-purple-300" /> Admin Portal
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
            <div className="space-y-4">
              <form onSubmit={handleUserSubmit} autoComplete="off" className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">User Email or Username</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      name="sprintsync_no_autofill_user"
                      autoComplete="off"
                      placeholder="e.g. user@domain.com"
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
                      name="sprintsync_no_autofill_pass"
                      autoComplete="new-password"
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
            </div>
          ) : (
            /* Form: Admin Login */
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-200 text-xs">
                👑 <strong>Admin Access</strong>: Dedicated control center for task assignment & user management.
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password..."
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

        </motion.div>
      </div>

      {/* Multi-step Registration Wizard */}
      <MultiStepRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setActiveTab('user');
        }}
      />

      {/* Dedicated Admin Portal */}
      <AdminLoginPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
};
