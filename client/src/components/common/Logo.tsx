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
    sm: 'w-6 h-6 sm:w-7 sm:h-7',
    md: 'w-8 h-8 xl:w-9 xl:h-9',
    lg: 'w-10 h-10 xl:w-12 xl:h-12',
    xl: 'w-14 h-14 xl:w-16 xl:h-16',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl xl:text-2xl',
    lg: 'text-2xl xl:text-3xl',
    xl: 'text-3xl xl:text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[8px] sm:text-[8.5px]',
    md: 'text-[9px] sm:text-[9.5px] xl:text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const content = (
    <div className={`flex items-center gap-2 sm:gap-2.5 group cursor-pointer select-none ${className}`}>
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
              className={`hidden sm:block font-semibold tracking-wider text-teal-600 uppercase font-sans mt-0.5 whitespace-nowrap overflow-visible ${taglineSizes[size]}`}
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
