import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Clock,
  Check,
  ExternalLink,
  Users,
  AlertTriangle,
  Info,
  Award,
  ShieldAlert
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminNotification } from '../../types';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminApi.markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n.notificationId === id ? { ...n, isRead: true } : n))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update notification');
    }
  };

  const handleMarkAllRead = async () => {
    for (const n of notifications.filter(n => !n.isRead)) {
      await adminApi.markNotificationRead(n.notificationId);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (selectedType === 'unread') return !n.isRead;
      if (selectedType === 'all') return true;
      return n.type === selectedType;
    });
  }, [notifications, selectedType]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <Bell className="w-7 h-7 text-vanisetu-accent" />
            Administrative Notifications & Alerts
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Real-time triggers for pending community reviews, platform health anomalies, and security events.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 text-green-600" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-vanisetu-primary/10 shadow-sm text-xs">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedType === 'all'
              ? 'bg-vanisetu-primary text-vanisetu-cream'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setSelectedType('unread')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedType === 'unread'
              ? 'bg-vanisetu-primary text-vanisetu-cream'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setSelectedType('review_task')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedType === 'review_task'
              ? 'bg-vanisetu-primary text-vanisetu-cream'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Review Tasks
        </button>
        <button
          onClick={() => setSelectedType('contribution')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedType === 'contribution'
              ? 'bg-vanisetu-primary text-vanisetu-cream'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contributions
        </button>
        <button
          onClick={() => setSelectedType('report')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedType === 'report'
              ? 'bg-vanisetu-primary text-vanisetu-cream'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reports
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl text-center text-red-600 text-sm border border-red-200">
            {error}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
            No notifications matching current filter.
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div
              key={n.notificationId}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-vanisetu-accent/40 shadow-sm'
                  : 'bg-gray-50/60 border-gray-200 text-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg mt-0.5 ${
                    n.type === 'review_task'
                      ? 'bg-amber-100 text-amber-800'
                      : n.type === 'report'
                      ? 'bg-red-100 text-red-800'
                      : n.type === 'contribution'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {n.type === 'review_task' && <AlertTriangle className="w-4 h-4" />}
                  {n.type === 'report' && <ShieldAlert className="w-4 h-4" />}
                  {n.type === 'contribution' && <Users className="w-4 h-4" />}
                  {n.type === 'system' && <Info className="w-4 h-4" />}
                  {n.type === 'milestone' && <Award className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-vanisetu-accent" />
                    )}
                  </div>
                  <p className="text-xs text-vanisetu-text-muted mt-1">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <a
                    href={n.link}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-vanisetu-primary/10 text-vanisetu-primary hover:bg-vanisetu-primary/20 text-xs font-semibold"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.notificationId)}
                    title="Mark as read"
                    className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
