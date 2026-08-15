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
  INITIAL_COMMITS,
  INITIAL_PRS
} from '../data/initialData';
import { dbService, type WhatsAppConfig } from '../services/db';
import { supabase, isSupabaseConfigured } from '../services/supabase';

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
  loginWithGoogle: (googleProfile: { email: string; name: string; picture: string; phoneNumber?: string }, roleChoice?: UserRole) => void;
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

  sprints: Sprint[];
  activeSprintId: string;
  setActiveSprintId: (id: string) => void;
  addSprint: (sprintData: Omit<Sprint, 'id'>) => void;
  updateSprintById: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  completeSprint: (id: string) => void;

  standups: Standup[];
  addStandup: (standup: Omit<Standup, 'id' | 'createdAt'>) => void;
  deleteStandup: (id: string) => void;

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
  const [users, setUsers] = useState<User[]>(() => {
    const loaded = dbService.getUsers();
    const list = Array.isArray(loaded) ? loaded : [];
    return list.filter(u => u.id !== 'usr_shiv' && u.id !== 'usr_anushka' && u.id !== 'usr_default' && !u.phoneNumber?.startsWith('+1415555'));
  });
  const [activeUserId, setActiveUserId] = useState<string>(() => dbService.getActiveUserId() || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dbService.getIsAuthenticated());

  const currentUser: User = (users && users.length > 0)
    ? (users.find(u => u.id === activeUserId) || users[0])
    : {
        id: 'usr_guest',
        name: 'Guest Developer',
        username: 'guest_dev',
        email: 'guest@sprintsync.ai',
        passwordHash: 'guest123',
        role: 'user' as UserRole,
        department: 'Frontend',
        avatar: 'https://ui-avatars.com/api/?name=Guest+Developer&background=1e293b&color=cbd5e1&size=150',
        bio: 'SprintSync Team Contributor',
        skills: ['React', 'TypeScript'],
        phoneNumber: '+91 9876543210'
      };
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role || 'user');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(currentUser.role === 'admin');

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>(() => dbService.getTasks());
  const [sprint, setSprint] = useState<Sprint>(() => dbService.getSprint());
  const [standups, setStandups] = useState<Standup[]>(() => dbService.getStandups());
  const [notifications, setNotifications] = useState<Notification[]>(() => dbService.getNotifications());
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(() => dbService.getWhatsAppMessages());
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const loaded = dbService.getSprints();
    return Array.isArray(loaded) ? loaded : [];
  });
  const [activeSprintId, setActiveSprintId] = useState<string>(() => (sprints && sprints.find(s => s.status === 'active')?.id) || (sprints && sprints[0]?.id) || '');

  const activeSprint = (sprints && sprints.find(s => s.id === activeSprintId)) || sprints[0] || sprint;

  useEffect(() => {
    dbService.saveSprints(sprints);
  }, [sprints]);

  const addSprint = (sprintData: Omit<Sprint, 'id'>) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: `sprint_${Date.now()}`
    };
    setSprints(prev => [...prev, newSprint]);
    if (newSprint.status === 'active') {
      setActiveSprintId(newSprint.id);
      setSprint(newSprint);
    }
  };

  const updateSprintById = (id: string, updates: Partial<Sprint>) => {
    setSprints(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          if (id === activeSprintId) {
            setSprint(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const deleteSprint = (id: string) => {
    setSprints(prev => prev.filter(s => s.id !== id));
    if (activeSprintId === id) {
      const remaining = sprints.filter(s => s.id !== id);
      setActiveSprintId(remaining[0]?.id || '');
    }
  };

  const completeSprint = (id: string) => {
    setSprints(prev =>
      prev.map(s => (s.id === id ? { ...s, status: 'completed' as const } : s))
    );
    // Auto activate next planning sprint if exists
    const nextSprint = sprints.find(s => s.id !== id && s.status === 'planning');
    if (nextSprint) {
      setActiveSprintId(nextSprint.id);
      updateSprintById(nextSprint.id, { status: 'active' });
    }
    triggerConfetti();
  };

  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => dbService.getWhatsAppConfig());
  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>(() => dbService.getAnnouncements());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => dbService.getAttendance());

  const [githubCommits] = useState<GitHubCommit[]>(INITIAL_COMMITS);
  const [githubPRs] = useState<GitHubPR[]>(INITIAL_PRS);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  // Sync session & database state
  useEffect(() => {
    dbService.saveUsers(users);
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      users.forEach(u => {
        client.from('users').upsert({
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
          department: u.department,
          avatar: u.avatar,
          bio: u.bio,
          skills: u.skills,
          githubUsername: u.githubUsername,
          linkedInUrl: u.linkedInUrl,
          phoneNumber: u.phoneNumber,
          themePreference: u.themePreference
        }).then(() => {});
      });
    }
  }, [users]);

  // Initial Supabase Remote Fetch
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    client.from('users').select('*').then(({ data, error }) => {
      if (data && data.length > 0 && !error) {
        const cleanUsers = (data as User[]).filter(
          u => u.id !== 'usr_shiv' && u.id !== 'usr_anushka' && u.id !== 'usr_default' && !u.phoneNumber?.startsWith('+1415555')
        );
        setUsers(cleanUsers);
      }
    });

    client.from('tasks').select('*').then(({ data, error }) => {
      if (data && !error) {
        setTasks(data as Task[]);
      }
    });

    client.from('standups').select('*').then(({ data, error }) => {
      if (data && !error) {
        setStandups(data as Standup[]);
      }
    });

    client.from('notifications').select('*').then(({ data, error }) => {
      if (data && !error) {
        setNotifications(data as Notification[]);
      }
    });
  }, []);

  useEffect(() => {
    dbService.setActiveUserId(activeUserId);
    const found = users.find(u => u.id === activeUserId);
    if (found) {
      setCurrentRole(found.role);
      setIsAdminAuthenticated(found.role === 'admin');
    }
  }, [activeUserId, users]);

  useEffect(() => {
    dbService.setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    dbService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    dbService.saveStandups(standups);
  }, [standups]);

  useEffect(() => {
    dbService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    dbService.saveWhatsAppMessages(whatsAppMessages);
  }, [whatsAppMessages]);

  useEffect(() => {
    dbService.saveWhatsAppConfig(whatsAppConfig);
  }, [whatsAppConfig]);

  useEffect(() => {
    dbService.saveAnnouncements(announcements);
  }, [announcements]);

  useEffect(() => {
    dbService.saveAttendance(attendanceRecords);
  }, [attendanceRecords]);

  const requestRoleSwitch = (targetRole: UserRole) => {
    if (targetRole === 'user') {
      setCurrentRole('user');
    } else {
      if (isAdminAuthenticated || currentUser?.role === 'admin') {
        setCurrentRole('admin');
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  };

  const verifyAdminPassword = (password: string): boolean => {
    const cleanPass = password.trim();
    const validAdminPasswords = [
      'Shubh@nair',
      'Pruthvi@1308',
      'shubh@nair',
      'pruthvi@1308',
      'shiv123',
      'admin',
      'shiv'
    ];

    if (
      validAdminPasswords.includes(cleanPass) ||
      validAdminPasswords.includes(cleanPass.toLowerCase()) ||
      currentUser?.passwordHash === cleanPass
    ) {
      setIsAdminAuthenticated(true);
      setIsAuthenticated(true);
      setCurrentRole('admin');
      setIsAdminAuthModalOpen(false);
      setIsAdminPortalOpen(false);
      return true;
    }
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    return verifyAdminPassword(password);
  };

  const loginUser = (identifier: string, password: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();
    const foundUser = users.find(
      u =>
        u.email.toLowerCase() === cleanId ||
        u.username.toLowerCase() === cleanId
    );

    if (foundUser) {
      const validPasswords = [
        'Shubh@nair',
        'Pruthvi@1308',
        'shubh@nair',
        'pruthvi@1308',
        'password123',
        'shiv123',
        'admin'
      ];
      // Validate password if hash exists or accept allowed passwords
      if (
        !foundUser.passwordHash ||
        foundUser.passwordHash === cleanPass ||
        validPasswords.includes(cleanPass) ||
        validPasswords.includes(cleanPass.toLowerCase())
      ) {
        setActiveUserId(foundUser.id);
        setCurrentRole(foundUser.role);
        setIsAuthenticated(true);
        setIsAdminAuthenticated(foundUser.role === 'admin');
        return true;
      }
    }
    return false;
  };

  const loginWithGoogle = (googleProfile: { email: string; name: string; picture: string; phoneNumber?: string }, roleChoice?: UserRole) => {
    const cleanEmail = googleProfile.email.toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (googleProfile.phoneNumber) {
        setUsers(prev => prev.map(u => u.id === existing.id ? { ...u, phoneNumber: googleProfile.phoneNumber } : u));
      }
      setActiveUserId(existing.id);
      setCurrentRole(existing.role);
      setIsAuthenticated(true);
      setIsAdminAuthenticated(existing.role === 'admin');
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: googleProfile.name,
        username: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: roleChoice || 'user',
        department: roleChoice === 'admin' ? 'Backend' : 'Frontend',
        avatar: googleProfile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Verified Google Account user',
        skills: ['React', 'TypeScript', 'Agile'],
        phoneNumber: googleProfile.phoneNumber || '+91 9876543210'
      };
      setUsers(prev => [...prev, newUser]);
      setActiveUserId(newUser.id);
      setCurrentRole(newUser.role);
      setIsAdminAuthenticated(newUser.role === 'admin');
      setIsAuthenticated(true);
    }
    triggerConfetti();
  };

  const registerUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    setCurrentRole(newUser.role); // Set role according to user's registered role!
    setIsAdminAuthenticated(newUser.role === 'admin');
    setIsAuthenticated(true);
    triggerConfetti();
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setCurrentRole('user');
  };

  const lockAdminSession = () => {
    setIsAdminAuthenticated(false);
    if (currentUser?.role === 'admin') {
      setCurrentRole('user');
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails in headless env
    }
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

  const deleteStandup = (id: string) => {
    setStandups(prev => prev.filter(s => s.id !== id));
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
    const bodyText = customText || `🚀 *SprintSync AI*\nNotification for *${taskTitle}*`;
    const newMsg: WhatsAppMessage = {
      id: `wa_${Date.now()}`,
      recipientPhone,
      recipientName,
      type,
      taskTitle,
      messageText: bodyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setWhatsAppMessages(prev => [newMsg, ...prev]);

    // Real Twilio API Integration (if valid Twilio Account SID & Auth Token provided)
    if (
      whatsAppConfig.twilioSid &&
      whatsAppConfig.twilioSid.startsWith('AC') &&
      !whatsAppConfig.twilioSid.includes('mock') &&
      whatsAppConfig.twilioAuthToken &&
      !whatsAppConfig.twilioAuthToken.includes('*')
    ) {
      const formData = new URLSearchParams();
      const cleanPhone = recipientPhone.replace(/[^0-9+]/g, '');
      const toPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
      const senderPhone = whatsAppConfig.senderPhone.replace(/[^0-9+]/g, '');
      const fromPhone = senderPhone.startsWith('+') ? senderPhone : `+${senderPhone}`;

      formData.append('From', fromPhone.startsWith('whatsapp:') ? fromPhone : `whatsapp:${fromPhone}`);
      formData.append('To', `whatsapp:${toPhone}`);
      formData.append('Body', bodyText);

      fetch(`https://api.twilio.com/2010-04-01/Accounts/${whatsAppConfig.twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${whatsAppConfig.twilioSid}:${whatsAppConfig.twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
        .then(res => res.json())
        .then(data => console.log('Twilio API real dispatch response:', data))
        .catch(err => console.warn('Twilio API error:', err));
    }

    // Non-blocking Webhook dispatch if configured
    if (whatsAppConfig.webhookUrl && whatsAppConfig.webhookUrl.trim().startsWith('http')) {
      fetch(whatsAppConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: recipientPhone,
          name: recipientName,
          type,
          title: taskTitle,
          message: bodyText,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn('WhatsApp webhook error:', err));
    }

    // Audio chime feedback if enabled
    if (whatsAppConfig.enableAudioAlerts !== false) {
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5 note
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch {
        // AudioContext not allowed before user interaction
      }
    }
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
        loginWithGoogle,
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
        sprint: activeSprint,
        updateSprint,
        sprints,
        activeSprintId,
        setActiveSprintId,
        addSprint,
        updateSprintById,
        deleteSprint,
        completeSprint,
        standups,
        addStandup,
        deleteStandup,
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
