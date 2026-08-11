import React, { useState } from 'react';
import type { Task, User, TaskPriority, TaskStatus } from '../../types';
import {
  X,
  Paperclip,
  GitBranch,
  Send,
  Flame,
  MessageSquare,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailModalProps {
  task: Task | null;
  users: User[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAddComment: (taskId: string, content: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  users,
  onClose,
  onUpdate,
  onDelete,
  onAddComment
}) => {
  if (!task) return null;

  const [commentText, setCommentText] = useState('');
  const [isEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [blockerReason, setBlockerReason] = useState(task.blockerReason || '');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(task.id, commentText);
    setCommentText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl glass-panel bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                TASK DETAILS
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: #{task.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* Title & Description */}
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-slate-100"
                />
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">{task.title}</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{task.description}</p>
              </div>
            )}

            {/* Status & Priority Control Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</label>
                <select
                  value={status}
                  onChange={e => {
                    const newSt = e.target.value as TaskStatus;
                    setStatus(newSt);
                    onUpdate(task.id, { status: newSt });
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-indigo-300"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="blocked">Blocked 🔴</option>
                  <option value="completed">Completed ✓</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority</label>
                <select
                  value={priority}
                  onChange={e => {
                    const newPri = e.target.value as TaskPriority;
                    setPriority(newPri);
                    onUpdate(task.id, { priority: newPri });
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <option value="critical">Critical 🔴</option>
                  <option value="high">High 🟠</option>
                  <option value="medium">Medium 🟡</option>
                  <option value="low">Low 🟢</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => {
                    setDueDate(e.target.value);
                    onUpdate(task.id, { dueDate: e.target.value });
                  }}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Est. vs Actual</label>
                <div className="flex items-center gap-1 mt-1 text-xs font-mono">
                  <span className="text-indigo-400 font-bold">{task.estimatedHours}h est</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{task.actualHours}h act</span>
                </div>
              </div>
            </div>

            {/* Blocker Section if status is blocked */}
            {status === 'blocked' && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <Flame className="w-4 h-4 text-rose-400" /> Blocker Note & Reason
                </div>
                <input
                  type="text"
                  placeholder="Reason for blocker..."
                  value={blockerReason}
                  onChange={e => setBlockerReason(e.target.value)}
                  onBlur={() => onUpdate(task.id, { blockerReason })}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-rose-200"
                />
              </div>
            )}

            {/* Assigned Members */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Assigned Team Members
              </label>
              <div className="flex flex-wrap gap-2">
                {users.filter(u => task.assignedToIds.includes(u.id)).map(u => (
                  <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-200">{u.name}</span>
                    <span className="text-[10px] text-slate-500">({u.department})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Link if present */}
            {task.githubIssueUrl && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-indigo-400 font-mono">
                  <GitBranch className="w-4 h-4" /> Linked GitHub Issue
                </div>
                <a
                  href={task.githubIssueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-300 hover:text-white underline font-mono text-[11px]"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Attachments & Assets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {task.attachments.map(att => (
                    <div key={att.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-indigo-400" />
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-slate-200 truncate">{att.name}</p>
                        <p className="text-[10px] text-slate-500">{att.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Thread */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Task Discussion & Comments ({task.comments?.length || 0})
              </h3>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {task.comments?.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={c.userAvatar} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-bold text-slate-200">{c.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 pl-7 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write a comment or mention @username..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Comment
                </button>
              </form>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Press ESC or click close to return</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
