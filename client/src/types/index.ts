export type ContentStatus = 'verified' | 'sample_pending_verification';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: AdminRole | 'learner';
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

export type PathNodeType = 'lesson' | 'script' | 'chest' | 'trophy';

export interface PathNode {
  nodeId: string;
  unitId: string;
  type: PathNodeType;
  title: string;
  description: string;
  lessonId?: string;
  scriptChar?: string;
  xpReward: number;
  rewardChest?: {
    xp: number;
    title: string;
    proverb: string;
    culturalContext: string;
  };
  order: number;
}

export interface UnitGuidebookPhrase {
  native: string;
  roman: string;
  meaning: string;
  audioText?: string;
}

export interface Unit {
  unitId: string;
  sectionId: string;
  unitNumber: number; // 1 to 8
  title: string;
  subtitle: string;
  description: string;
  themeColor: string; // 'green' | 'purple' | 'blue' | 'amber' | 'rose' | 'teal' | 'indigo' | 'gold'
  mascot?: {
    name: string;
    avatar: string;
    quote: string;
  };
  guidebookPhrases: UnitGuidebookPhrase[];
  nodes: PathNode[];
}

export interface Section {
  sectionId: string;
  sectionNumber: number; // 1, 2, 3
  title: string;
  subtitle: string;
  description: string;
  units: Unit[];
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

export interface IntroducedWord {
  word: string;
  nativeScript?: string;
  transliteration?: string;
  englishMeaning: string;
  hindiMeaning: string;
  pronunciation?: string;
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

// ================= ADMIN PANEL TYPES =================
export type AdminRole =
  | 'super_admin'
  | 'content_admin'
  | 'language_reviewer'
  | 'moderator'
  | 'read_only_admin';

export type UserStatus = 'active' | 'suspended' | 'banned';
export type ModuleStatus = 'draft' | 'published' | 'archived';
export type LessonStatus = 'draft' | 'published' | 'archived';
export type ContributionReviewStatus =
  | 'submitted'
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'needs_revision';

export type QuestionType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'fill_blank'
  | 'translation'
  | 'match_pairs'
  | 'word_arrangement'
  | 'listening_comprehension'
  | 'audio_pronunciation'
  | 'image_based'
  | 'true_false'
  | 'short_answer'
  | 'vocabulary_recognition';

export interface AdminLanguage {
  languageId: string;
  name: string;
  nativeName: string;
  scriptName: string;
  region: string;
  description: string;
  speakersCount: string;
  languageFamily: string;
  contentStatus: string;
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder: number;
  sampleGreeting: string;
  sampleGreetingMeaning: string;
  culturalNote?: string;
  iconURL?: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminModule {
  moduleId: string;
  languageId: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Cultural Heritage';
  displayOrder: number;
  prerequisites: string[];
  estimatedDuration: string;
  learningObjectives: string[];
  status: ModuleStatus;
  iconURL?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLesson {
  lessonId: string;
  moduleId: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  learningObjectives: string[];
  vocabularyIntro: string[];
  culturalInsight: string;
  xpReward: number;
  status: LessonStatus;
  requiredLessonId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminQuestion {
  questionId: string;
  lessonId: string;
  moduleId: string;
  languageId: string;
  questionText: string;
  questionType: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
  audioPronunciationText?: string;
  audioURL?: string;
  imageURL?: string;
  tribalWord?: string;
  nativeScript?: string;
  transliteration?: string;
  englishMeaning?: string;
  hindiMeaning?: string;
  pairs?: { tribal: string; translation: string }[];
  timeLimit?: number;
  xpReward: number;
  sequence: number;
  status: 'draft' | 'published';
  isScaffolded?: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVocabulary {
  vocabularyId: string;
  languageId: string;
  moduleId?: string;
  word: string;
  nativeScript: string;
  transliteration: string;
  englishMeaning: string;
  hindiMeaning: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'greeting' | 'pronoun' | 'phrase';
  pronunciationAudioText: string;
  audioURL?: string;
  imageURL?: string;
  category: 'Greetings' | 'Nature' | 'Family' | 'Numbers' | 'Festival' | 'Everyday' | 'Kinship' | 'Food';
  exampleSentence: {
    tribal: string;
    transliteration: string;
    translation: string;
  };
  culturalContext: string;
  contributor: string;
  verificationStatus: 'verified' | 'sample_pending_verification' | 'needs_revision';
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContribution {
  contributionId: string;
  uid: string;
  authorName: string;
  authorEmail?: string;
  languageId: string;
  contentType: 'word' | 'story' | 'song' | 'proverb' | 'translation' | 'correction';
  title: string;
  content: string;
  tribalText: string;
  translation: string;
  existingContent?: string;
  suggestedCorrection?: string;
  culturalContext: string;
  region: string;
  audioURL?: string;
  imageURL?: string;
  status: ContributionReviewStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  likesCount: number;
  createdAt: string;
  reviewedAt?: string;
}

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: AdminRole | 'learner';
  status: UserStatus;
  selectedLanguage: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  completedLessons: string[];
  unlockedAchievements: string[];
  contributionsCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface AdminMedia {
  mediaId: string;
  name: string;
  type: 'image' | 'audio' | 'icon' | 'document';
  url: string;
  sizeBytes: number;
  mimeType: string;
  category: 'lesson' | 'language' | 'module' | 'culture' | 'pronunciation';
  languageId?: string;
  usedInCount: number;
  uploadedBy: string;
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  description: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  baseXpReward: number;
  bonusAccuracyXp: number;
  dailyStreakBonusXp: number;
  contributionXpReward: number;
  maintenanceMode: boolean;
  allowGuestMode: boolean;
  autoApproveVerifiedElders: boolean;
  termsUrl: string;
  privacyUrl: string;
  communityGuidelinesUrl: string;
  contactEmail: string;
  socialInstagram: string;
  socialX: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AdminNotification {
  notificationId: string;
  type: 'contribution' | 'report' | 'system' | 'review_task' | 'milestone';
  title: string;
  message: string;
  link?: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  logId: string;
  adminId: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  entityType: 'language' | 'module' | 'lesson' | 'question' | 'vocabulary' | 'contribution' | 'user' | 'settings' | 'media';
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  ipAddress: string;
  timestamp: string;
}

export interface VersionRecord {
  versionId: string;
  entityType: 'language' | 'module' | 'lesson' | 'question' | 'vocabulary';
  entityId: string;
  versionNumber: number;
  snapshot: unknown;
  savedBy: string;
  changeSummary: string;
  createdAt: string;
}

export interface AdminStatsData {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalLanguages: number;
    publishedModules: number;
    totalLessons: number;
    totalQuestions: number;
    totalVocabularyEntries: number;
    pendingContributions: number;
    approvedContributions: number;
    rejectedContributions: number;
    totalLearningSessions: number;
    averageLessonCompletionRate: number;
  };
  languageStats: {
    languageId: string;
    name: string;
    nativeName: string;
    modulesCount: number;
    lessonsCount: number;
    vocabularyCount: number;
    learnersCount: number;
  }[];
  recentActivities: AuditLog[];
  pendingReviewTasks: AdminContribution[];
  recentUsers: AdminUser[];
}

