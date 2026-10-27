import React from 'react';
import { Achievement } from '../../types';
import { CheckCircle2, Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked,
}) => {
  return (
    <div
      className={`
        p-4 sm:p-5 rounded-3xl border-2 transition-all duration-200 flex items-start gap-4
        ${
          isUnlocked
            ? 'bg-cream-100 border-gold-400 shadow-earthy'
            : 'bg-cream-200/60 border-sage-200 opacity-60'
        }
      `}
    >
      <div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 shadow-sm
          ${
            isUnlocked
              ? 'bg-gold-100 border-gold-300 text-gold-700'
              : 'bg-cream-300 border-sage-300 grayscale'
          }
        `}
      >
        {achievement.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display font-extrabold text-base text-teal-900 truncate">
            {achievement.title}
          </h4>
          {isUnlocked ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-forest-700 bg-forest-100 px-2 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
              <span>Unlocked</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-500 bg-cream-300 px-2 py-0.5 rounded-full shrink-0">
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </span>
          )}
        </div>

        <p className="text-xs text-teal-700 font-medium mt-1 leading-snug">
          {achievement.description}
        </p>

        <div className="mt-2 text-xs font-bold text-gold-600">
          +{achievement.xpReward} XP Reward
        </div>
      </div>
    </div>
  );
};
