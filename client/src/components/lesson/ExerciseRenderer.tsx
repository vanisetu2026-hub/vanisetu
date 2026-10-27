import React, { useState } from 'react';
import { Exercise } from '../../types';
import { AudioPlayer } from '../common/AudioPlayer';
import { Button } from '../common/Button';
import { sound } from '../../utils/sound';
import { CheckCircle2, XCircle, Sparkles, Volume2 } from 'lucide-react';

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
  React.useEffect(() => {
    setSelectedAnswer(null);
    setMatchedPairs([]);
    setSelectedTribalPair(null);
    setSelectedTranslationPair(null);
    setArrangedWords([]);
    setHasChecked(false);
    setIsCorrect(false);
  }, [exercise.exerciseId]);

  // Handle checking the user's answer
  const handleCheckAnswer = () => {
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
  };

  const handleContinue = () => {
    onNext(isCorrect);
  };

  // Pair Matching Logic
  const handlePairSelection = (tribal: string | null, translation: string | null) => {
    sound.playClick();
    const newTribal = tribal !== null ? tribal : selectedTribalPair;
    const newTranslation = translation !== null ? translation : selectedTranslationPair;

    setSelectedTribalPair(newTribal);
    setSelectedTranslationPair(newTranslation);

    if (newTribal && newTranslation) {
      // Check if this pair matches the exercise pairs
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

  const canCheck = () => {
    if (hasChecked) return false;
    if (exercise.type === 'learn_word') return true;
    if (exercise.type === 'match_pairs') return matchedPairs.length === (exercise.pairs?.length || 4);
    if (exercise.type === 'arrange_words') return arrangedWords.length > 0;
    return selectedAnswer !== null;
  };

  return (
    <div className="w-full flex flex-col justify-between min-h-[500px]">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        {/* Exercise Prompt Title */}
        <div className="mb-6 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold font-display text-teal-950">
            {exercise.prompt}
          </h3>
        </div>

        {/* 1. Learn a New Word */}
        {exercise.type === 'learn_word' && (
          <div className="bg-cream-100 border-3 border-sage-300 rounded-3xl p-6 sm:p-8 text-center shadow-earthy space-y-4">
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
                <p className="text-2xl font-extrabold text-forest-700 font-sans">
                  {exercise.nativeScript}
                </p>
              )}
              <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-teal-900 mt-1">
                {exercise.tribalWord}
              </h2>
              {exercise.transliteration && (
                <p className="text-sm text-teal-600 font-semibold tracking-wide mt-1">
                  /{exercise.transliteration}/
                </p>
              )}
            </div>
            <div className="pt-4 border-t border-sage-200">
              <p className="text-xl font-bold text-teal-900">{exercise.englishMeaning}</p>
              {exercise.hindiMeaning && (
                <p className="text-sm font-semibold text-forest-600 mt-0.5">
                  {exercise.hindiMeaning}
                </p>
              )}
            </div>
            {exercise.exampleSentence && (
              <div className="p-3 bg-cream-50 rounded-2xl border border-sage-200 text-left text-xs space-y-1">
                <span className="font-bold text-forest-700 block uppercase tracking-wider">Example:</span>
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
          <div className="space-y-6">
            {exercise.tribalWord && (
              <div className="p-5 bg-cream-100 border-2 border-sage-300 rounded-3xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <AudioPlayer
                    text={exercise.tribalWord}
                    languageId={languageId}
                    size="md"
                    variant="gold"
                  />
                  <div>
                    {exercise.nativeScript && (
                      <p className="text-sm font-bold text-forest-700">{exercise.nativeScript}</p>
                    )}
                    <h3 className="text-2xl font-extrabold text-teal-900 font-display">
                      {exercise.tribalWord}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-3.5">
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
                      w-full p-4 rounded-2xl font-bold text-base text-left transition-all duration-150 border-2 select-none
                      ${
                        isSelected
                          ? 'bg-gold-100 border-gold-500 text-teal-950 shadow-[0_4px_0_#CF841C]'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-400 hover:bg-cream-50 text-teal-900 shadow-[0_4px_0_#C7D5CB]'
                      }
                      active:translate-y-1 active:shadow-none
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-cream-200 border border-sage-300 flex items-center justify-center text-xs font-bold text-teal-700 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Match Pairs Exercise */}
        {exercise.type === 'match_pairs' && (
          <div className="space-y-6">
            <p className="text-sm text-teal-700 font-medium text-center">
              Tap a word on the left and match it with its meaning on the right!
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Tribal Words Column */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block text-center">
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
                        w-full p-3.5 rounded-2xl font-bold text-sm text-center border-2 transition-all
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
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block text-center">
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
                          w-full p-3.5 rounded-2xl font-bold text-sm text-center border-2 transition-all
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
          <div className="space-y-6">
            <div className="p-8 bg-cream-100 border-3 border-sage-300 rounded-3xl flex flex-col items-center justify-center text-center shadow-earthy">
              <AudioPlayer
                text={exercise.audioPronunciationText || exercise.tribalWord || ''}
                languageId={languageId}
                size="xl"
                variant="gold"
              />
              <p className="text-sm font-bold text-teal-700 mt-3 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-gold-600" />
                <span>Tap the speaker icon to listen to the word</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
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
                      w-full p-4 rounded-2xl font-bold text-base text-left transition-all border-2
                      ${
                        isSelected
                          ? 'bg-gold-100 border-gold-500 text-teal-950 shadow-[0_4px_0_#CF841C]'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-400 text-teal-900 shadow-[0_4px_0_#C7D5CB]'
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Arrange Words to Form a Sentence */}
        {exercise.type === 'arrange_words' && (
          <div className="space-y-6">
            {/* Target arrangement box */}
            <div className="min-h-[70px] p-4 bg-cream-50 border-2 border-dashed border-sage-400 rounded-2xl flex flex-wrap gap-2 items-center">
              {arrangedWords.length === 0 ? (
                <span className="text-sm text-teal-500 italic">
                  Tap words below to arrange the sentence in order...
                </span>
              ) : (
                arrangedWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !hasChecked && handleToggleWord(word)}
                    className="bg-gold-300 hover:bg-gold-400 text-teal-950 font-bold px-3.5 py-1.5 rounded-xl border-2 border-gold-500 shadow-sm transition-all"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Available Word Bank */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {exercise.options?.map((word, idx) => {
                const isUsed = arrangedWords.includes(word);
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isUsed || hasChecked}
                    onClick={() => handleToggleWord(word)}
                    className={`
                      px-5 py-2.5 rounded-2xl font-bold text-base border-2 transition-all
                      ${
                        isUsed
                          ? 'bg-cream-300 border-sage-300 text-teal-400 opacity-40 shadow-none'
                          : 'bg-cream-100 border-sage-300 hover:border-forest-500 text-teal-900 shadow-[0_4px_0_#C7D5CB] active:translate-y-1'
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
      <div className="mt-8 pt-4 border-t-2 border-sage-200">
        {!hasChecked ? (
          <div className="flex justify-end">
            <Button
              variant="gold"
              size="lg"
              disabled={!canCheck()}
              onClick={handleCheckAnswer}
              className="w-full sm:w-auto min-w-[200px]"
            >
              Check Answer
            </Button>
          </div>
        ) : (
          <div
            className={`
              p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300
              ${
                isCorrect
                  ? 'bg-forest-50 border-forest-400 text-forest-900'
                  : 'bg-terracotta-50 border-terracotta-400 text-terracotta-900'
              }
            `}
          >
            <div className="flex items-start gap-3 w-full sm:w-auto">
              {isCorrect ? (
                <div className="w-10 h-10 rounded-2xl bg-forest-600 text-cream-50 flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-terracotta-600 text-cream-50 flex items-center justify-center shrink-0 shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h4 className="font-extrabold font-display text-lg">
                  {isCorrect ? 'Nicely Done! 🌟' : 'Correct Answer:'}
                </h4>
                <p className="text-sm font-medium mt-0.5">
                  {isCorrect
                    ? exercise.explanation
                    : typeof exercise.correctAnswer === 'string'
                    ? exercise.correctAnswer
                    : Array.isArray(exercise.correctAnswer)
                    ? exercise.correctAnswer.join(' ')
                    : exercise.explanation}
                </p>
                {!isCorrect && exercise.explanation && (
                  <p className="text-xs text-terracotta-700 italic mt-1">
                    {exercise.explanation}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant={isCorrect ? 'primary' : 'danger'}
              size="lg"
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[180px] shrink-0"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
