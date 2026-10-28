import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
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
  Globe2,
  CheckCircle2,
  Layers,
  Users2,
  Calendar,
  Compass,
  ArrowUpRight,
  Heart,
  Volume2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedLanguage,
    allLanguages,
    setSelectedLanguageId,
    lessons,
    dictionary,
    communityContributions,
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
  const currentStreak = user?.currentStreak || 0;
  const totalXP = user?.totalXP || 0;
  const dailyProgressXP = Math.min(dailyGoalXP, totalXP ? totalXP % (dailyGoalXP || 50) : 0);

  // Dynamic 7-day activity tracking
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  const daysOfWeek = dayLabels.map((day, idx) => {
    const isToday = idx === todayDayIndex;
    const isActive = isToday ? totalXP > 0 : idx < todayDayIndex && idx >= todayDayIndex - Math.max(0, currentStreak - 1);
    const xp = isToday ? Math.min(totalXP, dailyGoalXP) : (isActive ? dailyGoalXP : 0);
    return {
      day,
      xp,
      active: isActive && xp > 0,
      isToday,
    };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* 1. Welcome Hero & Quick Resume Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-900 to-teal-950 border-3 border-forest-700/60 text-cream-50 p-6 sm:p-8 shadow-earthy-lg">
        {/* Subtle decorative tribal ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-gold-400/20 text-gold-300 border border-gold-400/30 px-3 py-1 rounded-full">
                {selectedLanguage.sampleGreeting} • Tribal Heritage Hub
              </span>
              {user?.isGuest && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-gold-300 text-teal-950 px-2.5 py-0.5 rounded-full">
                  Guest Mode
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight text-cream-50">
              Johar, {user?.name || 'Learner'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-cream-200/90 font-medium leading-relaxed">
              Welcome to your VANISETU overview. You are currently mastering{' '}
              <strong className="text-gold-300">{selectedLanguage.name}</strong> ({selectedLanguage.nativeName}) with{' '}
              {completedCount} of {lessons.length} lessons mastered.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="gold"
                size="md"
                onClick={() => navigate('/learn')}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="shadow-[0_3px_0_#CF841C]"
              >
                {completedCount === 0 ? 'Start Interactive Road' : `Resume: ${nextLesson?.title.split('(')[0] || 'Learning Road'}`}
              </Button>

              <button
                type="button"
                onClick={() => navigate('/vocabulary')}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm px-5 py-2.5 rounded-2xl border-2 border-white/50 shadow-[0_3px_0_rgba(0,0,0,0.2)] active:translate-y-1 transition-all"
              >
                <Layers className="w-4 h-4 text-white" />
                <span>Practice Flashcards</span>
              </button>
            </div>
          </div>

          {/* Quick Active Language Card Widget */}
          <div className="lg:w-72 bg-forest-950/70 border-2 border-forest-600/60 rounded-3xl p-5 shadow-inner space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-forest-300 uppercase tracking-wider text-[10px]">
                Active Focus
              </span>
              <span className="font-extrabold text-gold-400 font-display">
                {progressPercent}% Complete
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-700 border-2 border-forest-500 flex items-center justify-center font-display font-black text-xl text-cream-100 shrink-0">
                {selectedLanguage.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base text-cream-50 truncate font-display">
                  {selectedLanguage.name}
                </p>
                <p className="text-xs text-gold-300/90 font-mono truncate">
                  {selectedLanguage.nativeName}
                </p>
              </div>
            </div>

            <ProgressBar current={completedCount} total={lessons.length} color="gold" height="xs" />

            <div className="pt-1 flex items-center justify-between text-[11px] text-cream-300 font-medium">
              <span>{completedCount} / {lessons.length} Lessons</span>
              <button
                onClick={() => navigate('/languages')}
                className="text-gold-300 hover:underline font-bold"
              >
                Switch Language →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total XP */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-earthy transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950 block">
            {totalXP}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Total XP Earned
          </span>
        </div>

        {/* Current Streak */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-earthy transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mb-3">
            <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'fill-current animate-bounce' : ''}`} />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950 block">
            {currentStreak}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Day Streak
          </span>
        </div>

        {/* Lessons Completed */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-earthy transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950 block">
            {user?.completedLessons.length || 0}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Lessons Mastered
          </span>
        </div>

        {/* Words Explored */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-earthy transition-transform hover:-translate-y-0.5">
          <div className="w-10 h-10 rounded-2xl bg-tribalpurple-100 text-tribalpurple-700 flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950 block">
            {dictionary.length}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Words in Lexicon
          </span>
        </div>
      </div>

      {/* 3. Tribal Language Exploration & Quick Switch Hub */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-8 shadow-earthy space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-sage-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-forest-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-teal-950">
                Tribal Languages Catalog
              </h2>
            </div>
            <p className="text-xs text-teal-600 font-medium mt-0.5">
              Switch languages freely. Your streaks and XP stay preserved across all courses.
            </p>
          </div>

          <Link
            to="/languages"
            className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Detailed Profiles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Language Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allLanguages.map((lang) => {
            const isCurrent = lang.languageId === selectedLanguage.languageId;
            return (
              <div
                key={lang.languageId}
                className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-br from-forest-50 to-sage-100/90 border-forest-600 shadow-md ring-2 ring-forest-600/30'
                    : 'bg-cream-50 hover:bg-cream-200/50 border-sage-200 hover:border-forest-400 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-forest-600 text-cream-50 font-display font-extrabold flex items-center justify-center text-sm shadow-sm">
                      {lang.name.charAt(0)}
                    </div>
                    {isCurrent ? (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-forest-600 text-cream-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-teal-600 bg-cream-200 px-2 py-0.5 rounded-full">
                        {lang.speakersCount.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold font-display text-base text-teal-950">
                      {lang.name}
                    </h3>
                    <p className="text-xs font-mono font-bold text-forest-700">
                      {lang.nativeName}
                    </p>
                    <p className="text-[11px] text-teal-600 mt-1 line-clamp-2">
                      {lang.description}
                    </p>
                  </div>

                  <div className="pt-1 text-[11px] text-teal-700 space-y-0.5 border-t border-sage-200/60">
                    <p><strong className="text-teal-900">Script:</strong> {lang.scriptName.split('/')[0]}</p>
                    <p><strong className="text-teal-900">Region:</strong> {lang.region.split(',')[0]}</p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-sage-200">
                  {isCurrent ? (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth={true}
                      onClick={() => navigate('/learn')}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                      className="text-xs py-1.5"
                    >
                      Continue Path
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth={true}
                      onClick={() => setSelectedLanguageId(lang.languageId)}
                      className="text-xs py-1.5 hover:bg-forest-50"
                    >
                      Switch to {lang.name}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Layout: Learning Momentum & Quick Practice Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Weekly Momentum & Activity Bar */}
        <div className="lg:col-span-7 bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-7 shadow-earthy space-y-5">
          <div className="flex items-center justify-between border-b-2 border-sage-200 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest-600" />
              <h3 className="font-display font-extrabold text-lg text-teal-950">
                Weekly Learning Momentum
              </h3>
            </div>
            <span className="text-xs font-bold text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Goal: {dailyGoalXP} XP / Day
            </span>
          </div>

          {/* Bar chart */}
          <div className="pt-4 flex items-end justify-between gap-3 h-44 border-b border-sage-300 pb-2">
            {daysOfWeek.map((item, idx) => {
              const barHeight = item.xp > 0 ? Math.min(100, Math.max(12, (item.xp / dailyGoalXP) * 100)) : 6;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 relative group ${
                      item.active
                        ? 'bg-gradient-to-t from-forest-600 to-forest-500 shadow-sm'
                        : 'bg-cream-300'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-teal-950 text-cream-50 text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap">
                      {item.xp} XP
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${item.isToday ? 'text-forest-700 underline font-extrabold' : 'text-teal-700'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Today's Goal Tracker Card */}
          <div className="p-4 rounded-2xl bg-cream-50 border-2 border-sage-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                <Target className="w-4 h-4 text-gold-600" />
                <span>Today’s Target: {dailyProgressXP} / {dailyGoalXP} XP</span>
              </div>
              <p className="text-[11px] text-teal-600 font-medium">
                {dailyProgressXP >= dailyGoalXP
                  ? 'Target completed! Superb dedication to tribal learning.'
                  : `Complete 1 lesson today to earn +${Math.max(10, dailyGoalXP - dailyProgressXP)} XP.`}
              </p>
            </div>
            <div className="w-full sm:w-44">
              <ProgressBar current={dailyProgressXP} total={dailyGoalXP} color="gold" height="sm" />
            </div>
          </div>
        </div>

        {/* Right Column: Quick Immersion Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Flashcard Drill Shortcut Card */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 sm:p-6 shadow-earthy space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Active Vocabulary</span>
              </span>
              <span className="text-xs font-extrabold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
                Interactive
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-teal-950">
              Vocabulary Flashcards
            </h3>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              Review native script vocabulary, listen to authentic pronunciations, and test your recall with flipping cards.
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth={true}
              onClick={() => navigate('/vocabulary')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              className="text-xs py-2"
            >
              Start Flashcards Practice
            </Button>
          </div>

          {/* Community Folklore Shortcut */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 sm:p-6 shadow-earthy space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider flex items-center gap-1">
                <Users2 className="w-3.5 h-3.5" />
                <span>Oral Traditions</span>
              </span>
              <span className="text-xs font-bold text-terracotta-700 bg-terracotta-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Heart className="w-3 h-3 fill-current" />
                <span>{communityContributions.length} Stories</span>
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base text-teal-950">
              Community Oral Heritage
            </h3>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              Explore authentic folklore, creation legends, and harvest songs contributed by tribal elders and custodians.
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth={true}
              onClick={() => navigate('/community')}
              icon={<Compass className="w-3.5 h-3.5 text-forest-600" />}
              className="text-xs py-2"
            >
              Read Tribal Stories
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Achievements Showcase */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-8 shadow-earthy space-y-5">
        <div className="flex items-center justify-between border-b-2 border-sage-200 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-600" />
            <h3 className="font-display font-extrabold text-lg text-teal-950">
              Cultural Milestones & Badges
            </h3>
          </div>
          <Link to="/progress" className="text-xs font-bold text-forest-700 hover:underline">
            View All Badges ({ACHIEVEMENTS.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = user?.unlockedAchievements.includes(ach.achievementId);
            return (
              <div
                key={ach.achievementId}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                  isUnlocked
                    ? 'bg-gold-50 border-gold-300 shadow-sm'
                    : 'bg-cream-200/50 border-sage-200 opacity-60'
                }`}
                title={ach.description}
              >
                <span className="text-3xl mb-1.5">{ach.icon}</span>
                <span className="text-xs font-bold text-teal-950 truncate w-full">
                  {ach.title}
                </span>
                <span className="text-[10px] text-teal-600 font-semibold mt-0.5">
                  {isUnlocked ? 'Unlocked ✨' : `+${ach.xpReward} XP`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
