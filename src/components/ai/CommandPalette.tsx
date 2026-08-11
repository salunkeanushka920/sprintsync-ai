import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Kanban,
  GitBranch,
  BarChart3,
  MessageSquare,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    users,
    setActiveTab,
    setIsCreateTaskOpen,
    setIsAIAssistantOpen,
    setIsWhatsAppModalOpen
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isCommandPaletteOpen) return null;

  const matchedTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : tasks.slice(0, 4);

  const matchedMembers = query
    ? users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
    : users.slice(0, 3);

  const actions = [
    { label: 'Create New Task', icon: Plus, action: () => setIsCreateTaskOpen(true) },
    { label: 'Open AI Assistant', icon: Sparkles, action: () => setIsAIAssistantOpen(true) },
    { label: 'WhatsApp Simulator', icon: MessageSquare, action: () => setIsWhatsAppModalOpen(true) },
    { label: 'View Kanban Board', icon: Kanban, action: () => setActiveTab('kanban') },
    { label: 'View Team Analytics', icon: BarChart3, action: () => setActiveTab('analytics') },
    { label: 'GitHub Sync Feeds', icon: GitBranch, action: () => setActiveTab('github') }
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={() => setIsCommandPaletteOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-2xl glass-panel bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Search Header Input */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command, search tasks, or find team members..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            <button onClick={() => setIsCommandPaletteOpen(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Navigation & Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {actions.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        act.action();
                        setIsCommandPaletteOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-200 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>{act.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matched Tasks */}
            {matchedTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Sprint Tasks</p>
                <div className="space-y-1.5">
                  {matchedTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveTab('kanban');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/40 text-xs flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                          {t.status}
                        </span>
                        <span className="font-semibold text-slate-200 truncate max-w-sm">{t.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{t.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Members */}
            {matchedMembers.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Team Members</p>
                <div className="flex gap-2">
                  {matchedMembers.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveTab('members');
                        setIsCommandPaletteOpen(false);
                      }}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2 cursor-pointer hover:border-purple-500/40"
                    >
                      <img src={m.avatar} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-slate-200 font-bold">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex justify-between">
            <span>Use ↑ ↓ to navigate, ESC to close</span>
            <span>SprintSync AI Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
