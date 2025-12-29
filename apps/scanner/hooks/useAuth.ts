import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isMockMode } from '../lib/supabase';
import { SignInCredentials, SignUpCredentials, getAuthErrorMessage } from '../types/auth';
import { useAuthStore } from '../store';

// Sign In Mutation
async function signInFn(credentials: SignInCredentials): Promise<{ user: User; session: Session }> {
  if (isMockMode) {
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

    return { user: mockUser, session: mockSession };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  return { user: data.user!, session: data.session! };
}

// Sign Up Mutation
async function signUpFn(credentials: SignUpCredentials): Promise<{ user: User | null; session: Session | null }> {
  if (isMockMode) {
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

    return { user: mockUser, session: mockSession };
  }

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  return { user: data.user, session: data.session };
}

// Sign Out Mutation
async function signOutFn(): Promise<void> {
  if (isMockMode) {
    console.log('Mock mode: Signing out');
    await new Promise((resolve) => setTimeout(resolve, 200));
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export function useSignIn() {
  const { setSession } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signInFn,
    onSuccess: (data) => {
      setSession(data.session);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useSignUp() {
  const { setSession } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpFn,
    onSuccess: (data) => {
      if (data.session) {
        setSession(data.session);
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useSignOut() {
  const { setSession } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutFn,
    onSuccess: () => {
      setSession(null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.clear();
    },
  });
}
