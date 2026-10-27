import { Router } from 'express';
import { requireAdminRole } from '../middleware/rbacMiddleware.js';
import {
  getAdminStats,
  getAdminLanguages,
  createAdminLanguage,
  updateAdminLanguage,
  deleteAdminLanguage,
  getAdminModules,
  createAdminModule,
  updateAdminModule,
  deleteAdminModule,
  duplicateAdminModule,
  getAdminLessons,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
  bulkImportQuestions,
  getAdminVocabulary,
  createAdminVocabulary,
  updateAdminVocabulary,
  deleteAdminVocabulary,
  getAdminContributions,
  reviewAdminContribution,
  getAdminUsers,
  updateAdminUserStatus,
  updateAdminUserRole,
  getAdminSettings,
  updateAdminSettings,
  getAdminMedia,
  uploadAdminMedia,
  deleteAdminMedia,
  getAdminNotifications,
  markNotificationRead,
  getAdminAuditLogs,
  getAdminVersionHistory,
  rollbackAdminVersion,
} from '../controllers/adminControllers.js';

const router = Router();

// 1. Dashboard & Statistics (Accessible to all admin roles)
router.get(
  '/stats',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminStats
);

// 2. Languages
router.get(
  '/languages',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminLanguages
);
router.post(
  '/languages',
  requireAdminRole(['super_admin', 'content_admin']),
  createAdminLanguage
);
router.put(
  '/languages/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  updateAdminLanguage
);
router.delete(
  '/languages/:id',
  requireAdminRole(['super_admin']),
  deleteAdminLanguage
);

// 3. Modules
router.get(
  '/modules',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminModules
);
router.post(
  '/modules',
  requireAdminRole(['super_admin', 'content_admin']),
  createAdminModule
);
router.put(
  '/modules/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  updateAdminModule
);
router.delete(
  '/modules/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  deleteAdminModule
);
router.post(
  '/modules/:id/duplicate',
  requireAdminRole(['super_admin', 'content_admin']),
  duplicateAdminModule
);

// 4. Lessons
router.get(
  '/lessons',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminLessons
);
router.post(
  '/lessons',
  requireAdminRole(['super_admin', 'content_admin']),
  createAdminLesson
);
router.put(
  '/lessons/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  updateAdminLesson
);
router.delete(
  '/lessons/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  deleteAdminLesson
);

// 5. Questions (12 question types)
router.get(
  '/questions',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminQuestions
);
router.post(
  '/questions',
  requireAdminRole(['super_admin', 'content_admin']),
  createAdminQuestion
);
router.put(
  '/questions/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  updateAdminQuestion
);
router.delete(
  '/questions/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  deleteAdminQuestion
);
router.post(
  '/questions/import',
  requireAdminRole(['super_admin', 'content_admin']),
  bulkImportQuestions
);

// 6. Vocabulary
router.get(
  '/vocabulary',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminVocabulary
);
router.post(
  '/vocabulary',
  requireAdminRole(['super_admin', 'content_admin']),
  createAdminVocabulary
);
router.put(
  '/vocabulary/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  updateAdminVocabulary
);
router.delete(
  '/vocabulary/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  deleteAdminVocabulary
);

// 7. Community Contributions Verification Workflow
router.get(
  '/contributions',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminContributions
);
router.patch(
  '/contributions/:id/review',
  requireAdminRole(['super_admin', 'language_reviewer', 'moderator']),
  reviewAdminContribution
);

// 8. User Management
router.get(
  '/users',
  requireAdminRole(['super_admin', 'moderator', 'read_only_admin']),
  getAdminUsers
);
router.patch(
  '/users/:id/status',
  requireAdminRole(['super_admin', 'moderator']),
  updateAdminUserStatus
);
router.patch(
  '/users/:id/role',
  requireAdminRole(['super_admin']),
  updateAdminUserRole
);

// 9. Platform Settings (Super Admin only)
router.get(
  '/settings',
  requireAdminRole(['super_admin', 'read_only_admin']),
  getAdminSettings
);
router.put(
  '/settings',
  requireAdminRole(['super_admin']),
  updateAdminSettings
);

// 10. Media Library
router.get(
  '/media',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'read_only_admin']),
  getAdminMedia
);
router.post(
  '/media',
  requireAdminRole(['super_admin', 'content_admin']),
  uploadAdminMedia
);
router.delete(
  '/media/:id',
  requireAdminRole(['super_admin', 'content_admin']),
  deleteAdminMedia
);

// 11. Notifications
router.get(
  '/notifications',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  getAdminNotifications
);
router.patch(
  '/notifications/:id/read',
  requireAdminRole(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin']),
  markNotificationRead
);

// 12. Audit Logs & Version History
router.get(
  '/audit-logs',
  requireAdminRole(['super_admin', 'read_only_admin']),
  getAdminAuditLogs
);
router.get(
  '/versions/:entityType/:entityId',
  requireAdminRole(['super_admin', 'content_admin']),
  getAdminVersionHistory
);
router.post(
  '/versions/:versionId/rollback',
  requireAdminRole(['super_admin']),
  rollbackAdminVersion
);

export default router;
