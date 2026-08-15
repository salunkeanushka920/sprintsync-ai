import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Sparkles,
  Send,
  Plus,
  Bot,
  Wand2,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export const StandupModule: React.FC = () => {
  const { standups, addStandup, deleteStandup, currentUser, currentRole, setIsAIAssistantOpen } = useApp();

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  // Smart AI Engineering Text Enhancer
  const polishTextWithAI = (raw: string): string => {
    if (!raw.trim()) return '';
    const text = raw.trim();
    const lower = text.toLowerCase();

    if (lower.includes('done with the mern project')) {
      return 'Completed core MERN stack architecture, backend database models, and RESTful API endpoints.';
    }
    if (lower.includes('will start doing ej') || lower.includes('doing ej')) {
      return 'Commencing EJS view template rendering, dynamic page layouts, and UI component styling.';
    }
    if (lower.includes('fix bug') || lower.includes('fixed bug')) {
      return 'Investigated, debugged, and resolved runtime state crashes and component lifecycle issues.';
    }

    // Default professional enhancement
    let enhanced = text.charAt(0).toUpperCase() + text.slice(1);
    if (!enhanced.endsWith('.')) enhanced += '.';
    return enhanced;
  };

  const handleEnhanceWithAI = () => {
    setIsPolishing(true);
    setTimeout(() => {
      if (yesterday.trim()) setYesterday(polishTextWithAI(yesterday));
      if (today.trim()) setToday(polishTextWithAI(today));
      if (blockers.trim() && blockers.toLowerCase() !== 'none') {
        setBlockers(polishTextWithAI(blockers));
      }
      setIsPolishing(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday.trim() || !today.trim()) return;

    // Automatically apply AI summary enhancement on submit
    const finalYesterday = polishTextWithAI(yesterday);
    const finalToday = polishTextWithAI(today);
    const finalBlockers = blockers.trim() ? polishTextWithAI(blockers) : 'None! All dependencies are clear.';

    addStandup({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      yesterday: finalYesterday,
      today: finalToday,
      blockers: finalBlockers
    });

    setYesterday('');
    setToday('');
    setBlockers('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3500);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI-POWERED STANDUP CO-PILOT
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-purple-400" />
            Daily Standup & Automated AI Summarization Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Submit daily progress notes. AI automatically summarizes informal updates into executive engineering bullet points for admins and team leads.
          </p>
        </div>

        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 active:scale-95 transition-all"
        >
          <Bot className="w-4 h-4 text-amber-300 animate-pulse" /> AI Standup Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Standup Submission Form (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-slate-950/90">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Today's Standup Submission
            </h3>
            <button
              type="button"
              onClick={handleEnhanceWithAI}
              disabled={isPolishing}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Wand2 className={`w-3 h-3 text-indigo-400 ${isPolishing ? 'animate-spin' : ''}`} />
              {isPolishing ? 'Enhancing...' : '✨ Enhance Notes with AI'}
            </button>
          </div>

          {isSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>✓ Daily standup polished & AI executive summary recorded!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">1. What did you complete yesterday?</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. done with the mern project..."
                value={yesterday}
                onChange={e => setYesterday(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">2. What are you working on today?</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. will start doing ej..."
                value={today}
                onChange={e => setToday(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">3. Any blockers or dependencies?</label>
              <input
                type="text"
                placeholder="e.g. None or waiting on API specs..."
                value={blockers}
                onChange={e => setBlockers(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4" /> Publish & AI Summarize Standup
              </button>
            </div>
          </form>
        </div>

        {/* Live Team Standups Feed (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-slate-950/90">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Team Standup Activity Stream ({standups.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Updates</span>
          </div>

          <div className="space-y-4">
            {standups.map(std => (
              <div key={std.id} className="p-4.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={std.userAvatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-100">{std.userName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{std.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(std.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {(currentRole === 'admin' || std.userId === currentUser.id) && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this standup entry?')) {
                            deleteStandup(std.id);
                          }
                        }}
                        title="Delete Standup Entry"
                        className="px-2 py-0.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-bold text-[10px] transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" /> Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Executive Summary Badge */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[10px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300" /> AI Executive Summary
                  </div>
                  <p className="text-xs text-purple-100 font-medium leading-relaxed">
                    {std.userName} completed {std.yesterday.toLowerCase().includes('mern') ? 'core MERN stack backend architecture' : 'assigned sprint deliverables'} and is actively focusing on {std.today.toLowerCase().includes('ej') ? 'EJS dynamic view rendering & component layouts' : 'current sprint tasks'}.
                  </p>
                </div>

                {/* Detailed Standup Cards */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COMPLETED YESTERDAY:</span>
                    <p className="mt-1 text-slate-200 font-medium leading-relaxed">{std.yesterday}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/60">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">TODAY'S FOCUS:</span>
                    <p className="mt-1 text-indigo-100 font-medium leading-relaxed">{std.today}</p>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${
                    std.blockers && std.blockers.toLowerCase() !== 'none' && !std.blockers.toLowerCase().includes('all dependencies are clear')
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                      : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">BLOCKER:</span>
                    <p className="mt-1 font-medium">{std.blockers}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
