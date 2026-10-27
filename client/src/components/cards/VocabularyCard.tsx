import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import { AudioPlayer } from '../common/AudioPlayer';
import { Button } from '../common/Button';
import { Star, Eye, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';

interface VocabularyCardProps {
  item: VocabularyItem;
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  currentIndex,
  totalItems,
  onNext,
  onPrev,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset revealed state when item changes
  useEffect(() => {
    setIsRevealed(false);
  }, [item.vocabularyId]);

  const handleReveal = () => {
    sound.playClick();
    setIsRevealed(!isRevealed);
  };

  // Laptop Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onPrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalItems, onNext, onPrev, isRevealed]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Word Counter & Favorite */}
      <div className="flex items-center justify-between w-full mb-3 px-2 text-xs font-bold text-teal-700">
        <span className="bg-cream-100 border border-sage-300 px-3 py-1 rounded-full">
          Word {currentIndex + 1} of {totalItems}
        </span>
        <button
          onClick={onToggleFavorite}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            isFavorite
              ? 'bg-gold-100 text-gold-700 border border-gold-300'
              : 'bg-cream-100 text-teal-600 border border-sage-300 hover:text-gold-600'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-gold-500 text-gold-500' : ''}`} />
          <span>{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Main Flashcard Card */}
      <div
        onClick={handleReveal}
        className="w-full bg-cream-100 border-2 sm:border-3 border-sage-300 rounded-3xl p-5 sm:p-8 shadow-earthy-lg cursor-pointer transition-all duration-300 hover:border-gold-400 relative overflow-hidden flex flex-col items-center justify-between min-h-[320px] sm:min-h-[380px] select-none touch-manipulation"
      >
        {/* Top bar in card */}
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100/80 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl">
            {item.category}
          </span>
          <AudioPlayer
            text={item.word}
            languageId={item.languageId}
            size="md"
            variant="gold"
          />
        </div>

        {/* Big Tribal Word & Script */}
        <div className="text-center my-4 sm:my-6 max-w-full px-2">
          {item.nativeScript && item.nativeScript !== item.word && (
            <p className="text-xl sm:text-3xl font-extrabold text-forest-700 font-sans mb-1 break-words">
              {item.nativeScript}
            </p>
          )}
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-teal-950 tracking-wide break-words">
            {item.word}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-teal-600 tracking-wider mt-1.5">
            /{item.transliteration}/
          </p>
        </div>

        {/* Revealed Meaning Area */}
        <div className="w-full">
          {isRevealed ? (
            <div className="w-full p-4 sm:p-5 bg-cream-50 rounded-2xl border-2 border-gold-300 text-center animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[10px] sm:text-[11px] font-bold text-gold-600 uppercase tracking-widest block mb-0.5">
                Meaning
              </span>
              <p className="text-lg sm:text-2xl font-bold font-display text-teal-900 leading-snug">
                {item.englishMeaning}
              </p>
              {item.hindiMeaning && (
                <p className="text-xs sm:text-sm font-semibold text-forest-700 mt-1">
                  {item.hindiMeaning}
                </p>
              )}

              {/* Example Sentence */}
              {item.exampleSentence && (
                <div className="mt-3 pt-2.5 border-t border-gold-200 text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-forest-600 uppercase tracking-wider block">
                    Example Sentence:
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-teal-900 mt-0.5">
                    {item.exampleSentence.tribal}
                  </p>
                  <p className="text-[11px] sm:text-xs text-teal-700 italic">
                    &ldquo;{item.exampleSentence.translation}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full py-3 sm:py-4 text-center text-teal-600 font-bold text-xs sm:text-sm bg-cream-200/60 rounded-2xl border-2 border-dashed border-sage-300 hover:border-gold-400 flex items-center justify-center gap-2 transition-colors">
              <Eye className="w-4 h-4 text-forest-600" />
              <span>Tap card to reveal meaning</span>
              <span className="hidden lg:inline-block text-[10px] font-mono text-teal-400 bg-cream-200 border border-sage-300 px-1.5 py-0.5 rounded">
                Space
              </span>
            </div>
          )}
        </div>

        {/* Cultural note if present */}
        {item.culturalContext && isRevealed && (
          <div className="mt-2.5 text-xs text-forest-800 bg-forest-50 p-2 sm:p-2.5 rounded-xl border border-forest-200 flex items-center gap-1.5 w-full">
            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span className="line-clamp-2">{item.culturalContext}</span>
          </div>
        )}
      </div>

      {/* Navigation Controls: Previous / Next Word */}
      <div className="w-full flex items-center justify-between gap-3 mt-4 sm:mt-6">
        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={currentIndex === 0}
          icon={<ChevronLeft className="w-4 h-4" />}
          iconPosition="left"
          className="flex-1 sm:flex-initial"
        >
          <span className="flex items-center gap-1">
            <span>Previous</span>
            <span className="hidden lg:inline text-[10px] text-teal-500 font-mono">[←]</span>
          </span>
        </Button>

        <Button
          variant="gold"
          size="md"
          onClick={onNext}
          disabled={currentIndex === totalItems - 1}
          icon={<ChevronRight className="w-4 h-4" />}
          iconPosition="right"
          className="flex-1 sm:flex-initial"
        >
          <span className="flex items-center gap-1">
            <span>Next Word</span>
            <span className="hidden lg:inline text-[10px] text-teal-800 font-mono">[→]</span>
          </span>
        </Button>
      </div>
    </div>
  );
};
