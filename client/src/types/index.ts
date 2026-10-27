export type ContentStatus = 'verified' | 'sample_pending_verification';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  selectedLanguage: string; // e.g., 'mundari', 'santali', 'ho', 'kurukh'
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastLearningDate?: string;
  dailyGoal: number; // in XP, e.g. 50
  completedLessons: string[]; // array of lessonIds
  unlockedAchievements: string[]; // array of achievementIds
  createdAt: string;
  isGuest?: boolean;
}

export interface TribalLanguage {
  languageId: string;
  name: string;
  nativeName: string;
  scriptName: string;
  region: string;
  description: string;
  speakersCount: string;
  languageFamily: string;
  badgeColor: string;
  accentColor: string;
  contentStatus: ContentStatus;
  isActive: boolean;
  culturalNote: string;
  sampleGreeting: string;
  sampleGreetingMeaning: string;
}

export interface Course {
  courseId: string;
  languageId: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Cultural Heritage';
  order: number;
  totalLessons: number;
}

export interface Lesson {
  lessonId: string;
  courseId: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  isPublished: boolean;
  culturalInsight?: string;
  requiredLessonId?: string | null;
}

export type ExerciseType =
  | 'learn_word'
  | 'select_meaning'
  | 'match_pairs'
  | 'multiple_choice'
  | 'fill_blank'
  | 'listen_identify'
  | 'arrange_words';

export interface Exercise {
  exerciseId: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  tribalWord?: string;
  nativeScript?: string;
  transliteration?: string;
  audioPronunciationText?: string;
  englishMeaning?: string;
  hindiMeaning?: string;
  options?: string[];
  correctAnswer: string | string[]; // string or array for pair matching / ordered words
  explanation: string;
  vocabularyId?: string;
  exampleSentence?: {
    tribal: string;
    transliteration: string;
    translation: string;
  };
  pairs?: { tribal: string; translation: string }[];
  order: number;
}

export interface VocabularyItem {
  vocabularyId: string;
  languageId: string;
  word: string;
  nativeScript?: string;
  transliteration: string;
  englishMeaning: string;
  hindiMeaning: string;
  category: 'Greetings' | 'Nature' | 'Family' | 'Numbers' | 'Festival' | 'Everyday';
  exampleSentence: {
    tribal: string;
    transliteration: string;
    translation: string;
  };
  audioPhonetic: string;
  verificationStatus: ContentStatus;
  culturalContext?: string;
  isFavorite?: boolean;
}

export interface UserLessonProgress {
  uid: string;
  languageId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  score?: number;
  accuracy?: number;
  completedAt?: string;
  xpEarned?: number;
}

export interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  criteria: 'first_lesson' | 'streak_3' | 'streak_7' | 'vocab_10' | 'xp_250' | 'cultural_explorer';
}

export interface CommunityContribution {
  contributionId: string;
  uid: string;
  authorName: string;
  languageId: string;
  contentType: 'word' | 'story' | 'song' | 'proverb';
  title: string;
  content: string;
  tribalText?: string;
  translation: string;
  culturalContext: string;
  region: string;
  audioURL?: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  likesCount: number;
  createdAt: string;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // "09:00"
  days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  sound: boolean;
}
