import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AdminRole } from '../types';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  elevateToAdmin: (passcode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'vanisetu_user_session';

const ADMIN_ACCOUNTS: Record<string, AdminRole | undefined> = {
  'admin@vanisetu.org': 'super_admin',
  'priyanka@vanisetu.org': 'content_admin',
  'shanti.reviewer@vanisetu.org': 'language_reviewer',
  'birsa.mod@vanisetu.org': 'moderator',
  'auditor@vanisetu.org': 'read_only_admin',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session from localStorage or Firebase
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            if (db) {
              const docRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const profile = docSnap.data() as UserProfile;
                const emailKey = profile.email.toLowerCase();
                const role = profile.role || ADMIN_ACCOUNTS[emailKey] || 'learner';
                setUser({ ...profile, role });
              } else {
                const emailKey = (firebaseUser.email || '').toLowerCase();
                const role = ADMIN_ACCOUNTS[emailKey] || 'learner';
                const defaultProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
                  email: firebaseUser.email || '',
                  role,
                  selectedLanguage: 'mundari',
                  totalXP: 50,
                  currentStreak: 1,
                  longestStreak: 1,
                  dailyGoal: 50,
                  completedLessons: [],
                  unlockedAchievements: ['ach_first_steps'],
                  createdAt: new Date().toISOString(),
                };
                await setDoc(docRef, defaultProfile);
                setUser(defaultProfile);
              }
            }
          } catch (e) {
            console.error('Error fetching Firestore user:', e);
            fallbackToLocalStorage();
          }
        } else {
          fallbackToLocalStorage();
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      fallbackToLocalStorage();
      setLoading(false);
    }
  }, []);

  const fallbackToLocalStorage = () => {
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (localData) {
        const parsed = JSON.parse(localData) as UserProfile;
        const emailKey = (parsed.email || '').toLowerCase();
        // Check if admin key is also present
        const hasAdminKey = sessionStorage.getItem('vanisetu_admin_key') === 'VANISETU_ADMIN_2026';
        const role = hasAdminKey ? 'super_admin' : (parsed.role || ADMIN_ACCOUNTS[emailKey] || 'learner');
        setUser({ ...parsed, role });
      } else {
        // Create an initial learner profile for normal learning (role: 'learner')
        const defaultLearner: UserProfile = {
          uid: 'learner_' + Math.random().toString(36).substring(2, 9),
          name: 'Priyanka Munda',
          email: 'learner@vanisetu.org',
          role: 'learner',
          selectedLanguage: 'mundari',
          totalXP: 70,
          currentStreak: 2,
          longestStreak: 3,
          dailyGoal: 50,
          completedLessons: ['mun_l1'],
          unlockedAchievements: ['ach_first_steps'],
          createdAt: new Date().toISOString(),
          isGuest: false,
        };
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultLearner));
        setUser(defaultLearner);
      }
    } catch {
      // Ignore
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const emailKey = email.toLowerCase().trim();
      const detectedRole: AdminRole | 'learner' = ADMIN_ACCOUNTS[emailKey] || 'learner';

      if (isFirebaseConfigured && auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (db) {
          const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            const updatedProfile: UserProfile = { ...profile, role: profile.role || detectedRole };
            setUser(updatedProfile);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedProfile));
          }
        }
      } else {
        // Local auth
        const profile: UserProfile = {
          uid: 'usr_' + btoa(emailKey).substring(0, 10),
          name: emailKey.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Learner',
          email: emailKey,
          role: detectedRole,
          selectedLanguage: 'mundari',
          totalXP: 100,
          currentStreak: 2,
          longestStreak: 3,
          dailyGoal: 50,
          completedLessons: ['mun_l1'],
          unlockedAchievements: ['ach_first_steps'],
          createdAt: new Date().toISOString(),
          isGuest: false,
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }

      if (detectedRole !== 'learner') {
        sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
        localStorage.setItem('vanisetu_active_admin_role', detectedRole);
      } else {
        sessionStorage.removeItem('vanisetu_admin_key');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const emailKey = email.toLowerCase().trim();
      const detectedRole: AdminRole | 'learner' = ADMIN_ACCOUNTS[emailKey] || 'learner';

      const newProfile: UserProfile = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        name,
        email: emailKey,
        role: detectedRole,
        selectedLanguage: 'mundari',
        totalXP: 20,
        currentStreak: 1,
        longestStreak: 1,
        dailyGoal: 50,
        completedLessons: [],
        unlockedAchievements: ['ach_first_steps'],
        createdAt: new Date().toISOString(),
        isGuest: false,
      };

      if (isFirebaseConfigured && auth) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        newProfile.uid = userCred.user.uid;
        if (db) {
          await setDoc(doc(db, 'users', userCred.user.uid), newProfile);
        }
      }

      setUser(newProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));

      if (detectedRole !== 'learner') {
        sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
        localStorage.setItem('vanisetu_active_admin_role', detectedRole);
      } else {
        sessionStorage.removeItem('vanisetu_admin_key');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: 'Guest Learner',
      email: 'guest@vanisetu.org',
      role: 'learner',
      selectedLanguage: 'mundari',
      totalXP: 0,
      currentStreak: 1,
      longestStreak: 1,
      dailyGoal: 50,
      completedLessons: [],
      unlockedAchievements: [],
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
    sessionStorage.removeItem('vanisetu_admin_key');
    setUser(guestUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    sessionStorage.removeItem('vanisetu_admin_key');
    localStorage.removeItem('vanisetu_active_admin_role');
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setUser(null);
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));

    if (isFirebaseConfigured && db && !user.isGuest) {
      try {
        await updateDoc(doc(db, 'users', user.uid), updates);
      } catch (e) {
        console.warn('Could not update Firestore profile:', e);
      }
    }
  };

  const elevateToAdmin = (passcode: string): boolean => {
    const validKeys = ['VANISETU_ADMIN_2026', 'vanisetu2026', 'admin2026'];
    if (validKeys.includes(passcode.trim())) {
      sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
      localStorage.setItem('vanisetu_active_admin_role', 'super_admin');
      if (user) {
        const updated: UserProfile = { ...user, role: 'super_admin' };
        setUser(updated);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginAsGuest,
        logout,
        updateUser,
        elevateToAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
