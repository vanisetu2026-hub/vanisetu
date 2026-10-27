import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
import { AdminRole, adminStore } from '../data/adminStore.js';

export interface AdminAuthenticatedRequest extends AuthenticatedRequest {
  adminUser?: {
    uid: string;
    email: string;
    name: string;
    role: AdminRole;
  };
}

const VALID_ADMIN_ROLES: AdminRole[] = [
  'super_admin',
  'content_admin',
  'language_reviewer',
  'moderator',
  'read_only_admin',
];

const MASTER_ADMIN_KEY = process.env.VANISETU_ADMIN_KEY || 'VANISETU_ADMIN_2026';

export const requireAdminRole = (allowedRoles: AdminRole[]) => {
  return (req: AdminAuthenticatedRequest, res: Response, next: NextFunction): void => {
    const adminKeyHeader = (req.headers['x-admin-key'] as string) || '';
    const requestedRoleHeader = (req.headers['x-admin-role'] as AdminRole) || undefined;
    const email = req.user?.email?.toLowerCase().trim();
    const uid = req.user?.uid;

    // 1. Check if valid master admin key is provided (Staff session elevation)
    const hasValidAdminKey = adminKeyHeader === MASTER_ADMIN_KEY;

    // 2. Check if user is registered in adminStore with an administrative role
    let foundAdminUser = adminStore.users.find(
      (u) =>
        (u.uid === uid || (email && u.email.toLowerCase() === email)) &&
        u.role !== 'learner' &&
        VALID_ADMIN_ROLES.includes(u.role as AdminRole)
    );

    // If no direct email match in adminStore, but valid admin key is supplied:
    if (!foundAdminUser && hasValidAdminKey) {
      const assignedRole =
        requestedRoleHeader && VALID_ADMIN_ROLES.includes(requestedRoleHeader)
          ? requestedRoleHeader
          : 'super_admin';

      foundAdminUser = {
        uid: uid || 'admin_master_session',
        name: req.user?.name || 'Authorized Administrator',
        email: email || 'admin@vanisetu.org',
        role: assignedRole,
        status: 'active',
        selectedLanguage: 'santali',
        totalXP: 1000,
        currentStreak: 10,
        longestStreak: 10,
        dailyGoal: 50,
        completedLessons: [],
        unlockedAchievements: [],
        contributionsCount: 0,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
    }

    // STRICT ACCESS CONTROL: If user is not an authorized administrator, DENY ACCESS
    if (!foundAdminUser) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Access Denied: You do not have administrative privileges to access the VANISETU CMS.',
      });
      return;
    }

    // Check account status
    if (foundAdminUser.status === 'suspended' || foundAdminUser.status === 'banned') {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: `Administrative access is revoked. Account is currently ${foundAdminUser.status}.`,
      });
      return;
    }

    // Role resolution
    let effectiveRole = foundAdminUser.role as AdminRole;
    if (
      foundAdminUser.role === 'super_admin' &&
      requestedRoleHeader &&
      VALID_ADMIN_ROLES.includes(requestedRoleHeader)
    ) {
      effectiveRole = requestedRoleHeader;
    }

    req.adminUser = {
      uid: foundAdminUser.uid,
      email: foundAdminUser.email,
      name: foundAdminUser.name,
      role: effectiveRole,
    };

    // Super Admin has universal capability
    if (effectiveRole === 'super_admin') {
      return next();
    }

    // Check role-specific capability
    if (!allowedRoles.includes(effectiveRole)) {
      res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: `Access denied. Role "${effectiveRole}" is not authorized for this action. Required: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
