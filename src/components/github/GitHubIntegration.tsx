import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  FolderGit2,
  RefreshCw
} from 'lucide-react';

export const GitHubIntegration: React.FC = () => {
  const { githubCommits, githubPRs } = useApp();

  const repos = [
    { name: 'sprintsync-ai-core', branches: 4, openPRs: 2, lastSync: '2 mins ago', status: 'connected' },
    { name: 'sprintsync-ai-web', branches: 6, openPRs: 1, lastSync: '5 mins ago', status: 'connected' },
    { name: 'sprintsync-ai-ml', branches: 2, openPRs: 0, lastSync: '15 mins ago', status: 'connected' }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" /> GITHUB REST API CONNECTED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-blue-400" />
            GitHub Repository & PR Synchronization
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time commit streams, pull request reviews, automated task status updates on PR merge, and contribution metrics.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-xs font-bold text-slate-200 transition-all">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} /> Sync Repositories Now
        </button>
      </div>

      {/* Connected Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {repos.map((repo, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" /> {repo.name}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {repo.branches} active branches • {repo.openPRs} open PRs
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Synced {repo.lastSync}</span>
              <a href={`https://github.com/sprintsync/${repo.name}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Commits Feed vs Open PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Commit Activity Feed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-purple-400" />
            Recent Commit Stream ({githubCommits.length})
          </h3>

          <div className="space-y-3">
            {githubCommits.map(commit => (
              <div key={commit.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={commit.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-200">@{commit.author}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                    {commit.hash}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{commit.message}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Repo: {commit.repo}</span>
                  <span>{commit.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pull Requests & Auto-Sync Status */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            Pull Requests Awaiting Review ({githubPRs.length})
          </h3>

          <div className="space-y-3">
            {githubPRs.map(pr => (
              <div key={pr.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-100">
                      #{pr.number}: {pr.title}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Author: @{pr.author} • Repo: {pr.repo}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    pr.status === 'open' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {pr.status.toUpperCase()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px]">
                  <span className="text-slate-400">Auto-moves linked task to In Review</span>
                  <a href={pr.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 font-mono">
                    Open PR <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
