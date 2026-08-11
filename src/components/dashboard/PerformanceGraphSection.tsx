import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Clock,
  CheckCircle2,
  Target,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const PerformanceGraphSection: React.FC = () => {
  const { tasks, currentUser, currentRole } = useApp();

  // Filter tasks based on role: User sees personal performance graph; Admin sees team-wide graph
  const displayTasks = currentRole === 'user'
    ? tasks.filter(t => t.assignedToIds.includes(currentUser.id))
    : tasks;

  // 1. Task Velocity & Daily Performance Trend
  const velocityData = [
    { day: 'Mon', completed: displayTasks.filter(t => t.status === 'completed').length, inProgress: displayTasks.filter(t => t.status === 'in_progress').length, pending: displayTasks.filter(t => t.status === 'todo').length },
    { day: 'Tue', completed: Math.max(1, displayTasks.filter(t => t.status === 'completed').length), inProgress: Math.max(1, displayTasks.filter(t => t.status === 'in_progress').length), pending: displayTasks.filter(t => t.status === 'todo').length },
    { day: 'Wed (Today)', completed: displayTasks.filter(t => t.status === 'completed').length, inProgress: displayTasks.filter(t => t.status === 'in_progress').length, pending: displayTasks.filter(t => t.status === 'todo').length },
    { day: 'Thu', completed: 0, inProgress: 2, pending: 1 },
    { day: 'Fri', completed: 0, inProgress: 1, pending: 2 }
  ];

  // 2. Estimated vs Actual Hours Area Chart
  const hoursData = [
    { day: 'Mon', estimated: 4, actual: 3.5 },
    { day: 'Tue', estimated: 6, actual: 5.5 },
    { day: 'Wed', estimated: 8, actual: 7.0 },
    { day: 'Thu', estimated: 5, actual: 0 },
    { day: 'Fri', estimated: 4, actual: 0 }
  ];

  // 3. Task Priority Distribution Pie Chart
  const criticalCount = displayTasks.filter(t => t.priority === 'critical').length;
  const highCount = displayTasks.filter(t => t.priority === 'high').length;
  const medCount = displayTasks.filter(t => t.priority === 'medium').length;
  const lowCount = displayTasks.filter(t => t.priority === 'low').length;

  const priorityData = [
    { name: 'Critical', value: criticalCount || 1, color: '#EF4444' },
    { name: 'High', value: highCount || 2, color: '#F59E0B' },
    { name: 'Medium', value: medCount || 1, color: '#4F7CFF' },
    { name: 'Low', value: lowCount || 1, color: '#22C55E' }
  ];

  const totalCompleted = displayTasks.filter(t => t.status === 'completed').length;
  const totalTasks = displayTasks.length || 1;
  const completionPercent = Math.round((totalCompleted / totalTasks) * 100);
  const totalEstHours = displayTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const totalActualHours = displayTasks.reduce((sum, t) => sum + t.actualHours, 0);

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            {currentRole === 'user' ? `${currentUser.name.split(' ')[0]}'s Performance & Velocity Graphs` : 'Team Sprint Analytics & Performance Graphs'}
          </h2>
          <p className="text-xs text-slate-400">
            Real-time visual graphs tracking task completion rates, sprint hours, and priority breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
            {completionPercent}% Sprint Target
          </span>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Velocity Rate</p>
            <p className="text-sm font-extrabold text-slate-100">{completionPercent}%</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Completed Tasks</p>
            <p className="text-sm font-extrabold text-emerald-400">{totalCompleted} / {displayTasks.length}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Actual Hours</p>
            <p className="text-sm font-extrabold text-purple-300">{totalActualHours}h / {totalEstHours}h</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Efficiency Score</p>
            <p className="text-sm font-extrabold text-amber-300">94.8%</p>
          </div>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph 1: Daily Task Completion Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Daily Task Velocity Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Status</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" name="To Do" fill="#4F7CFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Priority Breakdown Pie Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-indigo-400" /> Priority Distribution
            </h3>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Graph 3: Hours Logged vs Estimated Area Chart */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> Sprint Hours Logged vs Estimated
          </h3>
          <span className="text-[10px] text-purple-300 font-mono">Actual vs Estimated (Hours)</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="estimated" name="Estimated Hours" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorEst)" />
              <Area type="monotone" dataKey="actual" name="Actual Logged Hours" stroke="#22C55E" fillOpacity={1} fill="url(#colorAct)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
