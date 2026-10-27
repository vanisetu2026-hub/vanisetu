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
  // Stagger alternating curve for Duolingo-style winding road
  const offsets = ['translate-x-0', 'translate-x-6 sm:translate-x-12', 'translate-x-0', '-translate-x-6 sm:-translate-x-12'];
  const offsetClass = offsets[index % offsets.length];

  const handleClick = () => {
    if (isUnlocked) {
      onSelect(lesson.lessonId);
    }
  };

  return (
    <div className={`flex flex-col items-center my-6 relative transition-transform ${offsetClass}`}>
      {/* Duolingo-style 3D Node Button */}
      <button
        onClick={handleClick}
        disabled={!isUnlocked}
        title={isUnlocked ? `Start: ${lesson.title}` : `Complete previous lessons to unlock`}
        className={`
          relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center
          transition-all duration-200 select-none group
          ${
            isCompleted
              ? 'bg-forest-600 hover:bg-forest-500 text-cream-100 shadow-[0_7px_0_#1A3C28] active:translate-y-1 active:shadow-[0_2px_0_#1A3C28]'
              : isUnlocked
              ? 'bg-gold-400 hover:bg-gold-300 text-teal-900 shadow-[0_7px_0_#CF841C] ring-4 ring-gold-200/80 animate-pulse active:translate-y-1 active:shadow-[0_2px_0_#CF841C]'
              : 'bg-cream-300 text-teal-400 border-2 border-sage-300 shadow-[0_5px_0_#C7D5CB] cursor-not-allowed opacity-80'
          }
        `}
      >
        {isCompleted ? (
          <Check className="w-9 h-9 stroke-[3] text-cream-50" />
        ) : isUnlocked ? (
          <Star className="w-9 h-9 fill-current stroke-[1.5] text-teal-900 group-hover:scale-110 transition-transform" />
        ) : (
          <Lock className="w-8 h-8 text-teal-500" />
        )}

        {/* Crown / Star decoration for active lesson */}
        {isUnlocked && !isCompleted && (
          <div className="absolute -top-3 -right-2 bg-forest-600 text-cream-100 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 text-gold-400 fill-current" />
            <span>START</span>
          </div>
        )}
      </button>

      {/* Lesson Title & XP Badge */}
      <div className="mt-3 text-center max-w-[200px]">
        <h4 className="font-display font-extrabold text-sm sm:text-base text-teal-900 leading-tight">
          {lesson.title}
        </h4>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-gold-600">
            +{lesson.xpReward} XP
          </span>
          {isCompleted && (
            <span className="text-[11px] font-bold text-forest-600 bg-forest-100 px-2 py-0.5 rounded-md">
              Mastered
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
