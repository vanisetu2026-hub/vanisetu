import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  UserProfile,
  CommunityContribution,
  VocabularyItem,
  TribalLanguage,
  Course,
  Lesson,
  Achievement,
} from '../types';
import {
  LANGUAGES,
  COURSES,
  LESSONS,
  DICTIONARY_ITEMS,
  COMMUNITY_STORIES,
  ACHIEVEMENTS,
} from '../data/tribalData';

// ----------------------------------------------------------------------------
// USER PROFILE & PROGRESS SYNC
// ----------------------------------------------------------------------------

export const syncUserProfileToFirestore = async (user: UserProfile): Promise<boolean> => {
  if (!isFirebaseConfigured || !db || user.isGuest) return false;

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        ...user,
        lastSyncedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Also update userProgress collection
    const progressRef = doc(db, 'userProgress', user.uid);
    await setDoc(
      progressRef,
      {
        uid: user.uid,
        totalXP: user.totalXP || 0,
        currentStreak: user.currentStreak || 0,
        longestStreak: user.longestStreak || 0,
        completedLessons: user.completedLessons || [],
        unlockedAchievements: user.unlockedAchievements || [],
        selectedLanguage: user.selectedLanguage || 'mundari',
        dailyGoal: user.dailyGoal || 50,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return true;
  } catch (err) {
    console.warn('Firebase user sync note (stored locally):', err);
    return false;
  }
};

export const fetchUserProfileFromFirestore = async (
  uid: string
): Promise<UserProfile | null> => {
  if (!isFirebaseConfigured || !db || !uid) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Could not fetch Firestore user profile:', err);
  }
  return null;
};

// ----------------------------------------------------------------------------
// COMMUNITY STORIES & FOLKTALES
// ----------------------------------------------------------------------------

export const fetchCommunityContributionsFromFirestore = async (): Promise<
  CommunityContribution[] | null
> => {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const q = query(
      collection(db, 'communityContributions'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((d) => d.data() as CommunityContribution);
    }
  } catch (err) {
    console.warn('Firestore community fetch error (using fallback):', err);
  }
  return null;
};

export const saveCommunityContributionToFirestore = async (
  contribution: CommunityContribution
): Promise<boolean> => {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const docRef = doc(db, 'communityContributions', contribution.contributionId);
    await setDoc(docRef, contribution, { merge: true });
    return true;
  } catch (err) {
    console.warn('Could not save contribution to Firestore:', err);
    return false;
  }
};

export const likeCommunityContributionInFirestore = async (
  contributionId: string,
  delta: number
): Promise<boolean> => {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const docRef = doc(db, 'communityContributions', contributionId);
    await updateDoc(docRef, {
      likesCount: increment(delta),
    });
    return true;
  } catch (err) {
    console.warn('Could not update likes count in Firestore:', err);
    return false;
  }
};

// ----------------------------------------------------------------------------
// VOCABULARY & DICTIONARY
// ----------------------------------------------------------------------------

export const fetchVocabularyFromFirestore = async (): Promise<VocabularyItem[] | null> => {
  if (!isFirebaseConfigured || !db) return null;

  try {
    const snap = await getDocs(collection(db, 'vocabulary'));
    if (!snap.empty) {
      return snap.docs.map((d) => d.data() as VocabularyItem);
    }
  } catch (err) {
    console.warn('Could not fetch vocabulary from Firestore:', err);
  }
  return null;
};

export const saveVocabularyItemToFirestore = async (
  item: VocabularyItem
): Promise<boolean> => {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const docRef = doc(db, 'vocabulary', item.vocabularyId);
    await setDoc(docRef, item, { merge: true });
    return true;
  } catch (err) {
    console.warn('Could not save vocabulary item to Firestore:', err);
    return false;
  }
};

// ----------------------------------------------------------------------------
// SEEDING UTILITY (Push initial tribal dataset to Firebase Cloud Firestore)
// ----------------------------------------------------------------------------

export interface SeedResult {
  languagesCount: number;
  coursesCount: number;
  lessonsCount: number;
  vocabularyCount: number;
  storiesCount: number;
  achievementsCount: number;
  success: boolean;
  message: string;
}

export const seedAllDataToFirestore = async (): Promise<SeedResult> => {
  if (!isFirebaseConfigured || !db) {
    return {
      languagesCount: 0,
      coursesCount: 0,
      lessonsCount: 0,
      vocabularyCount: 0,
      storiesCount: 0,
      achievementsCount: 0,
      success: false,
      message: 'Firebase is not configured in client/.env',
    };
  }

  try {
    // 1. Languages
    for (const lang of LANGUAGES) {
      await setDoc(doc(db, 'languages', lang.languageId), lang, { merge: true });
    }

    // 2. Courses
    for (const course of COURSES) {
      await setDoc(doc(db, 'courses', course.courseId), course, { merge: true });
    }

    // 3. Lessons
    for (const lesson of LESSONS) {
      await setDoc(doc(db, 'lessons', lesson.lessonId), lesson, { merge: true });
    }

    // 4. Vocabulary items (chunked in batches for Firestore max 500 limit)
    const vocabChunks = [];
    const chunkSize = 200;
    for (let i = 0; i < DICTIONARY_ITEMS.length; i += chunkSize) {
      vocabChunks.push(DICTIONARY_ITEMS.slice(i, i + chunkSize));
    }

    for (const chunk of vocabChunks) {
      const batch = writeBatch(db);
      for (const item of chunk) {
        const ref = doc(db, 'vocabulary', item.vocabularyId);
        batch.set(ref, item, { merge: true });
      }
      await batch.commit();
    }

    // 5. Community Stories
    for (const story of COMMUNITY_STORIES) {
      await setDoc(
        doc(db, 'communityContributions', story.contributionId),
        story,
        { merge: true }
      );
    }

    // 6. Achievements
    for (const ach of ACHIEVEMENTS) {
      await setDoc(doc(db, 'achievements', ach.achievementId), ach, { merge: true });
    }

    return {
      languagesCount: LANGUAGES.length,
      coursesCount: COURSES.length,
      lessonsCount: LESSONS.length,
      vocabularyCount: DICTIONARY_ITEMS.length,
      storiesCount: COMMUNITY_STORIES.length,
      achievementsCount: ACHIEVEMENTS.length,
      success: true,
      message: 'Successfully seeded all tribal curriculum and stories to Firebase Firestore!',
    };
  } catch (err) {
    console.error('Error seeding data to Firestore:', err);
    return {
      languagesCount: 0,
      coursesCount: 0,
      lessonsCount: 0,
      vocabularyCount: 0,
      storiesCount: 0,
      achievementsCount: 0,
      success: false,
      message: err instanceof Error ? err.message : 'Unknown Firestore error',
    };
  }
};
