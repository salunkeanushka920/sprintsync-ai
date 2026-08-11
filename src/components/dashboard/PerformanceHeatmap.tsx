import type { User, Task } from '../../types';
import { Flame } from 'lucide-react';

interface PerformanceHeatmapProps {
  users: User[];
  tasks: Task[];
}

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ users, tasks }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Team Velocity & Productivity Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active task contributions per member for current hackathon sprint
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
          Last 7 Days
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800">
              <th className="pb-2 font-semibold">Member</th>
              <th className="pb-2 font-semibold">Role</th>
              <th className="pb-2 text-center font-semibold">Done</th>
              <th className="pb-2 text-center font-semibold">Active</th>
              {days.map(d => (
                <th key={d} className="pb-2 text-center font-semibold px-1">
                  {d}
                </th>
              ))}
              <th className="pb-2 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((user, idx) => {
              const userTasks = tasks.filter(t => t.assignedToIds.includes(user.id));
              const completedCount = userTasks.filter(t => t.status === 'completed').length;
              const activeCount = userTasks.filter(t => t.status !== 'completed').length;
              const score = Math.min(100, Math.round((completedCount * 30) + (userTasks.length * 10) + 40));

              // Seed mock intensity 0..4 for heatmap cells
              const intensityPattern = [
                [2, 4, 3, 4, 1, 0, 0],
                [3, 2, 4, 3, 2, 1, 0],
                [1, 3, 3, 4, 2, 0, 0],
                [4, 4, 2, 3, 3, 1, 0],
                [2, 3, 4, 2, 1, 0, 0],
                [1, 2, 3, 3, 2, 0, 0]
              ][idx % 6];

              return (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 font-semibold text-slate-200 flex items-center gap-2">
                    <img src={user.avatar} className="w-6 h-6 rounded-full object-cover" />
                    <span className="truncate max-w-[110px]">{user.name}</span>
                  </td>
                  <td className="py-2.5 text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] border border-slate-800">
                      {user.department}
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-bold text-emerald-400">{completedCount}</td>
                  <td className="py-2.5 text-center font-bold text-amber-400">{activeCount}</td>
                  
                  {intensityPattern.map((val, cellIdx) => {
                    const bgColors = [
                      'bg-slate-900 border-slate-800',
                      'bg-indigo-950 border-indigo-900 text-indigo-300',
                      'bg-indigo-800/60 border-indigo-700 text-indigo-200',
                      'bg-indigo-600 border-indigo-500 text-white font-bold',
                      'bg-emerald-500 border-emerald-400 text-slate-950 font-extrabold'
                    ];
                    return (
                      <td key={cellIdx} className="py-2.5 text-center px-1">
                        <div
                          className={`w-6 h-6 mx-auto rounded-md border flex items-center justify-center text-[10px] transition-all hover:scale-110 ${bgColors[val]}`}
                          title={`Day ${days[cellIdx]}: ${val * 2} commits / updates`}
                        >
                          {val > 0 ? val : ''}
                        </div>
                      </td>
                    );
                  })}

                  <td className="py-2.5 text-right font-extrabold text-indigo-400">{score}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
