import React, { useState, useEffect, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  Shield,
  Lock,
  Unlock,
  Ban,
  Flame,
  Award,
  Calendar,
  AlertTriangle,
  X,
  Sparkles,
  CheckCircle,
  Eye
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminUser, AdminRole } from '../../types';

const ROLES: { id: AdminRole | 'learner'; label: string; desc: string; badgeColor: string }[] = [
  { id: 'super_admin', label: 'Super Admin', desc: 'Full unrestricted control of platform', badgeColor: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'content_admin', label: 'Content Admin', desc: 'Manage languages, modules, lessons, vocabulary', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'language_reviewer', label: 'Language Reviewer', desc: 'Verify tribal submissions and linguistic accuracy', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'moderator', label: 'Moderator', desc: 'Moderate forums, user accounts and reports', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'read_only_admin', label: 'Auditor (Read Only)', desc: 'View reports, audit logs and statistics', badgeColor: 'bg-gray-100 text-gray-800 border-gray-300' },
  { id: 'learner', label: 'Learner', desc: 'Standard learner account', badgeColor: 'bg-green-50 text-green-700 border-green-200' }
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<AdminRole | 'learner'>('learner');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<'active' | 'suspended' | 'banned'>('active');
  const [statusReason, setStatusReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openRoleModal = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const openStatusModal = (user: AdminUser, status: 'active' | 'suspended' | 'banned') => {
    setSelectedUser(user);
    setNewStatus(status);
    setStatusReason('');
    setShowStatusModal(true);
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminApi.updateUserRole(selectedUser.uid, newRole);
      setShowRoleModal(false);
      await loadUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await adminApi.updateUserStatus(selectedUser.uid, newStatus, statusReason);
      setShowStatusModal(false);
      await loadUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q);
      const matchesRole = selectedRole === 'all' || u.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-vanisetu-accent" />
            User Management & Governance
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Search learners and staff, audit learning streaks & XP, assign RBAC permissions, and manage account statuses.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Registered Users</p>
          <p className="text-2xl font-bold text-vanisetu-primary mt-0.5">{users.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Active Learners</p>
          <p className="text-2xl font-bold text-green-700 mt-0.5">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Administrative Staff</p>
          <p className="text-2xl font-bold text-purple-700 mt-0.5">
            {users.filter(u => u.role !== 'learner').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Suspended / Banned</p>
          <p className="text-2xl font-bold text-red-600 mt-0.5">
            {users.filter(u => u.status === 'suspended' || u.status === 'banned').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or user UID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-vanisetu-text-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Roles</option>
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">Loading user accounts...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-vanisetu-cream/60 border-b border-vanisetu-primary/10 text-xs text-vanisetu-primary font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">XP & Streaks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => {
                  const roleObj = ROLES.find(r => r.id === user.role);

                  return (
                    <tr key={user.uid} className="hover:bg-vanisetu-cream/20 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-vanisetu-primary text-vanisetu-cream flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-vanisetu-text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            roleObj?.badgeColor || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {roleObj?.label || user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-gray-700 capitalize">
                        {user.selectedLanguage}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-bold text-vanisetu-accent">
                            <Award className="w-3.5 h-3.5" />
                            {user.totalXP} XP
                          </span>
                          <span className="flex items-center gap-1 font-bold text-orange-600">
                            <Flame className="w-3.5 h-3.5 fill-orange-500" />
                            {user.currentStreak}d
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : user.status === 'suspended'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                          {user.status === 'suspended' && <Lock className="w-3 h-3" />}
                          {user.status === 'banned' && <Ban className="w-3 h-3" />}
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-vanisetu-text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openRoleModal(user)}
                            title="Change Role & Permissions"
                            className="p-1.5 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => openStatusModal(user, 'suspended')}
                              title="Suspend User"
                              className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openStatusModal(user, 'active')}
                              title="Reactivate User"
                              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                          {user.status !== 'banned' && (
                            <button
                              onClick={() => openStatusModal(user, 'banned')}
                              title="Ban User"
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Assign Role to {selectedUser.name}
              </h3>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRoleUpdate} className="space-y-4">
              <div className="space-y-2">
                {ROLES.map(r => (
                  <label
                    key={r.id}
                    className={`block p-3 rounded-xl border cursor-pointer transition ${
                      newRole === r.id
                        ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="role"
                          value={r.id}
                          checked={newRole === r.id}
                          onChange={() => setNewRole(r.id)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs font-bold text-gray-900">{r.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${r.badgeColor}`}>
                        {r.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 pl-5">{r.desc}</p>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 shadow disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Save Role Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Change Status: {selectedUser.name}
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as 'active' | 'suspended' | 'banned')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                >
                  <option value="active">Active (Full platform access)</option>
                  <option value="suspended">Suspended (Temporary lockout)</option>
                  <option value="banned">Banned (Permanent restriction)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Action
                </label>
                <textarea
                  rows={3}
                  required={newStatus !== 'active'}
                  placeholder="Provide audit rationale for account suspension or ban..."
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-xs font-bold hover:bg-vanisetu-primary-dark shadow disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Confirm Status Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
