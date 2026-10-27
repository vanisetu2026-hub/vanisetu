import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import {
  LayoutDashboard,
  GraduationCap,
  Globe,
  BookOpen,
  Users2,
  Trophy,
  Bell,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { selectedLanguage } = useLearning();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn', path: '/learn', icon: GraduationCap },
    { name: 'Languages', path: '/languages', icon: Globe },
    { name: 'Dictionary', path: '/dictionary', icon: BookOpen },
    { name: 'Community', path: '/community', icon: Users2 },
    { name: 'Progress', path: '/progress', icon: Trophy },
    { name: 'Reminders', path: '/reminders', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-cream-100 border-r-2 border-sage-200 h-screen sticky top-0 px-4 py-6 justify-between select-none shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="px-2 mb-8">
          <Logo size="md" showTagline={true} linkTo="/dashboard" />
        </div>

        {/* Current Active Language Pill Card */}
        <div
          onClick={() => navigate('/languages')}
          className="mx-1 mb-6 p-3 rounded-2xl bg-gradient-to-br from-forest-50 to-sage-100/60 border-2 border-forest-200 hover:border-forest-400 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-forest-600 uppercase tracking-wider">
              Learning Course
            </span>
            <span className="text-xs font-bold text-forest-700 group-hover:translate-x-0.5 transition-transform">
              Change →
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-forest-600 text-cream-100 flex items-center justify-center font-bold text-xs">
              {selectedLanguage.name.charAt(0)}
            </div>
            <div>
              <p className="font-extrabold text-teal-900 text-sm font-display leading-tight">
                {selectedLanguage.name}
              </p>
              <p className="text-[11px] text-teal-600">{selectedLanguage.region.split(',')[0]}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all
                  ${
                    isActive
                      ? 'bg-forest-600 text-cream-50 shadow-[0_3px_0_#1A3C28]'
                      : 'text-teal-800 hover:bg-cream-200/80 hover:text-forest-700'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="pt-4 border-t border-sage-200 space-y-3">
        {user ? (
          <>
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-cream-200 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-2xl bg-gold-400 border-2 border-gold-500 text-teal-900 font-extrabold flex items-center justify-center text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-teal-900 truncate font-display">
                  {user.name}
                </p>
                <p className="text-xs text-gold-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-gold-500" />
                  {user.totalXP} XP
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-terracotta-600 hover:bg-terracotta-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 text-xs font-bold text-forest-700 bg-cream-50 hover:bg-cream-200 border-2 border-forest-600 rounded-2xl transition-colors shadow-sm"
          >
            Log In to Save Progress
          </button>
        )}
      </div>
    </aside>
  );
};
