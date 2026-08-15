import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Plus,
  Users,
  X,
  Sparkles,
  Archive,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ManageSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageSprintModal: React.FC<ManageSprintModalProps> = ({ isOpen, onClose }) => {
  const {
    sprints,
    activeSprintId,
    setActiveSprintId,
    addSprint,
    updateSprintById,
    completeSprint,
    users,
    currentRole
  } = useApp();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(users.map(u => u.id));

  if (!isOpen) return null;

  const toggleMemberSelection = (usrId: string) => {
    if (selectedMemberIds.includes(usrId)) {
      setSelectedMemberIds(prev => prev.filter(id => id !== usrId));
    } else {
      setSelectedMemberIds(prev => [...prev, usrId]);
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-slate-950/98 border border-indigo-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-[101]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100">Multi-Sprint & Workspace Management</h3>
                <p className="text-xs text-slate-400">Manage active sprints, team allocations, and project workspace goals</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Container with Scroll */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* Sprint List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">All Project Sprints ({sprints.length})</span>
              {currentRole === 'admin' && !isCreatingNew && (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create New Sprint
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {sprints.map(s => {
                const isActive = s.id === activeSprintId;
                const allocatedUsers = users.filter(u => (s.memberIds || []).includes(u.id));

                return (
                  <div
                    key={s.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-slate-100">{s.name}</h4>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border uppercase ${
                              s.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : s.status === 'planning'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">{s.goal}</p>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {s.startDate} to {s.endDate}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            onClick={() => {
                              setActiveSprintId(s.id);
                              if (s.status === 'planning') {
                                updateSprintById(s.id, { status: 'active' });
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-1 transition-all"
                          >
                            Switch to Sprint <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {currentRole === 'admin' && s.status === 'active' && (
                          <button
                            onClick={() => completeSprint(s.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1 transition-all"
                          >
                            <Archive className="w-3.5 h-3.5" /> Complete & Archive
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Team Members Allocated to Sprint */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-400" /> Allocated Team Members ({allocatedUsers.length}):
                      </span>

                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {allocatedUsers.map(u => (
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
                );
              })}
            </div>
          </div>

          {/* New Sprint Creation Form */}
          {isCreatingNew && (
            <form onSubmit={handleCreateSprintSubmit} className="glass-panel p-4 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Create New Sprint & Assign Team
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sprint Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprint 3 - Mobile Optimization"
                    value={newSprintName}
                    onChange={e => setNewSprintName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sprint Objective / Goal</label>
                  <textarea
                    rows={2}
                    placeholder="Key deliverables and focus areas..."
                    value={newSprintGoal}
                    onChange={e => setNewSprintGoal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={e => setNewStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">End Date</label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={e => setNewEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                    />
                  </div>
                </div>

                {/* Team Member Selector Chips */}
                <div>
                  <label className="font-bold text-slate-300 block mb-2">Allocate Team Members to Sprint</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {users.map(u => {
                      const isSel = selectedMemberIds.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => toggleMemberSelection(u.id)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isSel
                              ? 'bg-indigo-600/30 border-indigo-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
                          }`}
                        >
                          <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" />
                          <div className="truncate text-[11px]">
                            <div className="font-bold truncate">{u.name}</div>
                            <div className="text-[9px] text-slate-400">{u.department}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20"
                >
                  Save Sprint
                </button>
              </div>
            </form>
          )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
