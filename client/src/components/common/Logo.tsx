import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  iconOnly?: boolean;
  className?: string;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  iconOnly = false,
  className = '',
  linkTo = '/',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const content = (
    <div className={`flex items-center gap-2 sm:gap-3 group cursor-pointer select-none ${className}`}>
      {/* Official VANISETU Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}
      >
        <img
          src={logoImg}
          alt="VANISETU Logo"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <span
            className={`font-display font-extrabold tracking-wider text-forest-600 leading-none ${textSizes[size]}`}
          >
            VANI<span className="text-gold-500">SETU</span>
          </span>
          {showTagline && (
            <span
              className={`hidden sm:block font-semibold tracking-widest text-teal-600 uppercase font-sans mt-0.5 whitespace-nowrap ${taglineSizes[size]}`}
            >
              Learn • Preserve • Connect
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo} className="inline-block">{content}</Link>;
  }

  return content;
};
