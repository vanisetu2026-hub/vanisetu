import { v4 as uuidv4 } from 'uuid';
import {
  LANGUAGES as INITIAL_LANGUAGES,
  COURSES as INITIAL_COURSES,
  LESSONS as INITIAL_LESSONS,
  EXERCISES as INITIAL_EXERCISES,
  DICTIONARY as INITIAL_DICTIONARY,
  COMMUNITY_POSTS as INITIAL_COMMUNITY,
} from './seedData.js';

// Types for Admin Entities
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
  estimatedDuration: string; // e.g. "45 mins"
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
  correctAnswer: string | string[]; // string or array for pairs / multi-select / word arrangement
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
  timeLimit?: number; // in seconds
  xpReward: number;
  sequence: number;
  status: 'draft' | 'published';
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

// In-Memory Persistent Store with Initial Data
class AdminDataStore {
  languages: AdminLanguage[] = [];
  modules: AdminModule[] = [];
  lessons: AdminLesson[] = [];
  questions: AdminQuestion[] = [];
  vocabulary: AdminVocabulary[] = [];
  contributions: AdminContribution[] = [];
  users: AdminUser[] = [];
  media: AdminMedia[] = [];
  notifications: AdminNotification[] = [];
  auditLogs: AuditLog[] = [];
  versionHistory: VersionRecord[] = [];
  settings: PlatformSettings;

  constructor() {
    this.settings = {
      platformName: 'VANISETU',
      tagline: 'Learn • Preserve • Connect',
      description: 'A digital bridge for tribal languages and indigenous oral heritage.',
      defaultLanguage: 'mundari',
      supportedLanguages: ['mundari', 'santali', 'ho', 'kurukh'],
      baseXpReward: 20,
      bonusAccuracyXp: 10,
      dailyStreakBonusXp: 15,
      contributionXpReward: 50,
      maintenanceMode: false,
      allowGuestMode: true,
      autoApproveVerifiedElders: false,
      termsUrl: '/terms',
      privacyUrl: '/privacy',
      communityGuidelinesUrl: '/community-guidelines',
      contactEmail: 'contact@vanisetu.org',
      socialInstagram: 'https://www.instagram.com/vanisetu2026?utm_source=qr&cplk=MTN3cDJoanFrajJhcw%3D%3D',
      socialX: 'https://x.com/vanisetu',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    };

    this.initializeData();
  }

