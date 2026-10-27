import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Lock,
  UserCheck,
  HelpCircle,
  FileText,
  Sliders,
  Database,
  BarChart3,
  Image as ImageIcon,
  History
} from 'lucide-react';
import type { AdminRole } from '../../types';

interface PermissionRow {
  module: string;
  action: string;
  super_admin: boolean;
  content_admin: boolean;
  language_reviewer: boolean;
  moderator: boolean;
  read_only_admin: boolean;
}

const PERMISSION_MATRIX: PermissionRow[] = [
  // Platform Settings
  { module: 'Platform Settings', action: 'View Settings & Maintenance Status', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: true },
  { module: 'Platform Settings', action: 'Update Platform Configurations & XP Rules', super_admin: true, content_admin: false, language_reviewer: false, moderator: false, read_only_admin: false },

  // Language Management
  { module: 'Language Management', action: 'View Tribal Languages', super_admin: true, content_admin: true, language_reviewer: true, moderator: true, read_only_admin: true },
  { module: 'Language Management', action: 'Create & Edit Languages', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },
  { module: 'Language Management', action: 'Delete or Archive Languages', super_admin: true, content_admin: false, language_reviewer: false, moderator: false, read_only_admin: false },

  // Module & Lesson Management
  { module: 'Curriculum & Lessons', action: 'View Modules & Lessons', super_admin: true, content_admin: true, language_reviewer: true, moderator: true, read_only_admin: true },
  { module: 'Curriculum & Lessons', action: 'Create, Edit & Duplicate Lessons', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },
  { module: 'Curriculum & Lessons', action: 'Publish / Unpublish Lessons', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },
  { module: 'Curriculum & Lessons', action: 'Delete Modules & Lessons', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },

  // Question Management
  { module: 'Question Management', action: 'View & Preview Questions (All 12 Types)', super_admin: true, content_admin: true, language_reviewer: true, moderator: false, read_only_admin: true },
  { module: 'Question Management', action: 'Create, Edit & Duplicate Questions', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },
  { module: 'Question Management', action: 'Bulk Import / Export Questions', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },
  { module: 'Question Management', action: 'Delete Questions', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },

  // Vocabulary Repository
  { module: 'Vocabulary Repository', action: 'View & Search Lexicons', super_admin: true, content_admin: true, language_reviewer: true, moderator: true, read_only_admin: true },
  { module: 'Vocabulary Repository', action: 'Create & Edit Words, Native Scripts & Audio', super_admin: true, content_admin: true, language_reviewer: true, moderator: false, read_only_admin: false },
  { module: 'Vocabulary Repository', action: 'Delete Vocabulary Entries', super_admin: true, content_admin: true, language_reviewer: false, moderator: false, read_only_admin: false },

  // Community Contributions
  { module: 'Community Contributions', action: 'View Pending Submissions', super_admin: true, content_admin: true, language_reviewer: true, moderator: true, read_only_admin: true },
  { module: 'Community Contributions', action: 'Verify, Approve & Reward XP', super_admin: true, content_admin: true, language_reviewer: true, moderator: false, read_only_admin: false },
  { module: 'Community Contributions', action: 'Reject / Request Revision', super_admin: true, content_admin: true, language_reviewer: true, moderator: true, read_only_admin: false },

  // User Management
  { module: 'User Management', action: 'View User Directory & Streaks', super_admin: true, content_admin: true, language_reviewer: false, moderator: true, read_only_admin: true },
  { module: 'User Management', action: 'Suspend / Reactivate Accounts', super_admin: true, content_admin: false, language_reviewer: false, moderator: true, read_only_admin: false },
  { module: 'User Management', action: 'Ban Users & Assign Admin Roles', super_admin: true, content_admin: false, language_reviewer: false, moderator: false, read_only_admin: false },

  // Analytics & Audit
  { module: 'Analytics & Audit', action: 'View Retention, DAU & Lesson Completion', super_admin: true, content_admin: true, language_reviewer: true, moderator: false, read_only_admin: true },
  { module: 'Analytics & Audit', action: 'View Immutable Audit Logs', super_admin: true, content_admin: false, language_reviewer: false, moderator: false, read_only_admin: true },
  { module: 'Analytics & Audit', action: 'Rollback Version History', super_admin: true, content_admin: false, language_reviewer: false, moderator: false, read_only_admin: false }
];

