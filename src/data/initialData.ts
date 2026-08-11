import type { User, Task, Notification, Standup, GitHubCommit, GitHubPR, WhatsAppMessage, Sprint, TeamAnnouncement } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_shiv',
    name: 'Shiv',
    username: 'shiv_admin',
    email: 'shiv@sprintsync.ai',
    passwordHash: 'shiv123', // Admin password handled securely
    role: 'admin', // SOLE FIXED ADMIN
    department: 'Backend',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Hackathon Admin & Systems Operator for SprintSync',
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
    bio: 'Frontend Specialist crafting glassmorphic UI components & interactive features',
    skills: ['React', 'TailwindCSS', 'TypeScript', 'Framer Motion', 'UI Design'],
    githubUsername: 'anushka-dev',
    linkedInUrl: 'https://linkedin.com/in/anushka-dev',
    phoneNumber: '+14155552673',
    themePreference: 'dark'
  },
  {
    id: 'usr_subhadip',
    name: 'Subhadip',
    username: 'subhadip_api',
    email: 'subhadip@sprintsync.ai',
    passwordHash: 'password123',
    role: 'user',
    department: 'Backend',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'API & Microservices Architect',
    skills: ['Express', 'Prisma', 'PostgreSQL', 'Docker'],
    githubUsername: 'subhadip-backend',
    phoneNumber: '+14155552672'
  }
];

export const INITIAL_SPRINT: Sprint = {
  id: 'sprint_1',
  name: 'SprintSync Hackathon MVP Launch',
  goal: 'Deliver a high-impact personalized hackathon workspace with user task isolation, deadlines, and automated notifications',
  startDate: '2026-08-10',
  endDate: '2026-08-14',
  status: 'active'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk_1',
    title: 'Design Glassmorphic User Workspace & Dashboard',
    description: 'Build responsive dark mode UI layout for user workspace, top nav, personal metrics cards, and task progress widgets.',
    priority: 'high',
    status: 'completed',
    assignedToIds: ['usr_anushka'],
    createdBy: 'usr_shiv',
    startDate: '2026-08-10',
    dueDate: '2026-08-11',
    estimatedHours: 6,
    actualHours: 5.5,
    tags: ['UI'],
    githubIssueUrl: 'https://github.com/sprintsync/sprintsync-ai/issues/101',
    comments: [
      { id: 'cmt_1', userId: 'usr_shiv', userName: 'Shiv (Admin)', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', content: 'Design looks super clean and responsive!', createdAt: '2026-08-10T14:30:00Z' }
    ]
  },
  {
    id: 'tsk_2',
    title: 'Implement Multi-Step Registration Wizard UI',
    description: 'Build 3-step registration flow: Basic Info -> Security & Password -> Profile Personalization & Workspace Creation.',
    priority: 'critical',
    status: 'in_progress',
    assignedToIds: ['usr_anushka'],
    createdBy: 'usr_shiv',
    startDate: '2026-08-11',
    dueDate: '2026-08-12',
    estimatedHours: 7,
    actualHours: 4,
    tags: ['UI', 'API'],
    githubIssueUrl: 'https://github.com/sprintsync/sprintsync-ai/issues/102',
    progressNotes: 'Completed step 1 & step 2 forms; wiring up step 3 profile preview.'
  },
  {
    id: 'tsk_3',
    title: 'Build Profile Settings & Personalization Form',
    description: 'Allow users to edit profile photo, display name, bio, skills, GitHub, LinkedIn, and theme preference.',
    priority: 'high',
    status: 'todo',
    assignedToIds: ['usr_anushka'],
    createdBy: 'usr_shiv',
    startDate: '2026-08-12',
    dueDate: '2026-08-13',
    estimatedHours: 5,
    actualHours: 0,
    tags: ['UI']
  },
  {
    id: 'tsk_4',
    title: 'PostgreSQL Database Schema & Query Optimization',
    description: 'Set up indexing and foreign key constraints for users, tasks, and notifications tables.',
    priority: 'critical',
    status: 'in_progress',
    assignedToIds: ['usr_subhadip'],
    createdBy: 'usr_shiv',
    startDate: '2026-08-10',
    dueDate: '2026-08-12',
    estimatedHours: 8,
    actualHours: 6,
    tags: ['API']
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_anushka',
    type: 'assigned',
    title: '🚀 New Task Assigned by Shiv',
    message: 'You have been assigned to "Implement Multi-Step Registration Wizard UI". Priority: Critical.',
    read: false,
    createdAt: '2026-08-11T09:00:00Z',
    taskId: 'tsk_2'
  },
  {
    id: 'notif_2',
    userId: 'usr_anushka',
    type: 'deadline',
    title: '⏰ Task Due Tomorrow',
    message: 'Your task "Implement Multi-Step Registration Wizard UI" is due tomorrow at 6:00 PM.',
    read: false,
    createdAt: '2026-08-11T16:00:00Z',
    taskId: 'tsk_2'
  },
  {
    id: 'notif_3',
    userId: 'usr_anushka',
    type: 'announcement',
    title: '📢 Workspace Created',
    message: 'Welcome to your private SprintSync workspace, Anushka!',
    read: true,
    createdAt: '2026-08-10T08:00:00Z'
  }
];

