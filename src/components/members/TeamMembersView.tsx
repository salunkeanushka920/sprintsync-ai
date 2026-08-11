import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole, TeamDepartment } from '../../types';
import {
  Users,
  Plus,
  GitBranch,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeamMembersView: React.FC = () => {
  const { users, addUser, deleteUser, currentRole, tasks } = useApp();

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [department, setDepartment] = useState<TeamDepartment>('Frontend');
  const [skills] = useState('React, TypeScript, Tailwind');
  const [githubUsername, setGithubUsername] = useState('dev-user');
  const [phoneNumber, setPhoneNumber] = useState('+14155559988');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      email,
      role,
      department,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      bio: `${department} team contributor`,
      skills: skills.split(',').map(s => s.trim()),
      githubUsername,
      phoneNumber
    });

    setName('');
    setEmail('');
    setIsAddUserOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
              ROSTER CONTROL
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            Hackathon Team Members & Role Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Assign team roles (Frontend, Backend, AI/ML, Design, Documentation, Testing), manage GitHub profiles & WhatsApp alert contact numbers.
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        )}
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => {
          const userTasks = tasks.filter(t => t.assignedToIds.includes(u.id));
          const completedCount = userTasks.filter(t => t.status === 'completed').length;

          return (
            <div
              key={u.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{u.name}</h3>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-slate-300">
                        {u.department}
                      </span>
                    </div>
                  </div>
                </div>

                {currentRole === 'admin' && u.id !== 'usr_1' && (
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed italic">{u.bio}</p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1">
                {u.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 text-[9px] font-mono rounded bg-slate-900 border border-slate-800 text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400">
                  <span className="text-emerald-400 font-bold">{completedCount}</span> / {userTasks.length} tasks done
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <GitBranch className="w-3.5 h-3.5" /> @{u.githubUsername}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-400" /> Add New Team Member
                </h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@sprintsync.ai"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300">Platform Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as any)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      <option value="user">User / Team Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300">Department Team</label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value as any)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Design">Design</option>
                      <option value="Documentation">Documentation</option>
                      <option value="Testing">Testing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300">GitHub Username</label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={e => setGithubUsername(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
