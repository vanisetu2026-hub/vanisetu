import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { XPBadge } from '../common/XPBadge';
import { StreakBadge } from '../common/StreakBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import { Globe2, User, Bell, LogIn, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC<{ isLanding?: boolean }> = ({ isLanding = false }) => {
  const { user } = useAuth();
  const { selectedLanguage } = useLearning();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b-2 border-sage-200/80 px-3 sm:px-6 lg:px-8 py-2 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo (Shown on mobile & tablet, hidden on desktop when sidebar is present) */}
        <div className={!isLanding ? 'lg:hidden' : ''}>
          <Logo
            size="md"
            showTagline={!isLanding}
            className="shrink-0"
          />
        </div>

        {/* Desktop breadcrumb when sidebar is present */}
        {!isLanding && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-bold text-teal-600">Active Course:</span>
            <button
              onClick={() => navigate('/languages')}
              className="flex items-center gap-1.5 bg-cream-50 hover:bg-cream-200 border-2 border-sage-300 px-3 py-1 rounded-2xl text-xs font-bold text-teal-800 transition-colors shadow-sm group"
              title="Change active tribal language"
            >
              <Globe2 className="w-3.5 h-3.5 text-forest-600" />
              <span>{selectedLanguage.name}</span>
              <span className="text-teal-600 font-medium">({selectedLanguage.nativeName})</span>
              <span className="text-[10px] text-forest-700 group-hover:translate-x-0.5 transition-transform ml-0.5">
                Change →
              </span>
            </button>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {user ? (
            <>
              {/* Selected Language Selector Pill (Hidden on mobile and desktop, visible on tablet) */}
              <button
                onClick={() => navigate('/languages')}
                className="hidden md:flex lg:hidden items-center gap-2 bg-cream-50 hover:bg-cream-200 border-2 border-sage-300 px-3 py-1.5 rounded-2xl text-xs font-bold text-teal-800 transition-colors shadow-sm"
                title="Change active tribal language"
              >
                <Globe2 className="w-3.5 h-3.5 text-forest-600" />
                <span>{selectedLanguage.name}</span>
                <span className="text-[10px] bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded-md font-extrabold">
                  Active
                </span>
              </button>

              {/* Streak */}
              <StreakBadge streak={user.currentStreak || 0} size="sm" />

              {/* XP */}
              <XPBadge xp={user.totalXP || 0} size="sm" />

              {/* Reminders / Notifications button (Hidden on phone screen to guarantee zero clipping, visible from sm up) */}
              <button
                onClick={() => navigate('/reminders')}
                className="hidden sm:flex p-1.5 sm:p-2 rounded-2xl hover:bg-cream-200 text-teal-700 hover:text-teal-900 transition-colors relative"
                title="Daily Reminders & Habits"
                aria-label="Daily reminders"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-gold-400 rounded-full" />
              </button>

              {/* Admin CMS Access — visible to administrative staff or elevated session */}
              {user && ((user.role && user.role !== 'learner') || (typeof window !== 'undefined' && sessionStorage.getItem('vanisetu_admin_key') === 'VANISETU_ADMIN_2026')) && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1 bg-gold-100/90 hover:bg-gold-200 border border-gold-400 text-forest-900 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition shadow-xs"
                  title="Open Admin CMS"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                  <span className="hidden sm:inline">Admin CMS</span>
                </Link>
              )}

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-0.5 group"
                title="View Profile"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-2xl bg-forest-600 border-2 border-forest-700 text-cream-100 font-bold flex items-center justify-center text-xs sm:text-sm shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name || 'User avatar'} className="w-full h-full object-cover" />
                  ) : user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/languages"
                className="hidden md:inline-flex text-xs sm:text-sm font-bold text-teal-800 hover:text-forest-600 px-3 py-2 transition-colors"
              >
                Explore Languages
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold bg-cream-50 hover:bg-cream-200 text-forest-700 border-2 border-forest-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center text-xs sm:text-sm font-bold bg-gold-400 hover:bg-gold-300 text-teal-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-[0_3px_0_#CF841C] active:translate-y-0.5 active:shadow-none transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
