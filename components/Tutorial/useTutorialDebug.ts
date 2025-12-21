import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const TUTORIAL_DEBUG_KEY = 'tutorial_debug_enabled';

/**
 * Hook to manage tutorial debug mode state
 * Debug mode can be enabled by:
 * 1. Running in __DEV__ mode AND
 * 2. Setting debug flag in AsyncStorage
 *
 * This ensures debug UI is never included in production builds
 */
export const useTutorialDebug = () => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkDebugStatus();
  }, []);

  const checkDebugStatus = async () => {
    if (!__DEV__) {
      setIsDebugEnabled(false);
      setIsLoading(false);
      return;
    }

    try {
      const debugEnabled = await AsyncStorage.getItem(TUTORIAL_DEBUG_KEY);
      setIsDebugEnabled(debugEnabled === 'true');
    } catch (error) {
      console.warn('Failed to check tutorial debug status:', error);
      setIsDebugEnabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const enableDebug = async () => {
    if (!__DEV__) {
      console.warn('Debug mode is only available in development');
      return;
    }

    try {
      await AsyncStorage.setItem(TUTORIAL_DEBUG_KEY, 'true');
      setIsDebugEnabled(true);
    } catch (error) {
      console.warn('Failed to enable tutorial debug mode:', error);
    }
  };

  const disableDebug = async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_DEBUG_KEY, 'false');
      setIsDebugEnabled(false);
    } catch (error) {
      console.warn('Failed to disable tutorial debug mode:', error);
    }
  };

  const toggleDebug = async () => {
    if (isDebugEnabled) {
      await disableDebug();
    } else {
      await enableDebug();
    }
  };

  return {
    isDebugEnabled: __DEV__ && isDebugEnabled,
    isLoading,
    enableDebug,
    disableDebug,
    toggleDebug,
  };
};
