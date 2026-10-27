import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, size = 'md' }) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-display font-extrabold bg-gradient-to-r from-terracotta-100 to-terracotta-200 border-2 border-terracotta-400 text-terracotta-700 rounded-2xl shadow-sm ${sizeStyles[size]}`}
    >
      <div className="w-5 h-5 rounded-full bg-terracotta-400 flex items-center justify-center text-cream-50 shadow-sm shrink-0">
        <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
      </div>
      <span>{streak} <span className="text-terracotta-600 font-bold">Days</span></span>
    </div>
  );
};
