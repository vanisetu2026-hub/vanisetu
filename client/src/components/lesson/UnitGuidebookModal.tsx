import React from 'react';
import { Modal } from '../common/Modal';
import { Unit } from '../../types';
import { AudioPlayer } from '../common/AudioPlayer';
import { BookOpen, Sparkles, Volume2 } from 'lucide-react';

interface UnitGuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  languageId: string;
}

export const UnitGuidebookModal: React.FC<UnitGuidebookModalProps> = ({
  isOpen,
  onClose,
  unit,
  languageId,
}) => {
  if (!unit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Guidebook: Unit ${unit.unitNumber}`}
      maxWidth="lg"
    >
      <div className="space-y-4 py-1">
        {/* Unit Info Header */}
        <div className="bg-cream-100 border border-sage-300 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-forest-700 bg-forest-100 border border-forest-300 px-2 py-0.5 rounded-full inline-block">
            {unit.subtitle}
          </span>
          <h3 className="text-lg sm:text-xl font-black font-display text-teal-950">
            {unit.title}
          </h3>
          <p className="text-xs sm:text-sm text-teal-700 leading-relaxed font-medium">
            {unit.description}
          </p>
        </div>

        {/* Key Vocabulary & Phrases */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-forest-800">
            <BookOpen className="w-4 h-4 text-forest-600" />
            <span>Essential Unit Vocabulary & Phrases</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {unit.guidebookPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-sage-200 hover:border-forest-400 rounded-2xl p-3.5 space-y-1.5 shadow-2xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base sm:text-lg font-black text-forest-800 font-sans leading-tight">
                      {phrase.native}
                    </p>
                    <p className="text-xs font-bold text-teal-600 font-mono">
                      {phrase.roman}
                    </p>
                  </div>
                  <AudioPlayer
                    text={phrase.native}
                    languageId={languageId}
                    size="sm"
                    variant="gold"
                  />
                </div>
                <p className="text-xs text-teal-900 font-medium border-t border-sage-100 pt-1 leading-snug">
                  {phrase.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot Advice */}
        {unit.mascot && (
          <div className="flex items-center gap-3 bg-forest-50 border border-forest-200 rounded-2xl p-3 text-xs text-forest-900">
            <span className="text-2xl">{unit.mascot.avatar}</span>
            <div>
              <strong className="block font-bold">{unit.mascot.name}'s Cultural Tip:</strong>
              <p className="text-forest-700 font-medium">{unit.mascot.quote}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