export const INITIAL_STANDUPS: Standup[] = [
  {
    id: 'std_1',
    userId: 'usr_anushka',
    userName: 'Anushka',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2026-08-11',
    yesterday: 'Completed glassmorphic design system and UI components.',
    today: 'Building multi-step registration wizard and user workspace views.',
    blockers: 'None!',
    createdAt: '2026-08-11T09:30:00Z'
  }
];

export const INITIAL_COMMITS: GitHubCommit[] = [
  {
    id: 'cmt_101',
    hash: 'a7b39f2',
    message: 'feat(ui): add glassmorphism dashboard layout & multi-step registration wizard',
    author: 'anushka-dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    repo: 'sprintsync-web',
    date: '2 hours ago',
    url: 'https://github.com/sprintsync/sprintsync-ai/commit/a7b39f2'
  }
];

export const INITIAL_PRS: GitHubPR[] = [
  {
    id: 'pr_1',
    number: 12,
    title: 'ui: Add user data isolation & profile personalization screen',
    author: 'anushka-dev',
    repo: 'sprintsync-web',
    status: 'open',
    url: 'https://github.com/sprintsync/sprintsync-ai/pull/12'
  }
];

export const INITIAL_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'wa_1',
    recipientPhone: '+14155552673',
    recipientName: 'Anushka',
    type: 'task_assigned',
    taskTitle: 'Implement Multi-Step Registration Wizard UI',
    messageText: '🚀 *SprintSync*\n\nYou have been assigned a new task:\n*Implement Multi-Step Registration Wizard UI*\n\nPriority: Critical\nDue: 12 Aug, 6:00 PM',
    timestamp: '2026-08-11 09:00 AM',
    status: 'delivered'
  }
];

export const INITIAL_ANNOUNCEMENTS: TeamAnnouncement[] = [
  {
    id: 'ann_1',
    title: '🚀 Private Workspace Environment Ready',
    content: 'Welcome team! Each user has their own private workspace for personal tasks and deadlines. Shiv manages task operations via the dedicated admin portal.',
    authorName: 'Shiv (Admin)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-08-10T12:00:00Z',
    pinned: true
  }
];

export const INITIAL_ATTENDANCE = [
  {
    id: 'att_1',
    userId: 'usr_anushka',
    userName: 'Anushka',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '2026-08-11',
    clockInTime: '09:15 AM',
    clockOutTime: undefined,
    status: 'present' as const,
    location: 'Remote HQ (Mumbai)',
    totalHours: 6.5
  },
  {
    id: 'att_2',
    userId: 'usr_subhadip',
    userName: 'Subhadip',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '2026-08-11',
    clockInTime: '09:00 AM',
    clockOutTime: '05:30 PM',
    status: 'present' as const,
    location: 'Office Desk 4B',
    totalHours: 8.5
  },
  {
    id: 'att_3',
    userId: 'usr_shiv',
    userName: 'Shiv',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    date: '2026-08-11',
    clockInTime: '08:45 AM',
    clockOutTime: undefined,
    status: 'present' as const,
    location: 'Admin Server Room',
    totalHours: 7.0
  }
];

