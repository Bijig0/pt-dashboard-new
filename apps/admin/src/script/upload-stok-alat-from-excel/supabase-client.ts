import {
  supabase,
  SUPABASE_AUTH_EMAIL,
  SUPABASE_AUTH_PASSWORD,
} from "../supabase";

export const authenticateSupabase = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({
    email: SUPABASE_AUTH_EMAIL,
    password: SUPABASE_AUTH_PASSWORD,
  });

  if (error) {
    throw new Error(`Supabase authentication failed: ${error.message}`);
  }
};

export { supabase };
