import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  User,
  UserRole,
  Task,
  TaskStatus,
  Notification,
  Standup,
  GitHubCommit,
  GitHubPR,
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
  INITIAL_COMMITS,
  INITIAL_PRS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_SPRINT,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ATTENDANCE
} from '../data/initialData';

interface WhatsAppConfig {
  twilioSid: string;
  twilioAuthToken: string;
  metaCloudToken: string;
  senderPhone: string;
  isConnected: boolean;
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAdminAuthenticated: boolean;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  requestRoleSwitch: (role: UserRole) => void;
  verifyAdminPassword: (pass: string) => boolean;
  lockAdminSession: () => void;

  activeUserId: string;
  setActiveUserId: (id: string) => void;
  currentUser: User;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Auth Methods & Modals
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  loginUser: (identifier: string, pass: string) => boolean;
  registerUser: (userData: Omit<User, 'id'>) => void;
  loginAdmin: (pass: string) => boolean;
  logoutUser: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;
  
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: TaskStatus) => void;
  addCommentToTask: (taskId: string, content: string) => void;
  requestDeadlineExtension: (taskId: string, requestedHours: number, reason: string) => void;

  sprint: Sprint;
  updateSprint: (updates: Partial<Sprint>) => void;

  standups: Standup[];
  addStandup: (standup: Omit<Standup, 'id' | 'createdAt'>) => void;

  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppNotification: (
    recipientPhone: string,
    recipientName: string,
    type: WhatsAppMessage['type'],
    taskTitle: string,
    customText?: string
  ) => void;
  whatsAppConfig: WhatsAppConfig;
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;

  githubCommits: GitHubCommit[];
  githubPRs: GitHubPR[];

  announcements: TeamAnnouncement[];
  addAnnouncement: (announcement: Omit<TeamAnnouncement, 'id' | 'createdAt'>) => void;

  attendanceRecords: AttendanceRecord[];
  clockInUser: (userId: string) => void;
  clockOutUser: (userId: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  const [activeUserId, setActiveUserId] = useState<string>('usr_anushka'); // Anushka by default
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [sprint, setSprint] = useState<Sprint>(INITIAL_SPRINT);
  const [standups, setStandups] = useState<Standup[]>(INITIAL_STANDUPS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_MESSAGES);
  const [githubCommits] = useState<GitHubCommit[]>(INITIAL_COMMITS);
  const [githubPRs] = useState<GitHubPR[]>(INITIAL_PRS);
  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>({
    twilioSid: 'AC_sprintsync_mock_99218',
    twilioAuthToken: '********************************',
    metaCloudToken: 'EAAQ...sprintsync_token',
    senderPhone: '+14155550199',
    isConnected: true
  });

  const requestRoleSwitch = (targetRole: UserRole) => {
    if (targetRole === 'user') {
      setCurrentRole('user');
    } else {
      if (isAdminAuthenticated) {
        setCurrentRole('admin');
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  };

  const verifyAdminPassword = (password: string): boolean => {
    if (password === 'shiv123' || password === 'admin' || password === 'shiv') {
      setIsAdminAuthenticated(true);
      setIsAuthenticated(true);
      setCurrentRole('admin');
      setActiveUserId('usr_shiv');
      setIsAdminAuthModalOpen(false);
      setIsAdminPortalOpen(false);
      return true;
    }
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    return verifyAdminPassword(password);
  };

  const loginUser = (identifier: string, _password: string): boolean => {
    const foundUser = users.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase())
    );

    if (foundUser) {
      setActiveUserId(foundUser.id);
      setCurrentRole(foundUser.role);
      setIsAuthenticated(true);
      if (foundUser.role === 'admin') {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
      return true;
    }
    return false;
  };

  const registerUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    setCurrentRole('user');
    setIsAdminAuthenticated(false);
    setIsAuthenticated(true);
    triggerConfetti();
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setCurrentRole('user');
    setActiveUserId('usr_anushka');
  };

  const lockAdminSession = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('user');
    setActiveUserId('usr_anushka');
  };

  useEffect(() => {
    if (currentRole === 'admin') {
      setActiveUserId('usr_shiv');
    }
  }, [currentRole]);

  const currentUser = users.find(u => u.id === activeUserId) || users[1] || users[0];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      comments: taskData.comments || [],
      attachments: taskData.attachments || []
    };
    setTasks(prev => [newTask, ...prev]);

    // Send WhatsApp notification to assigned users
    taskData.assignedToIds.forEach(usrId => {
      const assignedUser = users.find(u => u.id === usrId);
      if (assignedUser) {
        sendWhatsAppNotification(
          assignedUser.phoneNumber || '+14155550100',
          assignedUser.name,
          'task_assigned',
          newTask.title,
          `🚀 *SprintSync*\n\nYou have been assigned a new task:\n*${newTask.title}*\n\nPriority: ${newTask.priority.toUpperCase()}\nDue: ${newTask.dueDate}`
        );

        // In-app notification
        setNotifications(nPrev => [
          {
            id: `notif_${Date.now()}_${usrId}`,
            userId: usrId,
            type: 'assigned',
            title: '🚀 New Task Assigned',
            message: `You were assigned to "${newTask.title}". Priority: ${newTask.priority}`,
            read: false,
            createdAt: new Date().toISOString(),
            taskId: newTask.id
          },
          ...nPrev
        ]);
      }
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'completed' && t.status !== 'completed') {
            triggerConfetti();
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const addCommentToTask = (taskId: string, content: string) => {
    const newComment = {
      id: `cmt_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString()
    };
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            comments: [...(t.comments || []), newComment]
          };
        }
        return t;
      })
    );
  };

  const requestDeadlineExtension = (taskId: string, requestedHours: number, reason: string) => {
    addCommentToTask(
      taskId,
      `⏳ [EXTENSION REQUEST] Requested +${requestedHours}h extension. Reason: ${reason}`
    );
    // Send alert to admin
    setNotifications(prev => [
      {
        id: `notif_ext_${Date.now()}`,
        userId: 'usr_1',
        type: 'deadline',
        title: '⏳ Deadline Extension Request',
        message: `${currentUser.name} requested +${requestedHours}h extension on task. Reason: ${reason}`,
        read: false,
        createdAt: new Date().toISOString(),
        taskId
      },
      ...prev
    ]);
  };

  const updateSprint = (updates: Partial<Sprint>) => {
    setSprint(prev => ({ ...prev, ...updates }));
  };

  const addStandup = (standupData: Omit<Standup, 'id' | 'createdAt'>) => {
    const newStandup: Standup = {
      ...standupData,
      id: `std_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStandups(prev => [newStandup, ...prev]);

    // Send in-app notification to admin
    setNotifications(prev => [
      {
        id: `notif_std_${Date.now()}`,
        userId: 'usr_1',
        type: 'announcement',
        title: '📋 Daily Standup Submitted',
        message: `${standupData.userName} submitted daily standup update.`,
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const sendWhatsAppNotification = (
    recipientPhone: string,
    recipientName: string,
    type: WhatsAppMessage['type'],
    taskTitle: string,
    customText?: string
  ) => {
    const newMsg: WhatsAppMessage = {
      id: `wa_${Date.now()}`,
      recipientPhone,
      recipientName,
      type,
      taskTitle,
      messageText: customText || `🚀 *SprintSync AI*\nNotification for *${taskTitle}*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setWhatsAppMessages(prev => [newMsg, ...prev]);
  };

  const updateWhatsAppConfig = (configUpdates: Partial<WhatsAppConfig>) => {
    setWhatsAppConfig(prev => ({ ...prev, ...configUpdates }));
  };

  const addAnnouncement = (data: Omit<TeamAnnouncement, 'id' | 'createdAt'>) => {
    const newAnn: TeamAnnouncement = {
      ...data,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const clockInUser = (usrId: string) => {
    const usr = users.find(u => u.id === usrId) || currentUser;
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      userId: usr.id,
      userName: usr.name,
      userAvatar: usr.avatar,
      date: today,
      clockInTime: timeNow,
      status: 'present',
      location: 'Remote HQ (Mumbai)'
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
  };

  const clockOutUser = (usrId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendanceRecords(prev =>
      prev.map(r => {
        if (r.userId === usrId && r.date === today && !r.clockOutTime) {
          return {
            ...r,
            clockOutTime: timeNow,
            totalHours: 7.5
          };
        }
        return r;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isAdminAuthenticated,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        requestRoleSwitch,
        verifyAdminPassword,
        lockAdminSession,
        activeUserId,
        setActiveUserId,
        currentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        isAuthenticated,
        setIsAuthenticated,
        loginUser,
        registerUser,
        loginAdmin,
        logoutUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isAdminPortalOpen,
        setIsAdminPortalOpen,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addCommentToTask,
        requestDeadlineExtension,
        sprint,
        updateSprint,
        standups,
        addStandup,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        whatsAppMessages,
        sendWhatsAppNotification,
        whatsAppConfig,
        updateWhatsAppConfig,
        githubCommits,
        githubPRs,
        announcements,
        addAnnouncement,
        attendanceRecords,
        clockInUser,
        clockOutUser,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
