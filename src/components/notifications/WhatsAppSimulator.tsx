import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  CheckCheck,
  Settings as SettingsIcon,
  ShieldCheck,
  Phone,
  User,
  Sparkles
} from 'lucide-react';

export const WhatsAppSimulator: React.FC = () => {
  const {
    whatsAppMessages,
    sendWhatsAppNotification,
    whatsAppConfig,
    updateWhatsAppConfig,
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
  const [activePhoneTab, setActivePhoneTab] = useState<'preview' | 'settings'>('preview');

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

    sendWhatsAppNotification(
      targetPhone,
      targetName,
      selectedMsgType,
      customTitle,
      customText ? `🚀 *SprintSync*\n\n*${customTitle}*\n${customText}` : defaultBody
    );
    setCustomText('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> META & TWILIO WHATSAPP API CONNECTED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            WhatsApp Real-Time Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate & test automated WhatsApp push reminders for task assignments, 24h deadline alerts, overdue flags, and emergency standup broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePhoneTab(activePhoneTab === 'preview' ? 'settings' : 'preview')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-emerald-500/40 transition-all"
          >
            <SettingsIcon className="w-4 h-4 text-emerald-400" />
            <span>{activePhoneTab === 'preview' ? 'API Settings' : 'Live Mobile View'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls / Log, Right Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Test Dispatcher & History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {activePhoneTab === 'preview' ? (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" /> Instant Test Message Dispatcher
              </h3>

              <form onSubmit={handleSendTestMessage} className="space-y-4 text-xs">
                {/* Recipient Selection Mode */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">Recipient Mode</label>
                    <span className="text-[10px] text-emerald-400 font-normal">Select mode to dispatch WhatsApp text</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setRecipientMode('custom')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        recipientMode === 'custom'
                          ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" /> Direct Phone Input
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipientMode('registered')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        recipientMode === 'registered'
                          ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" /> Team Roster Member
                    </button>
                  </div>
                </div>

                {/* Conditional Recipient Inputs */}
                {recipientMode === 'custom' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200">Phone Number</label>
                        {currentUser?.phoneNumber && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomPhone(currentUser.phoneNumber || '');
                              setCustomName(currentUser.name || 'Me');
                            }}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
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
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 font-mono text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-200">Recipient Name / Label</label>
                      <input
                        type="text"
                        placeholder="e.g. My Phone / Personal Number"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-600 text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-300">Select Team Member</label>
                    <select
                      value={selectedUser}
                      onChange={e => setSelectedUser(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 focus:outline-none"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.phoneNumber || 'No phone set'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-300">Notification Type</label>
                  <select
                    value={selectedMsgType}
                    onChange={e => setSelectedMsgType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  >
                    <option value="task_assigned">🚀 New Task Assignment</option>
                    <option value="deadline_reminder">⏰ 24h Deadline Reminder</option>
                    <option value="overdue_alert">⚠️ Overdue Task Alert</option>
                    <option value="announcement">📢 Team Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300">Task Subject / Title</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300">Custom Message Body (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Leave empty to use standard automated WhatsApp template..."
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Trigger WhatsApp Webhook Push
                </button>
              </form>
            </div>
          ) : (
            /* API Configuration Panel */
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Twilio & Meta Cloud API Credentials
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300">Twilio Account SID</label>
                  <input
                    type="text"
                    value={whatsAppConfig.twilioSid}
                    onChange={e => updateWhatsAppConfig({ twilioSid: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300">Meta Cloud API Token</label>
                  <input
                    type="password"
                    value={whatsAppConfig.metaCloudToken}
                    onChange={e => updateWhatsAppConfig({ metaCloudToken: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300">WhatsApp Business Sender Number</label>
                  <input
                    type="text"
                    value={whatsAppConfig.senderPhone}
                    onChange={e => updateWhatsAppConfig({ senderPhone: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Sent Messages Log Table */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200">Outbound Message Delivery Log</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {whatsAppMessages.map(msg => (
                <div key={msg.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{msg.recipientName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.recipientPhone}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{msg.taskTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    <div className="flex items-center gap-1 justify-end text-[10px] text-emerald-400 font-bold mt-0.5">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Realistic Mobile Frame Mockup (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[320px] h-[600px] bg-slate-950 border-[8px] border-slate-900 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-800">
            
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-900 mx-auto rounded-b-xl z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-950" />
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#075E54] text-white p-3 pt-1 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                  SS
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">SprintSync AI Official</p>
                  <p className="text-[9px] text-emerald-200">Business Account • Online</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Chat Body */}
            <div className="flex-1 bg-[#0b141a] p-3 space-y-3 overflow-y-auto bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:12px_12px]">
              
              <div className="text-center my-1">
                <span className="px-2 py-0.5 text-[9px] bg-[#182229] text-slate-400 rounded-md">TODAY</span>
              </div>

              {whatsAppMessages.slice(0, 5).map(msg => (
                <div key={msg.id} className="max-w-[88%] bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tl-none shadow text-[11px] space-y-1 ml-auto">
                  <div className="whitespace-pre-line leading-relaxed font-sans">
                    {msg.messageText}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-3 h-3 text-cyan-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Phone Home Indicator Bar */}
            <div className="h-4 bg-slate-950 flex items-center justify-center">
              <div className="w-24 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
