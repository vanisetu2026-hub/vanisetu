import {
  AdminLanguage,
  AdminModule,
  AdminLesson,
  AdminQuestion,
  AdminVocabulary,
  AdminContribution,
  AdminUser,
  AdminMedia,
  PlatformSettings,
  AdminNotification,
  AuditLog,
  VersionRecord,
  AdminStatsData,
  AdminRole,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api/admin' : '/api/admin');

// Helper to fetch with current admin role header
const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
  const activeRole = localStorage.getItem('vanisetu_active_admin_role') || 'super_admin';
  const token = localStorage.getItem('vanisetu_user_session');
  let authHeader = 'Bearer dev_admin_token';

  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.uid) authHeader = `Bearer ${parsed.uid}`;
    } catch {
      // Ignore
    }
  }

  const adminKey = sessionStorage.getItem('vanisetu_admin_key') || '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: authHeader,
    'x-admin-role': activeRole,
    'x-admin-key': adminKey,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || `Request failed with status ${response.status}`);
  }
  return json;
};

export const adminApi = {
  // 1. Dashboard Stats
  getStats: async (period: string = '30d'): Promise<AdminStatsData> => {
    const res = await adminFetch(`/stats?period=${period}`);
    return res.data;
  },

  // 2. Languages
  getLanguages: async (): Promise<AdminLanguage[]> => {
    const res = await adminFetch('/languages');
    return res.data;
  },
  createLanguage: async (data: Partial<AdminLanguage>): Promise<AdminLanguage> => {
    const res = await adminFetch('/languages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  updateLanguage: async (id: string, data: Partial<AdminLanguage>): Promise<AdminLanguage> => {
    const res = await adminFetch(`/languages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  deleteLanguage: async (id: string, force: boolean = false): Promise<{ message: string; archived?: boolean }> => {
    return adminFetch(`/languages/${id}?force=${force}`, {
      method: 'DELETE',
    });
  },

  // 3. Modules
  getModules: async (languageId?: string, status?: string): Promise<AdminModule[]> => {
    const query = new URLSearchParams();
    if (languageId && languageId !== 'all') query.append('languageId', languageId);
    if (status && status !== 'all') query.append('status', status);
    const res = await adminFetch(`/modules?${query.toString()}`);
    return res.data;
  },
  createModule: async (data: Partial<AdminModule>): Promise<AdminModule> => {
    const res = await adminFetch('/modules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  updateModule: async (id: string, data: Partial<AdminModule>): Promise<AdminModule> => {
    const res = await adminFetch(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  duplicateModule: async (id: string): Promise<AdminModule> => {
    const res = await adminFetch(`/modules/${id}/duplicate`, {
      method: 'POST',
    });
    return res.data;
  },
  deleteModule: async (id: string): Promise<{ message: string }> => {
    return adminFetch(`/modules/${id}`, {
      method: 'DELETE',
    });
  },

  // 4. Lessons
  getLessons: async (moduleId?: string, languageId?: string): Promise<AdminLesson[]> => {
    const query = new URLSearchParams();
    if (moduleId && moduleId !== 'all') query.append('moduleId', moduleId);
    if (languageId && languageId !== 'all') query.append('languageId', languageId);
    const res = await adminFetch(`/lessons?${query.toString()}`);
    return res.data;
  },
  createLesson: async (data: Partial<AdminLesson>): Promise<AdminLesson> => {
    const res = await adminFetch('/lessons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  updateLesson: async (id: string, data: Partial<AdminLesson>): Promise<AdminLesson> => {
    const res = await adminFetch(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  deleteLesson: async (id: string): Promise<{ message: string }> => {
    return adminFetch(`/lessons/${id}`, {
      method: 'DELETE',
    });
  },

  // 5. Questions (12 question types)
  getQuestions: async (lessonId?: string, questionType?: string, q?: string): Promise<AdminQuestion[]> => {
    const query = new URLSearchParams();
    if (lessonId && lessonId !== 'all') query.append('lessonId', lessonId);
    if (questionType && questionType !== 'all') query.append('questionType', questionType);
    if (q) query.append('q', q);
    const res = await adminFetch(`/questions?${query.toString()}`);
    return res.data;
  },
  createQuestion: async (data: Partial<AdminQuestion>): Promise<AdminQuestion> => {
    const res = await adminFetch('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  updateQuestion: async (id: string, data: Partial<AdminQuestion>): Promise<AdminQuestion> => {
    const res = await adminFetch(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  deleteQuestion: async (id: string): Promise<{ message: string }> => {
    return adminFetch(`/questions/${id}`, {
      method: 'DELETE',
    });
  },
  bulkImportQuestions: async (items: Partial<AdminQuestion>[]): Promise<{ importedCount: number; errors: unknown[] }> => {
    return adminFetch('/questions/import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  // 6. Vocabulary
  getVocabulary: async (languageId?: string, category?: string, q?: string): Promise<AdminVocabulary[]> => {
    const query = new URLSearchParams();
    if (languageId && languageId !== 'all') query.append('languageId', languageId);
    if (category && category !== 'all') query.append('category', category);
    if (q) query.append('q', q);
    const res = await adminFetch(`/vocabulary?${query.toString()}`);
    return res.data;
  },
  createVocabulary: async (data: Partial<AdminVocabulary>): Promise<AdminVocabulary> => {
    const res = await adminFetch('/vocabulary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  updateVocabulary: async (id: string, data: Partial<AdminVocabulary>): Promise<AdminVocabulary> => {
    const res = await adminFetch(`/vocabulary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  deleteVocabulary: async (id: string): Promise<{ message: string }> => {
    return adminFetch(`/vocabulary/${id}`, {
      method: 'DELETE',
    });
  },

  // 7. Contributions
  getContributions: async (status?: string, languageId?: string): Promise<AdminContribution[]> => {
    const query = new URLSearchParams();
    if (status && status !== 'all') query.append('status', status);
    if (languageId && languageId !== 'all') query.append('languageId', languageId);
    const res = await adminFetch(`/contributions?${query.toString()}`);
    return res.data;
  },
  reviewContribution: async (
    id: string,
    data: {
      status: string;
      reviewNotes?: string;
      rejectionReason?: string;
      awardBonusXP?: boolean;
    }
  ): Promise<AdminContribution> => {
    const res = await adminFetch(`/contributions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // 8. Users
  getUsers: async (role?: string, status?: string, q?: string): Promise<AdminUser[]> => {
    const query = new URLSearchParams();
    if (role && role !== 'all') query.append('role', role);
    if (status && status !== 'all') query.append('status', status);
    if (q) query.append('q', q);
    const res = await adminFetch(`/users?${query.toString()}`);
    return res.data;
  },
  updateUserStatus: async (id: string, status: string, reason?: string): Promise<AdminUser> => {
    const res = await adminFetch(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
    return res.data;
  },
  updateUserRole: async (id: string, role: AdminRole | 'learner'): Promise<AdminUser> => {
    const res = await adminFetch(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return res.data;
  },

  // 9. Settings
  getSettings: async (): Promise<PlatformSettings> => {
    const res = await adminFetch('/settings');
    return res.data;
  },
  updateSettings: async (data: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    const res = await adminFetch('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // 10. Media
  getMedia: async (type?: string, category?: string): Promise<AdminMedia[]> => {
    const query = new URLSearchParams();
    if (type && type !== 'all') query.append('type', type);
    if (category && category !== 'all') query.append('category', category);
    const res = await adminFetch(`/media?${query.toString()}`);
    return res.data;
  },
  uploadMedia: async (data: Partial<AdminMedia>): Promise<AdminMedia> => {
    const res = await adminFetch('/media', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },
  deleteMedia: async (id: string): Promise<{ message: string }> => {
    return adminFetch(`/media/${id}`, {
      method: 'DELETE',
    });
  },

  // 11. Notifications
  getNotifications: async (): Promise<AdminNotification[]> => {
    const res = await adminFetch('/notifications');
    return res.data;
  },
  markNotificationRead: async (id: string): Promise<void> => {
    await adminFetch(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  // 12. Audit Logs & Version History
  getAuditLogs: async (entityType?: string, action?: string): Promise<AuditLog[]> => {
    const query = new URLSearchParams();
    if (entityType && entityType !== 'all') query.append('entityType', entityType);
    if (action) query.append('action', action);
    const res = await adminFetch(`/audit-logs?${query.toString()}`);
    return res.data;
  },
  getVersionHistory: async (entityType: string, entityId: string): Promise<VersionRecord[]> => {
    const res = await adminFetch(`/versions/${entityType}/${entityId}`);
    return res.data;
  },
  rollbackVersion: async (versionId: string): Promise<{ message: string }> => {
    return adminFetch(`/versions/${versionId}/rollback`, {
      method: 'POST',
    });
  },
};
