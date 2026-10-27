import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TribalLanguage,
  Course,
  Lesson,
  VocabularyItem,
  ReminderSettings,
  CommunityContribution,
} from '../types';
import {
  LANGUAGES,
  COURSES,
  LESSONS,
  DICTIONARY_ITEMS,
  COMMUNITY_STORIES,
  ACHIEVEMENTS,
} from '../data/tribalData';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { sound } from '../utils/sound';

interface LearningContextType {
  selectedLanguage: TribalLanguage;
  allLanguages: TribalLanguage[];
  setSelectedLanguageId: (id: string) => void;
  courses: Course[];
  lessons: Lesson[];
  dictionary: VocabularyItem[];
  favorites: string[];
  toggleFavorite: (vocabId: string) => void;
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: ReminderSettings) => void;
  communityContributions: CommunityContribution[];
  addContribution: (contribution: Omit<CommunityContribution, 'contributionId' | 'likesCount' | 'createdAt' | 'moderationStatus'>) => void;
  likedContributions: string[];
  isContributionLiked: (id: string) => boolean;
  likeContribution: (id: string) => void;
  completeLesson: (lessonId: string, score: number, accuracy: number, xpEarned: number) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lesson: Lesson) => boolean;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const LOCAL_FAVORITES_KEY = 'vanisetu_favorites';
