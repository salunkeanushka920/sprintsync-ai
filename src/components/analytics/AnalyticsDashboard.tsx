import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Clock,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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

export const AnalyticsDashboard: React.FC = () => {
  const { tasks, users } = useApp();

  // 1. Burndown Chart Data (Ideal vs Actual remaining tasks)
  const burndownData = [
    { day: 'Day 1 (Mon)', ideal: 12, actual: 12 },
    { day: 'Day 2 (Tue)', ideal: 9, actual: 10 },
    { day: 'Day 3 (Wed)', ideal: 6, actual: 7 },
    { day: 'Day 4 (Thu)', ideal: 3, actual: 4 },
    { day: 'Day 5 (Fri)', ideal: 0, actual: 2 }
  ];

  // 2. Member Task Completion & Velocity
  const memberPerformanceData = users.map(u => {
    const userTasks = tasks.filter(t => t.assignedToIds.includes(u.id));
    const completed = userTasks.filter(t => t.status === 'completed').length;
    const inProgress = userTasks.filter(t => t.status === 'in_progress').length;
    const estHours = userTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    return {
      name: u.name.split(' ')[0],
      completed,
      inProgress,
      estHours
    };
  });

  // 3. Priority Distribution
  const criticalCount = tasks.filter(t => t.priority === 'critical').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const medCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  const priorityData = [
    { name: 'Critical 🔴', value: criticalCount, color: '#EF4444' },
    { name: 'High 🟠', value: highCount, color: '#F59E0B' },
    { name: 'Medium 🟡', value: medCount, color: '#4F7CFF' },
    { name: 'Low 🟢', value: lowCount, color: '#22C55E' }
  ];

  // 4. Estimated vs Actual Hours per Department
  const deptHoursData = [
    { dept: 'Frontend', estimated: 16, actual: 15 },
    { dept: 'Backend', estimated: 20, actual: 17.5 },
    { dept: 'AI/ML', estimated: 12, actual: 9 },
    { dept: 'Design', estimated: 8, actual: 7.5 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 flex items-center gap-1.5">
              RECHARTS METRICS ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Project Velocity & Sprint Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Burndown trajectory, member output benchmarks, priority heat map, and department workload hours.
          </p>
        </div>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sprint Burndown Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Sprint Burndown Trajectory
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Remaining Tasks</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="ideal" stroke="#4F7CFF" strokeDasharray="5 5" name="Ideal Burndown" />
                <Line type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={3} name="Actual Work Left" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Task Completion Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Member Task Output
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Completed vs Active</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" fill="#22C55E" name="Completed Tasks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" fill="#8B5CF6" name="In Progress" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priority Distribution Pie Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-400" /> Priority Distribution
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Task Urgency</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estimated vs Actual Hours per Department */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Estimated vs Actual Hours
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">By Department</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="dept" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="estimated" fill="#4F7CFF" name="Est. Hours" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#F59E0B" name="Actual Hours Spent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
