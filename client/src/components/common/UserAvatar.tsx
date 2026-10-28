import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'rounded' | 'circle';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  email,
  photoURL,
  size = 'md',
  className = '',
  shape = 'rounded',
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state if photoURL changes
  useEffect(() => {
    setHasError(false);
  }, [photoURL]);

  // Determine initial letter
  const getInitial = (): string => {
    const trimmedName = name?.trim();
    if (trimmedName && trimmedName.length > 0) {
      return trimmedName.charAt(0).toUpperCase();
    }
    const trimmedEmail = email?.trim();
    if (trimmedEmail && trimmedEmail.length > 0) {
      return trimmedEmail.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const initial = getInitial();

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm',
    md: 'w-8 h-8 xl:w-9 xl:h-9 text-xs xl:text-sm',
    lg: 'w-12 h-12 text-lg sm:text-xl',
    xl: 'w-20 h-20 text-3xl font-extrabold font-display',
  };

  const shapeClasses = shape === 'circle' ? 'rounded-full' : size === 'xl' ? 'rounded-3xl' : 'rounded-2xl';

  const hasValidPhoto = Boolean(
    photoURL &&
    typeof photoURL === 'string' &&
    photoURL.trim().length > 0 &&
    !hasError
  );

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${shapeClasses}
        bg-forest-600 border-2 sm:border-3 border-forest-700
        text-cream-100 font-bold flex items-center justify-center
        shadow-sm shrink-0 overflow-hidden select-none
        ${className}
      `}
    >
      {hasValidPhoto ? (
        <img
          src={photoURL!}
          alt=""
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="leading-none select-none uppercase tracking-tight">{initial}</span>
      )}
    </div>
  );
};
