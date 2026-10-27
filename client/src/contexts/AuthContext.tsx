import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'vanisetu_user_session';

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
                setUser(docSnap.data() as UserProfile);
              } else {
                const defaultProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner',
                  email: firebaseUser.email || '',
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
        setUser(JSON.parse(localData));
      } else {
        // Create an initial learner profile for instant frictionless exploration
        const guestUser: UserProfile = {
          uid: 'guest_' + Math.random().toString(36).substring(2, 9),
          name: 'Priyanka Munda',
          email: 'learner@vanisetu.org',
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
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
        setUser(guestUser);
      }
    } catch {
      // Ignore
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        if (db) {
          const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            setUser(profile);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          }
        }
      } else {
        // Fallback local auth for instant testing
        const profile: UserProfile = {
          uid: 'usr_' + btoa(email).substring(0, 10),
          name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Learner',
          email,
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
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile: UserProfile = {
          uid: userCred.user.uid,
          name,
          email,
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
        if (db) {
          await setDoc(doc(db, 'users', userCred.user.uid), newProfile);
        }
        setUser(newProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
      } else {
        const newProfile: UserProfile = {
          uid: 'usr_' + Math.random().toString(36).substring(2, 9),
          name,
          email,
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
        setUser(newProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
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
    setUser(guestUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestUser));
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
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
