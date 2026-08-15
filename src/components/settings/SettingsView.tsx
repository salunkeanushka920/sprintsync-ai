import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Database, MessageSquare, Cloud, Check, Copy, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, setSupabaseCredentials, SUPABASE_SQL_SCHEMA } from '../../services/supabase';

export const SettingsView: React.FC = () => {
  const { currentUser, updateUser, whatsAppConfig, updateWhatsAppConfig, sprint, updateSprint } = useApp();

  const [userPhone, setUserPhone] = useState(currentUser?.phoneNumber || '');
  const [userBio, setUserBio] = useState(currentUser?.bio || '');
  const [supaUrl, setSupaUrl] = useState(localStorage.getItem('sprintsync_supabase_url') || '');
  const [supaKey, setSupaKey] = useState(localStorage.getItem('sprintsync_supabase_anon_key') || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, {
      phoneNumber: userPhone.trim(),
      bio: userBio.trim()
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateUser(currentUser.id, { avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCredentials(supaUrl, supaKey);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" /> Platform & Workspace Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage profile photos, saved WhatsApp phone numbers, active sprint goals, and Supabase Cloud Database sync.
        </p>
      </div>

      {/* User Profile & Saved Phone Number Card */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 bg-slate-950/80 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Personal Profile & Saved WhatsApp Number
        </h3>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          <div className="md:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <img src={currentUser.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md" />
            
            <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] cursor-pointer transition-all shadow">
              📁 Upload Device Photo
              <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => updateUser(currentUser.id, { avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=1e293b&color=cbd5e1&size=150` })}
              className="text-[10px] text-slate-400 hover:text-white underline font-semibold"
            >
              👤 Set Blank Initials Avatar
            </button>
          </div>

          <div className="md:col-span-9 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Display Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Saved to your profile for automated WhatsApp alerts and task reminders.</span>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Bio / Workspace Role</label>
              <input
                type="text"
                value={userBio}
                onChange={e => setUserBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {profileSavedMsg && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Profile!
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30"
              >
                Save Profile & Phone Number
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Supabase Cloud Database Integration */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/40 space-y-4 bg-indigo-950/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-indigo-400" /> Supabase Cloud Database (Free Tier)
            </h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
              isSupabaseConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {isSupabaseConfigured ? '🟢 Live Supabase Sync' : '🟡 Local Storage Storage'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Connect your 100% free Supabase account to sync user logins, tasks, standups, and alerts across multiple computers in real-time.
          </p>

          <form onSubmit={handleSaveSupabase} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">Supabase Project URL</label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={supaUrl}
                onChange={e => setSupaUrl(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300">Supabase anon / public API Key</label>
              <input
                type="password"
                placeholder="eyJhbG..."
                value={supaKey}
                onChange={e => setSupaKey(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Schema Copied!' : 'Copy Supabase SQL Setup Schema'}</span>
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md shadow-indigo-600/25 transition-all"
              >
                Save & Connect Supabase
              </button>
            </div>
          </form>
        </div>

        {/* Active Sprint Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Sprint Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">Sprint Name</label>
              <input
                type="text"
                value={sprint.name}
                onChange={e => updateSprint({ name: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Sprint Goal & Objective</label>
              <textarea
                rows={2}
                value={sprint.goal}
                onChange={e => updateSprint({ goal: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={sprint.startDate}
                  onChange={e => updateSprint({ startDate: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300">End Date</label>
                <input
                  type="date"
                  value={sprint.endDate}
                  onChange={e => updateSprint({ endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Integrations Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Twilio & Meta Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">Twilio Account SID</label>
              <input
                type="text"
                value={whatsAppConfig.twilioSid}
                onChange={e => updateWhatsAppConfig({ twilioSid: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Meta Cloud API Permanent Token</label>
              <input
                type="password"
                value={whatsAppConfig.metaCloudToken}
                onChange={e => updateWhatsAppConfig({ metaCloudToken: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Sender Phone Number</label>
              <input
                type="text"
                value={whatsAppConfig.senderPhone}
                onChange={e => updateWhatsAppConfig({ senderPhone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

