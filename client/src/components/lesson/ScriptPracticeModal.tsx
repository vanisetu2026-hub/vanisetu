import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AudioPlayer } from '../common/AudioPlayer';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/sound';

interface ScriptPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptChar?: string;
  languageName: string;
  languageId: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export const ScriptPracticeModal: React.FC<ScriptPracticeModalProps> = ({
  isOpen,
  onClose,
  scriptChar = 'ᱚ',
  languageName,
  languageId,
  isCompleted,
  onComplete,
}) => {
  const [hasPracticed, setHasPracticed] = useState(false);

  const handlePractice = () => {
    sound.playCorrect();
    setHasPracticed(true);
    onComplete();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Native Script Practice: ${languageName}`} maxWidth="md">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 border border-forest-300 px-3 py-0.5 rounded-full">
          Script Character Mastery
        </span>

        {/* Large Glyph Tile */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-cream-100 border-3 border-sage-300 flex items-center justify-center text-5xl sm:text-6xl font-black font-sans text-forest-800 shadow-earthy select-none">
          {scriptChar}
        </div>

        {/* Pronunciation Audio */}
        <div className="flex items-center gap-3">
          <AudioPlayer text={scriptChar} languageId={languageId} size="md" variant="gold" />
          <span className="text-xs font-bold text-teal-800">Tap to listen to the authentic sound</span>
        </div>

        <p className="text-xs sm:text-sm text-teal-800 leading-relaxed max-w-sm">
          Listen to the ancestral vocalization of <strong>"{scriptChar}"</strong>. Repeat aloud to internalize its phonetic cadence.
        </p>

        {/* Reward Button */}
        <div className="w-full pt-2">
          {!isCompleted && !hasPracticed ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handlePractice}
              icon={<Sparkles className="w-5 h-5 text-gold-300 fill-current" />}
              className="w-full text-base font-extrabold shadow-[0_4px_0_#1A3C28]"
            >
              Master Character (+15 XP)
            </Button>
          ) : (
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-100 border border-forest-300 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                Character Mastered ⭐
              </span>
              <Button variant="outline" size="md" onClick={onClose} className="w-full">
                Continue Learning
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
