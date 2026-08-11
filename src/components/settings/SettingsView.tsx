import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Database, MessageSquare } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { whatsAppConfig, updateWhatsAppConfig, sprint, updateSprint } = useApp();

  return (
    <div className="space-y-6 pb-12">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" /> Platform & Workspace Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage active sprint goals, WhatsApp Cloud API keys, database connection strings, and UI preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Sprint Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" /> Sprint Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">Sprint Name</label>
              <input
                type="text"
                value={sprint.name}
                onChange={e => updateSprint({ name: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Sprint Goal & Objective</label>
              <textarea
                rows={2}
                value={sprint.goal}
                onChange={e => updateSprint({ goal: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={sprint.startDate}
                  onChange={e => updateSprint({ startDate: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300">End Date</label>
                <input
                  type="date"
                  value={sprint.endDate}
                  onChange={e => updateSprint({ endDate: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Integrations Config */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Twilio & Meta Credentials
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
              <label className="font-bold text-slate-300">Meta Cloud API Permanent Token</label>
              <input
                type="password"
                value={whatsAppConfig.metaCloudToken}
                onChange={e => updateWhatsAppConfig({ metaCloudToken: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Sender Phone Number</label>
              <input
                type="text"
                value={whatsAppConfig.senderPhone}
                onChange={e => updateWhatsAppConfig({ senderPhone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
