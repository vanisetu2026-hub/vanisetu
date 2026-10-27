import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  LANGUAGES,
  COURSES,
  LESSONS,
  EXERCISES,
  DICTIONARY,
  COMMUNITY_POSTS,
} from '../data/seedData.js';

// In-memory progress store for demo & fallback
const userProgressStore: Record<string, {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  completedLessons: string[];
  unlockedAchievements: string[];
  name: string;
  dailyGoal: number;
  selectedLanguage: string;
}> = {};

const getOrCreateUser = (uid: string, name?: string) => {
  if (!userProgressStore[uid]) {
    userProgressStore[uid] = {
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      completedLessons: [],
      unlockedAchievements: [],
      name: name || 'Learner',
      dailyGoal: 50,
      selectedLanguage: 'mundari',
    };
  }
  return userProgressStore[uid];
};

// 1. Language Controllers
export const getLanguages = (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, count: LANGUAGES.length, data: LANGUAGES });
};

export const getLanguageById = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const lang = LANGUAGES.find((l) => l.languageId === id);
  if (!lang) {
    res.status(404).json({ success: false, message: 'Language not found' });
    return;
  }
  res.json({ success: true, data: lang });
};

// 2. Course Controllers
export const getCourses = (req: AuthenticatedRequest, res: Response) => {
  const { languageId } = req.query;
  const list = languageId
    ? COURSES.filter((c) => c.languageId === languageId)
    : COURSES;
  res.json({ success: true, count: list.length, data: list });
};

export const getCourseById = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const course = COURSES.find((c) => c.courseId === id);
  if (!course) {
    res.status(404).json({ success: false, message: 'Course not found' });
    return;
  }
  res.json({ success: true, data: course });
};

// 3. Lesson Controllers
export const getLessonById = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const lesson = LESSONS.find((l) => l.lessonId === id);
  if (!lesson) {
    res.status(404).json({ success: false, message: 'Lesson not found' });
    return;
  }
  res.json({ success: true, data: lesson });
};

export const getLessonExercises = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const exercises = EXERCISES[id] || EXERCISES['mun_l1'] || [];
  res.json({ success: true, count: exercises.length, data: exercises });
};

// 4. Progress Controllers
export const getProgress = (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid || 'guest_learner';
  const progress = getOrCreateUser(uid, req.user?.name);
  res.json({ success: true, data: progress });
};

export const completeLesson = (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid || 'guest_learner';
  const { lessonId, score, accuracy, xpEarned } = req.body;

  if (!lessonId) {
    res.status(400).json({ success: false, message: 'lessonId is required' });
    return;
  }

  const user = getOrCreateUser(uid, req.user?.name);

  const alreadyCompleted = user.completedLessons.includes(lessonId);
  if (!alreadyCompleted) {
    user.completedLessons.push(lessonId);
    user.currentStreak += 1;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  }

  const awardedXP = Number(xpEarned) || 20;
  user.totalXP += awardedXP;

  res.json({
    success: true,
    message: 'Lesson progress recorded',
    data: {
      lessonId,
      score,
      accuracy,
      totalXP: user.totalXP,
      currentStreak: user.currentStreak,
      completedLessons: user.completedLessons,
    },
  });
};

// 5. Dictionary Controllers
export const getDictionary = (req: AuthenticatedRequest, res: Response) => {
  const { q, languageId, category } = req.query;
  let items = [...DICTIONARY];

  if (languageId && languageId !== 'all') {
    items = items.filter((i) => i.languageId === languageId);
  }

  if (category && category !== 'all') {
    items = items.filter((i) => i.category.toLowerCase() === String(category).toLowerCase());
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    items = items.filter(
      (i) =>
        i.word.toLowerCase().includes(query) ||
        i.transliteration.toLowerCase().includes(query) ||
        i.englishMeaning.toLowerCase().includes(query) ||
        i.hindiMeaning.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: items.length, data: items });
};

export const getDictionaryItem = (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const item = DICTIONARY.find((i) => i.vocabularyId === id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Dictionary entry not found' });
    return;
  }
  res.json({ success: true, data: item });
};

// 6. Community Controllers
export const getCommunity = (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, count: COMMUNITY_POSTS.length, data: COMMUNITY_POSTS });
};

export const createContribution = (req: AuthenticatedRequest, res: Response) => {
  const { title, content, languageId, contentType, tribalText, translation, culturalContext, region } = req.body;

  if (!title || !content || !translation) {
    res.status(400).json({ success: false, message: 'title, content, and translation are required' });
    return;
  }

  const newPost = {
    contributionId: 'contrib_' + Math.random().toString(36).substring(2, 9),
    uid: req.user?.uid || 'anonymous',
    authorName: req.user?.name || 'Community Elder',
    languageId: languageId || 'mundari',
    contentType: contentType || 'story',
    title,
    content,
    tribalText: tribalText || '',
    translation,
    culturalContext: culturalContext || '',
    region: region || 'Jharkhand, India',
    moderationStatus: 'approved',
    likesCount: 1,
    createdAt: new Date().toISOString(),
  };

  COMMUNITY_POSTS.unshift(newPost);

  res.status(201).json({
    success: true,
    message: 'Contribution submitted successfully for elder verification.',
    data: newPost,
  });
};

// 7. Profile Controllers
export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid || 'guest_learner';
  const profile = getOrCreateUser(uid, req.user?.name);
  res.json({
    success: true,
    data: {
      uid,
      email: req.user?.email || '',
      ...profile,
    },
  });
};

export const updateProfile = (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid || 'guest_learner';
  const profile = getOrCreateUser(uid, req.user?.name);

  const { name, dailyGoal, selectedLanguage } = req.body;
  if (name) profile.name = name;
  if (dailyGoal) profile.dailyGoal = Number(dailyGoal);
  if (selectedLanguage) profile.selectedLanguage = selectedLanguage;

  res.json({
    success: true,
    message: 'Profile updated',
    data: {
      uid,
      email: req.user?.email || '',
      ...profile,
    },
  });
};
