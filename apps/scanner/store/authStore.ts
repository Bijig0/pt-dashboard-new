import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isMockMode } from '../lib/supabase';
import {
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  getAuthErrorMessage,
} from '../types/auth';

interface AuthStore extends AuthState {
  // Actions
  initialize: () => Promise<(() => void) | undefined>;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

// Check if we're in a browser environment (not SSR)
const isBrowser = typeof window !== 'undefined';

// Timeout for auth initialization (prevents hanging)
const AUTH_INIT_TIMEOUT = 5000;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state - mark as initialized during SSR to prevent blocking
  user: null,
  session: null,
  isLoading: false,
  isInitialized: !isBrowser, // On server, consider initialized; client will re-initialize

  // Initialize auth state and set up listener
  initialize: async () => {
    // Skip if already initialized or not in browser
    if (get().isInitialized || !isBrowser) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });

    try {
      // Add timeout to prevent hanging when Supabase is not configured
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timed out')), AUTH_INIT_TIMEOUT);
      });

      const sessionPromise = supabase.auth.getSession();

      // Race between session fetch and timeout
      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise,
      ]) as Awaited<typeof sessionPromise>;

      if (error) {
        console.warn('[Auth] Error getting session:', error.message);
      }

      set({
        session: session ?? null,
        user: session?.user ?? null,
        isInitialized: true,
        isLoading: false,
      });

      // Listen for auth changes (only if we got this far)
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          set({
            session,
            user: session?.user ?? null,
          });
        });

        // Return cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (listenerError) {
        console.warn('[Auth] Failed to set up auth listener:', listenerError);
      }
    } catch (error) {
      // Handle timeout or other errors gracefully
      console.warn('[Auth] Initialization failed (app will work without auth):', error instanceof Error ? error.message : error);
      set({
        isInitialized: true,
        isLoading: false,
        session: null,
        user: null,
      });
    }
  },

  // Sign in with email and password
  signIn: async (credentials: SignInCredentials) => {
    set({ isLoading: true });

    try {
      if (isMockMode) {
        // Mock mode: simulate successful sign in
        console.log('Mock mode: Simulating sign in for', credentials.email);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser: User = {
          id: 'mock-user-id',
          email: credentials.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };

        const mockSession: Session = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        set({
          user: mockUser,
          session: mockSession,
          isLoading: false,
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpCredentials) => {
    set({ isLoading: true });

    try {
      if (isMockMode) {
        // Mock mode: simulate successful sign up
        console.log('Mock mode: Simulating sign up for', credentials.email);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser: User = {
          id: 'mock-user-id',
          email: credentials.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        };

        const mockSession: Session = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: mockUser,
        };

        set({
          user: mockUser,
          session: mockSession,
          isLoading: false,
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      // Note: User may need to confirm email before session is available
      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Sign out
  signOut: async () => {
    set({ isLoading: true });

    try {
      if (isMockMode) {
        console.log('Mock mode: Signing out');
        await new Promise((resolve) => setTimeout(resolve, 200));
        set({
          user: null,
          session: null,
          isLoading: false,
        });
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      set({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error(getAuthErrorMessage(error));
    }
  },

  // Set session (used by auth listener)
  setSession: (session: Session | null) => {
    set({
      session,
      user: session?.user ?? null,
    });
  },
}));
