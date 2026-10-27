import React from 'react';
import { TribalLanguage } from '../../types';
import { Button } from '../common/Button';
import { AudioPlayer } from '../common/AudioPlayer';
import { Globe, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface LanguageCardProps {
  language: TribalLanguage;
  isSelected: boolean;
  onSelect: (languageId: string) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(language.languageId)}
      className={`
        relative rounded-3xl p-6 sm:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between
        border-3 bg-cream-100
        ${
          isSelected
            ? 'border-forest-600 shadow-earthy-lg ring-4 ring-forest-100 scale-[1.02]'
            : 'border-sage-200 hover:border-forest-300 shadow-earthy hover:shadow-earthy-lg hover:-translate-y-1'
        }
      `}
    >
      {/* Active Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-forest-600 text-cream-50 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active Course</span>
        </div>
      )}

      <div>
        {/* Header: Native Name & Script */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-forest-700 tracking-wider uppercase font-sans">
              {language.languageFamily}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-900 mt-0.5">
              {language.name}
            </h3>
            <p className="text-lg font-bold text-forest-600 font-sans mt-0.5">
              {language.nativeName}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-forest-50 border-2 border-forest-200 flex items-center justify-center font-display font-black text-xl text-forest-700 shrink-0 shadow-sm">
            {language.name.charAt(0)}
          </div>
        </div>

        {/* Script & Region Badges */}
        <div className="flex flex-wrap gap-2 my-3">
          <span className="inline-flex items-center gap-1 bg-cream-200 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-xl">
            <Globe className="w-3.5 h-3.5 text-forest-600" />
            {language.scriptName}
          </span>
          <span className="inline-flex items-center gap-1 bg-cream-200 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-xl">
            <Users className="w-3.5 h-3.5 text-gold-600" />
            {language.speakersCount}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-teal-700 font-medium leading-relaxed my-3 line-clamp-3">
          {language.description}
        </p>

        {/* Sample Greeting & Audio snippet */}
        <div className="my-4 p-3.5 bg-cream-50 rounded-2xl border-2 border-sage-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-forest-600 block">
              Sample Greeting
            </span>
            <span className="font-extrabold text-teal-900 font-display text-base">
              {language.sampleGreeting}
            </span>
            <span className="text-xs text-teal-600 block">
              {language.sampleGreetingMeaning}
            </span>
          </div>

          <AudioPlayer
            text={language.sampleGreeting}
            languageId={language.languageId}
            size="md"
            variant="gold"
          />
        </div>

        {/* Cultural Reverence Insight */}
        <div className="p-3 bg-forest-50/70 rounded-2xl border border-forest-200 text-xs text-forest-800 leading-snug flex items-start gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <span>{language.culturalNote}</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <Button
          variant={isSelected ? 'primary' : 'gold'}
          fullWidth={true}
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(language.languageId);
          }}
        >
          {isSelected ? 'Continue Course' : 'Start Learning ' + language.name}
        </Button>
      </div>
    </div>
  );
};
