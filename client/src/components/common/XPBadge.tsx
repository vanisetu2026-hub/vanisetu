import React from 'react';
import { Sparkles } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ xp, size = 'md', animated = false }) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 gap-1',
    md: 'text-xs sm:text-sm px-2.5 sm:px-3.5 py-1 sm:py-1.5 gap-1 sm:gap-1.5',
    lg: 'text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 gap-1.5 sm:gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-display font-extrabold bg-gradient-to-r from-gold-100 to-gold-200 border-2 border-gold-400 text-teal-900 rounded-2xl shadow-sm shrink-0 select-none ${
        sizeStyles[size]
      } ${animated ? 'animate-pulse' : ''}`}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gold-400 flex items-center justify-center text-teal-900 shadow-sm shrink-0">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-900 fill-teal-900" />
      </div>
      <span>
        {xp}
        <span className="hidden sm:inline text-gold-600 font-bold ml-1">XP</span>
      </span>
    </div>
  );
};
