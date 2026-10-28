import React from 'react';
import { Unit, PathNode } from '../../types';
import { UNIT_THEMES, UnitThemeConfig } from '../../data/curriculumData';
import { BookOpen, ChevronDown, Sparkles, ArrowRight, Target } from 'lucide-react';

interface UnitHeaderBannerProps {
  unit: Unit;
  sectionNumber: number;
  languageName: string;
  activeNode?: PathNode | null;
  onOpenGuidebook: () => void;
  onOpenSectionSelector: () => void;
  onStartActiveLesson?: () => void;
  onScrollToActiveNode?: () => void;
}

export const UnitHeaderBanner: React.FC<UnitHeaderBannerProps> = ({
  unit,
  sectionNumber,
  languageName,
  activeNode,
  onOpenGuidebook,
  onOpenSectionSelector,
  onStartActiveLesson,
  onScrollToActiveNode,
}) => {
  const theme: UnitThemeConfig = UNIT_THEMES[unit.themeColor] || UNIT_THEMES.green;

  return (
    <div
      className={`
        sticky top-3 z-30 w-full rounded-2xl sm:rounded-3xl p-4 sm:p-5
        bg-gradient-to-r ${theme.headerGradient} border-2 ${theme.headerBorder}
        text-white shadow-earthy-lg transition-all duration-300
      `}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Section & Unit Indicator (Interactive Pill to switch sections!) */}
        <div className="space-y-1 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenSectionSelector}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider
              ${theme.headerPillBg} hover:brightness-110 active:scale-95 transition-all shadow-xs
            `}
            title="Click to switch sections or view roadmap"
          >
            <span>SECTION {sectionNumber}, UNIT {unit.unitNumber}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          <h2 className="text-base sm:text-xl font-black font-display tracking-tight leading-snug line-clamp-1 drop-shadow-xs">
            {unit.title}
          </h2>

          <p className="text-[11px] sm:text-xs text-white/90 font-medium line-clamp-1 hidden sm:block">
            {unit.description}
          </p>
        </div>

        {/* Right: Guidebook Button (Notebook icon matching Duolingo screenshot) */}
        <button
          type="button"
          onClick={onOpenGuidebook}
          className="shrink-0 p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 text-white transition-all shadow-xs flex items-center gap-1.5"
          title={`Open Unit ${unit.unitNumber} Guidebook`}
          aria-label={`Open Unit ${unit.unitNumber} Guidebook`}
        >
          <BookOpen className="w-5 h-5 sm:w-4 sm:h-4 text-gold-300" />
          <span className="hidden sm:inline-block text-xs font-extrabold">Guidebook</span>
        </button>
      </div>

      {/* Quick Action: Continue Next Lesson Without Scrolling */}
      {activeNode && onStartActiveLesson && (
        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={onStartActiveLesson}
            className="inline-flex items-center gap-2 bg-white text-teal-950 hover:bg-cream-50 active:scale-95 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black shadow-[0_3px_0_#94a3b8] transition-all"
            title="Start your next lesson directly"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
            <span className="truncate max-w-[200px] sm:max-w-xs">Continue: {activeNode.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onScrollToActiveNode && (
            <button
              type="button"
              onClick={onScrollToActiveNode}
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-xl transition-all border border-white/20"
              title="Focus on this node on the road"
            >
              <Target className="w-3.5 h-3.5 text-gold-300" />
              <span>Scroll to Node</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
