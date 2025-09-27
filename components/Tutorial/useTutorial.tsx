import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { TutorialStep } from './TutorialOverlay';

const TUTORIAL_STORAGE_KEY = 'tutorial_completed';

export const useTutorial = (steps: TutorialStep[]) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    checkTutorialStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkTutorialStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
      const isCompleted = completed === 'true';
      setHasCompletedTutorial(isCompleted);

      // Show tutorial if not completed and we have steps
      if (!isCompleted && steps.length > 0) {
        // Small delay to ensure the UI is ready
        setTimeout(() => {
          setIsVisible(true);
        }, 1000);
      }
    } catch (error) {
      console.warn('Failed to check tutorial status:', error);
    }
  };

  const startTutorial = () => {
    setCurrentStepIndex(0);
    setIsVisible(true);
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const skipTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      setHasCompletedTutorial(true);
      setIsVisible(false);
    } catch (error) {
      console.warn('Failed to save tutorial skip status:', error);
    }
  };

  const completeTutorial = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
      setHasCompletedTutorial(true);
      setIsVisible(false);
    } catch (error) {
      console.warn('Failed to save tutorial completion status:', error);
    }
  };

  const resetTutorial = async () => {
    try {
      await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
      setHasCompletedTutorial(false);
    } catch (error) {
      console.warn('Failed to reset tutorial status:', error);
    }
  };

  return {
    isVisible,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    totalSteps: steps.length,
    hasCompletedTutorial,
    startTutorial,
    nextStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
  };
};
