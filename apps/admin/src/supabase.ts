import { createClient } from "@supabase/supabase-js";
import { TQueryError } from "./types/globals";
import { Database } from "./types/supabase";

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];

const ANON_KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"];

export const supabase = createClient<Database>(SUPABASE_URL, ANON_KEY);

const errorType = {
  "23505": "Duplicated Row",
} as const;

type ErrorType = typeof errorType;

export const retrieveErrorType = (
  error: TQueryError
): ErrorType[keyof ErrorType] | TQueryError => {
  if (!error.code) return error;
  if (!(error.code in errorType)) return error;

  const code = error.code as keyof ErrorType;

  return errorType[code];
};
