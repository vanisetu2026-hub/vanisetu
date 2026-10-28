import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';
import { EXERCISES, LESSONS } from '../data/tribalData';
import { ExerciseRenderer } from '../components/lesson/ExerciseRenderer';
import { ProgressBar } from '../components/common/ProgressBar';
import { ArrowLeft, Sparkles, X } from 'lucide-react';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { selectedLanguage, completeLesson } = useLearning();

  const lesson = LESSONS.find((l) => l.lessonId === lessonId) || LESSONS[0];
  const exercises = EXERCISES[lesson.lessonId] || EXERCISES['mun_l1'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState<number>(Date.now());

  const currentExercise = exercises[currentIndex];

  const handleNext = (isCorrect: boolean) => {
    const updatedCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      setCorrectCount(updatedCorrect);
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed the lesson!
      const totalTimeSec = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((updatedCorrect / exercises.length) * 100);
      const xpEarned = lesson.xpReward + (accuracy >= 80 ? 10 : 0);

      completeLesson(lesson.lessonId, updatedCorrect, accuracy, xpEarned);

      // Navigate to Lesson Completion celebration page
      navigate('/lesson-completed', {
        state: {
          lessonId: lesson.lessonId,
          lessonTitle: lesson.title,
          languageName: selectedLanguage.name,
          xpEarned,
          correctCount: updatedCorrect,
          totalExercises: exercises.length,
          accuracy,
          timeSeconds: totalTimeSec,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-cream-200 flex flex-col justify-between py-6 px-4 sm:px-8 max-w-4xl mx-auto w-full">
      {/* Top Bar: Exit button, Lesson title, Progress bar */}
      <div className="w-full space-y-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/learn')}
            className="p-2 rounded-2xl bg-cream-100 hover:bg-cream-300 border border-sage-300 text-teal-800 transition-colors"
            title="Exit lesson"
            aria-label="Exit lesson"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-lg">
            <ProgressBar
              current={currentIndex + 1}
              total={exercises.length}
              color="gold"
              height="md"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-gold-600 bg-gold-100 border border-gold-300 px-3 py-1 rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>

        {/* Lesson Subtitle / Counter */}
        <div className="flex items-center justify-between text-xs font-bold text-teal-700 px-2">
          <span>{lesson.title}</span>
          <span>
            Question {currentIndex + 1} of {exercises.length}
          </span>
        </div>
      </div>

      {/* Main Exercise View */}
      <div className="flex-1 flex flex-col justify-center my-4">
        {currentExercise && (
          <ExerciseRenderer
            key={currentExercise.exerciseId}
            exercise={currentExercise}
            languageId={selectedLanguage.languageId}
            onNext={handleNext}
          />
        )}
      </div>

      {/* Footer Cultural Insight Note */}
      {lesson.culturalInsight && (
        <div className="mt-6 text-center text-xs text-forest-700 italic">
          &ldquo;{lesson.culturalInsight}&rdquo;
        </div>
      )}
    </div>
  );
};
