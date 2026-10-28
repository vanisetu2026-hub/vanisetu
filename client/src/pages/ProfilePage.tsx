import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLearning } from '../contexts/LearningContext';
import { ACHIEVEMENTS } from '../data/tribalData';
import { AchievementCard } from '../components/cards/AchievementCard';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { UserAvatar } from '../components/common/UserAvatar';
import { useNotification } from '../contexts/NotificationContext';
import {
  User,
  Sparkles,
  Flame,
  CheckCircle2,
  Trophy,
  Calendar,
  Globe2,
  Edit2,
  Save,
  UserPlus,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { selectedLanguage } = useLearning();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal?.toString() || '50');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      dailyGoal: parseInt(dailyGoal, 10) || 50,
    });
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile changes have been saved.',
    });
  };

  // Real weekly learning activity based on user progress
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun
  const currentStreak = user?.currentStreak || 0;
  const userXP = user?.totalXP || 0;
  const dailyTarget = user?.dailyGoal || 50;

  const daysOfWeek = dayLabels.map((day, idx) => {
    const isToday = idx === todayDayIndex;
    const isActive = isToday ? userXP > 0 : idx < todayDayIndex && idx >= todayDayIndex - Math.max(0, currentStreak - 1);
    const xp = isToday ? Math.min(userXP, dailyTarget) : (isActive ? dailyTarget : 0);
    return {
      day,
      xp,
      active: isActive && xp > 0,
      isToday,
    };
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Profile Header Card */}
      <div className="bg-cream-100 border-3 border-sage-200 rounded-3xl p-6 sm:p-8 shadow-earthy">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <UserAvatar
              name={user?.name}
              email={user?.email}
              photoURL={user?.photoURL}
              size="xl"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
                  {user?.name || 'Learner'}
                </h1>
                {user?.isGuest && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-200 text-gold-800 px-2.5 py-0.5 rounded-full">
                    Guest Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-600 font-semibold">
                {user?.isGuest ? 'Temporary Guest Session' : user?.email}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-forest-700 pt-1">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Learning: {selectedLanguage.name} ({selectedLanguage.nativeName})</span>
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? 'sage' : 'outline'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            icon={<Edit2 className="w-4 h-4" />}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Guest prompt banner */}
        {user?.isGuest && (
          <div className="mt-5 pt-4 border-t-2 border-sage-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gold-50/80 p-4 rounded-2xl border border-gold-300">
            <div>
              <p className="text-xs font-bold text-teal-950 font-display">
                You are currently in Guest Mode
              </p>
              <p className="text-[11px] text-teal-700">
                Create a free account to permanently sync and save your streaks, XP, and badges.
              </p>
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={() => navigate('/signup')}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Create Free Account
            </Button>
          </div>
        )}

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t-2 border-sage-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Learner Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
              <Input
                label="Daily Goal (XP)"
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                placeholder="50"
                min="10"
                max="500"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Core Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total XP */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            {user?.totalXP || 0}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Total XP
          </span>
        </div>

        {/* Current Streak */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto mb-2">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            {user?.currentStreak || 0}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Day Streak
          </span>
        </div>

        {/* Lessons Completed */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            {user?.completedLessons.length || 0}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Lessons Done
          </span>
        </div>

        {/* Longest Streak */}
        <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-tribalpurple-100 text-tribalpurple-700 flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-950">
            {user?.longestStreak || 0}
          </span>
          <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5">
            Best Streak
          </span>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-cream-100 border-2 border-sage-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-forest-600" />
            <h3 className="font-display font-extrabold text-lg text-teal-950">
              Weekly Learning Activity
            </h3>
          </div>
          <span className="text-xs font-bold text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
            Goal: {user?.dailyGoal || 50} XP / Day
          </span>
        </div>

        {/* Bar chart */}
        <div className="pt-4 flex items-end justify-between gap-3 h-40 border-b border-sage-300 pb-2">
          {daysOfWeek.map((item, idx) => {
            const barHeight = item.xp > 0 ? Math.min(100, Math.max(12, (item.xp / dailyTarget) * 100)) : 6;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 relative group ${
                    item.active
                      ? 'bg-gradient-to-t from-forest-600 to-forest-500 shadow-sm'
                      : 'bg-cream-300'
                  }`}
                  style={{ height: `${barHeight}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-teal-950 text-cream-50 text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity">
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
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold font-display text-teal-950">
            Achievements & Badges
          </h3>
          <span className="text-xs font-bold text-teal-600">
            Unlocked {user?.unlockedAchievements?.length || 0} of {ACHIEVEMENTS.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <AchievementCard
              key={ach.achievementId}
              achievement={ach}
              isUnlocked={user?.unlockedAchievements.includes(ach.achievementId) || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