const LOCAL_REMINDERS_KEY = 'vanisetu_reminders';
const LOCAL_COMMUNITY_KEY = 'vanisetu_community_contributions';
const LOCAL_LIKED_CONTRIBUTIONS_KEY = 'vanisetu_liked_contributions';

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotification();

  const [languageId, setLanguageId] = useState<string>(
    user?.selectedLanguage || 'mundari'
  );

  const [likedContributions, setLikedContributions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_LIKED_CONTRIBUTIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_REMINDERS_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            enabled: true,
            time: '09:00',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            sound: true,
          };
    } catch {
      return {
        enabled: true,
        time: '09:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        sound: true,
      };
    }
  });

  const [communityContributions, setCommunityContributions] = useState<CommunityContribution[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_COMMUNITY_KEY);
      const savedLiked = localStorage.getItem(LOCAL_LIKED_CONTRIBUTIONS_KEY);
      const likedList: string[] = savedLiked ? JSON.parse(savedLiked) : [];

      if (!saved) {
        return COMMUNITY_STORIES.map((item) => ({
          ...item,
          likesCount: item.likesCount + (likedList.includes(item.contributionId) ? 1 : 0),
        }));
      }

      const parsed: CommunityContribution[] = JSON.parse(saved);
      // Ensure seed stories maintain genuine baseline + user's single like state
      return parsed.map((item) => {
        const seed = COMMUNITY_STORIES.find((s) => s.contributionId === item.contributionId);
        if (seed) {
          const isLiked = likedList.includes(item.contributionId);
          return {
            ...item,
            likesCount: seed.likesCount + (isLiked ? 1 : 0),
          };
        }
        return item;
      });
    } catch {
      return COMMUNITY_STORIES;
    }
  });

  useEffect(() => {
    if (user?.selectedLanguage && user.selectedLanguage !== languageId) {
      setLanguageId(user.selectedLanguage);
    }
  }, [user?.selectedLanguage]);

  const selectedLanguage =
    LANGUAGES.find((l) => l.languageId === languageId) || LANGUAGES[0];

  const setSelectedLanguageId = (id: string) => {
    setLanguageId(id);
    if (user) {
      updateUser({ selectedLanguage: id });
    }
    addToast({
      type: 'info',
      title: 'Language Switched',
      message: `Now exploring ${LANGUAGES.find((l) => l.languageId === id)?.name || id}!`,
    });
  };

  const toggleFavorite = (vocabId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(vocabId);
      const updated = exists ? prev.filter((id) => id !== vocabId) : [...prev, vocabId];
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updated));
      addToast({
        type: exists ? 'info' : 'success',
        message: exists ? 'Removed from favorites' : 'Saved to favorite vocabulary! ⭐',
      });
      return updated;
    });
  };

  const updateReminderSettings = (settings: ReminderSettings) => {
    setReminderSettings(settings);
    localStorage.setItem(LOCAL_REMINDERS_KEY, JSON.stringify(settings));
    sound.setSoundEnabled(settings.sound);

    // Request browser notification permission if user enabled it
    if (settings.enabled && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          addToast({
            type: 'success',
            title: 'Reminders Active',
            message: `Daily learning reminders scheduled for ${settings.time}!`,
          });
        }
      });
    } else {
      addToast({
        type: 'info',
        title: 'Settings Saved',
        message: 'Reminder preferences updated successfully.',
      });
    }
  };

  const addContribution = (
    contribution: Omit<CommunityContribution, 'contributionId' | 'likesCount' | 'createdAt' | 'moderationStatus'>
  ) => {
    const newEntry: CommunityContribution = {
      ...contribution,
      contributionId: 'contrib_' + Math.random().toString(36).substring(2, 9),
      moderationStatus: 'approved', // Auto-approved for exhibition demo / pending verification
      likesCount: 1,
      createdAt: new Date().toISOString(),
    };

    setCommunityContributions((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(updated));
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Cultural Contribution Received',
      message: 'Thank you for preserving tribal oral heritage! Your contribution is now shared.',
    });
  };

  const isContributionLiked = (id: string): boolean => {
    return likedContributions.includes(id);
  };

  const likeContribution = (id: string) => {
    const isAlreadyLiked = likedContributions.includes(id);
    const updatedLiked = isAlreadyLiked
      ? likedContributions.filter((contribId) => contribId !== id)
      : [...likedContributions, id];

    setLikedContributions(updatedLiked);
    localStorage.setItem(LOCAL_LIKED_CONTRIBUTIONS_KEY, JSON.stringify(updatedLiked));

    setCommunityContributions((prev) => {
      const updated = prev.map((item) => {
        if (item.contributionId === id) {
          const delta = isAlreadyLiked ? -1 : 1;
          return {
            ...item,
            likesCount: Math.max(0, item.likesCount + delta),
          };
        }
        return item;
      });
      localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return user?.completedLessons.includes(lessonId) || false;
  };

  const isLessonUnlocked = (lesson: Lesson): boolean => {
    if (!lesson.requiredLessonId) return true;
    return isLessonCompleted(lesson.requiredLessonId);
  };

  const completeLesson = (
    lessonId: string,
    _score: number,
    _accuracy: number,
    xpEarned: number
  ) => {
    if (!user) return;

    const alreadyDone = user.completedLessons.includes(lessonId);
    const newCompleted = alreadyDone
      ? user.completedLessons
      : [...user.completedLessons, lessonId];

    const newXP = (user.totalXP || 0) + xpEarned;
    const newStreak = (user.currentStreak || 1) + (alreadyDone ? 0 : 1);
    const longest = Math.max(user.longestStreak || 1, newStreak);

    // Check achievement unlocking
    const newAchievements = [...user.unlockedAchievements];
    if (newCompleted.length >= 1 && !newAchievements.includes('ach_first_steps')) {
      newAchievements.push('ach_first_steps');
    }
    if (newStreak >= 3 && !newAchievements.includes('ach_streak_3')) {
      newAchievements.push('ach_streak_3');
      addToast({
        type: 'xp',
        title: 'Achievement Unlocked! 🔥',
        message: 'Campfire Flame: 3-Day Learning Streak!',
      });
    }
    if (newXP >= 250 && !newAchievements.includes('ach_xp_250')) {
      newAchievements.push('ach_xp_250');
      addToast({
        type: 'xp',
        title: 'Achievement Unlocked! 🏆',
        message: 'Heritage Champion: Earned 250+ XP!',
      });
    }

    updateUser({
      totalXP: newXP,
      currentStreak: newStreak,
      longestStreak: longest,
      completedLessons: newCompleted,
      unlockedAchievements: newAchievements,
      lastLearningDate: new Date().toISOString(),
    });

    addToast({
      type: 'xp',
      title: `+${xpEarned} XP Earned!`,
      message: 'Lesson completed! Your cultural knowledge grows.',
    });
  };

  return (
    <LearningContext.Provider
      value={{
        selectedLanguage,
        allLanguages: LANGUAGES,
        setSelectedLanguageId,
        courses: COURSES.filter((c) => c.languageId === languageId),
        lessons: LESSONS.filter((l) => l.languageId === languageId),
        dictionary: DICTIONARY_ITEMS,
        favorites,
        toggleFavorite,
        reminderSettings,
        updateReminderSettings,
        communityContributions,
        addContribution,
        likedContributions,
        isContributionLiked,
        likeContribution,
        completeLesson,
        isLessonCompleted,
        isLessonUnlocked,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
