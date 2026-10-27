import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Shield,
  Clock,
  User,
  ArrowRight,
  X,
  FileCode,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AuditLog, VersionRecord } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  // Diff inspection modal
  const [inspectedLog, setInspectedLog] = useState<AuditLog | null>(null);

  // Version rollback modal
  const [versionModalEntity, setVersionModalEntity] = useState<{ type: string; id: string } | null>(null);
  const [versionHistory, setVersionHistory] = useState<VersionRecord[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [rollbackStatus, setRollbackStatus] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAuditLogs();
      setLogs(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const openVersionHistory = async (entityType: string, entityId: string) => {
    try {
      setVersionModalEntity({ type: entityType, id: entityId });
      setLoadingVersions(true);
      setRollbackStatus(null);
      const history = await adminApi.getVersionHistory(entityType, entityId);
      setVersionHistory(history);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to fetch version history');
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    if (!window.confirm('Are you sure you want to rollback to this previous state?')) return;
    try {
      setRollbackStatus('Processing rollback...');
      await adminApi.rollbackVersion(versionId);
      setRollbackStatus('Successfully rolled back!');
      setTimeout(() => {
        setVersionModalEntity(null);
        setRollbackStatus(null);
        loadLogs();
      }, 1200);
    } catch (err: unknown) {
      setRollbackStatus(`Rollback failed: ${err instanceof Error ? err.message : 'Error'}`);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        l.action.toLowerCase().includes(q) ||
        l.adminName.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q) ||
        (l.reason && l.reason.toLowerCase().includes(q));
      const matchesEntity = selectedEntity === 'all' || l.entityType === selectedEntity;
      const matchesAction = selectedAction === 'all' || l.action.includes(selectedAction);
      return matchesSearch && matchesEntity && matchesAction;
    });
  }, [logs, searchQuery, selectedEntity, selectedAction]);

  const entityTypes = Array.from(new Set(logs.map(l => l.entityType)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <History className="w-7 h-7 text-vanisetu-accent" />
            Audit Trail & Version History
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Tamper-evident operational ledger recording every administrative mutation with rollback checkpoints.
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
              placeholder="Search audit trail by actor, entity ID, action, or note..."
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
              value={selectedEntity}
              onChange={e => setSelectedEntity(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Entity Domains</option>
              {entityTypes.map(t => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-vanisetu-primary/10 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">
            Verifying cryptographic ledger logs...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-vanisetu-text-muted">
            No audit records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-vanisetu-cream/60 border-b border-vanisetu-primary/10 text-xs text-vanisetu-primary font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type & ID</th>
                  <th className="py-3 px-4">Audit Note</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map(log => (
                  <tr key={log.logId} className="hover:bg-vanisetu-cream/20 transition">
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-900 text-xs">{log.adminName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                          {log.adminRole}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-bold text-vanisetu-primary bg-vanisetu-primary/5 px-2 py-0.5 rounded border border-vanisetu-primary/10">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-vanisetu-accent">
                        {log.entityType}
                      </span>
                      <p className="font-mono text-gray-400 text-[11px]">{log.entityId}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {log.reason || 'Standard administrative operation'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectedLog(log)}
                          title="Inspect Diff"
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-vanisetu-primary hover:bg-vanisetu-cream/60 rounded border border-gray-200 transition"
                        >
                          View Diff
                        </button>
                        <button
                          onClick={() => openVersionHistory(log.entityType, log.entityId)}
                          title="Entity Version History"
                          className="px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50 rounded border border-purple-200 transition"
                        >
                          Versions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diff Inspector Modal */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <FileCode className="w-5 h-5 text-vanisetu-accent" />
                Audit Diff: {inspectedLog.action}
              </h3>
              <button
                onClick={() => setInspectedLog(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Actor:</span>{' '}
                <strong>
                  {inspectedLog.adminName} ({inspectedLog.adminRole})
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Target:</span>{' '}
                <strong>
                  {inspectedLog.entityType} ({inspectedLog.entityId})
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-red-700">Previous Value:</span>
                <pre className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-60 text-gray-800">
                  {inspectedLog.previousValue
                    ? JSON.stringify(inspectedLog.previousValue, null, 2)
                    : '(Initial Creation / No Previous State)'}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-green-700">New / Applied Value:</span>
                <pre className="p-3 bg-green-50/60 border border-green-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-60 text-gray-800">
                  {inspectedLog.newValue
                    ? JSON.stringify(inspectedLog.newValue, null, 2)
                    : '(Deleted / Voided State)'}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedLog(null)}
                className="px-4 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-xs font-semibold hover:bg-vanisetu-primary-dark"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History & Rollback Modal */}
      {versionModalEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-purple-600" />
                Version History: {versionModalEntity.type} ({versionModalEntity.id})
              </h3>
              <button
                onClick={() => setVersionModalEntity(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rollbackStatus && (
              <div className="p-3 bg-purple-50 text-purple-800 rounded-lg text-xs font-semibold">
                {rollbackStatus}
              </div>
            )}

            {loadingVersions ? (
              <p className="text-xs text-center py-6 text-gray-500">Loading version checkpoints...</p>
            ) : versionHistory.length === 0 ? (
              <p className="text-xs text-center py-6 text-gray-500">
                No previous version checkpoints recorded for this entity.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {versionHistory.map(ver => (
                  <div
                    key={ver.versionId}
                    className="p-3 rounded-xl border border-gray-200 hover:border-purple-300 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">Version #{ver.versionNumber}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{new Date(ver.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Saved by: <strong>{ver.savedBy}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleRollback(ver.versionId)}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition shadow-sm"
                    >
                      Rollback to this
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setVersionModalEntity(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
