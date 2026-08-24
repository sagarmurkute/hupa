import { create } from 'zustand';
import { authClient } from '@hupa/auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup' | 'account';
  
  setAuthModalOpen: (open: boolean, tab?: 'signin' | 'signup' | 'account') => void;
  setAuthModalTab: (tab: 'signin' | 'signup' | 'account') => void;
  setUser: (user: AuthUser | null, session: AuthSession | null) => void;
  checkSession: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalTab: 'signin',

  setAuthModalOpen: (open, tab = 'signin') =>
    set({ isAuthModalOpen: open, authModalTab: tab }),

  setAuthModalTab: (tab) => set({ authModalTab: tab }),

  setUser: (user, session) => set({ user, session, isLoading: false }),

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const sessionData = await authClient.getSession();
      if (sessionData && sessionData.data && sessionData.data.user) {
        set({
          user: sessionData.data.user as any,
          session: sessionData.data.session as any,
          isLoading: false,
        });
      } else {
        set({ user: null, session: null, isLoading: false });
      }
    } catch {
      set({ user: null, session: null, isLoading: false });
    }
  },

  signOutUser: async () => {
    try {
      await authClient.signOut();
      set({ user: null, session: null, isAuthModalOpen: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ user: null, session: null, isAuthModalOpen: false });
    }
  },
}));
