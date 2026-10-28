import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Gift, Sparkles, Trophy, Quote } from 'lucide-react';
import { sound } from '../../utils/sound';

interface ChestRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: {
    xp: number;
    title: string;
    proverb: string;
    culturalContext: string;
  };
  isClaimed: boolean;
  onClaim: () => void;
}

export const ChestRewardModal: React.FC<ChestRewardModalProps> = ({
  isOpen,
  onClose,
  reward,
  isClaimed,
  onClaim,
}) => {
  if (!reward) return null;

  const handleClaim = () => {
    sound.playCorrect();
    onClaim();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={reward.title} maxWidth="md">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        {/* Animated Chest Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 flex items-center justify-center text-teal-950 shadow-earthy-lg animate-bounce">
          <Gift className="w-12 h-12 sm:w-14 sm:h-14 fill-amber-100 text-teal-950" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 fill-current text-amber-600" />
            Milestone Reward Unlocked!
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-display text-teal-950 mt-1">
            +{reward.xp} Bonus XP
          </h3>
          <p className="text-xs sm:text-sm text-teal-700 font-medium max-w-sm mt-0.5">
            You completed the journey checkpoint. Here is ancestral wisdom for your path:
          </p>
        </div>

        {/* Proverb Card */}
        <div className="w-full bg-cream-100 border-2 border-sage-300 rounded-2xl p-4 text-left space-y-2 relative shadow-xs">
          <Quote className="w-6 h-6 text-gold-500/40 absolute top-2 right-2" />
          <span className="text-[10px] font-black uppercase tracking-wider text-forest-700">
            Ancestral Tribal Proverb
          </span>
          <p className="text-base sm:text-lg font-bold font-display text-teal-950 italic">
            "{reward.proverb}"
          </p>
          <p className="text-xs text-teal-800 leading-relaxed font-medium pt-1 border-t border-sage-200">
            <strong>Meaning:</strong> {reward.culturalContext}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full pt-2">
          {!isClaimed ? (
            <Button
              variant="gold"
              size="lg"
              onClick={handleClaim}
              icon={<Sparkles className="w-5 h-5" />}
              className="w-full text-base font-extrabold shadow-[0_4px_0_#CF841C]"
            >
              Claim +{reward.xp} XP & Wisdom
            </Button>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-bold text-forest-700 bg-forest-100 border border-forest-300 px-3 py-1 rounded-full inline-block">
                ✓ Reward Already Claimed
              </span>
              <Button variant="outline" size="md" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
