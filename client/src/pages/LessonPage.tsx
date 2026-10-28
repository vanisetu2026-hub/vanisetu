import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../contexts/LearningContext';
import { EXERCISES, LESSONS, LESSON_INTRODUCED_VOCABULARY } from '../data/tribalData';
import { getTopicExercisesForLesson } from '../data/curriculumData';
import { ExerciseRenderer } from '../components/lesson/ExerciseRenderer';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Sparkles, X, BookOpen, ShieldCheck } from 'lucide-react';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { selectedLanguage, completeLesson } = useLearning();

  const fallbackKey = `${selectedLanguage.languageId}_l1`;
  const unitExercisesData = getTopicExercisesForLesson(selectedLanguage.languageId, lessonId || fallbackKey);

  const lesson = LESSONS.find((l) => l.lessonId === lessonId) || {
    lessonId: lessonId || fallbackKey,
    courseId: `course_${selectedLanguage.languageId}_101`,
    languageId: selectedLanguage.languageId,
    title: unitExercisesData.lessonTitle,
    description: `Master authentic vocabulary for ${unitExercisesData.lessonTitle}.`,
    order: 1,
    xpReward: 25,
    isPublished: true,
  };

  const exercises = EXERCISES[lesson.lessonId] || unitExercisesData.exercises;
  const introducedWords = LESSON_INTRODUCED_VOCABULARY[lesson.lessonId] || unitExercisesData.introducedWords;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);

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

        {/* Lesson Subtitle / Counter / Target Words */}
        <div className="flex items-center justify-between text-xs font-bold text-teal-700 px-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>{lesson.title}</span>
            {introducedWords.length > 0 && (
              <button
                type="button"
                onClick={() => setIsVocabModalOpen(true)}
                className="inline-flex items-center gap-1 bg-cream-100 hover:bg-cream-50 border border-sage-300 text-forest-700 px-2.5 py-0.5 rounded-xl text-[11px] font-bold shadow-sm transition-colors"
                title="View vocabulary taught in this lesson"
              >
                <BookOpen className="w-3.5 h-3.5 text-gold-600" />
                <span>Target Words ({introducedWords.length})</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-forest-700 bg-forest-50 border border-forest-200 px-2 py-0.5 rounded-full font-extrabold hidden sm:inline">
              ✓ Prerequisite Scaffolded
            </span>
            <span>
              Step {currentIndex + 1} of {exercises.length}
            </span>
          </div>
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

      {/* Target Vocabulary Modal */}
      <Modal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
        title={`Lesson Vocabulary: ${lesson.title}`}
        maxWidth="md"
      >
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-forest-50 border border-forest-200 text-xs text-forest-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold mb-0.5">Strict Prerequisite Scaffolding Active</p>
              <p className="text-[11px] text-forest-700">
                All questions, translations, and answer choices in this lesson only test words you have explicitly learned.
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {introducedWords.map((item, idx) => (
              <div key={idx} className="p-3 bg-cream-50 rounded-2xl border border-sage-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base text-forest-900 font-display">{item.word}</span>
                    {item.nativeScript && item.nativeScript !== item.word && (
                      <span className="text-xs font-bold text-forest-700 font-mono">({item.nativeScript})</span>
                    )}
                  </div>
                  {item.transliteration && item.transliteration !== item.word && (
                    <p className="text-[11px] text-teal-600 font-mono">/{item.transliteration}/</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-teal-900">{item.englishMeaning}</p>
                  <p className="text-[10px] text-teal-600 font-semibold">{item.hindiMeaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Footer Cultural Insight Note */}
      {lesson.culturalInsight && (
        <div className="mt-6 text-center text-xs text-forest-700 italic">
          &ldquo;{lesson.culturalInsight}&rdquo;
        </div>
      )}
    </div>
  );
};
