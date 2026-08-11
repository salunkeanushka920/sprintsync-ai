import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, Sparkles, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onOpenAdminPortal?: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onOpenAdminPortal
}) => {
  const { loginUser } = useApp();

  const [identifier, setIdentifier] = useState('anushka@sprintsync.ai');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginUser(identifier, password);
    if (!success) {
      setErrorMsg('Invalid email/username or password');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md glass-panel bg-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100">Sign In to SprintSync</h3>
                <p className="text-xs text-slate-400">Access your private personal workspace</p>
              </div>
            </div>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Email or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="anushka@sprintsync.ai"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 text-center space-y-2 text-xs">
            <p className="text-slate-400">
              Don't have a workspace account yet?{' '}
              <button onClick={onSwitchToRegister} className="text-indigo-400 hover:underline font-bold">
                Create One Now
              </button>
            </p>

            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="text-[10px] text-slate-600 hover:text-indigo-400 underline block mx-auto pt-1"
              >
                Shiv Admin Access Portal
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
