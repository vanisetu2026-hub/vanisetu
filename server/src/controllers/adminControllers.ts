import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AdminAuthenticatedRequest } from '../middleware/rbacMiddleware.js';
import {
  adminStore,
  AdminLanguage,
  AdminModule,
  AdminLesson,
  AdminQuestion,
  AdminVocabulary,
  AdminRole,
} from '../data/adminStore.js';

// 1. DASHBOARD OVERVIEW & STATS
export const getAdminStats = (req: AdminAuthenticatedRequest, res: Response) => {
  const { period = '30d' } = req.query;

  const totalUsers = adminStore.users.length;
  const activeUsers = adminStore.users.filter((u) => u.status === 'active').length;
  const newUsers = adminStore.users.filter((u) => {
    const created = new Date(u.createdAt).getTime();
    const daysAgo = period === 'today' ? 1 : period === '7d' ? 7 : 30;
    return Date.now() - created < daysAgo * 24 * 3600 * 1000;
  }).length;

  const totalLanguages = adminStore.languages.filter((l) => !l.isArchived).length;
  const publishedModules = adminStore.modules.filter((m) => m.status === 'published').length;
  const totalLessons = adminStore.lessons.filter((l) => l.status === 'published').length;
  const totalQuestions = adminStore.questions.length;
  const totalVocabulary = adminStore.vocabulary.filter((v) => v.isPublished).length;

  const pendingContributions = adminStore.contributions.filter(
    (c) => c.status === 'submitted' || c.status === 'pending_review' || c.status === 'under_review'
  ).length;
  const approvedContributions = adminStore.contributions.filter((c) => c.status === 'approved').length;
  const rejectedContributions = adminStore.contributions.filter((c) => c.status === 'rejected').length;

  // Aggregate language-wise stats
  const languageStats = adminStore.languages.map((lang) => {
    const langModules = adminStore.modules.filter((m) => m.languageId === lang.languageId).length;
    const langLessons = adminStore.lessons.filter((l) => l.languageId === lang.languageId).length;
    const langVocab = adminStore.vocabulary.filter((v) => v.languageId === lang.languageId).length;
    const langLearners = adminStore.users.filter((u) => u.selectedLanguage === lang.languageId).length;
    return {
      languageId: lang.languageId,
      name: lang.name,
      nativeName: lang.nativeName,
      modulesCount: langModules,
      lessonsCount: langLessons,
      vocabularyCount: langVocab,
      learnersCount: langLearners,
    };
  });

  // Recent administrative audit activities
  const recentActivities = adminStore.auditLogs.slice(0, 8);

  // Recent community review tasks
  const pendingReviewTasks = adminStore.contributions
    .filter((c) => c.status === 'pending_review' || c.status === 'under_review')
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      metrics: {
        totalUsers,
        activeUsers,
        newUsers,
        totalLanguages,
        publishedModules,
        totalLessons,
        totalQuestions,
        totalVocabularyEntries: totalVocabulary,
        pendingContributions,
        approvedContributions,
        rejectedContributions,
        totalLearningSessions: 3420,
        averageLessonCompletionRate: 84.5,
      },
      languageStats,
      recentActivities,
      pendingReviewTasks,
      recentUsers: adminStore.users.slice(0, 5),
    },
  });
};

// 2. LANGUAGE MANAGEMENT CONTROLLERS
export const getAdminLanguages = (_req: AdminAuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    count: adminStore.languages.length,
    data: adminStore.languages.sort((a, b) => a.displayOrder - b.displayOrder),
  });
};

export const createAdminLanguage = (req: AdminAuthenticatedRequest, res: Response) => {
  const {
    name,
    nativeName,
    scriptName,
    region,
    description,
    speakersCount,
    languageFamily,
    sampleGreeting,
    sampleGreetingMeaning,
    culturalNote,
    isFeatured = false,
  } = req.body;

  if (!name || !nativeName || !region) {
    res.status(400).json({ success: false, message: 'Name, nativeName, and region are required.' });
    return;
  }

  const languageId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const existing = adminStore.languages.find((l) => l.languageId === languageId);
  if (existing) {
    res.status(409).json({ success: false, message: `Language with ID "${languageId}" already exists.` });
    return;
  }

  const newLang: AdminLanguage = {
    languageId,
    name,
    nativeName,
    scriptName: scriptName || 'Native Script',
    region,
    description: description || '',
    speakersCount: speakersCount || 'Community Verified',
    languageFamily: languageFamily || 'Austroasiatic / Dravidian',
    contentStatus: 'verified',
    isActive: true,
    isFeatured: Boolean(isFeatured),
    displayOrder: adminStore.languages.length + 1,
    sampleGreeting: sampleGreeting || 'Johar',
    sampleGreetingMeaning: sampleGreetingMeaning || 'Traditional greeting',
    culturalNote: culturalNote || '',
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.languages.push(newLang);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CREATE_LANGUAGE',
    entityType: 'language',
    entityId: languageId,
    newValue: newLang,
    ipAddress: req.ip || '127.0.0.1',
  });

  adminStore.saveVersion('language', languageId, newLang, req.adminUser?.name || 'Admin', 'Initial creation');

  res.status(201).json({ success: true, message: 'Language created successfully.', data: newLang });
};

