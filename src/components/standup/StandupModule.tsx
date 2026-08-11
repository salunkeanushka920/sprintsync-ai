import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Sparkles,
  Send,
  Plus
} from 'lucide-react';

export const StandupModule: React.FC = () => {
  const { standups, addStandup, currentUser, setIsAIAssistantOpen } = useApp();

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday.trim() || !today.trim()) return;

    addStandup({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      yesterday,
      today,
      blockers: blockers || 'None'
    });

    setYesterday('');
    setToday('');
    setBlockers('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              DAILY SYNCHRONIZATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-purple-400" />
            Daily Standup & Blocker Clearing Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Keep your hackathon team aligned. Submit your 3-question daily standup and generate AI executive summaries for admins.
          </p>
        </div>

        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Auto Fill via AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Standup Submission Form (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-400" /> Today's Standup Submission
          </h3>

          {isSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold">
              ✓ Daily standup successfully recorded!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300">1. What did you complete yesterday?</label>
              <textarea
                rows={2}
                required
                placeholder="Finished landing page Hero section & animations..."
                value={yesterday}
                onChange={e => setYesterday(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300">2. What are you working on today?</label>
              <textarea
                rows={2}
                required
                placeholder="Integrating WhatsApp Cloud API webhook listeners..."
                value={today}
                onChange={e => setToday(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300">3. Any blockers or dependencies?</label>
              <input
                type="text"
                placeholder="e.g. Waiting on Redis connection string..."
                value={blockers}
                onChange={e => setBlockers(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Publish Standup to Team Feed
            </button>
          </form>
        </div>

        {/* Live Team Standups Feed (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Team Standup Activity Stream ({standups.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Updates</span>
          </div>

          <div className="space-y-4">
            {standups.map(std => (
              <div key={std.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={std.userAvatar} className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/40" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{std.userName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{std.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(std.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Completed Yesterday:</span>
                    <p className="mt-0.5 text-slate-200">{std.yesterday}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-900/50">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Today's Focus:</span>
                    <p className="mt-0.5 text-indigo-200">{std.today}</p>
                  </div>
                  {std.blockers && std.blockers !== 'None' && (
                    <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300">
                      <span className="text-[10px] font-bold text-rose-400 uppercase block">Blocker:</span>
                      <p className="mt-0.5">{std.blockers}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
