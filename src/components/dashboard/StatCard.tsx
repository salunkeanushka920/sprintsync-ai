import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color = 'blue',
  onClick
}) => {
  const colorStyles = {
    blue: 'from-blue-600/20 to-indigo-600/20 text-blue-400 border-blue-500/30',
    purple: 'from-purple-600/20 to-pink-600/20 text-purple-400 border-purple-500/30',
    emerald: 'from-emerald-600/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/30',
    rose: 'from-rose-600/20 to-red-600/20 text-rose-400 border-rose-500/30'
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`glass-panel p-4 rounded-2xl border bg-gradient-to-br transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-500/50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorStyles[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-slate-100 tracking-tight">{value}</span>
        {change && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
};
