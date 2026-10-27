import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, size = 'md' }) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 gap-1',
    md: 'text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-1.5',
    lg: 'text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 gap-1.5 sm:gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-display font-extrabold bg-gradient-to-r from-terracotta-100 to-terracotta-200 border-2 border-terracotta-400 text-terracotta-700 rounded-2xl shadow-sm shrink-0 select-none ${sizeStyles[size]}`}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-terracotta-400 flex items-center justify-center text-cream-50 shadow-sm shrink-0">
        <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current animate-bounce" />
      </div>
      <span>
        {streak}
        <span className="hidden sm:inline text-terracotta-600 font-bold ml-1">Days</span>
      </span>
    </div>
  );
};
