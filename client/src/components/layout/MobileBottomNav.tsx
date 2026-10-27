import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users2,
  User,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn', path: '/learn', icon: GraduationCap },
    { name: 'Dictionary', path: '/dictionary', icon: BookOpen },
    { name: 'Community', path: '/community', icon: Users2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-100/95 backdrop-blur-md border-t-2 border-sage-200 px-3 py-2 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 min-w-[56px]
              ${
                isActive
                  ? 'text-forest-700 font-extrabold scale-105'
                  : 'text-teal-600 hover:text-forest-600 font-medium'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-forest-600 text-cream-50 shadow-sm' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
