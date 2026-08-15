import type {
  User,
  Task,
  Notification,
  Standup,
  WhatsAppMessage,
  Sprint,
  TeamAnnouncement,
  AttendanceRecord
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STANDUPS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_SPRINT,
  INITIAL_SPRINTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ATTENDANCE
} from '../data/initialData';

const DB_KEYS = {
  USERS: 'sprintsync_users',
  ACTIVE_USER_ID: 'sprintsync_active_user_id',
  IS_AUTHENTICATED: 'sprintsync_is_authenticated',
  TASKS: 'sprintsync_tasks',
  STANDUPS: 'sprintsync_standups',
  NOTIFICATIONS: 'sprintsync_notifications',
  WHATSAPP_MESSAGES: 'sprintsync_whatsapp_messages',
  SPRINT: 'sprintsync_sprint',
  ANNOUNCEMENTS: 'sprintsync_announcements',
  ATTENDANCE: 'sprintsync_attendance',
  WHATSAPP_CONFIG: 'sprintsync_whatsapp_config'
};

export interface WhatsAppConfig {
  twilioSid: string;
  twilioAuthToken: string;
  metaCloudToken: string;
  senderPhone: string;
  isConnected: boolean;
  webhookUrl?: string;
  enableAudioAlerts?: boolean;
}

export const dbService = {
  // Users
  getUsers: (): User[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  },

  // Active Session
  getActiveUserId: (): string => {
    return localStorage.getItem(DB_KEYS.ACTIVE_USER_ID) || 'usr_anushka';
  },
  setActiveUserId: (id: string) => {
    localStorage.setItem(DB_KEYS.ACTIVE_USER_ID, id);
  },

  getIsAuthenticated: (): boolean => {
    return localStorage.getItem(DB_KEYS.IS_AUTHENTICATED) === 'true';
  },
  setIsAuthenticated: (auth: boolean) => {
    localStorage.setItem(DB_KEYS.IS_AUTHENTICATED, auth ? 'true' : 'false');
  },

  // Tasks
  getTasks: (): Task[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Standups
  getStandups: (): Standup[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.STANDUPS);
      return data ? JSON.parse(data) : INITIAL_STANDUPS;
    } catch {
      return INITIAL_STANDUPS;
    }
  },
  saveStandups: (standups: Standup[]) => {
    localStorage.setItem(DB_KEYS.STANDUPS, JSON.stringify(standups));
  },

  // Notifications
  getNotifications: (): Notification[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(DB_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  // WhatsApp Messages
  getWhatsAppMessages: (): WhatsAppMessage[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.WHATSAPP_MESSAGES);
      return data ? JSON.parse(data) : INITIAL_WHATSAPP_MESSAGES;
    } catch {
      return INITIAL_WHATSAPP_MESSAGES;
    }
  },
  saveWhatsAppMessages: (messages: WhatsAppMessage[]) => {
    localStorage.setItem(DB_KEYS.WHATSAPP_MESSAGES, JSON.stringify(messages));
  },

  // WhatsApp Config
  getWhatsAppConfig: (): WhatsAppConfig => {
    try {
      const data = localStorage.getItem(DB_KEYS.WHATSAPP_CONFIG);
      return data
        ? JSON.parse(data)
        : {
            twilioSid: 'AC_sprintsync_live_99218',
            twilioAuthToken: '********************************',
            metaCloudToken: 'EAAQ...sprintsync_token',
            senderPhone: '+14155550199',
            isConnected: true,
            webhookUrl: '',
            enableAudioAlerts: true
          };
    } catch {
      return {
        twilioSid: 'AC_sprintsync_live_99218',
        twilioAuthToken: '********************************',
        metaCloudToken: 'EAAQ...sprintsync_token',
        senderPhone: '+14155550199',
        isConnected: true,
        webhookUrl: '',
        enableAudioAlerts: true
      };
    }
  },
  saveWhatsAppConfig: (config: WhatsAppConfig) => {
    localStorage.setItem(DB_KEYS.WHATSAPP_CONFIG, JSON.stringify(config));
  },

  // Sprint
  getSprints: (): Sprint[] => {
    try {
      const data = localStorage.getItem('sprintsync_sprints');
      return data ? JSON.parse(data) : INITIAL_SPRINTS;
    } catch {
      return INITIAL_SPRINTS;
    }
  },
  saveSprints: (sprints: Sprint[]) => {
    localStorage.setItem('sprintsync_sprints', JSON.stringify(sprints));
  },

  getSprint: (): Sprint => {
    try {
      const data = localStorage.getItem(DB_KEYS.SPRINT);
      return data ? JSON.parse(data) : INITIAL_SPRINT;
    } catch {
      return INITIAL_SPRINT;
    }
  },
  saveSprint: (sprint: Sprint) => {
    localStorage.setItem(DB_KEYS.SPRINT, JSON.stringify(sprint));
  },

  // Announcements
  getAnnouncements: (): TeamAnnouncement[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  },
  saveAnnouncements: (announcements: TeamAnnouncement[]) => {
    localStorage.setItem(DB_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },
  saveAttendance: (records: AttendanceRecord[]) => {
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(records));
  },

  // Reset database
  resetDatabase: () => {
    localStorage.clear();
  }
};
