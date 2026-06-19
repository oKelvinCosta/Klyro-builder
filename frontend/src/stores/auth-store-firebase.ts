import { auth } from '@/firebase/firebase';
import { api } from '@/lib/axios';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { create } from 'zustand';

/**
 * Authentication state interface for Firebase authentication
 * @interface AuthState
 */
interface AuthState {
  /** Firebase user object or null if not authenticated */
  user: User | null;
  /** Loading state - true until Firebase confirms initial auth state */
  loading: boolean;
  /** Error message from Firebase authentication or null if no error */
  error: string | null;

  // Actions
  /** Register a new user with email and password */
  register: (email: string, password: string, name: string) => Promise<void>;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Logout current user */
  logout: () => Promise<void>;
  /** Send password reset email */
  resetPassword: (email: string) => Promise<void>;
  /** Clear error state */
  clearError: () => void;
  /** Initialize auth state listener - called once on app startup */
  _init: () => void;
}

/**
 * Syncs the Firebase user with the backend MongoDB database
 * @param name - Optional user name to sync with backend
 * @returns Promise that resolves when sync is complete
 */
async function syncUserWithBackend(name?: string) {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) return;
  await api.post('/auth/sync', { name });
}

/**
 * Validates the login with the backend by sending the Firebase ID token
 * @returns Promise that resolves when login validation is complete
 */
async function validateLogin() {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) return;
  await api.post('/auth/login');
}

/**
 * Firebase authentication store using Zustand
 * Manages Firebase authentication state and syncs with backend MongoDB
 *
 * @example
 * ```tsx
 * const { user, loading, login, logout } = useAuthStoreFirebase();\ * ```
 */
export const useAuthStoreFirebase = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  /**
   * Initialize Firebase auth state listener
   * Should be called once on app startup to listen for auth changes
   */
  _init: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
  },

  /**
   * Register a new user with email, password, and name
   * Creates Firebase auth user and syncs with backend MongoDB
   * @param email - User email address
   * @param password - User password
   * @param name - User display name
   * @throws Firebase auth error if registration fails
   */
  register: async (email, password, name) => {
    set({ error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await syncUserWithBackend(name);
    } catch (err: any) {
      set({ error: err.code });
      throw err;
    }
  },

  /**
   * Login with email and password
   * Authenticates with Firebase and validates with backend
   * @param email - User email address
   * @param password - User password
   * @throws Firebase auth error if login fails
   */
  login: async (email, password) => {
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await validateLogin();
    } catch (err: any) {
      set({ error: err.code });
      throw err;
    }
  },

  /**
   * Logout current user
   * Signs out from Firebase and clears user state
   * Note: React Query cache should be cleared separately if needed
   */
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  /**
   * Send password reset email to user
   * @param email - User email address to send reset link
   * @throws Firebase auth error if email sending fails
   */
  resetPassword: async (email) => {
    set({ error: null });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      set({ error: err.code });
      throw err;
    }
  },

  /**
   * Clear the current error state
   */
  clearError: () => set({ error: null }),
}));
