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

interface LocalAccountRecord extends UserProfile {
  password?: string;
}

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
const LOCAL_ACCOUNTS_KEY = 'vanisetu_registered_accounts';

const ADMIN_ACCOUNTS: Record<string, AdminRole | undefined> = {
  'admin@vanisetu.org': 'super_admin',
  'priyanka@vanisetu.org': 'content_admin',
  'shanti.reviewer@vanisetu.org': 'language_reviewer',
  'birsa.mod@vanisetu.org': 'moderator',
  'auditor@vanisetu.org': 'read_only_admin',
};

const VALID_ADMIN_PASSWORDS = ['admin2026', 'vanisetu2026', 'VANISETU_ADMIN_2026'];

// Helper to get all registered local accounts
const getLocalAccounts = (): LocalAccountRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Helper to save or update an account in local registry
const saveLocalAccount = (account: LocalAccountRecord) => {
  try {
    const accounts = getLocalAccounts();
    const index = accounts.findIndex(
      (a) => a.email.toLowerCase() === account.email.toLowerCase()
    );
    if (index >= 0) {
      accounts[index] = { ...accounts[index], ...account };
    } else {
      accounts.push(account);
    }
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Could not persist account locally:', err);
  }
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
                setLoading(false);
                return;
              }
            }
            // Firebase authenticated but no docSnap yet:
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
              isGuest: false,
            };
            if (db) {
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
              } catch (e) {
                console.warn('Could not setDoc on auth change:', e);
              }
            }
            setUser(defaultProfile);
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
        const hasAdminKey = sessionStorage.getItem('vanisetu_admin_key') === 'VANISETU_ADMIN_2026';
        const role = hasAdminKey ? 'super_admin' : (parsed.role || ADMIN_ACCOUNTS[emailKey] || 'learner');
        setUser({ ...parsed, role });
      } else {
        // Create an initial learner profile for instant learning exploration
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
      const isAdminPassword = VALID_ADMIN_PASSWORDS.includes(password.trim());

      // 1. Direct verification for known administrative staff accounts
      if (detectedRole !== 'learner' && isAdminPassword) {
        const adminProfile: UserProfile = {
          uid: 'usr_admin_' + btoa(emailKey).substring(0, 8),
          name: emailKey.split('@')[0].replace('.', ' ').toUpperCase(),
          email: emailKey,
          role: detectedRole,
          selectedLanguage: 'santali',
          totalXP: 1200,
          currentStreak: 14,
          longestStreak: 20,
          dailyGoal: 50,
          completedLessons: [],
          unlockedAchievements: [],
          createdAt: new Date().toISOString(),
          isGuest: false,
        };
        setUser(adminProfile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminProfile));
        sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
        localStorage.setItem('vanisetu_active_admin_role', detectedRole);
        return;
      }

      // 2. Check local accounts registry (offline / local development registration)
      const localAccounts = getLocalAccounts();
      const matchedLocal = localAccounts.find(
        (a) => a.email.toLowerCase() === emailKey && a.password === password
      );

      if (matchedLocal) {
        const profile: UserProfile = {
          uid: matchedLocal.uid,
          name: matchedLocal.name,
          email: matchedLocal.email,
          role: matchedLocal.role || detectedRole,
          selectedLanguage: matchedLocal.selectedLanguage || 'mundari',
          totalXP: matchedLocal.totalXP || 50,
          currentStreak: matchedLocal.currentStreak || 1,
          longestStreak: matchedLocal.longestStreak || 1,
          dailyGoal: matchedLocal.dailyGoal || 50,
          completedLessons: matchedLocal.completedLessons || [],
          unlockedAchievements: matchedLocal.unlockedAchievements || ['ach_first_steps'],
          createdAt: matchedLocal.createdAt || new Date().toISOString(),
          isGuest: false,
        };
        setUser(profile);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));

        if (profile.role && profile.role !== 'learner') {
          sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
          localStorage.setItem('vanisetu_active_admin_role', profile.role);
        } else {
          sessionStorage.removeItem('vanisetu_admin_key');
        }
        return;
      }

      // 3. Firebase authentication
      if (isFirebaseConfigured && auth) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, emailKey, password);
          if (db) {
            try {
              const docSnap = await getDoc(doc(db, 'users', userCred.user.uid));
              if (docSnap.exists()) {
                const profile = docSnap.data() as UserProfile;
                const updatedProfile: UserProfile = { ...profile, role: profile.role || detectedRole };
                setUser(updatedProfile);
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updatedProfile));
                return;
              }
            } catch (err) {
              console.warn('Firestore doc read error:', err);
            }
          }

          const defaultProfile: UserProfile = {
            uid: userCred.user.uid,
            name: userCred.user.displayName || emailKey.split('@')[0],
            email: emailKey,
            role: detectedRole,
            selectedLanguage: 'mundari',
            totalXP: 50,
            currentStreak: 1,
            longestStreak: 1,
            dailyGoal: 50,
            completedLessons: [],
            unlockedAchievements: ['ach_first_steps'],
            createdAt: new Date().toISOString(),
            isGuest: false,
          };
          setUser(defaultProfile);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultProfile));
          return;
        } catch (firebaseErr: unknown) {
          const errCode = (firebaseErr as { code?: string })?.code;
          if (errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
            throw new Error('Incorrect password. Please verify your credentials.');
          }
          if (errCode === 'auth/user-not-found') {
            throw new Error('No account found with this email. Please sign up first.');
          }
          if (errCode === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
          }
          // Check if email matched a local account with different password
          const emailMatched = localAccounts.find((a) => a.email.toLowerCase() === emailKey);
          if (emailMatched) {
            throw new Error('Incorrect password. Please verify your credentials.');
          }
          throw new Error('Invalid email or password. Please try again.');
        }
      }

      throw new Error('Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const emailKey = email.toLowerCase().trim();
      const detectedRole: AdminRole | 'learner' = ADMIN_ACCOUNTS[emailKey] || 'learner';

      // Check if already registered locally
      const localAccounts = getLocalAccounts();
      const existingLocal = localAccounts.find((a) => a.email.toLowerCase() === emailKey);

      let firebaseUid: string | null = null;

      // 1. Attempt Firebase Auth registration
      if (isFirebaseConfigured && auth) {
        try {
          const userCred = await createUserWithEmailAndPassword(auth, emailKey, password);
          firebaseUid = userCred.user.uid;
        } catch (firebaseErr: unknown) {
          const errCode = (firebaseErr as { code?: string })?.code;
          if (errCode === 'auth/email-already-in-use') {
            throw new Error('An account with this email already exists. Please log in.');
          }
          if (errCode === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
          }
          if (errCode === 'auth/weak-password') {
            throw new Error('Password must be at least 6 characters long.');
          }
          // If Firebase failed due to operation-not-allowed (auth provider not enabled in console)
          // or network error, log and gracefully fall back to local account creation:
          console.warn(
            'Firebase createUser failed (falling back to seamless local account registration):',
            firebaseErr
          );
        }
      }

      // If Firebase was not used or failed with a non-duplicate error, ensure email isn't duplicated locally
      if (!firebaseUid && existingLocal) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      const uid = firebaseUid || 'usr_' + Math.random().toString(36).substring(2, 10);
      const newProfile: UserProfile = {
        uid,
        name: name.trim(),
        email: emailKey,
        role: detectedRole,
        selectedLanguage: 'mundari',
        totalXP: 25,
        currentStreak: 1,
        longestStreak: 1,
        dailyGoal: 50,
        completedLessons: [],
        unlockedAchievements: ['ach_first_steps'],
        createdAt: new Date().toISOString(),
        isGuest: false,
      };

      // 2. If Firebase user created, attempt Firestore doc storage
      if (firebaseUid && db) {
        try {
          await setDoc(doc(db, 'users', firebaseUid), newProfile);
        } catch (firestoreErr) {
          console.warn('Firestore setDoc warning (saved locally):', firestoreErr);
        }
      }

      // 3. Persist in local accounts registry so user can always log back in
      saveLocalAccount({
        ...newProfile,
        password: password,
      });

      // 4. Set active user session
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
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error:', e);
      }
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

    // Update in local accounts registry as well
    const accounts = getLocalAccounts();
    const idx = accounts.findIndex((a) => a.uid === user.uid);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...updates };
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    }

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
