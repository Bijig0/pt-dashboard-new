import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type OnboardingContextType = {
  run: boolean;
  stepIndex: number;
  startOnboarding: () => void;
  stopOnboarding: () => void;
  setStepIndex: (index: number) => void;
  hasCompletedOnboarding: boolean;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'pt-dashboard-onboarding-completed';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return completed === 'true';
  });

  // Auto-start onboarding if user hasn't completed it
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      // Small delay to ensure page is rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding]);

  const startOnboarding = useCallback(() => {
    setStepIndex(0);
    setRun(true);
  }, []);

  const stopOnboarding = useCallback(() => {
    setRun(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setStepIndex(0);
    setRun(true);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        run,
        stepIndex,
        startOnboarding,
        stopOnboarding,
        setStepIndex,
        hasCompletedOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
