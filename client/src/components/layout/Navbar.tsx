import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { XPBadge } from '../common/XPBadge';
import { StreakBadge } from '../common/StreakBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useLearning } from '../../contexts/LearningContext';
import { Globe2, User, Bell, LogIn } from 'lucide-react';

export const Navbar: React.FC<{ isLanding?: boolean }> = ({ isLanding = false }) => {
  const { user } = useAuth();
  const { selectedLanguage } = useLearning();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b-2 border-sage-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Logo size="md" showTagline={!isLanding} />

        {/* Center / Right Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {user ? (
            <>
              {/* Selected Language Selector Pill */}
              <button
                onClick={() => navigate('/languages')}
                className="hidden sm:flex items-center gap-2 bg-cream-50 hover:bg-cream-200 border-2 border-sage-300 px-3 py-1.5 rounded-2xl text-xs font-bold text-teal-800 transition-colors shadow-sm"
                title="Change active tribal language"
              >
                <Globe2 className="w-4 h-4 text-forest-600" />
                <span>{selectedLanguage.name}</span>
                <span className="text-[10px] bg-forest-100 text-forest-700 px-1.5 py-0.5 rounded-md">
                  Active
                </span>
              </button>

              {/* Streak */}
              <StreakBadge streak={user.currentStreak || 1} size="sm" />

              {/* XP */}
              <XPBadge xp={user.totalXP || 0} size="sm" />

              {/* Reminders / Notifications button */}
              <button
                onClick={() => navigate('/reminders')}
                className="p-2 rounded-2xl hover:bg-cream-200 text-teal-700 hover:text-teal-900 transition-colors relative"
                title="Daily Reminders & Habits"
                aria-label="Daily reminders"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-400 rounded-full" />
              </button>

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 group"
                title="View Profile"
              >
                <div className="w-9 h-9 rounded-2xl bg-forest-600 border-2 border-forest-700 text-cream-100 font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/languages"
                className="hidden md:inline-flex text-sm font-bold text-teal-800 hover:text-forest-600 px-3 py-2 transition-colors"
              >
                Explore Languages
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-bold bg-cream-50 hover:bg-cream-200 text-forest-700 border-2 border-forest-600 px-4 py-2 rounded-2xl transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center text-sm font-bold bg-gold-400 hover:bg-gold-300 text-teal-900 px-4 py-2 rounded-2xl shadow-[0_3px_0_#CF841C] active:translate-y-0.5 active:shadow-none transition-all"
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
