import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  User,
  Activity,
  GitBranch,
  Calendar,
  MessageSquare,
  Clock,
  Settings,
  Sparkles,
  Users,
  BarChart3,
  Flame,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { tasks, sprints, currentRole, currentUser, setIsAIAssistantOpen } = useApp();

  const myTasks = tasks.filter(t => t.assignedToIds.includes(currentUser.id));
  const overdueCount = myTasks.filter(
    t => t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;

  const userNavItems = [
    { id: 'dashboard', label: 'My Workspace', icon: LayoutDashboard, badge: null },
    { id: 'kanban', label: 'My Tasks', icon: Kanban, badge: myTasks.length },
    { id: 'sprints', label: 'Sprint Workspaces', icon: Layers, badge: sprints.length },
    { id: 'attendance', label: 'Work Attendance', icon: Clock, badge: 'Punch' },
    { id: 'timeline', label: 'My Deadlines', icon: Calendar, badge: null },
    { id: 'standup', label: 'Daily Standup', icon: Activity, badge: null },
    { id: 'profile', label: 'Profile Settings', icon: User, badge: null },
    { id: 'github', label: 'GitHub Activity', icon: GitBranch, badge: 'Live' },
    { id: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare, badge: null }
  ];

  const adminNavItems = [
    { id: 'members', label: 'Team Members', icon: Users, badge: null },
    { id: 'analytics', label: 'Team Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Sprint Settings', icon: Settings, badge: null }
  ];

  const currentNav = currentRole === 'admin' ? [...userNavItems, ...adminNavItems] : userNavItems;

  return (
    <aside className="w-64 hidden lg:flex flex-col justify-between glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      <div className="space-y-6">
        
        {/* Workspace Owner Card */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <img src={currentUser.avatar} className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40" />
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
              {currentRole === 'admin' ? 'Admin Portal' : 'Private Workspace'}
            </p>
            <p className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</p>
          </div>
        </div>

        {/* Overdue Warning Alert if any */}
        {overdueCount > 0 && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
              <span>{overdueCount} Overdue Tasks</span>
            </div>
            <button
              onClick={() => setActiveTab('kanban')}
              className="text-[10px] font-bold underline hover:text-rose-200"
            >
              Fix
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          {currentNav.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Live'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom AI Assistant Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex p-2 rounded-xl bg-indigo-600/20 text-amber-300 border border-indigo-500/30">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-100">AI Productivity Copilot</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Auto standup updates & task suggestions.
          </p>
        </div>
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="w-full py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-purple-600/25"
        >
          Open AI Copilot
        </button>
      </div>
    </aside>
  );
};
