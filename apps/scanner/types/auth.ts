import { Session, User } from '@supabase/supabase-js';

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Auth error with user-friendly message
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Get user-friendly error message from Supabase auth error
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (message.includes('email not confirmed')) {
      return 'Please check your email and confirm your account.';
    }
    if (message.includes('user already registered')) {
      return 'An account with this email already exists.';
    }
    if (message.includes('password')) {
      return 'Password must be at least 6 characters.';
    }
    if (message.includes('email')) {
      return 'Please enter a valid email address.';
    }
    if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    }

    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