export const updateAdminLanguage = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const index = adminStore.languages.findIndex((l) => l.languageId === id);

  if (index === -1) {
    res.status(404).json({ success: false, message: 'Language not found.' });
    return;
  }

  const previous = { ...adminStore.languages[index] };
  const updated: AdminLanguage = {
    ...previous,
    ...req.body,
    languageId: id, // Immutable key
    updatedAt: new Date().toISOString(),
  };

  adminStore.languages[index] = updated;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_LANGUAGE',
    entityType: 'language',
    entityId: id,
    previousValue: previous,
    newValue: updated,
    ipAddress: req.ip || '127.0.0.1',
  });

  adminStore.saveVersion('language', id, updated, req.adminUser?.name || 'Admin', 'Updated language details');

  res.json({ success: true, message: 'Language updated successfully.', data: updated });
};

export const deleteAdminLanguage = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const lang = adminStore.languages.find((l) => l.languageId === id);

  if (!lang) {
    res.status(404).json({ success: false, message: 'Language not found.' });
    return;
  }

  // Referential integrity check: check if modules, lessons, or vocabulary exist
  const associatedModules = adminStore.modules.filter((m) => m.languageId === id);
  const associatedLessons = adminStore.lessons.filter((l) => l.languageId === id);
  const associatedVocab = adminStore.vocabulary.filter((v) => v.languageId === id);

  const hasDependencies = associatedModules.length > 0 || associatedLessons.length > 0 || associatedVocab.length > 0;

  if (hasDependencies && req.query.force !== 'true') {
    // Soft-archive by default to safeguard learning data
    lang.isArchived = true;
    lang.isActive = false;
    lang.updatedAt = new Date().toISOString();

    adminStore.addAuditLog({
      adminId: req.adminUser?.uid || 'admin',
      adminName: req.adminUser?.name || 'Administrator',
      adminRole: req.adminUser?.role || 'super_admin',
      action: 'ARCHIVE_LANGUAGE',
      entityType: 'language',
      entityId: id,
      reason: `Language has ${associatedModules.length} modules and ${associatedVocab.length} words. Archived instead of hard delete to preserve referential integrity.`,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Language "${lang.name}" contains active courses and vocabulary. It has been safely archived to prevent data loss.`,
      archived: true,
      data: lang,
    });
    return;
  }

  // Hard delete if forced or no dependencies
  adminStore.languages = adminStore.languages.filter((l) => l.languageId !== id);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'DELETE_LANGUAGE',
    entityType: 'language',
    entityId: id,
    previousValue: lang,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: `Language "${lang.name}" removed successfully.` });
};

// 3. MODULE MANAGEMENT CONTROLLERS
export const getAdminModules = (req: AdminAuthenticatedRequest, res: Response) => {
  const { languageId, status } = req.query;
  let list = [...adminStore.modules];

  if (languageId && languageId !== 'all') {
    list = list.filter((m) => m.languageId === languageId);
  }
  if (status && status !== 'all') {
    list = list.filter((m) => m.status === status);
  }

  res.json({ success: true, count: list.length, data: list.sort((a, b) => a.displayOrder - b.displayOrder) });
};

export const createAdminModule = (req: AdminAuthenticatedRequest, res: Response) => {
  const { languageId, title, description, difficulty = 'Beginner', estimatedDuration, learningObjectives } = req.body;

  if (!languageId || !title) {
    res.status(400).json({ success: false, message: 'languageId and title are required.' });
    return;
  }

  const moduleId = `mod_${languageId}_${uuidv4().substring(0, 6)}`;
  const newModule: AdminModule = {
    moduleId,
    languageId,
    title,
    description: description || '',
    difficulty,
    displayOrder: adminStore.modules.filter((m) => m.languageId === languageId).length + 1,
    prerequisites: req.body.prerequisites || [],
    estimatedDuration: estimatedDuration || '45 mins',
    learningObjectives: Array.isArray(learningObjectives) ? learningObjectives : ['Master fundamental greetings'],
    status: 'draft',
    createdBy: req.adminUser?.uid || 'admin',
    updatedBy: req.adminUser?.uid || 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.modules.push(newModule);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CREATE_MODULE',
    entityType: 'module',
    entityId: moduleId,
    newValue: newModule,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({ success: true, message: 'Module created as draft.', data: newModule });
};

export const updateAdminModule = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const idx = adminStore.modules.findIndex((m) => m.moduleId === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Module not found.' });
    return;
  }

  const previous = { ...adminStore.modules[idx] };
  const updated: AdminModule = {
    ...previous,
    ...req.body,
    moduleId: id,
    updatedBy: req.adminUser?.uid || 'admin',
    updatedAt: new Date().toISOString(),
  };

  adminStore.modules[idx] = updated;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_MODULE',
    entityType: 'module',
    entityId: id,
    previousValue: previous,
    newValue: updated,
    ipAddress: req.ip || '127.0.0.1',
  });

  adminStore.saveVersion('module', id, updated, req.adminUser?.name || 'Admin', 'Updated module details');

  res.json({ success: true, message: 'Module updated successfully.', data: updated });
};

export const duplicateAdminModule = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const source = adminStore.modules.find((m) => m.moduleId === id);
  if (!source) {
    res.status(404).json({ success: false, message: 'Source module not found.' });
    return;
  }

  const newModuleId = `mod_${source.languageId}_copy_${uuidv4().substring(0, 6)}`;
  const cloned: AdminModule = {
    ...source,
    moduleId: newModuleId,
    title: `${source.title} (Copy)`,
    status: 'draft',
    displayOrder: adminStore.modules.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.modules.push(cloned);
  res.status(201).json({ success: true, message: 'Module duplicated as draft.', data: cloned });
};

export const deleteAdminModule = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const target = adminStore.modules.find((m) => m.moduleId === id);
  if (!target) {
    res.status(404).json({ success: false, message: 'Module not found.' });
    return;
  }

  adminStore.modules = adminStore.modules.filter((m) => m.moduleId !== id);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'DELETE_MODULE',
    entityType: 'module',
    entityId: id,
    previousValue: target,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'Module deleted successfully.' });
};

// 4. LESSON MANAGEMENT CONTROLLERS
export const getAdminLessons = (req: AdminAuthenticatedRequest, res: Response) => {
  const { moduleId, languageId } = req.query;
  let list = [...adminStore.lessons];

  if (moduleId && moduleId !== 'all') {
    list = list.filter((l) => l.moduleId === moduleId);
  }
  if (languageId && languageId !== 'all') {
    list = list.filter((l) => l.languageId === languageId);
  }

  res.json({ success: true, count: list.length, data: list.sort((a, b) => a.order - b.order) });
};

export const createAdminLesson = (req: AdminAuthenticatedRequest, res: Response) => {
  const { moduleId, languageId, title, description, xpReward = 20, culturalInsight } = req.body;
  if (!moduleId || !title) {
    res.status(400).json({ success: false, message: 'moduleId and title are required.' });
    return;
  }

  const lessonId = `les_${languageId || 'tribal'}_${uuidv4().substring(0, 6)}`;
  const newLesson: AdminLesson = {
    lessonId,
    moduleId,
    languageId: languageId || 'mundari',
    title,
    description: description || '',
    order: adminStore.lessons.filter((l) => l.moduleId === moduleId).length + 1,
    difficulty: 'Beginner',
    estimatedDuration: '10 mins',
    learningObjectives: ['Oral pronunciation', 'Recognize indigenous terms'],
    vocabularyIntro: [],
    culturalInsight: culturalInsight || 'Traditional indigenous cultural context.',
    xpReward: Number(xpReward) || 20,
    status: 'draft',
    requiredLessonId: null,
    createdBy: req.adminUser?.uid || 'admin',
    updatedBy: req.adminUser?.uid || 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.lessons.push(newLesson);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CREATE_LESSON',
    entityType: 'lesson',
    entityId: lessonId,
    newValue: newLesson,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({ success: true, message: 'Lesson created.', data: newLesson });
};

export const updateAdminLesson = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const idx = adminStore.lessons.findIndex((l) => l.lessonId === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Lesson not found.' });
    return;
  }

  const previous = { ...adminStore.lessons[idx] };
  const updated: AdminLesson = {
    ...previous,
    ...req.body,
    lessonId: id,
    updatedBy: req.adminUser?.uid || 'admin',
    updatedAt: new Date().toISOString(),
  };

  adminStore.lessons[idx] = updated;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_LESSON',
    entityType: 'lesson',
    entityId: id,
    previousValue: previous,
    newValue: updated,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'Lesson updated.', data: updated });
};

export const deleteAdminLesson = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const target = adminStore.lessons.find((l) => l.lessonId === id);
  if (!target) {
    res.status(404).json({ success: false, message: 'Lesson not found.' });
    return;
  }

  adminStore.lessons = adminStore.lessons.filter((l) => l.lessonId !== id);
  res.json({ success: true, message: 'Lesson deleted.' });
};

// 5. QUESTION MANAGEMENT CONTROLLERS (Supports all 12 Question Types + Validation)
export const getAdminQuestions = (req: AdminAuthenticatedRequest, res: Response) => {
  const { lessonId, questionType, q } = req.query;
  let list = [...adminStore.questions];

  if (lessonId && lessonId !== 'all') {
    list = list.filter((item) => item.lessonId === lessonId);
  }
  if (questionType && questionType !== 'all') {
    list = list.filter((item) => item.questionType === questionType);
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    list = list.filter(
      (item) =>
        item.questionText.toLowerCase().includes(query) ||
        (item.tribalWord && item.tribalWord.toLowerCase().includes(query)) ||
        (item.englishMeaning && item.englishMeaning.toLowerCase().includes(query))
    );
  }

  res.json({ success: true, count: list.length, data: list.sort((a, b) => a.sequence - b.sequence) });
};

// Strict Prerequisite Vocabulary Registry per Lesson
export const LESSON_VOCABULARY_REGISTRY: Record<string, string[]> = {
  mun_l1: ['Johar', 'Bugigea', 'Haga', 'Marang'],
  mun_l2: ['Johar', 'Bugigea', 'Haga', 'Marang', 'Senenape', 'Orobu', 'Napama', 'Gapa'],
  mun_l3: ['Johar', 'Bugigea', 'Haga', 'Marang', 'Senenape', 'Orobu', 'Napama', 'Gapa', 'Aing', 'Am', 'Nutum', 'Disum'],
  san_l1: ['ᱡᱚᱦᱟᱨ', 'ᱵᱮᱥ', 'ᱥᱟᱨᱦᱟᱣ', 'ᱟᱹᱰᱤ', 'Johar', 'Besh', 'Sarhao', 'Adi'],
  san_l2: ['ᱡᱚᱦᱟᱨ', 'ᱵᱮᱥ', 'ᱥᱟᱨᱦᱟᱣ', 'ᱟᱹᱰᱤ', 'ᱵᱤᱨ', 'ᱫᱟᱜ', 'ᱥᱟᱨᱡᱚᱢ', 'ᱵᱟᱦᱟ', 'Bir', "Da'", 'Sarjom', 'Baha'],
  san_l3: ['ᱡᱚᱦᱟᱨ', 'ᱵᱮᱥ', 'ᱥᱟᱨᱦᱟᱣ', 'ᱟᱹᱰᱤ', 'ᱵᱤᱨ', 'ᱫᱟᱜ', 'ᱥᱟᱨᱡᱚᱢ', 'ᱵᱟᱦᱟ', 'ᱟᱭᱳ', 'ᱟᱯᱩ', 'ᱵᱚᱠᱚ', 'ᱚᱲᱟᱜ', 'Ayo', 'Apu', 'Boko', "Orak'"],
  ho_l1: ['Johar', 'Chilkan', 'Bugite', 'Menaña'],
  kur_l1: ['God Lagi', "Ek'as", 'Kode', 'Rahi'],
};

export const createAdminQuestion = (req: AdminAuthenticatedRequest, res: Response) => {
  const {
    lessonId,
    questionText,
    questionType,
    correctAnswer,
    options,
    explanation,
    hint,
    pairs,
    xpReward = 15,
  } = req.body;

  // Validation rules
  if (!questionText || !questionType || correctAnswer === undefined || correctAnswer === '') {
    res.status(400).json({
      success: false,
      message: 'questionText, questionType, and correctAnswer are required.',
    });
    return;
  }

  if ((questionType === 'multiple_choice' || questionType === 'multiple_select') && (!options || options.length < 2)) {
    res.status(400).json({
      success: false,
      message: 'Multiple choice/select questions must provide at least 2 options.',
    });
    return;
  }

  if (questionType === 'match_pairs' && (!pairs || pairs.length < 2)) {
    res.status(400).json({
      success: false,
      message: 'Matching pair questions must contain at least 2 valid pairs.',
    });
    return;
  }

  const allowed = LESSON_VOCABULARY_REGISTRY[lessonId || 'mun_l1'] || [];
  const targetWord = req.body.tribalWord || '';
  const isScaffolded = !targetWord || allowed.some(
    (w) => targetWord.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(targetWord.toLowerCase())
  );

  const questionId = `q_${uuidv4().substring(0, 8)}`;
  const newQuestion: AdminQuestion = {
    questionId,
    lessonId: lessonId || 'mun_l1',
    moduleId: req.body.moduleId || 'course_mundari_101',
    languageId: req.body.languageId || 'mundari',
    questionText,
    questionType,
    difficulty: req.body.difficulty || 'medium',
    options: options || [],
    correctAnswer,
    explanation: explanation || '',
    hint: hint || '',
    pairs: pairs || [],
    audioPronunciationText: req.body.audioPronunciationText || '',
    imageURL: req.body.imageURL || '',
    tribalWord: req.body.tribalWord || '',
    nativeScript: req.body.nativeScript || '',
    transliteration: req.body.transliteration || '',
    englishMeaning: req.body.englishMeaning || '',
    hindiMeaning: req.body.hindiMeaning || '',
    xpReward: Number(xpReward) || 15,
    sequence: adminStore.questions.length + 1,
    status: req.body.status || 'published',
    isScaffolded,
    createdBy: req.adminUser?.uid || 'admin',
    updatedBy: req.adminUser?.uid || 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.questions.push(newQuestion);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CREATE_QUESTION',
    entityType: 'question',
    entityId: questionId,
    newValue: newQuestion,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({ success: true, message: 'Question created successfully.', data: newQuestion });
};

export const updateAdminQuestion = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const idx = adminStore.questions.findIndex((q) => q.questionId === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Question not found.' });
    return;
  }

  const previous = { ...adminStore.questions[idx] };
  const targetLesson = req.body.lessonId || previous.lessonId || 'mun_l1';
  const allowed = LESSON_VOCABULARY_REGISTRY[targetLesson] || [];
  const targetWord = req.body.tribalWord !== undefined ? req.body.tribalWord : previous.tribalWord || '';
  const isScaffolded = !targetWord || allowed.some(
    (w) => targetWord.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(targetWord.toLowerCase())
  );

  const updated: AdminQuestion = {
    ...previous,
    ...req.body,
    isScaffolded,
    questionId: id,
    updatedBy: req.adminUser?.uid || 'admin',
    updatedAt: new Date().toISOString(),
  };

  adminStore.questions[idx] = updated;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_QUESTION',
    entityType: 'question',
    entityId: id,
    previousValue: previous,
    newValue: updated,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'Question updated.', data: updated });
};

export const deleteAdminQuestion = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  adminStore.questions = adminStore.questions.filter((q) => q.questionId !== id);
  res.json({ success: true, message: 'Question deleted.' });
};

export const bulkImportQuestions = (req: AdminAuthenticatedRequest, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'A non-empty array of questions is required.' });
    return;
  }

  let importedCount = 0;
  const errors: { row: number; error: string }[] = [];

  items.forEach((item, index) => {
    if (!item.questionText || !item.questionType || item.correctAnswer === undefined) {
      errors.push({ row: index + 1, error: 'Missing questionText, questionType, or correctAnswer' });
      return;
    }

    adminStore.questions.push({
      questionId: `q_bulk_${uuidv4().substring(0, 8)}`,
      lessonId: item.lessonId || 'mun_l1',
      moduleId: item.moduleId || 'course_mundari_101',
      languageId: item.languageId || 'mundari',
      questionText: item.questionText,
      questionType: item.questionType,
      difficulty: item.difficulty || 'medium',
      options: item.options || [],
      correctAnswer: item.correctAnswer,
      explanation: item.explanation || '',
      hint: item.hint || '',
      pairs: item.pairs || [],
      tribalWord: item.tribalWord || '',
      nativeScript: item.nativeScript || '',
      xpReward: Number(item.xpReward) || 15,
      sequence: adminStore.questions.length + 1,
      status: 'published',
      createdBy: req.adminUser?.uid || 'admin',
      updatedBy: req.adminUser?.uid || 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    importedCount++;
  });

  res.json({
    success: true,
    message: `Bulk import completed: ${importedCount} questions imported, ${errors.length} errors.`,
    importedCount,
    errors,
  });
};

// 6. VOCABULARY CONTROLLERS
export const getAdminVocabulary = (req: AdminAuthenticatedRequest, res: Response) => {
  const { languageId, category, q } = req.query;
  let list = [...adminStore.vocabulary];

  if (languageId && languageId !== 'all') {
    list = list.filter((v) => v.languageId === languageId);
  }
  if (category && category !== 'all') {
    list = list.filter((v) => v.category.toLowerCase() === String(category).toLowerCase());
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    list = list.filter(
      (v) =>
        v.word.toLowerCase().includes(query) ||
        v.transliteration.toLowerCase().includes(query) ||
        v.englishMeaning.toLowerCase().includes(query) ||
        v.hindiMeaning.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: list.length, data: list });
};

export const createAdminVocabulary = (req: AdminAuthenticatedRequest, res: Response) => {
  const { word, languageId, transliteration, englishMeaning, hindiMeaning, category, exampleSentence } = req.body;

  if (!word || !languageId || !englishMeaning) {
    res.status(400).json({ success: false, message: 'word, languageId, and englishMeaning are required.' });
    return;
  }

  const vocabularyId = `dict_${languageId.substring(0, 3)}_${uuidv4().substring(0, 6)}`;
  const newVocab: AdminVocabulary = {
    vocabularyId,
    languageId,
    word,
    nativeScript: req.body.nativeScript || '',
    transliteration: transliteration || word,
    englishMeaning,
    hindiMeaning: hindiMeaning || '',
    partOfSpeech: req.body.partOfSpeech || 'noun',
    pronunciationAudioText: req.body.pronunciationAudioText || transliteration || word,
    audioURL: req.body.audioURL || '',
    category: category || 'Everyday',
    exampleSentence: exampleSentence || {
      tribal: '',
      transliteration: '',
      translation: '',
    },
    culturalContext: req.body.culturalContext || '',
    contributor: req.adminUser?.name || 'Administrator',
    verificationStatus: 'verified',
    isFeatured: Boolean(req.body.isFeatured),
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminStore.vocabulary.unshift(newVocab);

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CREATE_VOCABULARY',
    entityType: 'vocabulary',
    entityId: vocabularyId,
    newValue: newVocab,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.status(201).json({ success: true, message: 'Vocabulary entry created.', data: newVocab });
};

export const updateAdminVocabulary = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const idx = adminStore.vocabulary.findIndex((v) => v.vocabularyId === id);
  if (idx === -1) {
    res.status(404).json({ success: false, message: 'Vocabulary entry not found.' });
    return;
  }

  const previous = { ...adminStore.vocabulary[idx] };
  const updated: AdminVocabulary = {
    ...previous,
    ...req.body,
    vocabularyId: id,
    updatedAt: new Date().toISOString(),
  };

  adminStore.vocabulary[idx] = updated;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_VOCABULARY',
    entityType: 'vocabulary',
    entityId: id,
    previousValue: previous,
    newValue: updated,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'Vocabulary entry updated.', data: updated });
};

export const deleteAdminVocabulary = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  adminStore.vocabulary = adminStore.vocabulary.filter((v) => v.vocabularyId !== id);
  res.json({ success: true, message: 'Vocabulary entry deleted.' });
};

// 7. COMMUNITY CONTRIBUTION VERIFICATION CONTROLLERS
export const getAdminContributions = (req: AdminAuthenticatedRequest, res: Response) => {
  const { status, languageId } = req.query;
  let list = [...adminStore.contributions];

  if (status && status !== 'all') {
    list = list.filter((c) => c.status === status);
  }
  if (languageId && languageId !== 'all') {
    list = list.filter((c) => c.languageId === languageId);
  }

  res.json({ success: true, count: list.length, data: list });
};

export const reviewAdminContribution = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, reviewNotes, rejectionReason, awardBonusXP = true } = req.body;

  const contribution = adminStore.contributions.find((c) => c.contributionId === id);
  if (!contribution) {
    res.status(404).json({ success: false, message: 'Contribution not found.' });
    return;
  }

  const previousStatus = contribution.status;
  contribution.status = status;
  contribution.reviewerId = req.adminUser?.uid || 'admin';
  contribution.reviewerName = req.adminUser?.name || 'Reviewer';
  contribution.reviewNotes = reviewNotes || contribution.reviewNotes;
  contribution.rejectionReason = rejectionReason || contribution.rejectionReason;
  contribution.reviewedAt = new Date().toISOString();

  // If approved: Automatically update/publish vocabulary or story
  if (status === 'approved') {
    if (contribution.contentType === 'word') {
      adminStore.vocabulary.unshift({
        vocabularyId: `dict_approved_${contribution.contributionId}`,
        languageId: contribution.languageId,
        word: contribution.title,
        nativeScript: contribution.tribalText || '',
        transliteration: contribution.title,
        englishMeaning: contribution.translation,
        hindiMeaning: '',
        partOfSpeech: 'phrase',
        pronunciationAudioText: contribution.title,
        category: 'Everyday',
        exampleSentence: {
          tribal: contribution.tribalText || contribution.content,
          transliteration: contribution.title,
          translation: contribution.translation,
        },
        culturalContext: contribution.culturalContext || 'Community verified tradition',
        contributor: contribution.authorName,
        verificationStatus: 'verified',
        isFeatured: false,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Reward contributor with XP
    if (awardBonusXP) {
      const author = adminStore.users.find((u) => u.uid === contribution.uid);
      if (author) {
        author.totalXP += 50;
        author.contributionsCount += 1;
      }
    }
  }

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: `REVIEW_CONTRIBUTION_${status.toUpperCase()}`,
    entityType: 'contribution',
    entityId: id,
    previousValue: { status: previousStatus },
    newValue: { status, reviewer: req.adminUser?.name, notes: reviewNotes },
    reason: reviewNotes || rejectionReason,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({
    success: true,
    message: `Contribution has been marked as ${status}. Contributor notified.`,
    data: contribution,
  });
};

// 8. USER MANAGEMENT CONTROLLERS
export const getAdminUsers = (req: AdminAuthenticatedRequest, res: Response) => {
  const { role, status, q } = req.query;
  let list = [...adminStore.users];

  if (role && role !== 'all') {
    list = list.filter((u) => u.role === role);
  }
  if (status && status !== 'all') {
    list = list.filter((u) => u.status === status);
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.uid.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, count: list.length, data: list });
};

export const updateAdminUserStatus = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const target = adminStore.users.find((u) => u.uid === id);
  if (!target) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  // Prevent suspending the last super admin
  if (target.role === 'super_admin' && status !== 'active') {
    const superAdminCount = adminStore.users.filter((u) => u.role === 'super_admin' && u.status === 'active').length;
    if (superAdminCount <= 1) {
      res.status(400).json({ success: false, message: 'Cannot suspend the primary Super Administrator.' });
      return;
    }
  }

  const previousStatus = target.status;
  target.status = status;

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: `USER_STATUS_${status.toUpperCase()}`,
    entityType: 'user',
    entityId: id,
    previousValue: { status: previousStatus },
    newValue: { status },
    reason: reason || 'Administrative action',
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: `User status changed to ${status}.`, data: target });
};

export const updateAdminUserRole = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  // Only Super Admin can change user roles
  if (req.adminUser?.role !== 'super_admin') {
    res.status(403).json({ success: false, message: 'Only Super Administrators can change user roles.' });
    return;
  }

  const target = adminStore.users.find((u) => u.uid === id);
  if (!target) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const previousRole = target.role;
  target.role = role as AdminRole | 'learner';

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'CHANGE_USER_ROLE',
    entityType: 'user',
    entityId: id,
    previousValue: { role: previousRole },
    newValue: { role },
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: `User role updated to ${role}.`, data: target });
};

// 9. PLATFORM SETTINGS CONTROLLERS
export const getAdminSettings = (_req: AdminAuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: adminStore.settings });
};

export const updateAdminSettings = (req: AdminAuthenticatedRequest, res: Response) => {
  if (req.adminUser?.role !== 'super_admin') {
    res.status(403).json({ success: false, message: 'Only Super Administrators can modify platform settings.' });
    return;
  }

  const previous = { ...adminStore.settings };
  adminStore.settings = {
    ...previous,
    ...req.body,
    updatedAt: new Date().toISOString(),
    updatedBy: req.adminUser?.name || 'Super Admin',
  };

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: 'UPDATE_SETTINGS',
    entityType: 'settings',
    entityId: 'platform_settings',
    previousValue: previous,
    newValue: adminStore.settings,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: 'Platform settings saved.', data: adminStore.settings });
};

// 10. MEDIA LIBRARY CONTROLLERS
export const getAdminMedia = (req: AdminAuthenticatedRequest, res: Response) => {
  const { type, category } = req.query;
  let list = [...adminStore.media];

  if (type && type !== 'all') {
    list = list.filter((m) => m.type === type);
  }
  if (category && category !== 'all') {
    list = list.filter((m) => m.category === category);
  }

  res.json({ success: true, count: list.length, data: list });
};

export const uploadAdminMedia = (req: AdminAuthenticatedRequest, res: Response) => {
  const { name, type = 'image', url, category = 'lesson', sizeBytes = 150000, mimeType = 'image/png' } = req.body;

  if (!name || !url) {
    res.status(400).json({ success: false, message: 'name and url are required.' });
    return;
  }

  const mediaId = `med_${uuidv4().substring(0, 8)}`;
  const item = {
    mediaId,
    name,
    type,
    url,
    sizeBytes: Number(sizeBytes) || 150000,
    mimeType,
    category,
    usedInCount: 0,
    uploadedBy: req.adminUser?.name || 'Administrator',
    createdAt: new Date().toISOString(),
  };

  adminStore.media.unshift(item);

  res.status(201).json({ success: true, message: 'Media uploaded and registered.', data: item });
};

export const deleteAdminMedia = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  adminStore.media = adminStore.media.filter((m) => m.mediaId !== id);
  res.json({ success: true, message: 'Media item deleted.' });
};

// 11. NOTIFICATIONS & ALERTS
export const getAdminNotifications = (_req: AdminAuthenticatedRequest, res: Response) => {
  res.json({ success: true, count: adminStore.notifications.length, data: adminStore.notifications });
};

export const markNotificationRead = (req: AdminAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notif = adminStore.notifications.find((n) => n.notificationId === id);
  if (notif) {
    notif.isRead = true;
  }
  res.json({ success: true, message: 'Notification marked as read.' });
};

// 12. AUDIT LOGS & VERSION HISTORY
export const getAdminAuditLogs = (req: AdminAuthenticatedRequest, res: Response) => {
  const { entityType, action } = req.query;
  let list = [...adminStore.auditLogs];

  if (entityType && entityType !== 'all') {
    list = list.filter((l) => l.entityType === entityType);
  }
  if (action && action !== 'all') {
    list = list.filter((l) => l.action.includes(String(action)));
  }

  res.json({ success: true, count: list.length, data: list });
};

export const getAdminVersionHistory = (req: AdminAuthenticatedRequest, res: Response) => {
  const { entityType, entityId } = req.params;
  const versions = adminStore.versionHistory.filter(
    (v) => v.entityType === entityType && v.entityId === entityId
  );
  res.json({ success: true, count: versions.length, data: versions });
};

export const rollbackAdminVersion = (req: AdminAuthenticatedRequest, res: Response) => {
  const { versionId } = req.params;
  const version = adminStore.versionHistory.find((v) => v.versionId === versionId);

  if (!version) {
    res.status(404).json({ success: false, message: 'Version record not found.' });
    return;
  }

  // Restore snapshot
  if (version.entityType === 'language') {
    const idx = adminStore.languages.findIndex((l) => l.languageId === version.entityId);
    if (idx !== -1) {
      adminStore.languages[idx] = version.snapshot as AdminLanguage;
    }
  } else if (version.entityType === 'module') {
    const idx = adminStore.modules.findIndex((m) => m.moduleId === version.entityId);
    if (idx !== -1) {
      adminStore.modules[idx] = version.snapshot as AdminModule;
    }
  }

  adminStore.addAuditLog({
    adminId: req.adminUser?.uid || 'admin',
    adminName: req.adminUser?.name || 'Administrator',
    adminRole: req.adminUser?.role || 'super_admin',
    action: `ROLLBACK_VERSION_${version.versionNumber}`,
    entityType: version.entityType,
    entityId: version.entityId,
    reason: `Restored version #${version.versionNumber}`,
    ipAddress: req.ip || '127.0.0.1',
  });

  res.json({ success: true, message: `Restored version #${version.versionNumber} successfully.` });
};
