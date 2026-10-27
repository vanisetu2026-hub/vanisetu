import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: 'gold' | 'forest' | 'sage';
  height?: 'xs' | 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'gold',
  height = 'md',
  showPercentage = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, total > 0 ? (current / total) * 100 : 0));

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const barColorClasses = {
    gold: 'bg-gold-400 border-b-2 border-gold-600',
    forest: 'bg-forest-600 border-b-2 border-forest-800',
    sage: 'bg-sage-500 border-b-2 border-sage-700',
  };

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <div className={`flex-1 w-full bg-cream-300 rounded-full overflow-hidden p-0.5 shadow-inner ${heightClasses[height]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${barColorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle shine highlight */}
          <div className="absolute top-0.5 left-2 right-2 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
      {showPercentage && (
        <span className="text-xs font-bold text-teal-800 shrink-0 font-display">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
