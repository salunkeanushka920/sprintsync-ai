import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  LogOut,
  LogIn,
  User,
  MapPin,
  Timer
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const {
    currentUser,
    users,
    attendanceRecords,
    clockInUser,
    clockOutUser
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDateStr(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const myRecordToday = attendanceRecords.find(a => a.userId === currentUser.id && a.date === todayStr);

  const isClockedIn = !!myRecordToday && !myRecordToday.clockOutTime;

  const handleClockToggle = () => {
    if (isClockedIn) {
      clockOutUser(currentUser.id);
    } else {
      clockInUser(currentUser.id);
    }
  };

  const presentCount = attendanceRecords.filter(a => a.date === todayStr && a.status === 'present').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> DAILY WORKSHIFT ATTENDANCE
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            Attendance Tracker & Shift Punch
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Clock in to record entry timestamps, track work hours, and view team daily attendance status.
          </p>
        </div>

        {/* Digital Clock Box */}
        <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <Timer className="w-6 h-6 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-base font-black font-mono text-slate-100 block">{currentTime}</span>
            <span className="text-[10px] text-slate-400">{currentDateStr}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Clock In Action Card (Left), Attendance Summary (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Punch Card (5 Cols) */}
        <div className="md:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 bg-slate-950/80 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" /> My Attendance Card
              </h3>
              <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full border ${
                isClockedIn
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isClockedIn ? '🟢 CLOCKED IN' : '🔴 CLOCKED OUT'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5">
              <img src={currentUser.avatar} className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40" />
              <div>
                <h4 className="text-sm font-extrabold text-slate-100">{currentUser.name}</h4>
                <p className="text-xs text-slate-400">@{currentUser.username} • {currentUser.department}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Remote HQ (Mumbai)
                </div>
              </div>
            </div>

            {myRecordToday && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CLOCK IN TIME</span>
                  <span className="font-mono font-bold text-emerald-300">{myRecordToday.clockInTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CLOCK OUT TIME</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {myRecordToday.clockOutTime || 'Active Shift...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleClockToggle}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
              isClockedIn
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
            }`}
          >
            {isClockedIn ? (
              <>
                <LogOut className="w-4 h-4" /> Clock Out (End Shift)
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Clock In (Start Work Shift)
              </>
            )}
          </button>
        </div>

        {/* Attendance Statistics Grid (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Team</span>
              <p className="text-xl font-extrabold text-slate-100">{users.length}</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Present Today</span>
              <p className="text-xl font-extrabold text-emerald-300">{presentCount}</p>
            </div>
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">On Time Rate</span>
              <p className="text-xl font-extrabold text-purple-300">100%</p>
            </div>
          </div>

          {/* Today's Roster Status */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Today's Team Check-In Status
            </h3>
            <div className="space-y-2">
              {attendanceRecords.map(rec => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img src={rec.userAvatar} className="w-7 h-7 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-slate-200 block">{rec.userName}</span>
                      <span className="text-[10px] text-slate-400">{rec.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold block">{rec.clockInTime}</span>
                    <span className="text-[10px] text-slate-500">{rec.clockOutTime ? `Out: ${rec.clockOutTime}` : 'Working'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
