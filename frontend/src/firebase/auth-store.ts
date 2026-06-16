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

interface AuthState {
  user: User | null;
  loading: boolean; // true até o Firebase confirmar o estado inicial de auth
  error: string | null;

  // ações
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  _init: () => void; // chamada uma vez na inicialização do app
}

async function syncUserWithBackend(name?: string) {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) return;

  await api.post('/api/auth/sync', { name }, { headers: { Authorization: `Bearer ${idToken}` } });
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  _init: () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
  },

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

  login: async (email, password) => {
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await syncUserWithBackend();
    } catch (err: any) {
      set({ error: err.code });
      throw err;
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  resetPassword: async (email) => {
    set({ error: null });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      set({ error: err.code });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
