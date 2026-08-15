import React from 'react';
import { LayoutDashboard, Kanban, Users, Activity, MessageSquare, Clock } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'standup', label: 'Standups', icon: Activity },
    { id: 'members', label: 'Team', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel bg-slate-950/95 border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-400'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
