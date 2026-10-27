import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '../components/common/Button';
import { sound } from '../utils/sound';
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
  Home,
} from 'lucide-react';

interface CompletionState {
  lessonId: string;
  lessonTitle: string;
  languageName: string;
  xpEarned: number;
  correctCount: number;
  totalExercises: number;
  accuracy: number;
  timeSeconds: number;
}

export const LessonCompletedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CompletionState | undefined;

  // Defaults if navigated directly
  const xpEarned = state?.xpEarned || 25;
  const correctCount = state?.correctCount || 5;
  const totalExercises = state?.totalExercises || 5;
  const accuracy = state?.accuracy || 100;
  const timeSeconds = state?.timeSeconds || 65;
  const lessonTitle = state?.lessonTitle || 'Simple Greetings';
  const languageName = state?.languageName || 'Mundari';

  useEffect(() => {
    // Play celebratory chime & launch confetti
    sound.playCelebration();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#214B32', '#E9A23B', '#D97860', '#F7F5EB'],
      });
    } catch {
      // Ignore
    }
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return mins > 0 ? `${mins}m ${s}s` : `${s}s`;
  };

  return (
    <div className="min-h-screen bg-cream-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-cream-100 border-3 border-sage-300 rounded-3xl p-6 sm:p-10 shadow-earthy-lg text-center space-y-6">
        {/* Celebration Mascot Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gold-400 border-4 border-gold-500 flex items-center justify-center text-teal-900 mx-auto shadow-button-gold animate-bounce">
            <Trophy className="w-12 h-12 fill-current" />
          </div>
          <div className="absolute -top-2 -right-2 bg-forest-600 text-cream-100 p-2 rounded-full shadow-md">
            <Sparkles className="w-5 h-5 text-gold-400 fill-gold-400" />
          </div>
        </div>

        {/* Title & Language */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            {languageName} Course
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-teal-950 mt-2">
            Lesson Completed!
          </h1>
          <p className="text-sm font-semibold text-teal-700 mt-1">
            You successfully finished &ldquo;{lessonTitle}&rdquo;
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* XP Earned */}
          <div className="p-4 bg-cream-50 border-2 border-gold-300 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-gold-600 mb-1">
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-wider">XP Earned</span>
            </div>
            <span className="text-2xl font-black font-display text-teal-950">
              +{xpEarned}
            </span>
          </div>

          {/* Accuracy */}
          <div className="p-4 bg-cream-50 border-2 border-forest-300 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-forest-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Accuracy</span>
            </div>
            <span className="text-2xl font-black font-display text-teal-950">
              {accuracy}%
            </span>
          </div>

          {/* Time Taken */}
          <div className="p-4 bg-cream-50 border-2 border-mutedblue-300 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1 text-mutedblue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Speed</span>
            </div>
            <span className="text-2xl font-black font-display text-teal-950">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Progress note */}
        <div className="p-3.5 bg-forest-50 border border-forest-200 rounded-2xl text-xs font-semibold text-forest-800 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
          <span>Progress saved to your cultural learning journey.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            variant="gold"
            size="lg"
            fullWidth={true}
            onClick={() => navigate('/dashboard')}
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Continue Learning
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => state?.lessonId ? navigate(`/lesson/${state.lessonId}`) : navigate('/learn')}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Review Lesson
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/dashboard')}
              icon={<Home className="w-4 h-4" />}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
