import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILL_OPTIONS = [
  'React',
  'TypeScript',
  'TailwindCSS',
  'Node.js',
  'Framer Motion',
  'Python',
  'AI & Prompting',
  'UI/UX Design',
  'GraphQL',
  'Docker',
  'Testing'
];

interface MultiStepRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const MultiStepRegisterModal: React.FC<MultiStepRegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const { registerUser } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript', 'TailwindCSS']);

  const handleDeviceAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !username.trim()) return;
      setStep(2);
    } else if (step === 2) {
      if (password.length < 4) {
        setPasswordError('Password must be at least 4 characters');
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      setPasswordError('');
      setStep(3);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleFinalSubmit = () => {
    let finalPhone = phoneNumber.trim();
    const digitsOnly = finalPhone.replace(/[^\d]/g, '');
    if (digitsOnly.length === 10) {
      finalPhone = `+91 ${digitsOnly}`;
    }

    registerUser({
      name: fullName,
      username,
      email,
      passwordHash: password,
      role: selectedRole,
      department: selectedRole === 'admin' ? 'Backend' : 'Frontend',
      avatar: selectedAvatar,
      bio: bio || (selectedRole === 'admin' ? 'Project Admin & System Lead' : 'Team Member crafting fast sprint features.'),
      skills: selectedSkills.length > 0 ? selectedSkills : ['React', 'TypeScript'],
      phoneNumber: finalPhone || '+91 9876543210'
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel bg-slate-950/95 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-sm text-slate-100">SprintSync Setup</span>
            </div>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between px-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === i
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                      : step > i
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {step > i ? '✓' : i}
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline font-semibold">
                  {i === 1 ? 'Basic Info' : i === 2 ? 'Security' : 'Personalization'}
                </span>
                {i < 3 && <div className="w-8 h-[1px] bg-slate-800 hidden sm:block ml-2" />}
              </div>
            ))}
          </div>

          {/* Form Step Content */}
          <form onSubmit={step === 3 ? e => { e.preventDefault(); handleFinalSubmit(); } : handleNextStep} className="space-y-4">
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Step 1: Basic Information & Role</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Select your workspace role and enter account details</p>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Choose Account Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('user')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedRole === 'user'
                          ? 'bg-indigo-950/60 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-indigo-400">Team Member</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Access task board, clock in/out, submit standups</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('admin')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedRole === 'admin'
                          ? 'bg-purple-950/60 border-purple-500 text-white ring-2 ring-purple-500/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-purple-400">Admin / Lead</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Manage sprint tasks, velocity analytics, announcements</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anushka Sharma"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="anushka@sprintsync.ai"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="anushka_dev"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Saved to your profile for automated WhatsApp alerts & task reminders</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Step 2: Password & Security</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Secure your personal workspace with a strong password</p>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Step 3: Personalize Workspace</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Choose your avatar, bio, and technical skills</p>
                </div>

                {/* Avatar Picker: Device Upload or Blank Silhouette */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Profile Photo (Upload from Device or Silhouette)</label>
                  
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAvatar}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shadow-indigo-500/20 shrink-0"
                    />

                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer text-center transition-all shadow-md">
                        📁 Upload Photo from Device
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDeviceAvatarUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAvatar(`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=1e293b&color=cbd5e1&size=150`)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[11px]"
                        >
                          👤 Blank Initials Profile
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedAvatar('https://lh3.googleusercontent.com/a/default-user=s96-c')}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-[11px]"
                        >
                          🌐 Google Silhouette
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bio / Role Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Frontend Engineer crafting sleek UI components..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Skills Chips */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Skills & Technologies</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_OPTIONS.map(skill => {
                      const isSel = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            isSel
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}{skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step Control Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => (prev - 1) as any)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-xs text-indigo-400 hover:underline font-semibold"
                >
                  Already have an account? Sign In
                </button>
              )}

              {step < 3 ? (
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 ml-auto"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 active:scale-95"
                >
                  <Zap className="w-5 h-5 text-amber-300 animate-bounce" /> Create My Workspace
                </button>
              )}
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
