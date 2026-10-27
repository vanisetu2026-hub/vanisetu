import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/sound';

interface AudioPlayerProps {
  text: string;
  languageId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'forest' | 'cream';
  label?: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  languageId = 'mundari',
  size = 'md',
  variant = 'gold',
  label,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    setIsPlaying(true);
    sound.speak(text, languageId);
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
  };

  const variantClasses = {
    gold: 'bg-gold-400 hover:bg-gold-300 text-teal-900 border-2 border-gold-500 shadow-[0_3px_0_#CF841C]',
    forest: 'bg-forest-600 hover:bg-forest-500 text-cream-100 border-2 border-forest-700 shadow-[0_3px_0_#1A3C28]',
    cream: 'bg-cream-100 hover:bg-cream-50 text-forest-700 border-2 border-forest-300 shadow-[0_3px_0_#BCD3C3]',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={`
        relative inline-flex items-center justify-center rounded-2xl transition-all duration-150 select-none
        active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-gold-400
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      title={`Listen to pronunciation: ${text}`}
      aria-label={`Pronounce ${text}`}
    >
      {isPlaying ? (
        <span className="flex items-center gap-0.5">
          <span className="w-1 h-3 bg-current animate-pulse rounded-full" />
          <span className="w-1 h-5 bg-current animate-pulse delay-75 rounded-full" />
          <span className="w-1 h-3 bg-current animate-pulse delay-150 rounded-full" />
        </span>
      ) : text ? (
        <Volume2 className={`${iconSizes[size]} transition-transform hover:scale-110`} />
      ) : (
        <VolumeX className={`${iconSizes[size]} opacity-40`} />
      )}
      {label && <span className="ml-2 font-bold font-sans">{label}</span>}
    </button>
  );
};
