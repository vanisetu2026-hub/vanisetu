import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users2,
  User,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { name: 'Learn', path: '/dashboard', icon: GraduationCap },
    { name: 'Flashcards', path: '/vocabulary', icon: Sparkles },
    { name: 'Dictionary', path: '/dictionary', icon: BookOpen },
    { name: 'Community', path: '/community', icon: Users2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-100/95 backdrop-blur-md border-t-2 border-sage-200 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-150 min-w-[52px] touch-manipulation
              ${
                isActive
                  ? 'text-forest-700 font-extrabold'
                  : 'text-teal-600 hover:text-forest-600 font-medium'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-forest-600 text-cream-50 shadow-sm scale-110' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight font-display">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
