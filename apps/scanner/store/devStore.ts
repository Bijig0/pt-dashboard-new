import { create } from 'zustand';
import { Platform } from 'react-native';

interface DevStore {
  // State
  useMockOCR: boolean;
  showDevPanel: boolean;
  enableUpload: boolean;

  // Actions
  setUseMockOCR: (value: boolean) => void;
  toggleUseMockOCR: () => void;
  setShowDevPanel: (value: boolean) => void;
  toggleDevPanel: () => void;
  setEnableUpload: (value: boolean) => void;
  toggleEnableUpload: () => void;
}

export const useDevStore = create<DevStore>((set) => ({
  // Initial state - only show dev panel on web
  useMockOCR: false,
  showDevPanel: Platform.OS === 'web',
  enableUpload: true,

  setUseMockOCR: (value: boolean) => {
    set({ useMockOCR: value });
  },

  toggleUseMockOCR: () => {
    set((state) => ({ useMockOCR: !state.useMockOCR }));
  },

  setShowDevPanel: (value: boolean) => {
    set({ showDevPanel: value });
  },

  toggleDevPanel: () => {
    set((state) => ({ showDevPanel: !state.showDevPanel }));
  },

  setEnableUpload: (value: boolean) => {
    set({ enableUpload: value });
  },

  toggleEnableUpload: () => {
    set((state) => ({ enableUpload: !state.enableUpload }));
  },
}));
