import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

/**
 * Check if we're in a browser environment (not SSR)
 */
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Zustand-compatible storage adapter using AsyncStorage
 * Falls back to localStorage on web (browser only, not during SSR)
 */
export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        // During SSR, localStorage is not available
        if (!isBrowser) return null;
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (error) {
      console.warn(`[Storage] Failed to get item "${name}":`, error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        // During SSR, localStorage is not available
        if (!isBrowser) return;
        localStorage.setItem(name, value);
        return;
      }
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn(`[Storage] Failed to set item "${name}":`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        // During SSR, localStorage is not available
        if (!isBrowser) return;
        localStorage.removeItem(name);
        return;
      }
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn(`[Storage] Failed to remove item "${name}":`, error);
    }
  },
};

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  // History and drafts
  SCAN_HISTORY: 'scanner-scan-history',
  DRAFTS: 'scanner-drafts',

  // Settings
  THEME_PREFERENCE: 'scanner-theme-preference',
  LANGUAGE: 'scanner-language',

  // Editor state
  EDITOR_AUTO_SAVE: 'scanner-editor-auto-save',

  // Dev settings
  DEV_SETTINGS: 'scanner-dev-settings',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