export const AdminRolesPage: React.FC = () => {
  const [filterModule, setFilterModule] = useState<string>('all');

  const filteredMatrix = filterModule === 'all'
    ? PERMISSION_MATRIX
    : PERMISSION_MATRIX.filter(r => r.module === filterModule);

  const modules = Array.from(new Set(PERMISSION_MATRIX.map(r => r.module)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-vanisetu-accent" />
          Roles & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-sm text-vanisetu-text-muted mt-1">
          Strict authorization hierarchy enforcing least-privilege principles across platform operations.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border-t-4 border-red-500 shadow-sm space-y-1">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Super Admin</span>
          <p className="text-sm font-bold text-gray-800">Platform Custodian</p>
          <p className="text-xs text-vanisetu-text-muted">
            Unrestricted access to all data, settings, role delegation, and audit logs.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-t-4 border-purple-500 shadow-sm space-y-1">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Content Admin</span>
          <p className="text-sm font-bold text-gray-800">Curriculum Lead</p>
          <p className="text-xs text-vanisetu-text-muted">
            Manages languages, modules, exercises, vocabulary, and bulk import/exports.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-t-4 border-blue-500 shadow-sm space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Language Reviewer</span>
          <p className="text-sm font-bold text-gray-800">Linguistic Expert</p>
          <p className="text-xs text-vanisetu-text-muted">
            Verifies tribal phonetics, community contributions, and dialect accuracy.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-t-4 border-amber-500 shadow-sm space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Moderator</span>
          <p className="text-sm font-bold text-gray-800">Community Safety</p>
          <p className="text-xs text-vanisetu-text-muted">
            Monitors user behavior, suspends bad actors, and flags suspicious activity.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-t-4 border-gray-400 shadow-sm space-y-1">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Read-Only Admin</span>
          <p className="text-sm font-bold text-gray-800">Platform Auditor</p>
          <p className="text-xs text-vanisetu-text-muted">
            Inspects analytics, content catalog, and audit trails without write privileges.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-vanisetu-primary" />
          <span className="text-xs font-bold text-gray-700">Filter Scope:</span>
          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
          >
            <option value="all">All Modules ({PERMISSION_MATRIX.length} capabilities)</option>
            {modules.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-vanisetu-text-muted">
          Server-side enforced by <code>rbacMiddleware.ts</code>
        </span>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-vanisetu-cream/60 border-b border-vanisetu-primary/10 text-xs text-vanisetu-primary font-semibold">
              <tr>
                <th className="py-3 px-4">Feature Domain</th>
                <th className="py-3 px-4">Permission Action</th>
                <th className="py-3 px-3 text-center">Super Admin</th>
                <th className="py-3 px-3 text-center">Content Admin</th>
                <th className="py-3 px-3 text-center">Language Reviewer</th>
                <th className="py-3 px-3 text-center">Moderator</th>
                <th className="py-3 px-3 text-center">Read Only</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-vanisetu-cream/20 transition">
                  <td className="py-3 px-4 text-xs font-semibold text-vanisetu-primary">
                    {row.module}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-700">
                    {row.action}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.super_admin ? (
                      <Check className="w-4 h-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.content_admin ? (
                      <Check className="w-4 h-4 text-purple-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.language_reviewer ? (
                      <Check className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.moderator ? (
                      <Check className="w-4 h-4 text-amber-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.read_only_admin ? (
                      <Check className="w-4 h-4 text-gray-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
