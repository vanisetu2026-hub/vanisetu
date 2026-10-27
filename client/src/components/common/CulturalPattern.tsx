import React from 'react';

interface CulturalPatternProps {
  className?: string;
  variant?: 'border' | 'strip' | 'corner' | 'mandala';
  color?: string;
}

export const CulturalPattern: React.FC<CulturalPatternProps> = ({
  className = '',
  variant = 'strip',
  color = '#214B32',
}) => {
  if (variant === 'strip') {
    return (
      <div className={`w-full overflow-hidden flex items-center opacity-70 ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 800 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-5 text-forest-600"
          preserveAspectRatio="repeat-x"
        >
          <pattern id="tribal-chevron" x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
            {/* Triangle chevron motif */}
            <path d="M 0 12 L 10 2 L 20 12 L 30 2 L 40 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 0 22 L 10 12 L 20 22 L 30 12 L 40 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Sun dot */}
            <circle cx="10" cy="7" r="1.5" fill={color} />
            <circle cx="30" cy="7" r="1.5" fill={color} />
          </pattern>
          <rect width="100%" height="24" fill="url(#tribal-chevron)" />
        </svg>
      </div>
    );
  }

  if (variant === 'border') {
    return (
      <div className={`w-full h-2 bg-gradient-to-r from-forest-600 via-gold-400 to-terracotta-500 rounded-full ${className}`} />
    );
  }

  return null;
};
