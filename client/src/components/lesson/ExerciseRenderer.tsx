import React, { useState, useEffect, useCallback } from 'react';
import { Exercise } from '../../types';
import { AudioPlayer } from '../common/AudioPlayer';
import { Button } from '../common/Button';
import { sound } from '../../utils/sound';
import { CheckCircle2, XCircle, Sparkles, Volume2, CornerDownLeft } from 'lucide-react';

interface ExerciseRendererProps {
  exercise: Exercise;
  languageId: string;
  onNext: (isCorrect: boolean) => void;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  languageId,
  onNext,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ tribal: string; translation: string }[]>([]);
  const [selectedTribalPair, setSelectedTribalPair] = useState<string | null>(null);
  const [selectedTranslationPair, setSelectedTranslationPair] = useState<string | null>(null);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedAnswer(null);
    setMatchedPairs([]);
    setSelectedTribalPair(null);
    setSelectedTranslationPair(null);
    setArrangedWords([]);
    setHasChecked(false);
    setIsCorrect(false);
  }, [exercise.exerciseId]);

  const canCheck = useCallback(() => {
    if (hasChecked) return false;
    if (exercise.type === 'learn_word') return true;
    if (exercise.type === 'match_pairs') return matchedPairs.length === (exercise.pairs?.length || 4);
    if (exercise.type === 'arrange_words') return arrangedWords.length > 0;
    return selectedAnswer !== null;
  }, [hasChecked, exercise.type, exercise.pairs?.length, matchedPairs.length, arrangedWords.length, selectedAnswer]);

  // Handle checking the user's answer
  const handleCheckAnswer = useCallback(() => {
    let correct = false;

    if (exercise.type === 'learn_word') {
      correct = true;
    } else if (exercise.type === 'match_pairs') {
      const requiredPairsCount = exercise.pairs?.length || 4;
      correct = matchedPairs.length === requiredPairsCount;
    } else if (exercise.type === 'arrange_words') {
      const expected = Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join(' ')
        : exercise.correctAnswer;
      correct = arrangedWords.join(' ').toLowerCase() === expected.toLowerCase();
    } else {
      correct =
        selectedAnswer?.trim().toLowerCase() ===
        (typeof exercise.correctAnswer === 'string'
          ? exercise.correctAnswer.trim().toLowerCase()
          : exercise.correctAnswer[0]?.trim().toLowerCase());
    }

    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  }, [exercise, matchedPairs, arrangedWords, selectedAnswer]);

  const handleContinue = useCallback(() => {
    onNext(isCorrect);
  }, [onNext, isCorrect]);

  // Laptop Keyboard Navigation (Enter to check/continue, 1-4 for choices)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, don't intercept
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (!hasChecked && exercise.options && exercise.options.length > 0) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= exercise.options.length) {
          e.preventDefault();
          sound.playClick();
          setSelectedAnswer(exercise.options[num - 1]);
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!hasChecked) {
          if (canCheck()) {
            handleCheckAnswer();
          }
        } else {
          handleContinue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChecked, exercise.options, canCheck, handleCheckAnswer, handleContinue]);

  // Pair Matching Logic
  const handlePairSelection = (tribal: string | null, translation: string | null) => {
    sound.playClick();
    const newTribal = tribal !== null ? tribal : selectedTribalPair;
    const newTranslation = translation !== null ? translation : selectedTranslationPair;

    setSelectedTribalPair(newTribal);
    setSelectedTranslationPair(newTranslation);

    if (newTribal && newTranslation) {
      const validPair = exercise.pairs?.find(
        (p) => p.tribal === newTribal && p.translation === newTranslation
      );
      if (validPair) {
        sound.playCorrect();
        setMatchedPairs((prev) => [...prev, validPair]);
      } else {
        sound.playIncorrect();
      }
      setSelectedTribalPair(null);
      setSelectedTranslationPair(null);
    }
  };

  // Word Arranging Logic
  const handleToggleWord = (word: string) => {
    sound.playClick();
    if (arrangedWords.includes(word)) {
      setArrangedWords((prev) => prev.filter((w) => w !== word));
    } else {
      setArrangedWords((prev) => [...prev, word]);
    }
  };

  return (
    <div className="w-full flex flex-col justify-between flex-1 min-h-[440px] sm:min-h-[500px]">
      <div className="flex-1 max-w-2xl mx-auto w-full px-1">
        {/* Exercise Prompt Title */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <h3 className="text-lg sm:text-2xl font-bold font-display text-teal-950 leading-snug">
            {exercise.prompt}
          </h3>
        </div>

        {/* 1. Learn a New Word */}
        {exercise.type === 'learn_word' && (
          <div className="bg-cream-100 border-2 sm:border-3 border-sage-300 rounded-3xl p-5 sm:p-8 text-center shadow-earthy space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center">
              <AudioPlayer
                text={exercise.tribalWord || ''}
                languageId={languageId}
                size="lg"
                variant="gold"
              />
            </div>
            <div>
              {exercise.nativeScript && (
                <p className="text-xl sm:text-2xl font-extrabold text-forest-700 font-sans">
                  {exercise.nativeScript}
                </p>
              )}
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-teal-900 mt-1">
                {exercise.tribalWord}
              </h2>
              {exercise.transliteration && (
                <p className="text-xs sm:text-sm text-teal-600 font-semibold tracking-wide mt-1">
                  /{exercise.transliteration}/
                </p>
              )}
            </div>
            <div className="pt-3 border-t border-sage-200">
              <p className="text-lg sm:text-xl font-bold text-teal-900">{exercise.englishMeaning}</p>
              {exercise.hindiMeaning && (
                <p className="text-xs sm:text-sm font-semibold text-forest-600 mt-0.5">
                  {exercise.hindiMeaning}
                </p>
              )}
            </div>
            {exercise.exampleSentence && (
              <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200 text-left text-xs space-y-1">
                <span className="font-bold text-forest-700 block uppercase tracking-wider text-[10px]">Example:</span>
                <p className="font-bold text-teal-900">{exercise.exampleSentence.tribal}</p>
                <p className="text-teal-700 italic">&ldquo;{exercise.exampleSentence.translation}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* 2. Multiple Choice / Select Meaning / Fill Blank */}
        {(exercise.type === 'multiple_choice' ||
          exercise.type === 'select_meaning' ||
          exercise.type === 'fill_blank') && (
          <div className="space-y-4 sm:space-y-6">
            {exercise.tribalWord && (
              <div className="p-4 sm:p-5 bg-cream-100 border-2 border-sage-300 rounded-3xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <AudioPlayer
                    text={exercise.tribalWord}
                    languageId={languageId}
                    size="md"
                    variant="gold"
                  />
                  <div>
                    {exercise.nativeScript && (
                      <p className="text-xs sm:text-sm font-bold text-forest-700">{exercise.nativeScript}</p>
                    )}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-teal-900 font-display">
                      {exercise.tribalWord}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3.5">
              {exercise.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!hasChecked) {
                        sound.playClick();
                        setSelectedAnswer(option);
                      }
                    }}
                    disabled={hasChecked}
                    className={`
                      w-full min-h-[52px] p-3.5 sm:p-4 rounded-2xl font-bold text-sm sm:text-base text-left transition-all duration-150 border-2 select-none touch-manipulation
                      ${
                        isSelected
                          ? 'bg-gold-100 border-gold-500 text-teal-950 shadow-[0_3px_0_#CF841C]'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-400 hover:bg-cream-50 text-teal-900 shadow-[0_3px_0_#C7D5CB]'
                      }
                      active:translate-y-0.5 active:shadow-none
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-1">
                        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-cream-200 border border-sage-300 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="flex-1 leading-snug">{option}</span>
                      </div>
                      {/* Laptop keyboard hint */}
                      <span className="hidden lg:inline-block text-[10px] font-mono font-bold text-teal-500 bg-cream-200/80 border border-sage-300 px-1.5 py-0.5 rounded">
                        key {idx + 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Match Pairs Exercise */}
        {exercise.type === 'match_pairs' && (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-xs sm:text-sm text-teal-700 font-medium text-center">
              Tap a word on the left and match it with its meaning on the right!
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Tribal Words Column */}
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-forest-700 block text-center">
                  Tribal Language
                </span>
                {exercise.pairs?.map((pair, idx) => {
                  const isMatched = matchedPairs.some((p) => p.tribal === pair.tribal);
                  const isSelected = selectedTribalPair === pair.tribal;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isMatched || hasChecked}
                      onClick={() => handlePairSelection(pair.tribal, null)}
                      className={`
                        w-full min-h-[46px] p-2.5 sm:p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-center border-2 transition-all select-none touch-manipulation
                        ${
                          isMatched
                            ? 'bg-forest-100 border-forest-400 text-forest-700 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-gold-200 border-gold-500 text-teal-900 shadow-[0_3px_0_#CF841C]'
                            : 'bg-cream-100 border-sage-300 hover:border-forest-400 text-teal-900 shadow-[0_3px_0_#C7D5CB]'
                        }
                      `}
                    >
                      {pair.tribal}
                    </button>
                  );
                })}
              </div>

              {/* Translation Column */}
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-forest-700 block text-center">
                  Meaning
                </span>
                {exercise.pairs
                  ?.slice()
                  .reverse()
                  .map((pair, idx) => {
                    const isMatched = matchedPairs.some((p) => p.translation === pair.translation);
                    const isSelected = selectedTranslationPair === pair.translation;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isMatched || hasChecked}
                        onClick={() => handlePairSelection(null, pair.translation)}
                        className={`
                          w-full min-h-[46px] p-2.5 sm:p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-center border-2 transition-all select-none touch-manipulation
                          ${
                            isMatched
                              ? 'bg-forest-100 border-forest-400 text-forest-700 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gold-200 border-gold-500 text-teal-900 shadow-[0_3px_0_#CF841C]'
                              : 'bg-cream-100 border-sage-300 hover:border-forest-400 text-teal-900 shadow-[0_3px_0_#C7D5CB]'
                          }
                        `}
                      >
                        {pair.translation}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* 4. Listen & Identify Exercise */}
        {exercise.type === 'listen_identify' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="p-6 sm:p-8 bg-cream-100 border-2 sm:border-3 border-sage-300 rounded-3xl flex flex-col items-center justify-center text-center shadow-earthy">
              <AudioPlayer
                text={exercise.audioPronunciationText || exercise.tribalWord || ''}
                languageId={languageId}
                size="xl"
                variant="gold"
              />
              <p className="text-xs sm:text-sm font-bold text-teal-700 mt-3 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-gold-600" />
                <span>Tap speaker icon to listen carefully</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
              {exercise.options?.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!hasChecked) {
                        sound.playClick();
                        setSelectedAnswer(option);
                      }
                    }}
                    disabled={hasChecked}
                    className={`
                      w-full min-h-[48px] p-3 sm:p-4 rounded-2xl font-bold text-sm sm:text-base text-left transition-all border-2 touch-manipulation
                      ${
                        isSelected
                          ? 'bg-gold-100 border-gold-500 text-teal-950 shadow-[0_3px_0_#CF841C]'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-400 text-teal-900 shadow-[0_3px_0_#C7D5CB]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      <span className="hidden lg:inline-block text-[10px] font-mono text-teal-500 bg-cream-200 border border-sage-300 px-1 rounded">
                        key {idx + 1}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Arrange Words to Form a Sentence */}
        {exercise.type === 'arrange_words' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="min-h-[64px] sm:min-h-[70px] p-3 sm:p-4 bg-cream-50 border-2 border-dashed border-sage-400 rounded-2xl flex flex-wrap gap-2 items-center">
              {arrangedWords.length === 0 ? (
                <span className="text-xs sm:text-sm text-teal-500 italic">
                  Tap words below to arrange the sentence...
                </span>
              ) : (
                arrangedWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !hasChecked && handleToggleWord(word)}
                    className="bg-gold-300 hover:bg-gold-400 text-teal-950 font-bold px-3 py-1.5 rounded-xl border-2 border-gold-500 shadow-sm transition-all text-xs sm:text-sm"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2 sm:pt-4">
              {exercise.options?.map((word, idx) => {
                const isUsed = arrangedWords.includes(word);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUsed || hasChecked}
                    onClick={() => handleToggleWord(word)}
                    className={`
                      px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-base border-2 transition-all touch-manipulation
                      ${
                        isUsed
                          ? 'bg-cream-300 border-sage-300 text-teal-400 opacity-40 shadow-none'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-500 text-teal-900 shadow-[0_3px_0_#C7D5CB] active:translate-y-1'
                      }
                    `}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action / Evaluation Bar */}
      <div className="sticky bottom-0 bg-cream-200/95 backdrop-blur-md pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t-2 border-sage-200 mt-6 z-20 -mx-4 px-4 sm:mx-0 sm:px-0">
        {!hasChecked ? (
          <div className="flex justify-end max-w-2xl mx-auto w-full">
            <Button
              variant="gold"
              size="lg"
              disabled={!canCheck()}
              onClick={handleCheckAnswer}
              className="w-full sm:w-auto min-w-[200px]"
            >
              <span className="flex items-center justify-center gap-2">
                <span>Check Answer</span>
                <span className="hidden lg:inline-flex items-center text-[10px] bg-teal-950/20 px-1.5 py-0.5 rounded font-mono">
                  <CornerDownLeft className="w-3 h-3 mr-0.5" /> Enter
                </span>
              </span>
            </Button>
          </div>
        ) : (
          <div
            className={`
              max-w-2xl mx-auto w-full p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200
              ${
                isCorrect
                  ? 'bg-forest-50 border-forest-400 text-forest-900'
                  : 'bg-terracotta-50 border-terracotta-400 text-terracotta-900'
              }
            `}
          >
            <div className="flex items-start gap-3 w-full sm:w-auto">
              {isCorrect ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-forest-600 text-cream-50 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-terracotta-600 text-cream-50 flex items-center justify-center shrink-0 shadow-sm">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold font-display text-base sm:text-lg">
                  {isCorrect ? 'Nicely Done! 🌟' : 'Correct Answer:'}
                </h4>
                <p className="text-xs sm:text-sm font-medium mt-0.5 break-words">
                  {isCorrect
                    ? exercise.explanation
                    : typeof exercise.correctAnswer === 'string'
                    ? exercise.correctAnswer
                    : Array.isArray(exercise.correctAnswer)
                    ? exercise.correctAnswer.join(' ')
                    : exercise.explanation}
                </p>
                {!isCorrect && exercise.explanation && (
                  <p className="text-[11px] sm:text-xs text-terracotta-700 italic mt-0.5">
                    {exercise.explanation}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant={isCorrect ? 'primary' : 'danger'}
              size="lg"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[170px] shrink-0"
              icon={<Sparkles className="w-4 h-4" />}
            >
              <span className="flex items-center justify-center gap-2">
                <span>Continue</span>
                <span className="hidden lg:inline-flex items-center text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                  <CornerDownLeft className="w-3 h-3 mr-0.5" /> Enter
                </span>
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
