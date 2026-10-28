import React from 'react';
import { PathNode } from '../../types';
import { UNIT_THEMES, UnitThemeConfig } from '../../data/curriculumData';
import { Check, Lock, Star, Sparkles, Trophy, Gift } from 'lucide-react';

interface PathNodeCardProps {
  node: PathNode;
  themeColor: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isActive: boolean;
  isChestClaimed?: boolean;
  onSelect: (node: PathNode) => void;
  index: number;
  mascot?: {
    name: string;
    avatar: string;
    quote: string;
  };
}

export const PathNodeCard: React.FC<PathNodeCardProps> = ({
  node,
  themeColor,
  isCompleted,
  isUnlocked,
  isActive,
  isChestClaimed,
  onSelect,
  index,
  mascot,
}) => {
  const theme: UnitThemeConfig = UNIT_THEMES[themeColor] || UNIT_THEMES.green;

  // Snake curve alternating offsets: center -> right -> center -> left -> center
  const offsets = [
    'translate-x-0',
    'translate-x-4 sm:translate-x-10 lg:translate-x-14',
    'translate-x-0',
    '-translate-x-4 sm:-translate-x-10 lg:-translate-x-14',
    'translate-x-0',
  ];
  const offsetClass = offsets[index % offsets.length];

  const handleClick = () => {
    if (isUnlocked) {
      onSelect(node);
    }
  };

  // Node is Chest
  if (node.type === 'chest') {
    return (
      <div className={`flex flex-col items-center my-3 sm:my-5 relative transition-transform ${offsetClass} ${isActive ? 'scroll-mt-36 sm:scroll-mt-40' : ''}`}>
        {/* Connector Dots */}
        {index > 0 && (
          <div className="flex flex-col items-center gap-1.5 -mt-3 mb-2.5">
            <div className="w-2 h-2 rounded-full bg-sage-300" />
            <div className="w-2 h-2 rounded-full bg-sage-300/70" />
            <div className="w-2 h-2 rounded-full bg-sage-300/40" />
          </div>
        )}

        <button
          onClick={handleClick}
          disabled={!isUnlocked}
          title={isUnlocked ? (isChestClaimed ? 'Milestone Chest (Claimed)' : 'Open Treasure Chest!') : 'Complete previous lessons to unlock'}
          className={`
            relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex flex-col items-center justify-center
            transition-all duration-200 select-none group touch-manipulation
            ${
              isChestClaimed
                ? 'bg-amber-100 border-2 border-amber-300 text-amber-700 shadow-[0_4px_0_#d97706] opacity-75'
                : isUnlocked
                ? 'bg-gradient-to-b from-amber-400 to-amber-500 border-2 border-amber-300 text-teal-950 shadow-[0_6px_0_#b45309] hover:brightness-110 active:translate-y-1 active:shadow-[0_2px_0_#b45309] animate-bounce'
                : 'bg-cream-300 text-teal-400 border-2 border-sage-300 shadow-[0_4px_0_#C7D5CB] cursor-not-allowed opacity-70'
            }
          `}
        >
          <Gift className={`w-8 h-8 sm:w-10 sm:h-10 ${isChestClaimed ? 'text-amber-600' : isUnlocked ? 'text-amber-950 fill-amber-300' : 'text-teal-400'}`} />

          {isUnlocked && !isChestClaimed && (
            <div className="absolute -top-2 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md animate-pulse">
              CLAIM +30 XP
            </div>
          )}
        </button>

        <div className="mt-2 text-center max-w-[150px]">
          <p className="font-display font-extrabold text-xs sm:text-sm text-teal-900 leading-tight">
            {node.title}
          </p>
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-600">
            {isChestClaimed ? 'Claimed ✨' : '+30 XP Bonus'}
          </span>
        </div>
      </div>
    );
  }

  // Node is Trophy / Unit Finale
  if (node.type === 'trophy') {
    return (
      <div className={`flex flex-col items-center my-4 sm:my-6 relative transition-transform ${offsetClass} ${isActive ? 'scroll-mt-36 sm:scroll-mt-40' : ''}`}>
        {/* Connector Dots */}
        {index > 0 && (
          <div className="flex flex-col items-center gap-1.5 -mt-3 mb-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-gold-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-gold-400/40" />
          </div>
        )}

        <button
          onClick={handleClick}
          disabled={!isUnlocked}
          title={isUnlocked ? `Unit Mastery Finale: ${node.title}` : 'Complete unit lessons to unlock trophy review'}
          className={`
            relative w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center
            transition-all duration-200 select-none group touch-manipulation
            ${
              isCompleted
                ? 'bg-gradient-to-b from-yellow-400 via-amber-500 to-amber-600 text-teal-950 shadow-[0_6px_0_#92400e] active:translate-y-1 active:shadow-[0_2px_0_#92400e]'
                : isUnlocked
                ? `${theme.nodeBg} ring-4 ${theme.activeRing} hover:brightness-110 active:translate-y-1`
                : 'bg-cream-300 text-teal-400 border-2 border-sage-300 shadow-[0_4px_0_#C7D5CB] cursor-not-allowed opacity-75'
            }
          `}
        >
          <Trophy className={`w-9 h-9 sm:w-11 sm:h-11 ${isCompleted ? 'fill-current text-teal-950' : isUnlocked ? 'text-white' : 'text-teal-400'}`} />

          {isUnlocked && !isCompleted && (
            <div className="absolute -top-2.5 bg-forest-600 text-cream-100 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-300 fill-current" />
              <span>FINALE</span>
            </div>
          )}
        </button>

        <div className="mt-2.5 text-center max-w-[170px]">
          <h4 className="font-display font-extrabold text-xs sm:text-base text-teal-900 leading-tight">
            {node.title}
          </h4>
          <span className="text-[10px] sm:text-xs font-bold text-amber-600">
            {isCompleted ? 'Mastered 👑' : `+${node.xpReward} XP`}
          </span>
        </div>
      </div>
    );
  }

  // Standard Star Lesson or Native Script Character Node
  return (
    <div className={`flex flex-col items-center my-3 sm:my-5 relative transition-transform ${offsetClass} ${isActive ? 'scroll-mt-36 sm:scroll-mt-40' : ''}`}>
      {/* Duolingo Journey Connector Dots */}
      {index > 0 && (
        <div className="flex flex-col items-center gap-1.5 -mt-3 mb-2.5">
          <div className="w-2 h-2 rounded-full bg-sage-300" />
          <div className="w-2 h-2 rounded-full bg-sage-300/70" />
          <div className="w-2 h-2 rounded-full bg-sage-300/40" />
        </div>
      )}

      {/* Mascot cheer card placed beside node index 1 or 2 */}
      {mascot && (index === 1 || index === 2) && (
        <div className={`absolute top-0 ${index === 1 ? '-right-28 sm:-right-44' : '-left-28 sm:-left-44'} z-10 hidden sm:flex items-center gap-2 max-w-[140px] sm:max-w-[170px]`}>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cream-100 border-2 border-sage-300 shadow-earthy flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            {mascot.avatar}
          </div>
          <div className="bg-white/95 border border-sage-300 p-2 rounded-xl shadow-xs text-left">
            <span className="text-[10px] font-extrabold text-forest-700 block">{mascot.name}</span>
            <p className="text-[9px] text-teal-800 leading-tight font-medium">{mascot.quote}</p>
          </div>
        </div>
      )}

      {/* Duolingo-style 3D Node Button */}
      <button
        onClick={handleClick}
        disabled={!isUnlocked}
        title={isUnlocked ? `Start: ${node.title}` : 'Complete previous step to unlock'}
        className={`
          relative w-16 h-16 sm:w-20 sm:h-20 lg:w-22 lg:h-22 rounded-full flex flex-col items-center justify-center
          transition-all duration-200 select-none group touch-manipulation
          ${
            isCompleted
              ? 'bg-forest-600 hover:bg-forest-500 text-cream-100 shadow-[0_5px_0_#1A3C28] sm:shadow-[0_6px_0_#1A3C28] active:translate-y-1 active:shadow-[0_2px_0_#1A3C28]'
              : isUnlocked
              ? `${theme.nodeBg} ${theme.nodeHoverBg} ring-4 ${theme.activeRing} ${isActive ? 'animate-pulse' : ''} active:translate-y-1`
              : 'bg-cream-300 text-teal-400 border-2 border-sage-300 shadow-[0_4px_0_#C7D5CB] cursor-not-allowed opacity-80'
          }
        `}
      >
        {isCompleted ? (
          <Check className="w-7 h-7 sm:w-9 sm:h-9 stroke-[3] text-cream-50" />
        ) : isUnlocked ? (
          node.type === 'script' ? (
            <span className="text-xl sm:text-2xl font-black font-sans leading-none text-white drop-shadow-sm group-hover:scale-110 transition-transform">
              {node.scriptChar || 'あ'}
            </span>
          ) : (
            <Star className="w-7 h-7 sm:w-9 sm:h-9 fill-current stroke-[1.5] text-white group-hover:scale-110 transition-transform" />
          )
        ) : (
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500" />
        )}

        {/* Start Badge for active lesson */}
        {isUnlocked && !isCompleted && (
          <div className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 bg-amber-500 text-cream-100 text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200 fill-current" />
            <span>START</span>
          </div>
        )}
      </button>

      {/* Lesson Title & XP Badge */}
      <div className="mt-2.5 sm:mt-3 text-center max-w-[170px] sm:max-w-[200px]">
        <h4 className="font-display font-extrabold text-xs sm:text-base text-teal-900 leading-tight">
          {node.title}
        </h4>
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1">
          <span className="text-[11px] sm:text-xs font-bold text-amber-600">
            +{node.xpReward} XP
          </span>
          {isCompleted && (
            <span className="text-[10px] sm:text-[11px] font-bold text-forest-600 bg-forest-100 px-1.5 sm:px-2 py-0.5 rounded-md">
              Mastered ⭐
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
