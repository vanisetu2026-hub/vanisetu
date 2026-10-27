import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-teal-800 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-2xl shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-500">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              w-full rounded-2xl bg-cream-50 border-2 py-3 text-teal-900 placeholder-teal-400 font-medium
              transition-all duration-200 outline-none
              ${leftIcon ? 'pl-11' : 'pl-4'}
              ${rightIcon ? 'pr-11' : 'pr-4'}
              ${
                error
                  ? 'border-terracotta-400 focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-200'
                  : 'border-sage-200 focus:border-forest-600 focus:ring-2 focus:ring-forest-100'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-teal-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-semibold text-terracotta-600 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-teal-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