  private initializeData() {
    const now = new Date().toISOString();

    // 1. Seed Languages
    this.languages = INITIAL_LANGUAGES.map((lang, index) => ({
      languageId: lang.languageId,
      name: lang.name,
      nativeName: lang.nativeName,
      scriptName: lang.scriptName,
      region: lang.region,
      description: lang.description,
      speakersCount: lang.speakersCount,
      languageFamily: lang.languageFamily,
      contentStatus: lang.contentStatus,
      isActive: lang.isActive,
      isFeatured: index < 2,
      displayOrder: index + 1,
      sampleGreeting: lang.sampleGreeting,
      sampleGreetingMeaning: lang.sampleGreetingMeaning,
      culturalNote: 'Centuries of indigenous harmony with nature, hills (burus), and sacred groves (sarna).',
      isArchived: false,
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: now,
    }));

    // 2. Seed Modules (from COURSES)
    this.modules = INITIAL_COURSES.map((course, idx) => ({
      moduleId: course.courseId,
      languageId: course.languageId,
      title: course.title,
      description: course.description,
      difficulty: 'Beginner',
      displayOrder: course.order || idx + 1,
      prerequisites: [],
      estimatedDuration: '45 mins',
      learningObjectives: [
        'Master traditional greetings and etiquette',
        'Learn basic self-introduction',
        'Identify sacred nature and kinship words',
      ],
      status: 'published',
      createdBy: 'super_admin_seed',
      updatedBy: 'super_admin_seed',
      createdAt: '2026-01-20T00:00:00Z',
      updatedAt: now,
    }));

    // 3. Seed Lessons
    this.lessons = INITIAL_LESSONS.map((lesson) => ({
      lessonId: lesson.lessonId,
      moduleId: lesson.courseId,
      languageId: lesson.languageId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      difficulty: 'Beginner',
      estimatedDuration: '10 mins',
      learningObjectives: ['Pronounce key terms correctly', 'Recognize native scripts'],
      vocabularyIntro: ['Johar', 'Hese', 'Enam'],
      culturalInsight: 'Traditional greeting honoring life and creation.',
      xpReward: lesson.xpReward || 20,
      status: lesson.isPublished ? 'published' : 'draft',
      requiredLessonId: lesson.order > 1 ? `mun_l${lesson.order - 1}` : null,
      createdBy: 'super_admin_seed',
      updatedBy: 'super_admin_seed',
      createdAt: '2026-01-22T00:00:00Z',
      updatedAt: now,
    }));

    // 4. Seed Questions (Exercises)
    Object.entries(INITIAL_EXERCISES).forEach(([lessonId, exList]) => {
      (exList as Array<Record<string, unknown>>).forEach((ex, idx) => {
        const qType: QuestionType = (ex.type as QuestionType) || 'multiple_choice';
        this.questions.push({
          questionId: (ex.exerciseId as string) || `q_${uuidv4().substring(0, 8)}`,
          lessonId,
          moduleId: 'course_mundari_101',
          languageId: 'mundari',
          questionText: (ex.prompt as string) || 'Choose the correct meaning:',
          questionType: qType,
          difficulty: 'easy',
          options: (ex.options as string[]) || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: (ex.correctAnswer as string | string[]) || 'Option B',
          explanation: (ex.explanation as string) || 'Standard traditional term.',
          hint: 'Remember what was taught in the vocabulary introduction.',
          tribalWord: (ex.tribalWord as string) || 'Johar',
          nativeScript: (ex.nativeScript as string) || 'जोहार',
          transliteration: (ex.transliteration as string) || 'Johar',
          englishMeaning: (ex.englishMeaning as string) || 'Greetings of respect',
          hindiMeaning: (ex.hindiMeaning as string) || 'अभिवादन / प्रणाम',
          xpReward: 10,
          sequence: (ex.order as number) || idx + 1,
          status: 'published',
          createdBy: 'super_admin_seed',
          updatedBy: 'super_admin_seed',
          createdAt: '2026-01-25T00:00:00Z',
          updatedAt: now,
        });
      });
    });

    // Add comprehensive sample questions for all 12 types so admin can manage them immediately
    this.addSampleQuestionsForTwelveTypes();

    // 5. Seed Vocabulary
    this.vocabulary = INITIAL_DICTIONARY.map((dict, idx) => ({
      vocabularyId: dict.vocabularyId || `dict_${idx + 1}`,
      languageId: dict.languageId,
      moduleId: 'course_mundari_101',
      word: dict.word,
      nativeScript: dict.nativeScript || '',
      transliteration: dict.transliteration,
      englishMeaning: dict.englishMeaning,
      hindiMeaning: dict.hindiMeaning,
      partOfSpeech: 'greeting',
      pronunciationAudioText: dict.transliteration,
      category: (dict.category as AdminVocabulary['category']) || 'Greetings',
      exampleSentence: dict.exampleSentence || {
        tribal: 'Sanam hopon ko johar!',
        transliteration: 'Sanam hopon ko johar!',
        translation: 'Greetings to all people!',
      },
      culturalContext: 'Used by community elders during Sarhul and family gatherings.',
      contributor: 'Guru Gomke Cultural Trust',
      verificationStatus: 'verified',
      isFeatured: true,
      isPublished: true,
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: now,
    }));

    // Add extra vocabulary terms
    this.vocabulary.push(
      {
        vocabularyId: 'dict_mun_sal',
        languageId: 'mundari',
        word: 'Sarjom',
        nativeScript: 'सारजोम',
        transliteration: 'Sarjom',
        englishMeaning: 'Sal Tree (Shorea robusta) - The Sacred Tree',
        hindiMeaning: 'सखुआ / साल का वृक्ष',
        partOfSpeech: 'noun',
        pronunciationAudioText: 'Sar-jom',
        category: 'Nature',
        exampleSentence: {
          tribal: 'Sarjom baha re baha bonga hobaoa.',
          transliteration: 'Sarjom baha re baha bonga hobaoa.',
          translation: 'When the Sal tree blossoms, the spring flower festival begins.',
        },
        culturalContext: 'Sal tree blossoms are the central symbol of the Sarhul festival.',
        contributor: 'Prof. Ramdayal Munda Institute',
        verificationStatus: 'verified',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-02-05T00:00:00Z',
        updatedAt: now,
      },
      {
        vocabularyId: 'dict_san_bir',
        languageId: 'santali',
        word: 'ᱵᱤᱨ (Bir)',
        nativeScript: 'ᱵᱤᱨ',
        transliteration: 'Bir',
        englishMeaning: 'Forest, Woods, Living Nature',
        hindiMeaning: 'जंगल, वन',
        partOfSpeech: 'noun',
        pronunciationAudioText: 'Beer',
        category: 'Nature',
        exampleSentence: {
          tribal: 'ᱵᱤᱨ ᱫᱚ ᱟᱞᱮᱭᱟᱜ ᱟᱭᱳ ᱠᱟᱱᱟ (Bir do aleyag ayo kana)',
          transliteration: 'Bir do aleyag ayo kana',
          translation: 'The forest is our sacred nurturing mother.',
        },
        culturalContext: 'Central principle of tribal environmental conservation.',
        contributor: 'Santali Sahitya Parishad',
        verificationStatus: 'verified',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-02-08T00:00:00Z',
        updatedAt: now,
      }
    );

    // 6. Seed Contributions with Multi-Stage Workflow
    this.contributions = [
      {
        contributionId: 'contrib_101',
        uid: 'usr_elder_sukra',
        authorName: 'Sukra Oraon (Village Elder)',
        authorEmail: 'sukra.oraon@vanisetu.org',
        languageId: 'kurukh',
        contentType: 'story',
        title: 'The Origin of the Karam Branch Dance',
        content: 'Our ancestors tell that during the great drought, two brothers Karma and Dharma kept vigil by the sacred branch...',
        tribalText: 'Karma Dharma digha padda re khekel bachao bachaoge...',
        translation: 'Karma and Dharma protected the mother earth and rain blessed the valley once again.',
        culturalContext: 'Sung during the Bhado moon harvest festival.',
        region: 'Ranchi, Jharkhand',
        status: 'pending_review',
        likesCount: 12,
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        contributionId: 'contrib_102',
        uid: 'usr_anita_ho',
        authorName: 'Anita Bodra',
        authorEmail: 'anita.bodra@vanisetu.org',
        languageId: 'ho',
        contentType: 'word',
        title: 'New Vocabulary: "Mage Parab" (Harvest Festival)',
        content: 'Word: Mage Parab — Annual thanksgiving feast celebrated with traditional flutes (Rutu).',
        tribalText: 'ᱢᱟᱜᱮ ᱯᱚᱨᱚᱵᱽ',
        translation: 'Mage Harvest Thanksgiving Festival',
        culturalContext: 'Celebrated in January when granaries are full.',
        region: 'Chaibasa, Jharkhand',
        status: 'under_review',
        reviewerId: 'rev_shanti_munda',
        reviewerName: 'Shanti Munda',
        reviewNotes: 'Verified pronunciation with Chaibasa elders committee.',
        likesCount: 8,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        contributionId: 'contrib_103',
        uid: 'usr_soma_munda',
        authorName: 'Soma Munda (Tribal Folklorist)',
        authorEmail: 'soma.munda@vanisetu.org',
        languageId: 'mundari',
        contentType: 'story',
        title: 'The Legend of Singbonga and the Seven Brothers',
        content: 'Long before iron was forged in the hills, the Munda ancestors lived along the lush valleys of the Chota Nagpur plateau...',
        tribalText: 'Singbonga do buru chotan re biridjana, da\' do jorna leka lingijana.',
        translation: 'Singbonga arose on the sacred hill, and life-giving water flowed like an eternal brook.',
        culturalContext: 'Told to children during the summer harvest to instill reverence for water conservation.',
        region: 'Khunti, Jharkhand',
        status: 'approved',
        reviewerId: 'admin_super_1',
        reviewerName: 'Super Admin',
        reviewNotes: 'Authentic folktale verified against Ramdayal Munda oral archives.',
        likesCount: 148,
        createdAt: '2026-04-12T10:00:00Z',
        reviewedAt: '2026-04-14T11:00:00Z',
      },
    ];

    // 7. Seed Admin & Learner Users
    this.users = [
      {
        uid: 'admin_super_1',
        name: 'Raaj (Lead Administrator)',
        email: 'admin@vanisetu.org',
        role: 'super_admin',
        status: 'active',
        selectedLanguage: 'santali',
        totalXP: 1450,
        currentStreak: 18,
        longestStreak: 25,
        dailyGoal: 50,
        completedLessons: ['mun_l1', 'mun_l2', 'mun_l3', 'san_l1'],
        unlockedAchievements: ['ach_first_steps', 'ach_streak_3', 'ach_streak_7'],
        contributionsCount: 14,
        createdAt: '2026-01-01T00:00:00Z',
        lastActiveAt: now,
      },
      {
        uid: 'content_admin_priya',
        name: 'Priyanka Munda (Curator)',
        email: 'priyanka@vanisetu.org',
        role: 'content_admin',
        status: 'active',
        selectedLanguage: 'mundari',
        totalXP: 980,
        currentStreak: 12,
        longestStreak: 15,
        dailyGoal: 50,
        completedLessons: ['mun_l1', 'mun_l2'],
        unlockedAchievements: ['ach_first_steps', 'ach_streak_7'],
        contributionsCount: 22,
        createdAt: '2026-01-10T00:00:00Z',
        lastActiveAt: now,
      },
      {
        uid: 'rev_shanti_munda',
        name: 'Shanti Munda (Elder Reviewer)',
        email: 'shanti.reviewer@vanisetu.org',
        role: 'language_reviewer',
        status: 'active',
        selectedLanguage: 'mundari',
        totalXP: 640,
        currentStreak: 8,
        longestStreak: 10,
        dailyGoal: 30,
        completedLessons: ['mun_l1'],
        unlockedAchievements: ['ach_first_steps'],
        contributionsCount: 9,
        createdAt: '2026-01-15T00:00:00Z',
        lastActiveAt: now,
      },
      {
        uid: 'mod_birsa_topno',
        name: 'Birsa Topno (Community Moderator)',
        email: 'birsa.mod@vanisetu.org',
        role: 'moderator',
        status: 'active',
        selectedLanguage: 'ho',
        totalXP: 510,
        currentStreak: 5,
        longestStreak: 8,
        dailyGoal: 40,
        completedLessons: ['ho_l1'],
        unlockedAchievements: ['ach_first_steps'],
        contributionsCount: 5,
        createdAt: '2026-01-20T00:00:00Z',
        lastActiveAt: now,
      },
      {
        uid: 'learner_amit_kumar',
        name: 'Amit Kumar',
        email: 'amit.learner@gmail.com',
        role: 'learner',
        status: 'active',
        selectedLanguage: 'santali',
        totalXP: 185,
        currentStreak: 4,
        longestStreak: 6,
        dailyGoal: 50,
        completedLessons: ['san_l1'],
        unlockedAchievements: ['ach_first_steps'],
        contributionsCount: 1,
        createdAt: '2026-02-14T00:00:00Z',
        lastActiveAt: now,
      },
      {
        uid: 'learner_suspended_demo',
        name: 'Flagged User (Demo)',
        email: 'flagged@example.com',
        role: 'learner',
        status: 'suspended',
        selectedLanguage: 'kurukh',
        totalXP: 20,
        currentStreak: 0,
        longestStreak: 1,
        dailyGoal: 30,
        completedLessons: [],
        unlockedAchievements: [],
        contributionsCount: 0,
        createdAt: '2026-03-01T00:00:00Z',
        lastActiveAt: '2026-03-02T00:00:00Z',
      },
    ];

    // 8. Seed Media Library
    this.media = [
      {
        mediaId: 'med_logo_emblem',
        name: 'vanisetu-transparent-emblem.png',
        type: 'image',
        url: '/logo.png',
        sizeBytes: 98505,
        mimeType: 'image/png',
        category: 'language',
        usedInCount: 12,
        uploadedBy: 'admin_super_1',
        createdAt: '2026-02-01T00:00:00Z',
      },
      {
        mediaId: 'med_white_badge',
        name: 'vanisetu-white-badge.png',
        type: 'icon',
        url: '/favicon.png',
        sizeBytes: 129247,
        mimeType: 'image/png',
        category: 'language',
        usedInCount: 6,
        uploadedBy: 'admin_super_1',
        createdAt: '2026-02-01T00:00:00Z',
      },
      {
        mediaId: 'med_johar_audio',
        name: 'mundari-johar-elder-pronunciation.mp3',
        type: 'audio',
        url: 'https://actions.google.com/sounds/v1/human_voices/gentle_greeting.ogg',
        sizeBytes: 245100,
        mimeType: 'audio/mp3',
        category: 'pronunciation',
        languageId: 'mundari',
        usedInCount: 4,
        uploadedBy: 'content_admin_priya',
        createdAt: '2026-02-10T00:00:00Z',
      },
      {
        mediaId: 'med_sarhul_illustration',
        name: 'sarhul-sal-tree-blooming.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
        sizeBytes: 412800,
        mimeType: 'image/jpeg',
        category: 'culture',
        languageId: 'mundari',
        usedInCount: 3,
        uploadedBy: 'content_admin_priya',
        createdAt: '2026-02-12T00:00:00Z',
      },
    ];

    // 9. Seed Admin Notifications
    this.notifications = [
      {
        notificationId: 'notif_1',
        type: 'contribution',
        title: 'New Oral Folktale Submitted',
        message: 'Sukra Oraon submitted "The Origin of the Karam Branch Dance" in Kurukh.',
        link: '/admin/contributions',
        entityType: 'contribution',
        entityId: 'contrib_101',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        notificationId: 'notif_2',
        type: 'review_task',
        title: 'Elder Review Pending',
        message: 'Anita Bodra submitted a new Ho vocabulary term awaiting verification.',
        link: '/admin/contributions',
        entityType: 'contribution',
        entityId: 'contrib_102',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        notificationId: 'notif_3',
        type: 'system',
        title: 'Platform Milestone Achieved',
        message: 'Platform reached 7,500+ verified vocabulary searches this week.',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];

    // 10. Seed Initial Audit Logs
    this.auditLogs = [
      {
        logId: 'log_001',
        adminId: 'admin_super_1',
        adminName: 'Raaj (Lead Administrator)',
        adminRole: 'super_admin',
        action: 'APPROVE_CONTRIBUTION',
        entityType: 'contribution',
        entityId: 'contrib_103',
        newValue: { status: 'approved', likesCount: 148 },
        reason: 'Verified against Ramdayal Munda oral traditions archives',
        ipAddress: '127.0.0.1',
        timestamp: '2026-04-14T11:00:00Z',
      },
      {
        logId: 'log_002',
        adminId: 'admin_super_1',
        adminName: 'Raaj (Lead Administrator)',
        adminRole: 'super_admin',
        action: 'UPDATE_PLATFORM_SETTINGS',
        entityType: 'settings',
        entityId: 'platform_settings',
        newValue: { platformName: 'VANISETU', defaultLanguage: 'mundari' },
        reason: 'Official platform launch configuration',
        ipAddress: '127.0.0.1',
        timestamp: '2026-04-15T09:30:00Z',
      },
    ];
  }

  // Helper: Seed sample questions for all 12 question types
  private addSampleQuestionsForTwelveTypes() {
    const samples: Partial<AdminQuestion>[] = [
      {
        questionText: 'Which of the following are traditional harvest celebrations? (Select all that apply)',
        questionType: 'multiple_select',
        difficulty: 'medium',
        options: ['Sarhul', 'Karam', 'Mage Parab', 'Diwali'],
        correctAnswer: ['Sarhul', 'Karam', 'Mage Parab'],
        explanation: 'Sarhul, Karam, and Mage Parab are indigenous seasonal thanksgiving celebrations.',
      },
      {
        questionText: 'Complete the sentence: "Sanam hopon ko ______!" (Greetings to all people!)',
        questionType: 'fill_blank',
        difficulty: 'easy',
        options: ['johar', 'da', 'bir', 'buru'],
        correctAnswer: 'johar',
        explanation: 'Johar is the respectful greeting used for all kin.',
      },
      {
        questionText: 'Translate "The forest is our sacred mother" into Santali:',
        questionType: 'translation',
        difficulty: 'medium',
        correctAnswer: 'Bir do aleyag ayo kana',
        explanation: 'In Santali: Bir = Forest, ayo = Mother.',
      },
      {
        questionText: 'Match each tribal word with its English meaning:',
        questionType: 'match_pairs',
        difficulty: 'medium',
        pairs: [
          { tribal: 'Johar', translation: 'Respectful Greetings' },
          { tribal: 'Bir', translation: 'Sacred Forest' },
          { tribal: 'Da', translation: 'Life-giving Water' },
          { tribal: 'Buru', translation: 'Great Mountain' },
        ],
        correctAnswer: ['Johar:Respectful Greetings', 'Bir:Sacred Forest', 'Da:Life-giving Water', 'Buru:Great Mountain'],
        explanation: 'Core indigenous nature vocabulary.',
      },
      {
        questionText: 'Arrange the words to form a respectful greeting in Mundari:',
        questionType: 'word_arrangement',
        difficulty: 'medium',
        options: ['Am', 'cheleka', 'menama?'],
        correctAnswer: ['Am', 'cheleka', 'menama?'],
        explanation: 'Am (You) + cheleka (how) + menama? (are you) = How are you?',
      },
      {
        questionText: 'Listen to the audio and identify the spoken greeting:',
        questionType: 'listening_comprehension',
        difficulty: 'easy',
        audioPronunciationText: 'Johar',
        options: ['Johar', 'Sarjom', 'Enam', 'Hese'],
        correctAnswer: 'Johar',
        explanation: 'The speaker clearly pronounced the two syllables of "Jo-har".',
      },
      {
        questionText: 'Speak the word "Johar" clearly into your microphone:',
        questionType: 'audio_pronunciation',
        difficulty: 'easy',
        tribalWord: 'Johar',
        correctAnswer: 'Johar',
        explanation: 'Phonetic emphasis should be on the open "har" sound with joined hands.',
      },
      {
        questionText: 'Identify the sacred tree depicted in this cultural illustration:',
        questionType: 'image_based',
        difficulty: 'medium',
        imageURL: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
        options: ['Sal Tree (Sarjom)', 'Banyan Tree', 'Oak Tree', 'Pine Tree'],
        correctAnswer: 'Sal Tree (Sarjom)',
        explanation: 'The Sal tree (Shorea robusta) is revered in the Sarna sacred groves.',
      },
      {
        questionText: 'True or False: In tribal worldview, the forest is treated as a commercial resource to be exploited.',
        questionType: 'true_false',
        difficulty: 'easy',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'False. The forest is treated as an elder kin and maternal shelter to be cherished and protected.',
      },
      {
        questionText: 'What is the indigenous script created by Guru Gomke Pandit Raghunath Murmu for Santali?',
        questionType: 'short_answer',
        difficulty: 'easy',
        correctAnswer: 'Ol Chiki',
        explanation: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) was created in 1925 to accurately capture Santali phonetics.',
      },
      {
        questionText: 'Select the Ol Chiki written form for the greeting "Johar":',
        questionType: 'vocabulary_recognition',
        difficulty: 'medium',
        options: ['ᱡᱚᱦᱟᱨ', 'ᱵᱤᱨ', 'ᱫᱟᱜ', 'ᱥᱟᱨᱦᱟᱣ'],
        correctAnswer: 'ᱡᱚᱦᱟᱨ',
        explanation: 'ᱡᱚᱦᱟᱨ is the exact Ol Chiki script representation of Johar.',
      },
    ];

    samples.forEach((sample, i) => {
      this.questions.push({
        questionId: `q_sample_${i + 1}`,
        lessonId: 'mun_l1',
        moduleId: 'course_mundari_101',
        languageId: 'mundari',
        questionText: sample.questionText || '',
        questionType: sample.questionType as QuestionType,
        difficulty: sample.difficulty || 'easy',
        options: sample.options || [],
        correctAnswer: sample.correctAnswer || '',
        explanation: sample.explanation || '',
        pairs: sample.pairs,
        audioPronunciationText: sample.audioPronunciationText,
        imageURL: sample.imageURL,
        tribalWord: sample.tribalWord,
        xpReward: 15,
        sequence: this.questions.length + 1,
        status: 'published',
        createdBy: 'super_admin_seed',
        updatedBy: 'super_admin_seed',
        createdAt: '2026-02-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      });
    });
  }

  // Audit Logging Utility
  addAuditLog(entry: Omit<AuditLog, 'logId' | 'timestamp'>) {
    const log: AuditLog = {
      logId: 'log_' + uuidv4().substring(0, 8),
      ...entry,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 500 logs
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }

  // Version History Snapshot Utility
  saveVersion(entityType: VersionRecord['entityType'], entityId: string, snapshot: unknown, savedBy: string, summary: string) {
    const previousVersions = this.versionHistory.filter(
      (v) => v.entityType === entityType && v.entityId === entityId
    );
    const versionNumber = previousVersions.length + 1;
    const version: VersionRecord = {
      versionId: 'ver_' + uuidv4().substring(0, 8),
      entityType,
      entityId,
      versionNumber,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
      savedBy,
      changeSummary: summary,
      createdAt: new Date().toISOString(),
    };
    this.versionHistory.unshift(version);
    return version;
  }
}

export const adminStore = new AdminDataStore();
