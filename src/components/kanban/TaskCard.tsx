import type { Task, User } from '../../types';
import {
  Clock,
  MessageSquare,
  Flame,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  users: User[];
  onTaskClick: (task: Task) => void;
  onMoveStatus: (taskId: string, direction: 'prev' | 'next') => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  onTaskClick,
  onMoveStatus
}) => {
  const assignees = users.filter(u => task.assignedToIds.includes(u.id));

  const priorityColors = {
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    medium: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  const priorityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };

  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer group shadow-lg ${
        task.status === 'blocked'
          ? 'border-rose-500/50 bg-rose-950/20'
          : isOverdue
          ? 'border-amber-500/50 bg-amber-950/20'
          : 'border-slate-800/80 hover:border-indigo-500/50 bg-slate-900/90'
      }`}
      onClick={() => onTaskClick(task)}
    >
      {/* Card Header: Priority & Quick Move Controls */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border flex items-center gap-1 ${priorityColors[task.priority]}`}>
            <span>{priorityIcons[task.priority]}</span>
            <span>{task.priority.toUpperCase()}</span>
          </span>
          {isOverdue && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-500 text-slate-950">
              OVERDUE
            </span>
          )}
        </div>

        {/* Move Column Arrows on Hover */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          {task.status !== 'todo' && (
            <button
              onClick={() => onMoveStatus(task.id, 'prev')}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Move left column"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {task.status !== 'completed' && (
            <button
              onClick={() => onMoveStatus(task.id, 'next')}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Move right column"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
        {task.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
        {task.description}
      </p>

      {/* Blocker Alert Banner if blocked */}
      {task.status === 'blocked' && task.blockerReason && (
        <div className="mt-2.5 p-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-[10px] text-rose-300 flex items-start gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">Blocker: {task.blockerReason}</span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {task.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-[9px] font-semibold rounded bg-slate-950 text-slate-400 border border-slate-800">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer: Due Date, Hours, Assignees & Comments */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {task.dueDate}
          </span>
          <span>{task.estimatedHours}h</span>
        </div>

        <div className="flex items-center gap-2">
          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}

          {/* Member Avatars */}
          <div className="flex -space-x-1.5">
            {assignees.map(u => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                className="w-5 h-5 rounded-full object-cover ring-2 ring-slate-900"
                title={u.name}
              />
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};
