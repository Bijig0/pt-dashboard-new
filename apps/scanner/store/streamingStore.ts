import { create } from 'zustand';

interface StreamingStore {
  // State
  thinkingText: string;
  currentStep: string;
  progress: number;
  isStreaming: boolean;
  error: string | null;

  // Actions
  startStreaming: () => void;
  appendThinking: (text: string) => void;
  setProgress: (step: string, percent: number) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useStreamingStore = create<StreamingStore>((set) => ({
  // Initial state
  thinkingText: '',
  currentStep: '',
  progress: 0,
  isStreaming: false,
  error: null,

  // Start streaming
  startStreaming: () => {
    set({
      thinkingText: '',
      currentStep: 'Starting...',
      progress: 0,
      isStreaming: true,
      error: null,
    });
  },

  // Append thinking text (streaming from Claude)
  appendThinking: (text: string) => {
    set((state) => ({
      thinkingText: state.thinkingText + text,
    }));
  },

  // Set progress step and percentage
  setProgress: (step: string, percent: number) => {
    set({
      currentStep: step,
      progress: percent,
    });
  },

  // Set error state
  setError: (message: string) => {
    set({
      error: message,
      isStreaming: false,
    });
  },

  // Reset all streaming state
  reset: () => {
    set({
      thinkingText: '',
      currentStep: '',
      progress: 0,
      isStreaming: false,
      error: null,
    });
  },
}));
