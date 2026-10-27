import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminAuth } from './AdminRouteGuard';
import { Logo } from '../common/Logo';
import { ToastNotification } from '../common/ToastNotification';
import { AdminRole } from '../../types';
import {
  LayoutDashboard,
  Globe2,
  Layers,
  GraduationCap,
  HelpCircle,
  BookOpen,
  Users2,
  UserCog,
  BarChart3,
  Image as ImageIcon,
  Bell,
  ScrollText,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const { currentRole, setCurrentRole, hasPermission } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // 14 Admin Navigation Items with Permission Mappings
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      allowedRoles: ['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Languages',
      path: '/admin/languages',
      icon: Globe2,
      allowedRoles: ['super_admin', 'content_admin', 'language_reviewer', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Modules',
      path: '/admin/modules',
      icon: Layers,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Lessons',
      path: '/admin/lessons',
      icon: GraduationCap,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Questions (12 Types)',
      path: '/admin/questions',
      icon: HelpCircle,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Vocabulary',
      path: '/admin/vocabulary',
      icon: BookOpen,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Contributions',
      path: '/admin/contributions',
      icon: Users2,
      badge: 'Review',
      allowedRoles: ['super_admin', 'language_reviewer', 'moderator', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: UserCog,
      allowedRoles: ['super_admin', 'moderator', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Media Library',
      path: '/admin/media',
      icon: ImageIcon,
      allowedRoles: ['super_admin', 'content_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Notifications',
      path: '/admin/notifications',
      icon: Bell,
      allowedRoles: ['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Audit Logs',
      path: '/admin/audit-logs',
      icon: ScrollText,
      allowedRoles: ['super_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      allowedRoles: ['super_admin', 'read_only_admin'] as AdminRole[],
    },
    {
      name: 'Roles & RBAC',
      path: '/admin/roles',
      icon: ShieldCheck,
      allowedRoles: ['super_admin'] as AdminRole[],
    },
  ];

  const roleLabels: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    content_admin: 'Content Admin',
    language_reviewer: 'Language Reviewer',
    moderator: 'Moderator',
    read_only_admin: 'Read-Only Admin',
  };

  const roleColors: Record<AdminRole, string> = {
    super_admin: 'bg-gold-500 text-teal-950 border-gold-600',
    content_admin: 'bg-forest-600 text-cream-50 border-forest-700',
    language_reviewer: 'bg-sage-600 text-cream-50 border-sage-700',
    moderator: 'bg-terracotta-500 text-cream-50 border-terracotta-600',
    read_only_admin: 'bg-mutedblue-500 text-cream-50 border-mutedblue-600',
  };

  // Compute breadcrumb name
  const currentNav = navItems.find((item) =>
    item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
  );

  return (
    <div className="min-h-screen bg-cream-200 text-teal-900 flex font-sans antialiased">
      <ToastNotification />

      {/* Desktop Admin Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-cream-100 border-r-2 border-sage-200 h-screen sticky top-0 transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Header Logo */}
        <div className="p-4 border-b-2 border-sage-200 flex items-center justify-between gap-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <Logo size="sm" showTagline={false} linkTo="/admin" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-forest-100 text-forest-800 px-2 py-0.5 rounded-md border border-forest-300">
                CMS
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <Logo size="sm" iconOnly={true} linkTo="/admin" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-700 hover:text-teal-900 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-cream-50/80 border-b border-sage-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Shield className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold text-teal-600 tracking-wider block">
                  Active Mode
                </span>
                <span className="text-xs font-bold text-teal-900 truncate block">
                  {roleLabels[currentRole]}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="text-[10px] font-bold text-forest-700 bg-forest-100/70 hover:bg-forest-100 px-2 py-1 rounded-lg border border-forest-300 transition-colors shrink-0"
              title="Switch demo role to inspect RBAC behavior"
            >
              Switch Role
            </button>
          </div>
        )}

        {/* Role Switcher Drawer (Development & QA helper) */}
        {!isCollapsed && isRoleDropdownOpen && (
          <div className="p-3 bg-cream-50 border-b-2 border-gold-300 space-y-1.5 text-xs animate-in fade-in duration-150">
            <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Select Role to Test:
            </span>
            {(['super_admin', 'content_admin', 'language_reviewer', 'moderator', 'read_only_admin'] as AdminRole[]).map(
              (r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    currentRole === r
                      ? 'bg-forest-600 text-cream-50 shadow-sm'
                      : 'hover:bg-cream-200 text-teal-800'
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {currentRole === r && <Sparkles className="w-3 h-3 text-gold-300 fill-current" />}
                </button>
              )
            )}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const allowed = hasPermission(item.allowedRoles);

            if (!allowed) {
              return null; // Hide unauthorized navigation items
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs transition-all relative group
                  ${
                    isActive
                      ? 'bg-forest-600 text-cream-50 shadow-[0_2px_0_#1A3C28]'
                      : 'text-teal-800 hover:bg-cream-200/80 hover:text-forest-700'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={item.name}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[9px] bg-gold-400 text-teal-950 font-extrabold px-1.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Quick Link to Learner Platform */}
        <div className="p-3 border-t-2 border-sage-200">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 p-2.5 rounded-2xl bg-cream-50 hover:bg-forest-50 border border-sage-300 hover:border-forest-300 text-forest-700 font-bold text-xs transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Switch to Learner View"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Learner View</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-cream-100/95 backdrop-blur-md border-b-2 border-sage-200 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-teal-800 hover:bg-cream-200"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-800 truncate">
              <span className="text-forest-600 font-extrabold">VANISETU CMS</span>
              <span>/</span>
              <span className="text-teal-950 truncate">{currentNav?.name || 'Overview'}</span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Role Pill Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${roleColors[currentRole]}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{roleLabels[currentRole]}</span>
            </div>

            {/* Quick Switch to Learner App */}
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 bg-forest-600 hover:bg-forest-700 active:scale-95 text-cream-50 text-xs font-bold px-3 py-1.5 rounded-2xl transition-all shadow-sm"
              title="Return to Student Learning View"
            >
              <span>Learner View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => navigate('/admin/notifications')}
              className="p-2 rounded-2xl hover:bg-cream-200 text-teal-700 relative transition-colors"
              title="Admin Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-2xl bg-forest-700 border-2 border-forest-800 text-cream-100 flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Mobile Slideover Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-teal-950/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-cream-100 border-r-2 border-sage-200 h-full flex flex-col p-4 z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-sage-200">
                <Logo size="sm" showTagline={false} linkTo="/admin" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-cream-200 text-teal-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-3 bg-cream-50 rounded-2xl border border-sage-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-600">Active Test Role</span>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
                  className="w-full bg-cream-100 border border-sage-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-teal-900"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="content_admin">Content Admin</option>
                  <option value="language_reviewer">Language Reviewer</option>
                  <option value="moderator">Moderator</option>
                  <option value="read_only_admin">Read-Only Admin</option>
                </select>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const allowed = hasPermission(item.allowedRoles);
                  if (!allowed) return null;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all
                        ${
                          isActive
                            ? 'bg-forest-600 text-cream-50 shadow-sm'
                            : 'text-teal-800 hover:bg-cream-200'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-sage-200">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-forest-600 text-cream-50 font-bold text-xs shadow-sm"
                >
                  <span>Switch to Learner View</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
