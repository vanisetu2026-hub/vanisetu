import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AdminRole } from '../types';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  signInWithGoogle: () => Promise<void>;
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

// Helper to get registered local accounts
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
      // Check redirect result if user returned from mobile Google redirect sign-in
      getRedirectResult(auth).catch((err) => {
        console.warn('Redirect sign-in check:', err);
      });

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const emailKey = (firebaseUser.email || '').toLowerCase().trim();
            const role = ADMIN_ACCOUNTS[emailKey] || 'learner';

            if (db) {
              const docRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const profile = docSnap.data() as UserProfile;
                const mergedProfile: UserProfile = {
                  ...profile,
                  name: profile.name || firebaseUser.displayName || 'Learner',
                  photoURL: firebaseUser.photoURL || profile.photoURL,
                  role: profile.role || role,
                };
                setUser(mergedProfile);
                localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mergedProfile));
                if (mergedProfile.role && mergedProfile.role !== 'learner') {
                  sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
                  localStorage.setItem('vanisetu_active_admin_role', mergedProfile.role);
                }
                setLoading(false);
                return;
              }
            }

            // Firebase authenticated but initial doc not created yet:
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || emailKey.split('@')[0] || 'Learner',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || undefined,
              role,
              selectedLanguage: 'mundari',
              totalXP: 0,
              currentStreak: 0,
              longestStreak: 0,
              dailyGoal: 50,
              completedLessons: [],
              unlockedAchievements: [],
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
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultProfile));
            if (role !== 'learner') {
              sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
              localStorage.setItem('vanisetu_active_admin_role', role);
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
        const hasAdminKey = sessionStorage.getItem('vanisetu_admin_key') === 'VANISETU_ADMIN_2026';
        const role = hasAdminKey ? 'super_admin' : (parsed.role || ADMIN_ACCOUNTS[emailKey] || 'learner');
        setUser({ ...parsed, role });
      } else {
        // No session stored — start clean as unauthenticated visitor
        setUser(null);
      }
    } catch {
      setUser(null);
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
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
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

      // 2. Check local accounts registry (offline / local registered accounts)
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
          totalXP: matchedLocal.totalXP || 0,
          currentStreak: matchedLocal.currentStreak || 0,
          longestStreak: matchedLocal.longestStreak || 0,
          dailyGoal: matchedLocal.dailyGoal || 50,
          completedLessons: matchedLocal.completedLessons || [],
          unlockedAchievements: matchedLocal.unlockedAchievements || [],
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
            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            dailyGoal: 50,
            completedLessons: [],
            unlockedAchievements: [],
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
          // Check if email matched a local account with wrong password
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
          console.warn('Firebase createUser fallback to local storage:', firebaseErr);
        }
      }

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
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        dailyGoal: 50,
        completedLessons: [],
        unlockedAchievements: [],
        createdAt: new Date().toISOString(),
        isGuest: false,
      };

      // 2. If Firebase user created, attempt Firestore doc storage
      if (firebaseUid && db) {
        try {
          await setDoc(doc(db, 'users', firebaseUid), newProfile);
        } catch (firestoreErr) {
          console.warn('Firestore setDoc warning:', firestoreErr);
        }
      }

      // 3. Persist in local accounts registry
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error('Firebase configuration missing. Please check VITE_FIREBASE_API_KEY in client/.env.');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      let userCred;
      try {
        userCred = await signInWithPopup(auth, provider);
      } catch (popupErr: unknown) {
        const errObj = popupErr as { code?: string; message?: string };
        if (errObj.code === 'auth/popup-closed-by-user') {
          throw new Error('Google Sign-In was cancelled.');
        }
        if (errObj.code === 'auth/popup-blocked') {
          // If popup is blocked by the browser, attempt redirect
          await signInWithRedirect(auth, provider);
          return;
        }
        if (errObj.code === 'auth/unauthorized-domain') {
          throw new Error(
            'The current domain is not authorized in Firebase. Please add this domain to Firebase Console > Authentication > Settings > Authorized domains.'
          );
        }
        if (errObj.code === 'auth/network-request-failed') {
          throw new Error('Network error connecting to Google. Please check your internet connection.');
        }
        throw new Error(errObj.message || 'Google Sign-In failed. Please try again.');
      }

      const firebaseUser = userCred.user;
      const emailKey = (firebaseUser.email || '').toLowerCase().trim();
      const detectedRole: AdminRole | 'learner' = ADMIN_ACCOUNTS[emailKey] || 'learner';

      let userProfile: UserProfile;

      if (db) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const existing = docSnap.data() as UserProfile;
            userProfile = {
              ...existing,
              name: existing.name || firebaseUser.displayName || 'Learner',
              photoURL: firebaseUser.photoURL || existing.photoURL,
              role: existing.role || detectedRole,
            };
            try {
              await updateDoc(docRef, {
                photoURL: userProfile.photoURL,
                lastLearningDate: new Date().toISOString(),
              });
            } catch (uErr) {
              console.warn('Could not update Firestore user doc:', uErr);
            }
          } else {
            userProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || emailKey.split('@')[0] || 'Learner',
              email: emailKey,
              photoURL: firebaseUser.photoURL || undefined,
              role: detectedRole,
              selectedLanguage: 'mundari',
              totalXP: 0,
              currentStreak: 0,
              longestStreak: 0,
              dailyGoal: 50,
              completedLessons: [],
              unlockedAchievements: [],
              createdAt: new Date().toISOString(),
              isGuest: false,
            };
            try {
              await setDoc(docRef, userProfile);
            } catch (sErr) {
              console.warn('Could not setDoc in Firestore:', sErr);
            }
          }
        } catch (dbErr) {
          console.warn('Firestore read error during Google sign-in:', dbErr);
          userProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || emailKey.split('@')[0] || 'Learner',
            email: emailKey,
            photoURL: firebaseUser.photoURL || undefined,
            role: detectedRole,
            selectedLanguage: 'mundari',
            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            dailyGoal: 50,
            completedLessons: [],
            unlockedAchievements: [],
            createdAt: new Date().toISOString(),
            isGuest: false,
          };
        }
      } else {
        userProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || emailKey.split('@')[0] || 'Learner',
          email: emailKey,
          photoURL: firebaseUser.photoURL || undefined,
          role: detectedRole,
          selectedLanguage: 'mundari',
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          dailyGoal: 50,
          completedLessons: [],
          unlockedAchievements: [],
          createdAt: new Date().toISOString(),
          isGuest: false,
        };
      }

      setUser(userProfile);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userProfile));

      if (detectedRole !== 'learner') {
        sessionStorage.setItem('vanisetu_admin_key', 'VANISETU_ADMIN_2026');
        localStorage.setItem('vanisetu_active_admin_role', detectedRole);
      } else {
        sessionStorage.removeItem('vanisetu_admin_key');
      }

      saveLocalAccount(userProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      name: 'Guest Learner',
      email: '',
      role: 'learner',
      selectedLanguage: 'mundari',
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
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

    // Update in local accounts registry
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
        signInWithGoogle,
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
