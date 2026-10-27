import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminRole } from '../../types';
import {
  ShieldAlert,
  ArrowLeft,
  KeyRound,
  Lock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface AdminAuthContextType {
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;
  hasPermission: (allowedRoles: AdminRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminRouteGuard');
  }
  return context;
};

const VALID_ADMIN_ROLES: AdminRole[] = [
  'super_admin',
  'content_admin',
  'language_reviewer',
  'moderator',
  'read_only_admin'
];

export const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, elevateToAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Passcode unlock form state for staff
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  // Active admin role stored for RBAC testing
  const [currentRole, setRoleState] = useState<AdminRole>(() => {
    return (localStorage.getItem('vanisetu_active_admin_role') as AdminRole) || 'super_admin';
  });

  const setCurrentRole = (role: AdminRole) => {
    setRoleState(role);
    localStorage.setItem('vanisetu_active_admin_role', role);
  };

  useEffect(() => {
    if (user?.role && user.role !== 'learner' && VALID_ADMIN_ROLES.includes(user.role as AdminRole)) {
      setRoleState(user.role as AdminRole);
      localStorage.setItem('vanisetu_active_admin_role', user.role);
    }
  }, [user]);

  const hasPermission = (allowedRoles: AdminRole[]): boolean => {
    if (currentRole === 'super_admin') return true;
    return allowedRoles.includes(currentRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-forest-800">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  // 1. If user is completely unauthenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Determine if user is authorized as admin
  const hasAdminRole = user.role && user.role !== 'learner' && VALID_ADMIN_ROLES.includes(user.role as AdminRole);
  const hasAdminSessionKey = sessionStorage.getItem('vanisetu_admin_key') === 'VANISETU_ADMIN_2026';
  const isAuthorized = Boolean(hasAdminRole || hasAdminSessionKey);

  // Handle staff passcode unlock
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setIsUnlocking(true);

    const success = elevateToAdmin(passcode);
    if (success) {
      setUnlockSuccess(true);
      setTimeout(() => {
        setIsUnlocking(false);
      }, 600);
    } else {
      setIsUnlocking(false);
      setPasscodeError('Invalid administrator security key. Access denied.');
    }
  };

  // 3. If unauthorized learner or guest, render a strict 403 Forbidden screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-cream-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-earthy-lg border-2 border-red-200 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
              403 • Forbidden
            </span>
            <h1 className="text-2xl font-black text-teal-950 font-display mt-2">
              Restricted Staff Area
            </h1>
            <p className="text-xs text-teal-700 font-medium mt-1">
              Administrator privileges required to access the VANISETU Content Management System.
            </p>
          </div>

          <div className="p-3.5 bg-cream-50 rounded-2xl border border-sage-200 text-left text-xs space-y-1">
            <p className="text-teal-900 font-bold">Current Account:</p>
            <p className="text-teal-700 truncate font-mono text-[11px]">
              {user.email || user.name}
            </p>
            <p className="text-gold-700 text-[11px] font-semibold">
              Role: <span className="uppercase">{user.role || 'Learner'}</span> (No CMS Access)
            </p>
          </div>

          {/* Staff Passcode Unlock Form */}
          <form onSubmit={handlePasscodeSubmit} className="text-left space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-teal-900">
              Are you an authorized staff member?
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Staff Passcode / Admin Key"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-forest-600 outline-none"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {passcodeError && (
              <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{passcodeError}</span>
              </p>
            )}

            {unlockSuccess && (
              <p className="text-[11px] font-semibold text-green-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 flex-shrink-0" />
                <span>Staff credentials verified! Unlocking...</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isUnlocking || !passcode.trim()}
              className="w-full py-2 bg-forest-700 hover:bg-forest-800 text-cream-100 rounded-xl text-xs font-bold transition shadow disabled:opacity-40"
            >
              {isUnlocking ? 'Verifying...' : 'Verify Staff Access'}
            </button>
          </form>

          {/* Return button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cream-100 hover:bg-cream-200 text-teal-900 border-2 border-sage-300 rounded-2xl text-xs font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Learning Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized administrator — grant CMS access
  return (
    <AdminAuthContext.Provider value={{ currentRole, setCurrentRole, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
