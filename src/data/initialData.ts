import type { User, Task, Notification, Standup, GitHubCommit, GitHubPR, WhatsAppMessage, Sprint, TeamAnnouncement, AttendanceRecord } from '../types';

export const DEFAULT_FALLBACK_USER: User = {
  id: 'usr_default',
  name: 'Workspace User',
  username: 'workspace_user',
  email: 'user@sprintsync.ai',
  role: 'user',
  department: 'Frontend',
  avatar: 'https://ui-avatars.com/api/?name=Workspace+User&background=1e293b&color=cbd5e1&size=150',
  bio: 'SprintSync Project Workspace Member',
  skills: ['React', 'TypeScript', 'TailwindCSS'],
  phoneNumber: '+91 9876543210'
};

export const INITIAL_USERS: User[] = [DEFAULT_FALLBACK_USER];

export const INITIAL_SPRINTS: Sprint[] = [];

export const INITIAL_SPRINT: Sprint = {
  id: 'sprint_empty',
  name: 'No Active Sprint Workspace',
  goal: 'No active sprint workspace. Create a new sprint workspace from the Sprint Workspaces menu.',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
  status: 'planning',
  memberIds: []
};

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_NOTIFICATIONS: Notification[] = [];

export const INITIAL_STANDUPS: Standup[] = [];

export const INITIAL_COMMITS: GitHubCommit[] = [];

export const INITIAL_PRS: GitHubPR[] = [];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [];

export const INITIAL_ANNOUNCEMENTS: TeamAnnouncement[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
