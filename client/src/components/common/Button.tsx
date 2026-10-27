import React from 'react';
import { sound } from '../../utils/sound';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'sage';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  noSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  noSound = false,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading && !noSound) {
      sound.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-wide rounded-2xl transition-all duration-150 select-none active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:shadow-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 shadow-[0_3px_0] active:shadow-[0_0_0]',
    md: 'text-sm px-5 py-2.5 shadow-[0_4px_0] active:shadow-[0_0_0]',
    lg: 'text-base px-6 py-3.5 shadow-[0_5px_0] active:shadow-[0_0_0]',
    xl: 'text-lg px-8 py-4 shadow-[0_6px_0] active:shadow-[0_0_0]',
  };

  const variantStyles = {
    primary:
      'bg-forest-600 hover:bg-forest-500 text-cream-100 shadow-forest-800 focus:ring-forest-500',
    gold:
      'bg-gold-400 hover:bg-gold-300 text-teal-900 shadow-gold-600 focus:ring-gold-400',
    sage:
      'bg-sage-500 hover:bg-sage-400 text-cream-50 shadow-sage-700 focus:ring-sage-500',
    outline:
      'bg-cream-100 hover:bg-cream-200 text-forest-700 border-2 border-forest-600 shadow-forest-200 focus:ring-forest-400',
    ghost:
      'bg-transparent hover:bg-forest-50 text-forest-700 shadow-none active:translate-y-0 focus:ring-forest-400',
    danger:
      'bg-terracotta-500 hover:bg-terracotta-400 text-cream-100 shadow-terracotta-700 focus:ring-terracotta-400',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
};
