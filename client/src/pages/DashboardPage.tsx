import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { LessonCard } from '../components/cards/LessonCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ACHIEVEMENTS } from '../data/tribalData';
import {
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Trophy,
  Target,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
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

  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);

  // Find next in-progress or first unlocked uncompleted lesson
  const nextLesson =
    lessons.find((l) => isLessonUnlocked(l) && !isLessonCompleted(l.lessonId)) ||
    lessons[0];

  const completedCount = lessons.filter((l) => isLessonCompleted(l.lessonId)).length;
  const progressPercent = Math.round((completedCount / (lessons.length || 1)) * 100);

  const dailyGoalXP = user?.dailyGoal || 50;
  const dailyProgressXP = Math.min(dailyGoalXP, user?.totalXP ? user.totalXP % (dailyGoalXP || 50) : 0);

  // Unit 1 Guidebook phrases tailored to selected language
  const getGuidebookPhrases = () => {
    switch (selectedLanguage.languageId) {
      case 'santali':
        return [
          { native: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', meaning: 'Hello / Traditional Respectful Greeting' },
          { native: 'ᱟᱹᱰᱤ ᱡᱚᱦᱟᱨ', roman: 'Adi Johar', meaning: 'Warm / Heartfelt Greetings' },
          { native: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?', roman: 'Chet leka menama?', meaning: 'How are you?' },
          { native: 'ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ', roman: 'Bes ge menanya', meaning: 'I am doing well' },
          { native: 'ᱥᱟᱨᱦᱟᱣ', roman: 'Sarhao', meaning: 'Thank you' },
          { native: 'ᱵᱤᱨ ᱟᱨ ᱫᱟᱜ', roman: 'Bir ar Da', meaning: 'Forest and Water (Sacred Nature)' },
        ];
      case 'mundari':
        return [
          { native: 'जोहार', roman: 'Johar', meaning: 'Greetings of respect and harmony' },
          { native: 'हेसे', roman: 'Hese', meaning: 'Yes' },
          { native: 'कागे', roman: 'Kage', meaning: 'No' },
          { native: 'आम चेलेका मेनामा?', roman: 'Am cheleka menama?', meaning: 'How are you?' },
          { native: 'एनम', roman: 'Enam', meaning: 'Thank you' },
          { native: 'ओरोबु नपामा', roman: 'Orobu napama', meaning: 'We shall meet again' },
        ];
      case 'ho':
        return [
          { native: 'ᱡᱚᱦᱟᱨ', roman: 'Johar', meaning: 'Reverent traditional greeting' },
          { native: 'ᱦᱮ', roman: 'He', meaning: 'Yes' },
          { native: 'ᱠᱟ', roman: 'Ka', meaning: 'No' },
          { native: 'ᱵᱩᱜᱤᱛᱮ ᱢᱮᱱᱟᱢᱟ?', roman: 'Bugite menama?', meaning: 'Are you well?' },
          { native: 'ᱫᱟᱹᱭ', roman: 'Dai', meaning: 'Elder Sister (Respectful address)' },
        ];
      case 'kurukh':
      default:
        return [
          { native: 'गोड़ लागी', roman: 'God Lagi', meaning: 'Respectful salutation (I touch your feet)' },
          { native: 'हअ', roman: 'Ha', meaning: 'Yes' },
          { native: 'मला', roman: 'Mala', meaning: 'No' },
          { native: 'एक’अस रही?', roman: "Ek'as rahi?", meaning: 'How are you?' },
          { native: 'कोड़े रही', roman: 'Kode rahi', meaning: 'I am well' },
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Duolingo Layout Grid: Main Learning Path + Right Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left / Primary Column: Unit Banner + Interactive Lesson Road */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          {/* Authentic Duolingo Unit 1 Banner */}
          <div className="bg-gradient-to-r from-forest-700 via-forest-800 to-forest-900 border-2 border-forest-600/50 text-cream-50 rounded-3xl p-4 sm:p-6 shadow-earthy-lg relative overflow-hidden">
            {/* Subtle radial glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              {/* Top Row: Unit Pill + Language Badge + Guidebook Action */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="bg-gold-500/20 text-gold-300 border border-gold-400/40 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    UNIT 1
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-cream-200">
                    {selectedLanguage.name} <span className="text-gold-300">({selectedLanguage.nativeName})</span>
                  </span>
                </div>

                <button
                  onClick={() => setIsGuidebookOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-cream-100/10 hover:bg-cream-100/20 active:scale-95 border border-cream-100/20 px-2.5 sm:px-3 py-1 rounded-2xl text-xs font-bold text-cream-100 transition-all shadow-sm"
                  title="View Unit 1 Guidebook and key phrases"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold-300" />
                  <span>Guidebook</span>
                </button>
              </div>

              {/* Title & Short Description */}
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold font-display leading-tight text-cream-50">
                  Simple Greetings & Fundamentals
                </h1>
                <p className="text-xs sm:text-sm text-cream-200 mt-0.5 font-medium leading-relaxed">
                  Learn everyday greetings, polite expressions, and sacred nature words in {selectedLanguage.name}.
                </p>
              </div>

              {/* Bottom Row: Progress + Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-forest-600/40">
                <div className="space-y-1">
                  <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-bold text-cream-200">
                    <span>Progress: {completedCount} / {lessons.length} Lessons</span>
                    <span className="text-gold-300 font-extrabold">{progressPercent}%</span>
                  </div>
                  <div className="w-full sm:w-48">
                    <ProgressBar current={completedCount} total={lessons.length} color="gold" height="sm" />
                  </div>
                </div>

                {nextLesson && (
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => navigate(`/lesson/${nextLesson.lessonId}`)}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    className="w-full sm:w-auto text-xs sm:text-sm py-2 px-4 shadow-[0_3px_0_#CF841C]"
                  >
                    {completedCount === 0 ? 'Start Unit 1' : `Continue: ${nextLesson.title.split('(')[0]}`}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Compact Mini-Stats Bar for Mobile (< lg) */}
          <div className="lg:hidden flex items-center justify-between gap-2 bg-cream-100 border-2 border-sage-200 rounded-2xl p-2.5 shadow-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Target className="w-4 h-4 text-gold-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-800">
                  <span>Daily Goal</span>
                  <span>{dailyProgressXP}/{dailyGoalXP} XP</span>
                </div>
                <div className="mt-0.5">
                  <ProgressBar current={dailyProgressXP} total={dailyGoalXP} color="gold" height="xs" />
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-sage-200 shrink-0 mx-1" />

            <Link
              to="/vocabulary"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-2.5 py-1 rounded-xl shrink-0 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-forest-600" />
              <span>Flashcards</span>
            </Link>
          </div>

          {/* Interactive Lesson Road / Duolingo Winding Path */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-4 sm:p-8 shadow-earthy">
            <div className="flex items-center justify-between border-b-2 border-sage-200 pb-3 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600">
                  Learning Journey
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-teal-950">
                  {selectedLanguage.name} Path
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-teal-600">Status</span>
                <p className="font-extrabold font-display text-forest-700 text-sm sm:text-base">
                  {completedCount === lessons.length ? 'Mastered 🎉' : 'In Progress'}
                </p>
              </div>
            </div>

            {/* Winding Nodes */}
            <div className="py-2 flex flex-col items-center">
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

              {/* Duolingo Unit Milestone / Checkpoint */}
              <div className="mt-6 pt-6 border-t-2 border-dashed border-sage-200 w-full flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-cream-200 border-2 border-sage-300 flex items-center justify-center text-teal-600 shadow-sm mb-2">
                  {completedCount === lessons.length ? (
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-gold-500 animate-bounce" />
                  ) : (
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-teal-400" />
                  )}
                </div>
                <h3 className="font-display font-extrabold text-sm sm:text-base text-teal-900">
                  Unit 2: Family, Kinship & Elders
                </h3>
                <p className="text-xs text-teal-600 font-medium max-w-xs mt-0.5">
                  {completedCount === lessons.length
                    ? 'Congratulations! You unlocked the next milestone in tribal heritage.'
                    : 'Complete all Unit 1 lessons to unlock family terminology.'}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Exploration Cards on Mobile (rendered below the lessons so lessons are seen first!) */}
          <div className="lg:hidden space-y-4 pt-2">
            {/* Daily Challenge Card */}
            <div className="bg-gradient-to-br from-gold-50 to-cream-100 border-2 border-gold-300 rounded-3xl p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-700 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-gold-600" />
                <span>Daily Challenge</span>
              </div>
              <h4 className="font-display font-extrabold text-base text-teal-950">
                Complete 2 Lessons Today
              </h4>
              <p className="text-xs text-teal-700 font-medium">
                Earn an extra +50 XP bonus and unlock the next cultural milestone in {selectedLanguage.name}.
              </p>
              <div className="pt-1">
                <ProgressBar current={completedCount} total={2} color="gold" height="xs" showPercentage={true} />
              </div>
            </div>

            {/* Cultural Lore Card */}
            <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-forest-700 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-forest-600" />
                <span>Cultural Heritage</span>
              </div>
              <h4 className="font-display font-bold text-base text-teal-900">
                The Sacred Grove (Sarna)
              </h4>
              <p className="text-xs text-teal-700 leading-relaxed font-medium">
                In tribal cosmology, nature is an elder kin to cherish. Every village preserves a virgin forest patch called Sarna where the Sal trees bloom unpruned.
              </p>
              <Link
                to="/community"
                className="text-xs font-bold text-forest-700 hover:underline inline-block pt-1"
              >
                Explore Tribal Stories & Folktales →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Desktop/Laptop Widgets (Hidden on small screens, shown on lg screens) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24">
          {/* Daily Goal & Streak Card */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Daily Goal
              </span>
              <Target className="w-4 h-4 text-gold-500" />
            </div>

            <div>
              <p className="text-2xl font-extrabold font-display text-teal-900">
                {dailyProgressXP} / {dailyGoalXP} <span className="text-xs font-bold text-gold-600">XP</span>
              </p>
              <p className="text-xs text-teal-600 font-medium mt-0.5">
                {dailyProgressXP >= dailyGoalXP
                  ? 'Goal completed for today! Awesome work!'
                  : `${dailyGoalXP - dailyProgressXP} XP to reach today’s target`}
              </p>
            </div>

            <ProgressBar current={dailyProgressXP} total={dailyGoalXP} color="gold" height="sm" />

            <div className="pt-3 border-t border-sage-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${(user?.currentStreak || 0) > 0 ? 'text-terracotta-500 fill-current animate-bounce' : 'text-teal-400'}`} />
                <span className="text-xs font-bold text-teal-800">
                  {user?.currentStreak || 0} Day Streak
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                (user?.currentStreak || 0) > 0
                  ? 'text-terracotta-600 bg-terracotta-50 border-terracotta-200'
                  : 'text-teal-600 bg-cream-200 border-sage-200'
              }`}>
                {(user?.currentStreak || 0) > 0 ? 'Active Fire 🔥' : 'Start Today'}
              </span>
            </div>
          </div>

          {/* Flashcards Practice Quick Card */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                Word Practice
              </span>
              <BookOpen className="w-4 h-4 text-forest-600" />
            </div>
            <h3 className="text-lg font-bold font-display text-teal-900">
              Vocabulary Flashcards
            </h3>
            <p className="text-xs text-teal-700 font-medium leading-relaxed">
              Strengthen your memory with native pronunciations, flip flashcards, and cultural example sentences.
            </p>
            <Button
              variant="outline"
              size="sm"
              fullWidth={true}
              onClick={() => navigate('/vocabulary')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="text-xs py-2"
            >
              Practice Flashcards
            </Button>
          </div>

          {/* Daily Challenge Card */}
          <div className="bg-gradient-to-br from-gold-50 to-cream-100 border-2 border-gold-300 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gold-700 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-gold-600" />
              <span>Daily Challenge</span>
            </div>
            <h3 className="font-display font-extrabold text-lg text-teal-950">
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
            <h4 className="font-display font-bold text-base text-teal-900">
              The Sacred Grove (Sarna)
            </h4>
            <p className="text-xs text-teal-700 leading-relaxed font-medium">
              In tribal cosmology, nature is an elder kin to cherish. Every village preserves a virgin forest patch called Sarna where the Sal trees bloom unpruned.
            </p>
            <Link
              to="/community"
              className="text-xs font-bold text-forest-700 hover:underline inline-block pt-1"
            >
              Explore Tribal Stories & Folktales →
            </Link>
          </div>

          {/* Badges Preview */}
          <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-teal-900">
                Badges & Milestones
              </h4>
              <Link to="/progress" className="text-xs font-bold text-forest-700 hover:underline">
                View all ({ACHIEVEMENTS.length})
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {ACHIEVEMENTS.slice(0, 3).map((ach) => {
                const isUnlocked = user?.unlockedAchievements.includes(ach.achievementId);
                return (
                  <div
                    key={ach.achievementId}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-gold-50 border-gold-300 shadow-sm'
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

      {/* Guidebook Modal */}
      <Modal
        isOpen={isGuidebookOpen}
        onClose={() => setIsGuidebookOpen(false)}
        title={`Unit 1 Guidebook: ${selectedLanguage.name}`}
        maxWidth="lg"
      >
        <div className="space-y-5">
          <div className="bg-forest-50 border border-forest-200 p-4 rounded-2xl text-xs text-forest-800 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Cultural Insight & Etiquette</span>
            </p>
            {selectedLanguage.culturalNote} Traditional greetings honor the spirit in all beings and nature.
          </div>

          <div>
            <h4 className="font-display font-extrabold text-sm text-teal-900 uppercase tracking-wider mb-3">
              Key Phrases in this Unit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getGuidebookPhrases().map((phrase, i) => (
                <div
                  key={i}
                  className="p-3 bg-cream-50 border border-sage-200 rounded-2xl flex flex-col justify-between"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display font-bold text-base text-forest-800">
                      {phrase.native}
                    </span>
                    <span className="text-xs font-semibold text-gold-600 font-mono">
                      {phrase.roman}
                    </span>
                  </div>
                  <p className="text-xs text-teal-700 mt-1.5 font-medium">
                    {phrase.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-sage-200 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsGuidebookOpen(false)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Got it, let's learn!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
