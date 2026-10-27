import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  linkTo = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Culturally Inspired Emblem: A stylized Sacred Grove leaf + Bridge arch (Setu) + Voice speech wave */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer circle - warm terracotta rim */}
          <circle cx="50" cy="50" r="46" fill="#F7F5EB" stroke="#214B32" strokeWidth="4" />
          
          {/* Bridge (Setu) Arch */}
          <path
            d="M20 74 C 35 48, 65 48, 80 74"
            stroke="#E9A23B"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Bridge Support Pillars */}
          <path d="M35 63 L 35 74" stroke="#E9A23B" strokeWidth="3" strokeLinecap="round" />
          <path d="M50 54 L 50 74" stroke="#E9A23B" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 63 L 65 74" stroke="#E9A23B" strokeWidth="3" strokeLinecap="round" />

          {/* Central Sacred Sal Leaf (Nature & Origin) */}
          <path
            d="M50 18 C 66 30, 66 52, 50 62 C 34 52, 34 30, 50 18 Z"
            fill="#214B32"
          />
          {/* Central Leaf Vein / Speech Flow */}
          <path
            d="M50 24 L 50 56"
            stroke="#F7F5EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M44 36 Q 50 38 56 36"
            stroke="#F7F5EB"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M42 46 Q 50 48 58 46"
            stroke="#F7F5EB"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Cultural Sun Ray / Dot */}
          <circle cx="50" cy="14" r="3.5" fill="#E9A23B" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-display font-extrabold tracking-wider text-forest-600 leading-none ${textSizes[size]}`}
        >
          VANI<span className="text-gold-500">SETU</span>
        </span>
        {showTagline && (
          <span
            className={`font-medium tracking-widest text-teal-600 uppercase font-sans mt-0.5 ${taglineSizes[size]}`}
          >
            Learn • Preserve • Connect
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="inline-block">{content}</Link>;
  }

  return content;
};
