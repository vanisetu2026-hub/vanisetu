import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';
import { DICTIONARY_ITEMS } from '../data/tribalData';
import { AudioPlayer } from '../components/common/AudioPlayer';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { ArrowLeft, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

export const TranslationPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLanguage } = useLearning();

  const words = DICTIONARY_ITEMS.filter((i) => i.languageId === selectedLanguage.languageId);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = words[index] || words[0];

  const handleNext = () => {
    sound.playClick();
    setRevealed(false);
    if (index < words.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b-2 border-sage-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-2xl bg-cream-100 hover:bg-cream-300 border border-sage-300 text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display text-teal-950">
              Interactive Translation & Meaning
            </h1>
            <p className="text-xs text-teal-600 font-medium">
              Explore phrasing in {selectedLanguage.name} ({selectedLanguage.nativeName})
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-700 bg-cream-100 px-3 py-1 rounded-full border border-sage-300">
          {index + 1} / {words.length}
        </span>
      </div>

      <ProgressBar current={index + 1} total={words.length} color="gold" height="sm" />

      {/* Main Translation Card */}
      {current && (
        <div className="bg-cream-100 border-3 border-sage-300 rounded-3xl p-6 sm:p-10 shadow-earthy-lg flex flex-col items-center justify-between min-h-[380px] space-y-6 text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-xl">
              Tribal Language Expression
            </span>
            <AudioPlayer
              text={current.word}
              languageId={selectedLanguage.languageId}
              size="md"
              variant="gold"
            />
          </div>

          <div>
            {current.nativeScript && current.nativeScript !== current.word && (
              <p className="text-2xl font-extrabold text-forest-700 font-sans mb-1">
                {current.nativeScript}
              </p>
            )}
            <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-teal-950">
              {current.word}
            </h2>
            <p className="text-sm font-semibold text-teal-600 mt-2">
              /{current.transliteration}/
            </p>
          </div>

          {/* Reveal button or translation block */}
          <div className="w-full">
            {revealed ? (
              <div className="p-5 bg-cream-50 border-2 border-gold-400 rounded-2xl animate-in fade-in zoom-in-95 duration-200 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block">
                    English Meaning:
                  </span>
                  <p className="text-xl font-bold font-display text-teal-900 mt-0.5">
                    {current.englishMeaning}
                  </p>
                </div>

                {current.hindiMeaning && (
                  <div>
                    <span className="text-[10px] font-bold text-forest-600 uppercase tracking-widest block">
                      Hindi Meaning:
                    </span>
                    <p className="text-base font-semibold text-forest-800">
                      {current.hindiMeaning}
                    </p>
                  </div>
                )}

                {current.exampleSentence && (
                  <div className="pt-3 border-t border-gold-200 text-left text-xs space-y-1">
                    <span className="font-bold text-forest-700 block uppercase tracking-wider">
                      Example:
                    </span>
                    <p className="font-bold text-teal-900">{current.exampleSentence.tribal}</p>
                    <p className="text-teal-700 italic">
                      &ldquo;{current.exampleSentence.translation}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="md"
                fullWidth={true}
                onClick={() => {
                  sound.playClick();
                  setRevealed(true);
                }}
                icon={<Eye className="w-4 h-4 text-forest-600" />}
              >
                Reveal Translation & Example
              </Button>
            )}
          </div>

          <div className="w-full pt-4 border-t border-sage-200 flex justify-end">
            <Button
              variant="gold"
              size="lg"
              onClick={handleNext}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              Next Expression
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
