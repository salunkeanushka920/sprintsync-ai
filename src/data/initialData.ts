import type { User, Task, Notification, Standup, GitHubCommit, GitHubPR, WhatsAppMessage, Sprint, TeamAnnouncement, AttendanceRecord } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_shiv',
    name: 'Shiv',
    username: 'shiv_admin',
    email: 'shiv@sprintsync.ai',
    passwordHash: 'shiv123',
    role: 'admin',
    department: 'Backend',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Workspace Administrator & Systems Operator for SprintSync',
    skills: ['System Design', 'Task Operations', 'Team Management', 'Security'],
    githubUsername: 'shiv-admin',
    phoneNumber: '+14155550100'
  },
  {
    id: 'usr_anushka',
    name: 'Anushka',
    username: 'anushka_dev',
    email: 'anushka@sprintsync.ai',
    passwordHash: 'password123',
    role: 'user',
    department: 'Frontend',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Frontend Specialist & Core Product Developer',
    skills: ['React', 'TailwindCSS', 'TypeScript', 'Framer Motion', 'UI Design'],
    githubUsername: 'anushka-dev',
    linkedInUrl: 'https://linkedin.com/in/anushka-dev',
    phoneNumber: '+14155552673',
    themePreference: 'dark'
  }
];

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
