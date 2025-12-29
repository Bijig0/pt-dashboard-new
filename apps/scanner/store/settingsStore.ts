import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Appearance, ColorSchemeName } from 'react-native';
import { zustandStorage, STORAGE_KEYS } from '../lib/storage';

export type ThemePreference = 'light' | 'dark' | 'system';

interface SettingsState {
  // Theme
  themePreference: ThemePreference;
  effectiveTheme: ColorSchemeName;

  // Language (for future use)
  language: string;

  // Editor settings
  autoSaveEnabled: boolean;
  autoSaveIntervalMs: number;

  // Validation settings
  inlineValidationEnabled: boolean;
}

interface SettingsActions {
  setThemePreference: (preference: ThemePreference) => void;
  setLanguage: (language: string) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setAutoSaveInterval: (intervalMs: number) => void;
  setInlineValidationEnabled: (enabled: boolean) => void;
  updateEffectiveTheme: () => void;
  reset: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const getSystemTheme = (): ColorSchemeName => {
  return Appearance.getColorScheme() || 'light';
};

const calculateEffectiveTheme = (preference: ThemePreference): ColorSchemeName => {
  if (preference === 'system') {
    return getSystemTheme();
  }
  return preference;
};

const initialState: SettingsState = {
  themePreference: 'system',
  effectiveTheme: getSystemTheme(),
  language: 'en',
  autoSaveEnabled: true,
  autoSaveIntervalMs: 5000, // 5 seconds
  inlineValidationEnabled: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setThemePreference: (preference: ThemePreference) => {
        set({
          themePreference: preference,
          effectiveTheme: calculateEffectiveTheme(preference),
        });
      },

      setLanguage: (language: string) => {
        set({ language });
      },

      setAutoSaveEnabled: (enabled: boolean) => {
        set({ autoSaveEnabled: enabled });
      },

      setAutoSaveInterval: (intervalMs: number) => {
        set({ autoSaveIntervalMs: Math.max(1000, intervalMs) }); // Min 1 second
      },

      setInlineValidationEnabled: (enabled: boolean) => {
        set({ inlineValidationEnabled: enabled });
      },

      updateEffectiveTheme: () => {
        const { themePreference } = get();
        set({ effectiveTheme: calculateEffectiveTheme(themePreference) });
      },

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.THEME_PREFERENCE,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
        language: state.language,
        autoSaveEnabled: state.autoSaveEnabled,
        autoSaveIntervalMs: state.autoSaveIntervalMs,
        inlineValidationEnabled: state.inlineValidationEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        // Update effective theme after rehydration
        if (state) {
          state.effectiveTheme = calculateEffectiveTheme(state.themePreference);
        }
      },
    }
  )
);

// Set up listener for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { themePreference } = useSettingsStore.getState();
  if (themePreference === 'system') {
    useSettingsStore.setState({ effectiveTheme: colorScheme || 'light' });
  }
});
