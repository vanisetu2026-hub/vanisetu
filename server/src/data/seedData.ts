export interface TribalLanguage {
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
  sampleGreeting: string;
  sampleGreetingMeaning: string;
}

export const LANGUAGES: TribalLanguage[] = [
  {
    languageId: 'mundari',
    name: 'Mundari',
    nativeName: 'मुंडारी / Mundari',
    scriptName: 'Devanagari / Mundari Bani',
    region: 'Jharkhand, Odisha, West Bengal',
    description: 'An Austroasiatic language of the Munda people with ancestral oral poetry and Karam songs.',
    speakersCount: '1.2+ Million speakers',
    languageFamily: 'Austroasiatic (Munda branch)',
    contentStatus: 'sample_pending_verification',
    isActive: true,
    sampleGreeting: 'Johar',
    sampleGreetingMeaning: 'Greetings of respect and harmony',
  },
  {
    languageId: 'santali',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    scriptName: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    region: 'Jharkhand, Odisha, West Bengal, Assam',
    description: 'Eighth Schedule language written in the indigenous Ol Chiki script created by Pandit Raghunath Murmu.',
    speakersCount: '7.6+ Million speakers',
    languageFamily: 'Austroasiatic (Munda branch)',
    contentStatus: 'sample_pending_verification',
    isActive: true,
    sampleGreeting: 'ᱡᱚᱦᱟᱨ (Johar)',
    sampleGreetingMeaning: 'Traditional greeting honoring life and creation',
  },
  {
    languageId: 'ho',
    name: 'Ho',
    nativeName: 'ᱦᱳ / Ho',
    scriptName: 'Warang Citi (ᱣᱟᱨᱟᱝ ᱪᱤᱛᱤ)',
    region: 'Kolhan Region, Jharkhand & Mayurbhanj, Odisha',
    description: 'Spoken by the Ho tribal community with its indigenous Warang Citi script created by Lako Bodra.',
    speakersCount: '1.4+ Million speakers',
    languageFamily: 'Austroasiatic (Kherwarian)',
    contentStatus: 'sample_pending_verification',
    isActive: true,
    sampleGreeting: 'Johar',
    sampleGreetingMeaning: 'Reverent salutation',
  },
  {
    languageId: 'kurukh',
    name: 'Kurukh',
    nativeName: 'कुड़ुख़ (Kurux)',
    scriptName: 'Tolang Siki / Devanagari',
    region: 'Jharkhand, Chhattisgarh, Odisha, West Bengal',
    description: 'A major North Dravidian language of the Oraon people renowned for rich riddles and Sarhul songs.',
    speakersCount: '2.0+ Million speakers',
    languageFamily: 'Dravidian (North Dravidian)',
    contentStatus: 'sample_pending_verification',
    isActive: true,
    sampleGreeting: 'God Lagi (गोड़ लागी)',
    sampleGreetingMeaning: 'I touch your feet with deep respect',
  },
];

export const COURSES = [
  {
    courseId: 'course_mundari_101',
    languageId: 'mundari',
    title: 'Mundari for Beginners',
    description: 'Learn everyday greetings, respectful family terms, and nature expressions in Mundari.',
    level: 'Beginner',
    order: 1,
    totalLessons: 3,
  },
  {
    courseId: 'course_santali_101',
    languageId: 'santali',
    title: 'Santali & Ol Chiki Fundamentals',
    description: 'Discover conversational phrases and Ol Chiki vocabulary.',
    level: 'Beginner',
    order: 1,
    totalLessons: 3,
  },
  {
    courseId: 'course_ho_101',
    languageId: 'ho',
    title: 'Ho Language Essentials',
    description: 'Master everyday greetings and community phrases in Ho.',
    level: 'Beginner',
    order: 1,
    totalLessons: 3,
  },
  {
    courseId: 'course_kurukh_101',
    languageId: 'kurukh',
    title: 'Kurukh Step by Step',
    description: 'An engaging introduction to Oraon greetings, village life, and kinship expressions.',
    level: 'Beginner',
    order: 1,
    totalLessons: 3,
  },
];

