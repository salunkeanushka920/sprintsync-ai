export type UserRole = 'admin' | 'user';

export type TeamDepartment = 'Frontend' | 'Backend' | 'AI/ML' | 'Design' | 'Documentation' | 'Testing';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'blocked' | 'completed';

export type TaskTag = 'UI' | 'API' | 'AI' | 'Bug' | 'Research' | 'Docs' | 'Testing';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  department: TeamDepartment;
  avatar: string;
  bio: string;
  skills: string[];
  githubUsername?: string;
  linkedInUrl?: string;
  phoneNumber?: string;
  themePreference?: 'dark' | 'light';
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'code' | 'doc';
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToIds: string[]; // Contains userId
  createdBy: string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: TaskTag[];
  githubIssueUrl?: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  blockerReason?: string;
  progressNotes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'assigned' | 'priority' | 'deadline' | 'overdue' | 'comment' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}

export interface Standup {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
}

export interface GitHubCommit {
  id: string;
  hash: string;
  message: string;
  author: string;
  avatar: string;
  repo: string;
  date: string;
  url: string;
}

export interface GitHubPR {
  id: string;
  number: number;
  title: string;
  author: string;
  repo: string;
  status: 'open' | 'merged' | 'closed';
  url: string;
}

export interface WhatsAppMessage {
  id: string;
  recipientPhone: string;
  recipientName: string;
  type: 'task_assigned' | 'deadline_reminder' | 'overdue_alert' | 'announcement';
  taskTitle: string;
  messageText: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'planning' | 'completed';
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  pinned: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  date: string; // YYYY-MM-DD
  clockInTime: string; // HH:MM AM/PM
  clockOutTime?: string; // HH:MM AM/PM
  status: 'present' | 'late' | 'half_day' | 'absent';
  location: string;
  totalHours?: number;
}

