import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User as UserIcon,
  Save,
  Eye,
  X,
  CheckCircle2,
  Moon,
  Sun,
  Sparkles,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileSettings: React.FC = () => {
  const { currentUser, updateUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio);
  const [skills, setSkills] = useState(currentUser.skills.join(', '));
  const [githubUsername, setGithubUsername] = useState(currentUser.githubUsername || '');
  const [linkedInUrl, setLinkedInUrl] = useState(currentUser.linkedInUrl || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [themePreference, setThemePreference] = useState<'dark' | 'light'>(currentUser.themePreference || 'dark');

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateUser(currentUser.id, {
      name,
      username,
      avatar,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      githubUsername,
      linkedInUrl,
      phoneNumber,
      themePreference
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setUsername(currentUser.username);
    setAvatar(currentUser.avatar);
    setBio(currentUser.bio);
    setSkills(currentUser.skills.join(', '));
    setGithubUsername(currentUser.githubUsername || '');
    setLinkedInUrl(currentUser.linkedInUrl || '');
    setPhoneNumber(currentUser.phoneNumber || '');
    setThemePreference(currentUser.themePreference || 'dark');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
              WORKSPACE PERSONALIZATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <UserIcon className="w-6 h-6 text-purple-400" />
            Profile Settings & Identity
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Customize your profile photo, bio, technical skills, GitHub link, and workspace theme.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-xs font-bold text-slate-200 transition-all"
          >
            <Eye className="w-4 h-4 text-purple-400" /> Preview Profile
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Profile settings saved successfully! Your personal workspace updated instantly.
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Device Photo Upload Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e293b&color=cbd5e1&size=150`}
                alt="Profile"
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-purple-500/50 shadow-xl"
              />
              <label
                title="Add Profile Image"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-pointer shadow-lg transition-all ring-2 ring-slate-950"
              >
                <Plus className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDeviceFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs cursor-pointer inline-flex items-center gap-2 transition-all shadow-md shadow-purple-600/30">
                <Plus className="w-4 h-4 text-amber-300" /> Add Profile Image from Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDeviceFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Select any photo from your computer or phone to set as your avatar profile picture.
              </p>
            </div>
          </div>
        </div>

        {/* Name & Display Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Username / Display Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="text-xs">
          <label className="font-bold text-slate-300 block mb-1">Bio / Headline</label>
          <textarea
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Skills */}
        <div className="text-xs">
          <label className="font-bold text-slate-300 block mb-1">Skills & Technologies (Comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Social Links & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">GitHub Username</label>
            <input
              type="text"
              placeholder="username"
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">LinkedIn URL</label>
            <input
              type="text"
              placeholder="https://linkedin.com/in/username"
              value={linkedInUrl}
              onChange={e => setLinkedInUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Phone Number (Optional)</label>
            <input
              type="text"
              placeholder="+14155552673"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Theme Preference */}
        <div className="text-xs">
          <label className="font-bold text-slate-300 block mb-2">Workspace Theme Preference</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setThemePreference('dark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                themePreference === 'dark'
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Theme (Default)
            </button>
            <button
              type="button"
              onClick={() => setThemePreference('light')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                themePreference === 'light'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-200 font-bold text-xs flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-purple-400" /> Preview Profile
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

      </form>

      {/* Profile Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel bg-slate-950/95 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Profile Preview Card
                </h3>
                <button onClick={() => setIsPreviewOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-3 pt-2">
                <img src={avatar} className="w-20 h-20 mx-auto rounded-3xl object-cover ring-4 ring-purple-500/50" />
                <div>
                  <h4 className="text-base font-extrabold text-slate-100">{name}</h4>
                  <p className="text-xs text-purple-300 font-mono">@{username}</p>
                </div>
                <p className="text-xs text-slate-400 italic px-4">{bio}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {skills.split(',').map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono rounded-md bg-slate-900 border border-slate-800 text-indigo-300">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
