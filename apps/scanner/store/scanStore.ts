import { create } from 'zustand';
import {
  ScanState,
  OCRResult,
  idleState,
  processingState,
  completedState,
  errorState,
} from '../types/ocr';

interface ScanStore {
  // State
  scanState: ScanState;
  selectedImageUri: string | null;

  // Actions
  setScanState: (state: ScanState) => void;
  setSelectedImage: (uri: string) => void;
  startProcessing: () => void;
  completeProcessing: (result: OCRResult) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  // Initial state
  scanState: idleState(),
  selectedImageUri: null,

  // Set scan state directly
  setScanState: (state: ScanState) => {
    set({ scanState: state });
  },

  // Set selected image URI
  setSelectedImage: (uri: string) => {
    set({ selectedImageUri: uri });
  },

  // Start OCR processing
  startProcessing: () => {
    set({ scanState: processingState() });
  },

  // Complete OCR processing with result
  completeProcessing: (result: OCRResult) => {
    set({ scanState: completedState(result) });
  },

  // Set error state
  setError: (message: string) => {
    set({ scanState: errorState(message) });
  },

  // Reset to idle state
  reset: () => {
    set({
      scanState: idleState(),
      selectedImageUri: null,
    });
  },
}));
