import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ValidationStore {
  // Cached data
  companyNames: string[];
  alatNames: string[];

  // Loading states
  isLoading: boolean;
  lastFetched: Date | null;
  error: string | null;

  // Actions
  fetchValidationData: () => Promise<void>;
  refreshIfStale: (maxAgeMinutes?: number) => Promise<void>;
  reset: () => void;
}

export const useValidationStore = create<ValidationStore>((set, get) => ({
  // Initial state
  companyNames: [],
  alatNames: [],
  isLoading: false,
  lastFetched: null,
  error: null,

  // Fetch company and alat names from Supabase
  fetchValidationData: async () => {
    set({ isLoading: true, error: null });

    try {
      // Fetch company names
      const { data: companies, error: companyError } = await supabase
        .from('company')
        .select('name')
        .order('name');

      if (companyError) {
        throw new Error(`Failed to fetch companies: ${companyError.message}`);
      }

      // Fetch alat names (unique)
      const { data: alats, error: alatError } = await supabase
        .from('alat')
        .select('name')
        .order('name');

      if (alatError) {
        throw new Error(`Failed to fetch alat: ${alatError.message}`);
      }

      // Extract unique names
      const companyNames = companies?.map((c) => c.name) ?? [];
      const alatNames = [...new Set(alats?.map((a) => a.name) ?? [])];

      set({
        companyNames,
        alatNames,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });

      console.log(
        `Loaded ${companyNames.length} companies and ${alatNames.length} alat names`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to fetch validation data:', message);
      set({ isLoading: false, error: message });
    }
  },

  // Refresh data if it's older than maxAgeMinutes
  refreshIfStale: async (maxAgeMinutes = 5) => {
    const { lastFetched, isLoading, fetchValidationData } = get();

    if (isLoading) return;

    if (!lastFetched) {
      await fetchValidationData();
      return;
    }

    const ageMinutes = (Date.now() - lastFetched.getTime()) / 1000 / 60;
    if (ageMinutes > maxAgeMinutes) {
      await fetchValidationData();
    }
  },

  // Reset store
  reset: () => {
    set({
      companyNames: [],
      alatNames: [],
      isLoading: false,
      lastFetched: null,
      error: null,
    });
  },
}));