export const LESSONS = [
  {
    lessonId: 'mun_l1',
    courseId: 'course_mundari_101',
    languageId: 'mundari',
    title: 'Simple Greetings (जोहार - Johar)',
    description: 'Start with fundamental greetings and asking how someone is doing.',
    order: 1,
    xpReward: 20,
    isPublished: true,
  },
  {
    lessonId: 'mun_l2',
    courseId: 'course_mundari_101',
    languageId: 'mundari',
    title: 'Farewells & Safe Journeys',
    description: 'Learn polite parting words and wishing safe travels.',
    order: 2,
    xpReward: 25,
    isPublished: true,
  },
  {
    lessonId: 'mun_l3',
    courseId: 'course_mundari_101',
    languageId: 'mundari',
    title: 'Introducing Yourself & Identity',
    description: 'Share your name, learn pronouns, and connect with people in the village.',
    order: 3,
    xpReward: 30,
    isPublished: true,
  },
];

export const EXERCISES: Record<string, unknown[]> = {
  'mun_l1': [
    {
      exerciseId: 'mun_l1_ex1',
      lessonId: 'mun_l1',
      type: 'learn_word',
      prompt: 'Learn this foundational greeting:',
      tribalWord: 'Johar',
      nativeScript: 'जोहार',
      transliteration: 'Johar',
      englishMeaning: 'Hello / Greetings / Respectful salutations',
      hindiMeaning: 'नमस्ते / जोहार / प्रणाम',
      correctAnswer: 'Johar',
      explanation: 'Johar is the universal indigenous greeting across Central India.',
      order: 1,
    },
    {
      exerciseId: 'mun_l1_ex2',
      lessonId: 'mun_l1',
      type: 'multiple_choice',
      prompt: 'What does "Johar" mean in Mundari?',
      options: ['Goodbye', 'Greetings / Hello', 'Thank you', 'Water'],
      correctAnswer: 'Greetings / Hello',
      explanation: 'Johar is the traditional respectful greeting used when meeting people.',
      order: 2,
    },
  ],
};

export const DICTIONARY = [
  {
    vocabularyId: 'dict_mun_1',
    languageId: 'mundari',
    word: 'Johar',
    nativeScript: 'जोहार',
    transliteration: 'Johar',
    englishMeaning: 'Traditional respectful greeting or salutation',
    hindiMeaning: 'नमस्ते, प्रणाम, पारंपरिक अभिवादन',
    category: 'Greetings',
    exampleSentence: {
      tribal: 'Sanam hopon ko johar!',
      transliteration: 'Sanam hopon ko johar!',
      translation: 'Greetings to all children and people of the land!',
    },
    verificationStatus: 'sample_pending_verification',
  },
  {
    vocabularyId: 'dict_san_1',
    languageId: 'santali',
    word: 'ᱡᱚᱦᱟᱨ (Johar)',
    nativeScript: 'ᱡᱚᱦᱟᱨ',
    transliteration: 'Johar',
    englishMeaning: 'Greetings, salutations of universal brotherhood',
    hindiMeaning: 'अभिवादन, जोहार',
    category: 'Greetings',
    exampleSentence: {
      tribal: 'ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩ ᱡᱚᱦᱟᱨ (Marang Buru Johar)',
      transliteration: 'Marang Buru Johar',
      translation: 'Salutations to Marang Buru, guardian of the hills.',
    },
    verificationStatus: 'sample_pending_verification',
  },
];

export const COMMUNITY_POSTS = [
  {
    contributionId: 'story_1',
    uid: 'system_curator_1',
    authorName: 'Soma Munda (Tribal Folklorist)',
    languageId: 'mundari',
    contentType: 'story',
    title: 'The Legend of Singbonga and the Seven Brothers',
    content: 'Long before iron was forged in the hills, the Munda ancestors lived along the lush valleys of the Chota Nagpur plateau...',
    tribalText: 'Singbonga do buru chotan re biridjana, da\' do jorna leka lingijana.',
    translation: 'Singbonga arose on the sacred hill, and life-giving water flowed like a eternal brook.',
    culturalContext: 'Told to children during the summer harvest to instill reverence for water conservation and respect for the Sun.',
    region: 'Khunti, Jharkhand',
    moderationStatus: 'approved',
    likesCount: 148,
    createdAt: '2026-04-12T10:00:00Z',
  },
];
