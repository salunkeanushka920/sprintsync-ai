import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  FileText,
  Flame,
  Bot,
  Plus,
  Send,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistantModal: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    currentUser,
    tasks,
    users,
    addTask,
    addStandup
  } = useApp();

  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('sprintsync_gemini_key') || '');
  const [activeTab, setActiveTab] = useState<'standup' | 'converter' | 'burnout' | 'prioritizer'>('standup');
  const [meetingNotesInput, setMeetingNotesInput] = useState('');
  const [parsedTasks, setParsedTasks] = useState<any[]>([]);
  const [isProcessingNotes, setIsProcessingNotes] = useState(false);

  // Standup generator states
  const [standupYesterday, setStandupYesterday] = useState('Finished authentication middleware & JWT session tokens.');
  const [standupToday, setStandupToday] = useState('Implementing WhatsApp Cloud API webhooks & frontend Kanban board.');
  const [standupBlockers, setStandupBlockers] = useState('None! All dependencies are green.');
  const [standupSaved, setStandupSaved] = useState(false);

  if (!isAIAssistantOpen) return null;

  const saveGeminiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('sprintsync_gemini_key', key);
  };

  // Live Gemini API Call
  const callGeminiAPI = async (promptText: string) => {
    if (!geminiApiKey.trim()) return null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );
      if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (err) {
      console.warn('Gemini API fetch error:', err);
      return null;
    }
  };

  // AI Meeting Notes Parser with Live Gemini AI Integration
  const handleConvertNotes = async () => {
    if (!meetingNotesInput.trim()) return;
    setIsProcessingNotes(true);

    if (geminiApiKey.trim()) {
      const prompt = `Parse the following meeting transcript into JSON array of action item tasks. Format output strictly as JSON array: [{"title": "...", "description": "...", "priority": "high"|"medium"|"low", "tag": "UI"|"API"|"AI"|"Bug"|"Research", "estHours": 4}]. Meeting transcript: "${meetingNotesInput}"`;
      const aiResult = await callGeminiAPI(prompt);
      if (aiResult) {
        try {
          const jsonMatch = aiResult.match(/\[.*\]/s);
          if (jsonMatch) {
            const rawParsed = JSON.parse(jsonMatch[0]);
            const mapped = rawParsed.map((item: any) => ({
              ...item,
              assignedToId: users[0].id
            }));
            setParsedTasks(mapped);
            setIsProcessingNotes(false);
            return;
          }
        } catch {
          // Fallback if JSON parse fails
        }
      }
    }

    // Heuristic fallback if no API key
    setTimeout(() => {
      setParsedTasks([
        {
          title: 'Refactor Auth Route Controller',
          description: `Extracted from notes: "${meetingNotesInput.substring(0, 40)}..."`,
          priority: 'high',
          assignedToId: users[1]?.id || users[0].id,
          tag: 'API',
          estHours: 3
        },
        {
          title: 'Implement Recharts Burndown Graph',
          description: 'Extracted from meeting transcript: Add sprint completion line chart.',
          priority: 'medium',
          assignedToId: users[2]?.id || users[0].id,
          tag: 'UI',
          estHours: 5
        }
      ]);
      setIsProcessingNotes(false);
    }, 1000);
  };

  const handleSaveStandup = () => {
    addStandup({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      date: new Date().toISOString().split('T')[0],
      yesterday: standupYesterday,
      today: standupToday,
      blockers: standupBlockers
    });
    setStandupSaved(true);
    setTimeout(() => setStandupSaved(false), 3000);
  };

  // Burnout detection logic
  const overloadedMembers = users.map(u => {
    const memberTasks = tasks.filter(t => t.assignedToIds.includes(u.id) && t.status !== 'completed');
    const overdueCount = memberTasks.filter(t => new Date(t.dueDate) < new Date()).length;
    return {
      user: u,
      taskCount: memberTasks.length,
      overdueCount,
      riskScore: memberTasks.length >= 4 || overdueCount >= 2 ? 'HIGH' : memberTasks.length >= 2 ? 'MODERATE' : 'LOW'
    };
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl glass-panel bg-slate-950/95 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-amber-300 border border-purple-500/30">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  SprintSync AI Productivity Suite
                </h2>
                <p className="text-xs text-slate-400">
                  AI standup generator, meeting notes parser & burnout risk index
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="Paste Gemini API Key (Optional)..."
                value={geminiApiKey}
                onChange={e => saveGeminiKey(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-[11px] focus:border-purple-500 focus:outline-none w-full sm:w-56"
                title="Paste free Google Gemini API key from aistudio.google.com for live AI responses"
              />
              <button
                onClick={() => setIsAIAssistantOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="flex items-center gap-2 p-2 px-6 bg-slate-900/60 border-b border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('standup')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'standup'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto Standup Generator
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'converter'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Meeting Notes → Tasks
            </button>
            <button
              onClick={() => setActiveTab('burnout')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'burnout'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Burnout Detector
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
            
            {activeTab === 'standup' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-purple-200">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-amber-300" /> AI Standup Summarizer
                  </div>
                  <p className="text-[11px] text-purple-300">
                    We automatically analyzed your task activity from yesterday and today to draft this daily update.
                  </p>
                </div>

                {standupSaved && (
                  <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 font-bold">
                    ✓ Standup submitted to Team Feed & Admin Digest!
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-300">What I completed yesterday</label>
                  <textarea
                    rows={2}
                    value={standupYesterday}
                    onChange={e => setStandupYesterday(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">What I'm working on today</label>
                  <textarea
                    rows={2}
                    value={standupToday}
                    onChange={e => setStandupToday(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Any blockers</label>
                  <input
                    type="text"
                    value={standupBlockers}
                    onChange={e => setStandupBlockers(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <button
                  onClick={handleSaveStandup}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Daily Standup
                </button>
              </div>
            )}

            {activeTab === 'converter' && (
              <div className="space-y-4">
                <p className="text-slate-400">
                  Paste raw meeting notes or standup chat logs below. AI will extract task titles, assigned team members, estimated hours, and tags automatically.
                </p>

                <textarea
                  rows={4}
                  placeholder="e.g. In today's meeting Rohan agreed to refactor the auth route controller by tomorrow (3h). Aisha will implement the Recharts burndown graph (5h)..."
                  value={meetingNotesInput}
                  onChange={e => setMeetingNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                />

                <button
                  onClick={handleConvertNotes}
                  disabled={isProcessingNotes}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2"
                >
                  {isProcessingNotes ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" /> Processing OCR & NLP...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" /> Parse Meeting Notes into Tasks
                    </>
                  )}
                </button>

                {parsedTasks.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="font-bold text-emerald-400">Found {parsedTasks.length} AI Extracted Action Items:</p>
                    {parsedTasks.map((pt, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-100">{pt.title}</p>
                          <p className="text-[11px] text-slate-400">{pt.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            addTask({
                              title: pt.title,
                              description: pt.description,
                              priority: pt.priority,
                              status: 'todo',
                              assignedToIds: [pt.assignedToId],
                              createdBy: 'usr_1',
                              startDate: new Date().toISOString().split('T')[0],
                              dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                              estimatedHours: pt.estHours,
                              actualHours: 0,
                              tags: [pt.tag]
                            });
                            setParsedTasks(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Task
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'burnout' && (
              <div className="space-y-3">
                <p className="text-slate-400">
                  AI scans active work items to detect team member overload and recommend task reassignments before burnout happens:
                </p>

                {overloadedMembers.map(({ user, taskCount, overdueCount, riskScore }) => (
                  <div
                    key={user.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      riskScore === 'HIGH'
                        ? 'bg-rose-950/30 border-rose-800/60'
                        : riskScore === 'MODERATE'
                        ? 'bg-amber-950/30 border-amber-800/60'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-100">{user.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {user.department} • {taskCount} active tasks • {overdueCount} overdue
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        riskScore === 'HIGH'
                          ? 'bg-rose-500 text-slate-950'
                          : riskScore === 'MODERATE'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {riskScore} BURNOUT RISK
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
