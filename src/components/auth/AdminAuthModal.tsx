import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    verifyAdminPassword,
    requestRoleSwitch
  } = useApp();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = verifyAdminPassword(password);
    if (!success) {
      setErrorMsg('Incorrect Admin Password! (Hint: admin)');
    } else {
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="w-full max-w-md glass-panel bg-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  Admin Access Control
                </h3>
                <p className="text-xs text-slate-400">Password required for Admin dashboard</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAdminAuthModalOpen(false);
                requestRoleSwitch('user');
              }}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hint Badge */}
          <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Password Protected Access</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold">
              Default: admin
            </span>
          </div>

          {/* Error Message if wrong password */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Enter Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter password..."
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Unlock Admin Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  requestRoleSwitch('user');
                }}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs text-center"
              >
                Continue as Team User (No Password Required)
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
