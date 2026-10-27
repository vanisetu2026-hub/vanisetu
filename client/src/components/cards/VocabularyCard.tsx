import React, { useState } from 'react';
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

  const handleReveal = () => {
    sound.playClick();
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Word Counter */}
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
        className="w-full bg-cream-100 border-3 border-sage-300 rounded-3xl p-6 sm:p-10 shadow-earthy-lg cursor-pointer transition-all duration-300 hover:border-gold-400 relative overflow-hidden flex flex-col items-center justify-between min-h-[380px] select-none"
      >
        {/* Subtle Category Pill */}
        <div className="w-full flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100/80 px-3 py-1 rounded-xl">
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
        <div className="text-center my-6">
          {item.nativeScript && item.nativeScript !== item.word && (
            <p className="text-2xl sm:text-3xl font-extrabold text-forest-700 font-sans mb-1">
              {item.nativeScript}
            </p>
          )}
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-teal-950 tracking-wide">
            {item.word}
          </h2>
          <p className="text-sm font-semibold text-teal-600 tracking-wider mt-2">
            /{item.transliteration}/
          </p>
        </div>

        {/* Revealed Meaning Area */}
        <div className="w-full">
          {isRevealed ? (
            <div className="w-full p-4 sm:p-5 bg-cream-50 rounded-2xl border-2 border-gold-300 text-center animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[11px] font-bold text-gold-600 uppercase tracking-widest block mb-1">
                Meaning
              </span>
              <p className="text-xl sm:text-2xl font-bold font-display text-teal-900">
                {item.englishMeaning}
              </p>
              {item.hindiMeaning && (
                <p className="text-sm font-semibold text-forest-700 mt-1">
                  {item.hindiMeaning}
                </p>
              )}

              {/* Example Sentence */}
              {item.exampleSentence && (
                <div className="mt-4 pt-3 border-t border-gold-200 text-left">
                  <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wider block">
                    Example Sentence:
                  </span>
                  <p className="text-sm font-bold text-teal-900 mt-0.5">
                    {item.exampleSentence.tribal}
                  </p>
                  <p className="text-xs text-teal-700 italic">
                    &ldquo;{item.exampleSentence.translation}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full py-4 text-center text-teal-600 font-bold text-sm bg-cream-200/60 rounded-2xl border-2 border-dashed border-sage-300 hover:border-gold-400 flex items-center justify-center gap-2 transition-colors">
              <Eye className="w-4 h-4 text-forest-600" />
              <span>Tap or click card to reveal meaning</span>
            </div>
          )}
        </div>

        {/* Cultural note if present */}
        {item.culturalContext && isRevealed && (
          <div className="mt-3 text-xs text-forest-800 bg-forest-50 p-2.5 rounded-xl border border-forest-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
            <span>{item.culturalContext}</span>
          </div>
        )}
      </div>

      {/* Navigation Controls: Previous / Next Word */}
      <div className="w-full flex items-center justify-between gap-4 mt-6">
        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          disabled={currentIndex === 0}
          icon={<ChevronLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Previous Word
        </Button>

        <Button
          variant="gold"
          size="md"
          onClick={onNext}
          disabled={currentIndex === totalItems - 1}
          icon={<ChevronRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Next Word
        </Button>
      </div>
    </div>
  );
};
