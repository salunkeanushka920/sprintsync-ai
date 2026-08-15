import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar } from 'lucide-react';

export const SprintTimeline: React.FC = () => {
  const { tasks, sprint, users, currentUser, currentRole } = useApp();

  const userTimelineTasks = currentRole === 'user'
    ? tasks.filter(t => t.assignedToIds.includes(currentUser.id))
    : tasks;

  const days = [
    { name: 'Mon 10 Aug', date: '2026-08-10', label: 'Day 1: Setup & Design' },
    { name: 'Tue 11 Aug', date: '2026-08-11', label: 'Day 2: Core APIs & UI' },
    { name: 'Wed 12 Aug', date: '2026-08-12', label: 'Day 3: WhatsApp & AI' },
    { name: 'Thu 13 Aug', date: '2026-08-13', label: 'Day 4: Integration & QA' },
    { name: 'Fri 14 Aug', date: '2026-08-14', label: 'Day 5: Demo Day Pitch' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center gap-1.5">
              GANTT ROADMAP
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-purple-400" />
            Project Sprint Timeline & Gantt Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {sprint.name} — Goal: {sprint.goal}
          </p>
        </div>
      </div>

      {/* Timeline Gantt Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 overflow-x-auto">
        <div className="min-w-[800px]">
          
          {/* Days Header */}
          <div className="grid grid-cols-6 gap-2 border-b border-slate-800 pb-3 text-xs font-bold text-slate-400">
            <div>Deliverable / Task</div>
            {days.map((d, idx) => (
              <div key={idx} className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-200 block">{d.name}</span>
                <span className="text-[9px] text-indigo-400 font-normal">{d.label}</span>
              </div>
            ))}
          </div>

          {/* Task Timeline Rows */}
          <div className="divide-y divide-slate-800/60 mt-3 space-y-3">
            {userTimelineTasks.map(task => {
              const assignee = users.find(u => u.id === task.assignedToIds[0]);

              return (
                <div key={task.id} className="grid grid-cols-6 gap-2 items-center py-2 text-xs hover:bg-slate-900/40 rounded-xl transition-colors">
                  
                  {/* Task Name & Assignee */}
                  <div className="pr-2">
                    <p className="font-bold text-slate-200 truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                      {assignee && <img src={assignee.avatar} className="w-4 h-4 rounded-full" />}
                      <span>{assignee?.name.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Gantt Bar spanning across days */}
                  {days.map(d => {
                    const isTaskActiveOnDay =
                      new Date(task.startDate) <= new Date(d.date) &&
                      new Date(task.dueDate) >= new Date(d.date);

                    return (
                      <div key={d.date} className="px-1">
                        {isTaskActiveOnDay ? (
                          <div
                            className={`p-2 rounded-xl border text-[10px] font-bold text-center transition-all ${
                              task.status === 'completed'
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                : task.status === 'blocked'
                                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                                : 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                            }`}
                          >
                            {task.status.toUpperCase()}
                          </div>
                        ) : (
                          <div className="h-7 border border-dashed border-slate-800/60 rounded-xl" />
                        )}
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};
