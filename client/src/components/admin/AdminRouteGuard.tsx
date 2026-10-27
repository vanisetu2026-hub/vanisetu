import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AdminRole } from '../../types';

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

export const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Active admin role stored in localStorage for role testing
  const [currentRole, setRoleState] = useState<AdminRole>(() => {
    return (localStorage.getItem('vanisetu_active_admin_role') as AdminRole) || 'super_admin';
  });

  const setCurrentRole = (role: AdminRole) => {
    setRoleState(role);
    localStorage.setItem('vanisetu_active_admin_role', role);
  };

  useEffect(() => {
    localStorage.setItem('vanisetu_active_admin_role', currentRole);
  }, [currentRole]);

  const hasPermission = (allowedRoles: AdminRole[]): boolean => {
    if (currentRole === 'super_admin') return true;
    return allowedRoles.includes(currentRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-bold text-sm text-forest-800">Loading VANISETU Admin Panel...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in at all, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AdminAuthContext.Provider value={{ currentRole, setCurrentRole, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
