import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Sparkles,
  Archive,
  Layers,
  Check,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Sprint } from '../../types';

export const SprintWorkspacesView: React.FC = () => {
  const {
    sprints,
    activeSprintId,
    setActiveSprintId,
    addSprint,
    updateSprintById,
    deleteSprint,
    completeSprint,
    users,
    currentRole,
    currentUser
  } = useApp();

  const visibleSprints = currentRole === 'admin'
    ? sprints
    : sprints.filter(s => (s.memberIds || []).includes(currentUser.id));

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(users.map(u => u.id));

  // Edit Sprint State for Admins
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'planning' | 'completed'>('planning');
  const [editMemberIds, setEditMemberIds] = useState<string[]>([]);

  const toggleMemberSelection = (usrId: string) => {
    if (selectedMemberIds.includes(usrId)) {
      setSelectedMemberIds(prev => prev.filter(id => id !== usrId));
    } else {
      setSelectedMemberIds(prev => [...prev, usrId]);
    }
  };

  const toggleEditMemberSelection = (usrId: string) => {
    if (editMemberIds.includes(usrId)) {
      setEditMemberIds(prev => prev.filter(id => id !== usrId));
    } else {
      setEditMemberIds(prev => [...prev, usrId]);
    }
  };

  const handleCreateSprintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintName.trim()) return;

    addSprint({
      name: newSprintName.trim(),
      goal: newSprintGoal.trim() || 'Deliver key sprint features & milestones.',
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'planning',
      memberIds: selectedMemberIds
    });

    setNewSprintName('');
    setNewSprintGoal('');
    setIsCreatingNew(false);
  };

  const openEditModal = (s: Sprint) => {
    setEditingSprint(s);
    setEditName(s.name);
    setEditGoal(s.goal);
    setEditStartDate(s.startDate);
    setEditEndDate(s.endDate);
    setEditStatus(s.status);
    setEditMemberIds(s.memberIds || users.map(u => u.id));
  };

  const handleEditSprintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSprint || !editName.trim()) return;

    updateSprintById(editingSprint.id, {
      name: editName.trim(),
      goal: editGoal.trim(),
      startDate: editStartDate,
      endDate: editEndDate,
      status: editStatus,
      memberIds: editMemberIds
    });

    if (editStatus === 'active') {
      setActiveSprintId(editingSprint.id);
    }

    setEditingSprint(null);
  };

  const activeSprint = sprints.find(s => s.id === activeSprintId) || sprints[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Multi-Sprint Management Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-3">
            Sprint Workspaces & Team Allocations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Create new sprint workspaces, edit milestones, allocate team members per sprint, and switch active development sprints seamlessly.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 self-start md:self-center transition-all"
          >
            <Plus className="w-4 h-4" /> {isCreatingNew ? 'Close Form' : 'Create New Sprint Workspace'}
          </button>
        )}
      </div>

      {/* New Sprint Creation Card (Admin Only) */}
      {currentRole === 'admin' && isCreatingNew && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateSprintSubmit}
          className="glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-slate-950/90 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Create New Sprint Workspace
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Workspace ID: sprint_{Date.now().toString().slice(-4)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Sprint Title / Workspace Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sprint 3 - Payments & Live Webhooks"
                value={newSprintName}
                onChange={e => setNewSprintName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Sprint Objective / Key Goal</label>
              <input
                type="text"
                placeholder="e.g. Complete payment gateway & Stripe webhooks"
                value={newSprintGoal}
                onChange={e => setNewSprintGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={newStartDate}
                onChange={e => setNewStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Target End Date</label>
              <input
                type="date"
                required
                value={newEndDate}
                onChange={e => setNewEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Allocate Team Members */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Allocate Team Members for this Sprint Workspace</span>
              <span className="text-[11px] text-indigo-400 font-mono">{selectedMemberIds.length} members selected</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {users.map(u => {
                const isSelected = selectedMemberIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleMemberSelection(u.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{u.name}</p>
                        <p className="text-[10px] text-slate-400">{u.department}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
            >
              Save & Launch Sprint Workspace
            </button>
          </div>
        </motion.form>
      )}

      {/* Active Sprint Summary Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Workspace Sprint:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CURRENTLY LIVE
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-100 mt-0.5">{activeSprint?.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-slate-400">
            <span className="block text-[10px] text-slate-500 font-bold">TIMELINE</span>
            <span className="font-mono text-slate-200">{activeSprint?.startDate} → {activeSprint?.endDate}</span>
          </div>
          <div className="text-slate-400">
            <span className="block text-[10px] text-slate-500 font-bold">TEAM ALLOCATION</span>
            <span className="font-mono text-slate-200">{(activeSprint?.memberIds || []).length} Members</span>
          </div>
        </div>
      </div>

      {/* Sprint Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            {currentRole === 'admin' ? `All Project Sprints (${sprints.length})` : `My Allocated Sprint Workspaces (${visibleSprints.length})`}
          </h3>
          {currentRole !== 'admin' && (
            <span className="text-[11px] text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              🔒 Filtered to sprints allocated to you by Admin
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleSprints.map(s => {
            const isActive = s.id === activeSprintId;
            const isCompleted = s.status === 'completed';
            const allocatedMembers = users.filter(u => (s.memberIds || []).includes(u.id));

            return (
              <div
                key={s.id}
                className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-950/80 via-slate-950 to-slate-900 border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isCompleted
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {isActive ? '🟢 Active Workspace' : isCompleted ? '📁 Archived' : '⏱️ In Planning'}
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {s.startDate} to {s.endDate}
                      </span>

                      {/* Admin Edit & Delete Buttons */}
                      {currentRole === 'admin' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            title="Edit Sprint Workspace"
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-indigo-400" /> Edit
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${s.name}"?`)) {
                                deleteSprint(s.id);
                              }
                            }}
                            title="Delete Sprint Workspace"
                            className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[11px] font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-100">{s.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.goal}</p>
                </div>

                {/* Team Avatars Stack */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Allocated Team ({allocatedMembers.length})</span>
                    <div className="flex items-center -space-x-2">
                      {allocatedMembers.map(m => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          title={`${m.name} (${m.department})`}
                          className="w-7 h-7 rounded-full object-cover border-2 border-slate-950 ring-1 ring-slate-700"
                        />
                      ))}
                      {allocatedMembers.length === 0 && (
                        <span className="text-[11px] text-slate-500 italic">No members assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isActive && !isCompleted && (
                      <button
                        onClick={() => setActiveSprintId(s.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow"
                      >
                        Switch to Sprint →
                      </button>
                    )}

                    {isActive && !isCompleted && (
                      <button
                        onClick={() => completeSprint(s.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Archive className="w-3.5 h-3.5 text-amber-400" /> Complete Sprint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Edit Sprint Modal */}
      <AnimatePresence>
        {editingSprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleEditSprintSubmit}
              className="w-full max-w-2xl glass-panel bg-slate-950/95 border border-indigo-500/50 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-400" /> Edit Sprint Workspace: <span className="text-indigo-300 font-mono">{editingSprint.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingSprint(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sprint Title / Workspace Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sprint Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="planning">⏱️ Planning</option>
                    <option value="active">🟢 Active Live Workspace</option>
                    <option value="completed">📁 Archived / Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={e => setEditStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Target End Date</label>
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1 text-xs">Sprint Goal / Milestone Objective</label>
                <textarea
                  rows={2}
                  value={editGoal}
                  onChange={e => setEditGoal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Edit Allocated Team Members */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Allocated Team Members</span>
                  <span className="text-[11px] text-indigo-400 font-mono">{editMemberIds.length} members assigned</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {users.map(u => {
                    const isAssigned = editMemberIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleEditMemberSelection(u.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isAssigned
                            ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                          <div>
                            <p className="text-xs font-bold text-slate-200">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.department}</p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isAssigned ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isAssigned && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (editingSprint && confirm(`Are you sure you want to delete "${editingSprint.name}"?`)) {
                      deleteSprint(editingSprint.id);
                      setEditingSprint(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" /> Delete Sprint
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSprint(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30"
                  >
                    Update Sprint Changes
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
