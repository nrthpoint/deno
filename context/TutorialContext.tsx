import React, { createContext, useContext } from 'react';

import { tutorialSteps } from '@/components/Tutorial/tutorialSteps';
import { useTutorial } from '@/components/Tutorial/useTutorial';

interface TutorialContextType {
  isVisible: boolean;
  currentStepIndex: number;
  currentStep: any;
  totalSteps: number;
  hasCompletedTutorial: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tutorial = useTutorial(tutorialSteps);

  return <TutorialContext.Provider value={tutorial}>{children}</TutorialContext.Provider>;
};

export const useTutorialContext = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
};
