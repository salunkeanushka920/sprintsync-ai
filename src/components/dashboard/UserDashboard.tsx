import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from './StatCard';
import { PerformanceGraphSection } from './PerformanceGraphSection';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Megaphone,
  Flame,
  Send,
  Sparkles,
  ArrowRight,
  Paperclip,
  Zap
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    updateTask,
    addCommentToTask,
    requestDeadlineExtension,
    announcements,
    setActiveTab,
    setIsAIAssistantOpen
  } = useApp();

  const [selectedTaskForExtension, setSelectedTaskForExtension] = useState<string | null>(null);
  const [extensionHours, setExtensionHours] = useState(4);
  const [extensionReason, setExtensionReason] = useState('');
  const [showExtensionSuccess, setShowExtensionSuccess] = useState(false);

  const [blockerInputTaskId, setBlockerInputTaskId] = useState<string | null>(null);
  const [blockerText, setBlockerText] = useState('');

  const [commentInputTaskId, setCommentInputTaskId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const [progressNotesTaskId, setProgressNotesTaskId] = useState<string | null>(null);
  const [progressNotesText, setProgressNotesText] = useState('');

  // User specific tasks
  const myTasks = tasks.filter(t => t.assignedToIds.includes(currentUser.id));
  const myPendingTasks = myTasks.filter(t => t.status !== 'completed');
  const myCompletedToday = myTasks.filter(t => t.status === 'completed');
  const myUrgentTasks = myPendingTasks.filter(t => t.priority === 'critical' || t.priority === 'high');

  const handleExtensionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForExtension || !extensionReason.trim()) return;

    requestDeadlineExtension(selectedTaskForExtension, extensionHours, extensionReason);
    setSelectedTaskForExtension(null);
    setExtensionReason('');
    setShowExtensionSuccess(true);
    setTimeout(() => setShowExtensionSuccess(false), 3000);
  };

  const handleBlockerSubmit = (taskId: string) => {
    if (!blockerText.trim()) return;
    updateTask(taskId, {
      status: 'blocked',
      blockerReason: blockerText
    });
    addCommentToTask(taskId, `⚠️ [FLAGGED BLOCKER] ${blockerText}`);
    setBlockerInputTaskId(null);
    setBlockerText('');
  };

  const handleCommentSubmit = (taskId: string) => {
    if (!commentText.trim()) return;
    addCommentToTask(taskId, commentText);
    setCommentInputTaskId(null);
    setCommentText('');
  };

  const handleProgressNotesSubmit = (taskId: string) => {
    if (!progressNotesText.trim()) return;
    updateTask(taskId, { progressNotes: progressNotesText });
    setProgressNotesTaskId(null);
    setProgressNotesText('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* User Greeting Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {currentUser.department} Lead
              </span>
              <span className="text-xs text-slate-400">GH: @{currentUser.githubUsername}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
              Welcome back, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl">
              {currentUser.bio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/25 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Generate Today's Standup</span>
          </button>
        </div>
      </div>

      {/* Extension Success Toast */}
      {showExtensionSuccess && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Extension request dispatched to Admin! In-app & WhatsApp notification triggered.
        </div>
      )}

      {/* User Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={myTasks.length}
          subtitle={`${myPendingTasks.length} pending`}
          icon={CheckSquare}
          color="purple"
        />
        <StatCard
          title="Completed Today"
          value={myCompletedToday.length}
          subtitle="Awesome velocity!"
          change="+100% target"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Urgent Alerts"
          value={myUrgentTasks.length}
          subtitle="Critical/High Priority"
          isPositive={false}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Active Blockers"
          value={myTasks.filter(t => t.status === 'blocked').length}
          subtitle="Requires unblock"
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Performance & Velocity Graphs Section */}
      <PerformanceGraphSection />

      {/* Main Grid: Left Tasks & Actions, Right Team Announcements & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Agenda & Interactive Tasks (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              My Current Tasks & Progress Actions
            </h2>
            <button
              onClick={() => setActiveTab('kanban')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Open Kanban Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myPendingTasks.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-200">You're All Caught Up!</h3>
              <p className="text-xs text-slate-400 mt-1">No active pending tasks assigned to you right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myPendingTasks.map(task => (
                <div
                  key={task.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          task.priority === 'critical' ? 'bg-rose-500 text-slate-950' :
                          task.priority === 'high' ? 'bg-amber-500 text-slate-950' :
                          task.priority === 'medium' ? 'bg-indigo-500/30 text-indigo-300' :
                          'bg-emerald-500/30 text-emerald-300'
                        }`}>
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Due: {task.dueDate}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mt-1.5">{task.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                    </div>

                    {/* Quick Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={e => updateTask(task.id, { status: e.target.value as any })}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">In Review</option>
                      <option value="blocked">Blocked</option>
                      <option value="completed">Completed ✓</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                    {task.progressNotes && (
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Note: {task.progressNotes}
                      </span>
                    )}
                  </div>

                  {/* User Actions Bar */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCommentInputTaskId(commentInputTaskId === task.id ? null : task.id)}
                        className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Comment ({task.comments?.length || 0})
                      </button>
                      <button
                        onClick={() => setBlockerInputTaskId(blockerInputTaskId === task.id ? null : task.id)}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                      >
                        <Flame className="w-3.5 h-3.5" /> Mark Blocker
                      </button>
                      <button
                        onClick={() => setSelectedTaskForExtension(task.id)}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                      >
                        <Clock className="w-3.5 h-3.5" /> Request Extension
                      </button>
                    </div>

                    <button
                      onClick={() => setProgressNotesTaskId(progressNotesTaskId === task.id ? null : task.id)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                    >
                      <Paperclip className="w-3.5 h-3.5" /> Add Progress Note
                    </button>
                  </div>

                  {/* Inline Blocker Input */}
                  {blockerInputTaskId === task.id && (
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2 mt-2">
                      <p className="text-xs font-bold text-amber-200">State your task blocker:</p>
                      <input
                        type="text"
                        placeholder="What is stopping progress? (e.g. Waiting on API endpoint)..."
                        value={blockerText}
                        onChange={e => setBlockerText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setBlockerInputTaskId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleBlockerSubmit(task.id)}
                          className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg"
                        >
                          Save Blocker
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Progress Notes Input */}
                  {progressNotesTaskId === task.id && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 mt-2">
                      <p className="text-xs font-bold text-slate-200">Add latest work progress notes:</p>
                      <input
                        type="text"
                        placeholder="Latest status / link to branch..."
                        value={progressNotesText}
                        onChange={e => setProgressNotesText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setProgressNotesTaskId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleProgressNotesSubmit(task.id)}
                          className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Comment Thread */}
                  {commentInputTaskId === task.id && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      {task.comments?.map(c => (
                        <div key={c.id} className="p-2 rounded-lg bg-slate-900/60 text-xs flex items-start gap-2">
                          <img src={c.userAvatar} className="w-5 h-5 rounded-full object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">{c.userName}</span>
                              <span className="text-[10px] text-slate-500">
                                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleCommentSubmit(task.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" /> Send
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Team Announcements & Deadline Extension Modal */}
        <div className="space-y-6">
          
          {/* Extension Request Form Card */}
          {selectedTaskForExtension && (
            <div className="glass-panel p-5 rounded-2xl border border-purple-500/50 bg-purple-950/20 space-y-3">
              <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Request Deadline Extension
              </h3>
              <form onSubmit={handleExtensionSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Additional Hours Needed</label>
                  <select
                    value={extensionHours}
                    onChange={e => setExtensionHours(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  >
                    <option value={2}>+2 Hours</option>
                    <option value={4}>+4 Hours</option>
                    <option value={8}>+8 Hours</option>
                    <option value={12}>+12 Hours (1/2 day)</option>
                    <option value={24}>+24 Hours (1 full day)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400">Reason for Request</label>
                  <textarea
                    rows={2}
                    placeholder="Describe technical complexity or blocker..."
                    value={extensionReason}
                    onChange={e => setExtensionReason(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForExtension(null)}
                    className="px-3 py-1.5 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Team Announcements */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                Team Announcements
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold">
                Live Feed
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <img src={ann.authorAvatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-200">{ann.authorName}</span>
                    {ann.pinned && (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-indigo-500 text-slate-950 rounded">
                        PINNED
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-indigo-300">{ann.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
