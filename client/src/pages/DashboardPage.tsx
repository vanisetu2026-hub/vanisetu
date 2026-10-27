import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { LessonCard } from '../components/cards/LessonCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { ACHIEVEMENTS } from '../data/tribalData';
import {
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Trophy,
  Target,
  Compass,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedLanguage,
    lessons,
    isLessonCompleted,
    isLessonUnlocked,
  } = useLearning();
  const navigate = useNavigate();

  // Find next in-progress or first unlocked uncompleted lesson
  const nextLesson =
    lessons.find((l) => isLessonUnlocked(l) && !isLessonCompleted(l.lessonId)) ||
    lessons[0];

  const completedCount = lessons.filter((l) => isLessonCompleted(l.lessonId)).length;
  const progressPercent = Math.round((completedCount / (lessons.length || 1)) * 100);

  const dailyGoalXP = user?.dailyGoal || 50;
  const dailyProgressXP = Math.min(dailyGoalXP, user?.totalXP ? user.totalXP % 100 : 20);

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Continue Learning Banner */}
      <div className="bg-gradient-to-r from-forest-600 via-forest-700 to-forest-800 text-cream-50 rounded-3xl p-6 sm:p-8 shadow-earthy-lg relative overflow-hidden">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-forest-800/80 border border-forest-500/50 px-3 py-1 rounded-full text-xs font-bold text-gold-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Active Course: {selectedLanguage.name} ({selectedLanguage.nativeName})</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Johar, {user?.name || 'Learner'}! 👋
            </h1>

            <p className="text-sm sm:text-base text-cream-200 font-medium leading-relaxed">
              Continue mastering {selectedLanguage.name}. You have completed {completedCount} of{' '}
              {lessons.length} core lessons in this module.
            </p>
          </div>

          {nextLesson && (
            <div className="w-full md:w-auto shrink-0">
              <Button
                variant="gold"
                size="lg"
                fullWidth={true}
                onClick={() => navigate(`/lesson/${nextLesson.lessonId}`)}
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
              >
                Continue: {nextLesson.title.split('(')[0]}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Stats Grid: Daily Goal, Streak, and Vocabulary Practice */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Daily Goal */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Daily Goal
            </span>
            <Target className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-2xl font-extrabold font-display text-teal-900">
            {dailyProgressXP} / {dailyGoalXP} <span className="text-xs font-bold text-gold-600">XP</span>
          </p>
          <div className="mt-3">
            <ProgressBar current={dailyProgressXP} total={dailyGoalXP} color="gold" height="sm" />
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Active Streak
            </span>
            <Flame className="w-4 h-4 text-terracotta-500 fill-current animate-bounce" />
          </div>
          <p className="text-2xl font-extrabold font-display text-teal-900">
            {user?.currentStreak || 1} <span className="text-xs font-bold text-terracotta-600">Days</span>
          </p>
          <p className="text-xs text-teal-600 font-medium mt-1">
            Complete a lesson today to maintain your fire! 🔥
          </p>
        </div>

        {/* Vocabulary Flashcards Quick Link */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Flashcards
            </span>
            <BookOpen className="w-4 h-4 text-forest-600" />
          </div>
          <p className="text-2xl font-extrabold font-display text-teal-900">
            Learn Words
          </p>
          <Link
            to="/vocabulary"
            className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1 mt-2"
          >
            Practice Flashcards →
          </Link>
        </div>
      </div>

      {/* 3. Main Learning Path (Duolingo Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Winding Learning Path Nodes */}
        <div className="lg:col-span-8 bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-10 shadow-earthy">
          <div className="flex items-center justify-between border-b-2 border-sage-200 pb-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-600">
                Course Module 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
                {selectedLanguage.name} for Beginners
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-teal-600">Module Progress</span>
              <p className="font-extrabold font-display text-forest-700 text-lg">
                {progressPercent}%
              </p>
            </div>
          </div>

          {/* Interactive Lesson Road / Nodes */}
          <div className="py-4 flex flex-col items-center">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.lessonId}
                lesson={lesson}
                isCompleted={isLessonCompleted(lesson.lessonId)}
                isUnlocked={isLessonUnlocked(lesson)}
                onSelect={(id) => navigate(`/lesson/${id}`)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Daily Challenge & Achievements Showcase */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Challenge Card */}
          <div className="bg-gradient-to-br from-gold-100 to-cream-100 border-2 border-gold-300 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gold-700 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-gold-600" />
              <span>Daily Challenge</span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-teal-950">
              Complete 2 Lessons Today
            </h3>
            <p className="text-xs text-teal-700 font-medium leading-relaxed">
              Earn an extra +50 XP bonus and unlock the next cultural milestone in {selectedLanguage.name}.
            </p>
            <div className="pt-2">
              <ProgressBar current={completedCount} total={2} color="gold" height="sm" showPercentage={true} />
            </div>
          </div>

          {/* Cultural Heritage Highlight */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-forest-600" />
              <span>Cultural Heritage</span>
            </div>
            <h4 className="font-display font-bold text-lg text-teal-900">
              The Sacred Grove (Sarna)
            </h4>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              In tribal cosmology, nature is not a resource to exploit, but an elder kin to cherish.
              Every village preserves a virgin forest patch called Sarna where the Sal trees bloom unpruned.
            </p>
            <Link
              to="/community"
              className="text-xs font-bold text-forest-700 hover:underline inline-block pt-1"
            >
              Explore Tribal Stories & Folktales →
            </Link>
          </div>

          {/* Achievements Preview */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-teal-900">
                Badges & Milestones
              </h4>
              <Link to="/progress" className="text-xs font-bold text-forest-700 hover:underline">
                View all ({ACHIEVEMENTS.length})
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ACHIEVEMENTS.slice(0, 3).map((ach) => {
                const isUnlocked = user?.unlockedAchievements.includes(ach.achievementId);
                return (
                  <div
                    key={ach.achievementId}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-gold-50 border-gold-300'
                        : 'bg-cream-200/50 border-sage-200 opacity-50'
                    }`}
                    title={ach.title}
                  >
                    <span className="text-2xl mb-1">{ach.icon}</span>
                    <span className="text-[10px] font-bold text-teal-900 truncate w-full">
                      {ach.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
