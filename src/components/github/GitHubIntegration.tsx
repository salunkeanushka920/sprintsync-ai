import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  FolderGit2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { GitHubCommit, GitHubPR } from '../../types';

export const GitHubIntegration: React.FC = () => {
  const { githubCommits, githubPRs } = useApp();

  const [repoInput, setRepoInput] = useState('salunkeanushka920/sprintsync-ai');
  const [githubToken, setGithubToken] = useState(localStorage.getItem('sprintsync_github_pat') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [liveCommits, setLiveCommits] = useState<GitHubCommit[]>(githubCommits);
  const [livePRs, setLivePRs] = useState<GitHubPR[]>(githubPRs);
  const [activeRepoName, setActiveRepoName] = useState('salunkeanushka920/sprintsync-ai');

  const fetchLiveGitHubData = async (targetRepo: string) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRepo = targetRepo.trim().replace('https://github.com/', '');
    if (!cleanRepo || !cleanRepo.includes('/')) {
      setErrorMsg('Please enter a valid repo in format "owner/repository" (e.g. salunkeanushka920/sprintsync-ai)');
      setIsLoading(false);
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (githubToken.trim()) {
        headers['Authorization'] = `token ${githubToken.trim()}`;
        localStorage.setItem('sprintsync_github_pat', githubToken.trim());
      }

      // 1. Fetch real commits from GitHub REST API
      const commitsRes = await fetch(`https://api.github.com/repos/${cleanRepo}/commits?per_page=10`, { headers });
      if (!commitsRes.ok) {
        throw new Error(`GitHub API returned status ${commitsRes.status}. Make sure repo exists and is public (or provide PAT).`);
      }
      const commitsData = await commitsRes.json();

      const mappedCommits: GitHubCommit[] = commitsData.map((c: any) => ({
        id: c.sha,
        hash: c.sha.substring(0, 7),
        message: c.commit.message.split('\n')[0],
        author: c.author?.login || c.commit.author?.name || 'developer',
        avatar: c.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        repo: cleanRepo,
        date: new Date(c.commit.author?.date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        url: c.html_url
      }));

      setLiveCommits(mappedCommits);

      // 2. Fetch real Pull Requests from GitHub REST API
      try {
        const prsRes = await fetch(`https://api.github.com/repos/${cleanRepo}/pulls?state=all&per_page=5`, { headers });
        if (prsRes.ok) {
          const prsData = await prsRes.json();
          const mappedPRs: GitHubPR[] = prsData.map((p: any) => ({
            id: String(p.id),
            number: p.number,
            title: p.title,
            author: p.user?.login || 'developer',
            repo: cleanRepo,
            status: p.merged_at ? 'merged' : p.state === 'open' ? 'open' : 'closed',
            url: p.html_url
          }));
          setLivePRs(mappedPRs);
        }
      } catch {
        // Fallback for PRs if none
      }

      setActiveRepoName(cleanRepo);
      setSuccessMsg(`Successfully fetched live GitHub data for ${cleanRepo}!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch live data from GitHub API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveGitHubData('salunkeanushka920/sprintsync-ai');
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" /> LIVE GITHUB REST API CONNECTED
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-2 flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-blue-400" />
            GitHub Live Repository Synchronization
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Fetch live commit logs, real Pull Request states, and commit hashes directly from GitHub's REST API.
          </p>
        </div>

        <button
          onClick={() => fetchLiveGitHubData(repoInput)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/25 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync Live Repos'}</span>
        </button>
      </div>

      {/* GitHub Repository Search Bar & Optional Token */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-blue-400" /> Connect GitHub Repository
        </h3>

        <form onSubmit={e => { e.preventDefault(); fetchLiveGitHubData(repoInput); }} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-6">
            <label className="font-bold text-slate-300 block mb-1">GitHub Repository (owner/repo)</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="salunkeanushka920/sprintsync-ai or facebook/react"
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="font-bold text-slate-300 block mb-1">GitHub Personal Token (Optional for Private Repos)</label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxx (optional)"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 font-bold text-xs transition-all"
            >
              Fetch Live Data
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Grid: Commits Feed vs Open PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Commit Activity Feed */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-purple-400" />
              Live GitHub Commit Stream ({liveCommits.length})
            </h3>
            <span className="text-[10px] font-mono text-blue-400 font-semibold">{activeRepoName}</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {liveCommits.map(commit => (
              <div key={commit.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={commit.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-200">@{commit.author}</span>
                  </div>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-blue-900 text-blue-300 transition-colors flex items-center gap-1"
                  >
                    {commit.hash} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">{commit.message}</p>
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-emerald-400" />
              Live Pull Requests ({livePRs.length})
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">{activeRepoName}</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {livePRs.length > 0 ? (
              livePRs.map(pr => (
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
                    <span className="text-slate-400">Auto-links to sprint Kanban tasks</span>
                    <a href={pr.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1 font-mono font-semibold">
                      Open on GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 rounded-xl bg-slate-900/40 border border-slate-800">
                No active pull requests found in repository {activeRepoName}.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
