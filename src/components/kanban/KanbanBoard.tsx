import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { ManageSprintModal } from '../calendar/ManageSprintModal';
import type { Task, TaskStatus, TaskPriority, TaskTag } from '../../types';
import {
  Plus,
  Filter,
  Search,
  Kanban as KanbanIcon,
  User as UserIcon,
  Tag as TagIcon,
  Calendar,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    users,
    currentUser,
    currentRole,
    sprints,
    activeSprintId,
    setActiveSprintId,
    sprint,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    addCommentToTask,
    searchQuery,
    setSearchQuery,
    isCreateTaskOpen,
    setIsCreateTaskOpen
  } = useApp();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isManageSprintOpen, setIsManageSprintOpen] = useState(false);

  // Quick Task Creation Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');
  const [newStatus] = useState<TaskStatus>('todo');
  const [newAssignee, setNewAssignee] = useState<string>(currentUser.id);
  const [newEstHours] = useState(4);
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [newTag, setNewTag] = useState<TaskTag>('UI');

  const columns: { id: TaskStatus; label: string; color: string; bg: string }[] = [
    { id: 'todo', label: 'To Do', color: 'text-slate-400', bg: 'border-slate-800' },
    { id: 'in_progress', label: 'In Progress', color: 'text-amber-400', bg: 'border-amber-500/30' },
    { id: 'review', label: 'In Review', color: 'text-indigo-400', bg: 'border-indigo-500/30' },
    { id: 'blocked', label: 'Blocked 🔴', color: 'text-rose-400', bg: 'border-rose-500/40' },
    { id: 'completed', label: 'Completed ✓', color: 'text-emerald-400', bg: 'border-emerald-500/30' }
  ];

  // Sprint member allocation filtering
  const allocatedSprintMembers = users.filter(u => (sprint.memberIds || []).includes(u.id));

  // Filtering logic with User Data Isolation
  const userIsolatedTasks = currentRole === 'user'
    ? tasks.filter(t => t.assignedToIds.includes(currentUser.id))
    : tasks;

  const filteredTasks = userIsolatedTasks.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTag = t.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (currentRole === 'admin' && selectedMember !== 'all' && !t.assignedToIds.includes(selectedMember)) return false;
    if (selectedTag !== 'all' && !t.tags.includes(selectedTag as any)) return false;
    return true;
  });

  const handleQuickCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      description: newDesc || 'No detailed description provided.',
      priority: newPriority,
      status: newStatus,
      assignedToIds: [newAssignee],
      createdBy: 'usr_1',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      estimatedHours: newEstHours,
      actualHours: 0,
      tags: [newTag]
    });

    setNewTitle('');
    setNewDesc('');
    setIsCreateTaskOpen(false);
  };

  const handleMoveDirection = (taskId: string, direction: 'prev' | 'next') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const currentIdx = columns.findIndex(c => c.id === task.status);
    let targetIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (targetIdx >= 0 && targetIdx < columns.length) {
      moveTaskStatus(taskId, columns[targetIdx].id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Board Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> {sprint.name}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1 flex items-center gap-2.5">
            <KanbanIcon className="w-6 h-6 text-indigo-400" />
            Sprint Task Board & Kanban Workflow
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag, prioritize, and manage high-velocity tasks in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManageSprintOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-slate-200 transition-all"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Manage Sprints ({sprints.length})</span>
          </button>

          <button
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Task
          </button>
        </div>
      </div>

      {/* Multi-Sprint Tabs & Team Member Allocation Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Sprint Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {sprints.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSprintId(s.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                s.id === activeSprintId
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{s.name}</span>
              <span className={`px-1.5 py-0.2 text-[9px] rounded-md ${
                s.status === 'active' ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {s.status}
              </span>
            </button>
          ))}
        </div>

        {/* Sprint Allocated Members */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Sprint Team ({allocatedSprintMembers.length}):
          </span>
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {allocatedSprintMembers.map(u => (
              <img
                key={u.id}
                src={u.avatar}
                title={`${u.name} (${u.department})`}
                className="w-6 h-6 rounded-full border-2 border-slate-950 object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical 🔴</option>
              <option value="high">High 🟠</option>
              <option value="medium">Medium 🟡</option>
              <option value="low">Low 🟢</option>
            </select>
          </div>

          {/* Member Filter */}
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMember}
              onChange={e => setSelectedMember(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Assignees</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.department})
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className="flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Tags</option>
              <option value="UI">#UI</option>
              <option value="API">#API</option>
              <option value="AI">#AI</option>
              <option value="Bug">#Bug</option>
              <option value="Research">#Research</option>
              <option value="Docs">#Docs</option>
              <option value="Testing">#Testing</option>
            </select>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search board..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* 5-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const colHours = colTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

          return (
            <div
              key={col.id}
              className={`glass-panel p-3.5 rounded-2xl border ${col.bg} min-h-[500px] flex flex-col space-y-3 bg-slate-950/40`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{colHours}h est</span>
              </div>

              {/* Column Tasks Stream */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-slate-600 border border-dashed border-slate-800/60 rounded-xl text-xs">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map(t => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      users={users}
                      onTaskClick={setSelectedTask}
                      onMoveStatus={handleMoveDirection}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Drawer/Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          users={users}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onAddComment={addCommentToTask}
        />
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {isCreateTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" /> Create Sprint Task
                </h3>
                <button onClick={() => setIsCreateTaskOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Integrate Auth Middleware API..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Objectives & acceptance criteria..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300">Priority</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as any)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      <option value="critical">Critical 🔴</option>
                      <option value="high">High 🟠</option>
                      <option value="medium">Medium 🟡</option>
                      <option value="low">Low 🟢</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300">Tag Category</label>
                    <select
                      value={newTag}
                      onChange={e => setNewTag(e.target.value as any)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      <option value="UI">#UI</option>
                      <option value="API">#API</option>
                      <option value="AI">#AI</option>
                      <option value="Bug">#Bug</option>
                      <option value="Research">#Research</option>
                      <option value="Docs">#Docs</option>
                      <option value="Testing">#Testing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300">Assign To</label>
                    <select
                      value={newAssignee}
                      onChange={e => setNewAssignee(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300">Due Date</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={e => setNewDueDate(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateTaskOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Create & Dispatch WhatsApp Alert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-Sprint & Team Allocation Hub Modal */}
      <ManageSprintModal
        isOpen={isManageSprintOpen}
        onClose={() => setIsManageSprintOpen(false)}
      />

    </div>
  );
};
