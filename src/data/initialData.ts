import type { User, Task, Notification, Standup, GitHubCommit, GitHubPR, WhatsAppMessage, Sprint, TeamAnnouncement, AttendanceRecord } from '../types';

export const INITIAL_USERS: User[] = [];

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
