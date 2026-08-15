import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Phone,
  User,
  Sparkles
} from 'lucide-react';

export const WhatsAppSimulator: React.FC = () => {
  const {
    sendWhatsAppNotification,
    users,
    currentUser
  } = useApp();

  const [recipientMode, setRecipientMode] = useState<'custom' | 'registered'>('custom');
  const [selectedUser, setSelectedUser] = useState<string>(users[0]?.id || '');
  const [customPhone, setCustomPhone] = useState<string>(currentUser?.phoneNumber || '+14155552673');
  const [customName, setCustomName] = useState<string>(currentUser?.name || 'My Phone');
  const [selectedMsgType, setSelectedMsgType] = useState<
    'task_assigned' | 'deadline_reminder' | 'overdue_alert' | 'announcement'
  >('deadline_reminder');
  const [customTitle, setCustomTitle] = useState('Build API Integration');
  const [customText, setCustomText] = useState('');
  const [isAIEnhancing, setIsAIEnhancing] = useState(false);

  const handleAIEnhanceMessage = async () => {
    setIsAIEnhancing(true);

    const recipientName = recipientMode === 'registered'
      ? (users.find(u => u.id === selectedUser)?.name || 'Team Member')
      : (customName || 'Team Member');

    const geminiKey = localStorage.getItem('sprintsync_gemini_key') || '';

    if (geminiKey.trim()) {
      try {
        const prompt = `Enhance and polish the following WhatsApp notification message for software engineering team member "${recipientName}". Title: "${customTitle}". Message type: "${selectedMsgType}". Current raw notes: "${customText || 'Please complete this task on priority.'}". Make it high impact, professional, friendly, with WhatsApp markdown formatting (*bold*, _italic_, emojis). Keep concise under 300 chars.`;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (res.ok) {
          const data = await res.json();
          const aiOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiOutput) {
            setCustomText(aiOutput.trim());
            setIsAIEnhancing(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini API fetch error:', err);
      }
    }

    // Heuristic AI Enhancement Fallback
    setTimeout(() => {
      let polished = '';
      const recipientFirstName = recipientName.split(' ')[0];
      const rawBody = customText.trim();

      if (selectedMsgType === 'task_assigned') {
        polished = `🚀 *SprintSync AI Task Assignment*\n\nHi ${recipientFirstName}! You have been allocated a new high-priority sprint deliverable:\n📌 *${customTitle}*\n\n${rawBody ? `*Details*: ${rawBody}\n\n` : ''}Please check your SprintSync dashboard for full acceptance criteria and update your status!`;
      } else if (selectedMsgType === 'deadline_reminder') {
        polished = `⏰ *SprintSync 24h Deadline Reminder*\n\nHey ${recipientFirstName}! Friendly reminder that your assigned deliverable *${customTitle}* is due in *24 hours*.\n\n${rawBody ? `*Status Note*: ${rawBody}\n\n` : ''}If you encounter any blockers or need help, please flag it in your Daily Standup!`;
      } else if (selectedMsgType === 'overdue_alert') {
        polished = `⚠️ *SprintSync Overdue Alert*\n\nAttention ${recipientFirstName}: Task *${customTitle}* has exceeded its target completion date.\n\n${rawBody ? `*Notes*: ${rawBody}\n\n` : ''}Please update your status or request an admin deadline extension.`;
      } else {
        polished = `📢 *SprintSync Official Broadcast*\n\nTeam Update for ${recipientFirstName}:\n*${customTitle}*\n\n${rawBody || 'All hands on deck for upcoming milestone deliverables and dry run testing!'}`;
      }

      setCustomText(polished);
      setIsAIEnhancing(false);
    }, 500);
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetPhone = '';
    let targetName = '';

    if (recipientMode === 'registered') {
      const recipient = users.find(u => u.id === selectedUser) || users[0];
      targetPhone = recipient?.phoneNumber || '+14155550100';
      targetName = recipient?.name || 'Team Member';
    } else {
      targetPhone = customPhone.trim() || currentUser?.phoneNumber || '+14155550100';
      targetName = customName.trim() || currentUser?.name || 'My Phone';
    }

    let defaultBody = '';
    if (selectedMsgType === 'task_assigned') {
      defaultBody = `🚀 *SprintSync AI*\n\nYou have been assigned a new task:\n*${customTitle}*\n\nPriority: High\nDue: Tomorrow 6:00 PM`;
    } else if (selectedMsgType === 'deadline_reminder') {
      defaultBody = `⏰ *Reminder*: Your task *${customTitle}* is due in *24 hours*.\n\nPlease update your progress status.`;
    } else if (selectedMsgType === 'overdue_alert') {
      defaultBody = `⚠️ *Alert*: Your task *${customTitle}* is overdue.\n\nPlease complete it or request a deadline extension.`;
    } else {
      defaultBody = `📢 *SprintSync AI Announcement*\n\n*${customTitle}*\n${customText || 'All hands on deck for demo day dry run!'}`;
    }

    const finalMsgBody = customText ? `🚀 *SprintSync*\n\n*${customTitle}*\n${customText}` : defaultBody;

    // 1. Record Notification in App State
    sendWhatsAppNotification(
      targetPhone,
      targetName,
      selectedMsgType,
      customTitle,
      finalMsgBody
    );

    // 2. DIRECT REDIRECT TO NATIVE WHATSAPP APP / WHATSAPP WEB
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMsgBody)}`;
    window.open(whatsappUrl, '_blank');

    setCustomText('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> REAL-TIME WHATSAPP DISPATCHER
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            WhatsApp Message Center & Direct Dispatcher
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Type custom messages or select task reminders to immediately launch WhatsApp on your phone or desktop with pre-filled message text.
          </p>
        </div>
      </div>

      {/* Main Dispatcher Card */}
      <div className="max-w-3xl mx-auto">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 bg-slate-950/90 shadow-2xl">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" /> Instant Text Message Dispatcher
          </h3>

          <form onSubmit={handleSendTestMessage} className="space-y-5 text-xs">
            {/* Recipient Selection Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-200 text-xs">Select Recipient Mode</label>
                <span className="text-[11px] text-emerald-400 font-semibold">Redirects directly to WhatsApp App</span>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setRecipientMode('custom')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    recipientMode === 'custom'
                      ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Phone className="w-4 h-4" /> Direct Phone Input
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode('registered')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    recipientMode === 'registered'
                      ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <User className="w-4 h-4" /> Team Roster Member
                </button>
              </div>
            </div>

            {/* Conditional Recipient Inputs */}
            {recipientMode === 'custom' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/30">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-200">Phone Number (with Country Code)</label>
                    {currentUser?.phoneNumber && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPhone(currentUser.phoneNumber || '');
                          setCustomName(currentUser.name || 'Me');
                        }}
                        className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-fill Mine
                      </button>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210 or +1 415 555 0100"
                    value={customPhone}
                    onChange={e => setCustomPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-200 block mb-1">Recipient Name / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex (Frontend)"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="font-bold text-slate-300 block mb-1">Select Team Member</label>
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  {users.filter(u => u.id !== 'usr_shiv' && u.id !== 'usr_anushka' && !u.phoneNumber?.startsWith('+1415555')).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.phoneNumber || 'No phone set'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-300 block mb-1">Notification Type</label>
              <select
                value={selectedMsgType}
                onChange={e => setSelectedMsgType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              >
                <option value="task_assigned">🚀 New Task Assignment</option>
                <option value="deadline_reminder">⏰ 24h Deadline Reminder</option>
                <option value="overdue_alert">⚠️ Overdue Task Alert</option>
                <option value="announcement">📢 Team Announcement</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">Task Subject / Title</label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-300">Custom Message Body (Optional)</label>
                <button
                  type="button"
                  onClick={handleAIEnhanceMessage}
                  disabled={isAIEnhancing}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-extrabold text-[11px] flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAIEnhancing ? 'animate-spin' : ''}`} />
                  {isAIEnhancing ? 'AI Enhancing...' : '✨ Enhance Message with AI Co-Pilot'}
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Type raw notes or leave empty to let AI Co-Pilot generate a high-impact WhatsApp alert..."
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 active:scale-95 transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-slate-950" /> Send via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};
