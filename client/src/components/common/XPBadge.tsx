import React from 'react';
import { Sparkles } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const XPBadge: React.FC<XPBadgeProps> = ({ xp, size = 'md', animated = false }) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-sm px-3.5 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <div
      className={`inline-flex items-center font-display font-extrabold bg-gradient-to-r from-gold-100 to-gold-200 border-2 border-gold-400 text-teal-900 rounded-2xl shadow-sm ${
        sizeStyles[size]
      } ${animated ? 'animate-pulse' : ''}`}
    >
      <div className="w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center text-teal-900 shadow-sm shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-teal-900 fill-teal-900" />
      </div>
      <span>{xp} <span className="text-gold-600 font-bold">XP</span></span>
    </div>
  );
};
