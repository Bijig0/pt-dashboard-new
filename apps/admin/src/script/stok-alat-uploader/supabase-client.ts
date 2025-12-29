import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Environment = "dev" | "prod";

const SUPABASE_AUTH_EMAIL = "clbb8.mail@gmail.com";
const SUPABASE_AUTH_PASSWORD = "Bryanbrady1";

const DB_CONFIG = {
  dev: {
    url: "https://lkxwausyseuiizopsrwi.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHdhdXN5c2V1aWl6b3BzcndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2Nzg0MDQsImV4cCI6MjAyMDI1NDQwNH0.qRzHq2F1qqky8Q-CoFdkr6VBFm48ra3aRo6oZu4vvnQ",
  },
  prod: {
    url: "https://kawkfmkwmydrtobxxtom.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthd2tmbWt3bXlkcnRvYnh4dG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ0MTQxMjQsImV4cCI6MjAxOTk5MDEyNH0.0wh6ydIWEiLuJp1N3ed_WTb6no7szTgmf7pwzt11ucE",
  },
} as const;

let supabaseClient: SupabaseClient | null = null;
let currentEnv: Environment | null = null;

export const parseEnvironment = (args: string[]): Environment => {
  if (args.includes("--prod")) return "prod";
  if (args.includes("--dev")) return "dev";
  return "dev"; // Default to dev for safety
};

export const initSupabase = (env: Environment): SupabaseClient => {
  const config = DB_CONFIG[env];
  supabaseClient = createClient(config.url, config.anonKey);
  currentEnv = env;
  return supabaseClient;
};

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    throw new Error("Supabase not initialized. Call initSupabase() first.");
  }
  return supabaseClient;
};

export const getCurrentEnv = (): Environment => {
  if (!currentEnv) {
    throw new Error("Environment not set. Call initSupabase() first.");
  }
  return currentEnv;
};

export const authenticateSupabase = async (): Promise<void> => {
  const client = getSupabase();
  const { error } = await client.auth.signInWithPassword({
    email: SUPABASE_AUTH_EMAIL,
    password: SUPABASE_AUTH_PASSWORD,
  });

  if (error) {
    throw new Error(`Supabase authentication failed: ${error.message}`);
  }
};

export const getEnvLabel = (env: Environment): string => {
  return env === "prod" ? "PRODUCTION" : "DEVELOPMENT";
};
