import React from 'react';
import { Lesson } from '../../types';
import { Check, Lock, Star, Sparkles } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  onSelect: (lessonId: string) => void;
  index: number;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted,
  isUnlocked,
  onSelect,
  index,
}) => {
  // Stagger alternating curve for Duolingo-style winding road (responsive offsets)
  const offsets = [
    'translate-x-0',
    'translate-x-3 sm:translate-x-8 lg:translate-x-12',
    'translate-x-0',
    '-translate-x-3 sm:-translate-x-8 lg:-translate-x-12',
  ];
  const offsetClass = offsets[index % offsets.length];

  const handleClick = () => {
    if (isUnlocked) {
      onSelect(lesson.lessonId);
    }
  };

  return (
    <div className={`flex flex-col items-center my-3 sm:my-5 relative transition-transform ${offsetClass}`}>
      {/* Duolingo Journey Connector Dots */}
      {index > 0 && (
        <div className="flex flex-col items-center gap-1.5 -mt-3 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-sage-300" />
          <div className="w-2 h-2 rounded-full bg-sage-300/70" />
          <div className="w-2 h-2 rounded-full bg-sage-300/40" />
        </div>
      )}

      {/* Duolingo-style 3D Node Button */}
      <button
        onClick={handleClick}
        disabled={!isUnlocked}
        title={isUnlocked ? `Start: ${lesson.title}` : `Complete previous lessons to unlock`}
        className={`
          relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full flex flex-col items-center justify-center
          transition-all duration-200 select-none group touch-manipulation
          ${
            isCompleted
              ? 'bg-forest-600 hover:bg-forest-500 text-cream-100 shadow-[0_5px_0_#1A3C28] sm:shadow-[0_6px_0_#1A3C28] active:translate-y-1 active:shadow-[0_2px_0_#1A3C28]'
              : isUnlocked
              ? 'bg-gold-400 hover:bg-gold-300 text-teal-900 shadow-[0_5px_0_#CF841C] sm:shadow-[0_6px_0_#CF841C] ring-4 ring-gold-200/80 animate-pulse active:translate-y-1 active:shadow-[0_2px_0_#CF841C]'
              : 'bg-cream-300 text-teal-400 border-2 border-sage-300 shadow-[0_4px_0_#C7D5CB] cursor-not-allowed opacity-80'
          }
        `}
      >
        {isCompleted ? (
          <Check className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3] text-cream-50" />
        ) : isUnlocked ? (
          <Star className="w-7 h-7 sm:w-9 sm:h-9 fill-current stroke-[1.5] text-teal-900 group-hover:scale-110 transition-transform" />
        ) : (
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />
        )}

        {/* Crown / Star decoration for active lesson */}
        {isUnlocked && !isCompleted && (
          <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 bg-forest-600 text-cream-100 text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-400 fill-current" />
            <span>START</span>
          </div>
        )}
      </button>

      {/* Lesson Title & XP Badge */}
      <div className="mt-2.5 sm:mt-3 text-center max-w-[170px] sm:max-w-[200px]">
        <h4 className="font-display font-extrabold text-xs sm:text-base text-teal-900 leading-tight">
          {lesson.title}
        </h4>
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1">
          <span className="text-[11px] sm:text-xs font-bold text-gold-600">
            +{lesson.xpReward} XP
          </span>
          {isCompleted && (
            <span className="text-[10px] sm:text-[11px] font-bold text-forest-600 bg-forest-100 px-1.5 sm:px-2 py-0.5 rounded-md">
              Mastered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
