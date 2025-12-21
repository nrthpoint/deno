import * as Updates from 'expo-updates';
import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface OTAUpdateState {
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isUpdatePending: boolean;
  error: string | null;
}

/**
 * Hook to manage OTA updates with expo-updates
 * Checks for updates on app start and when returning to foreground
 */
export const useOTAUpdate = () => {
  const [state, setState] = useState<OTAUpdateState>({
    isUpdateAvailable: false,
    isDownloading: false,
    isUpdatePending: false,
    error: null,
  });

  const checkForUpdates = useCallback(async () => {
    // Don't check for updates in development mode
    if (__DEV__) {
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setState((prev) => ({ ...prev, isUpdateAvailable: true, error: null }));
      }
    } catch (error) {
      console.warn('Error checking for updates:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to check for updates',
      }));
    }
  }, []);

  const downloadUpdate = useCallback(async () => {
    if (__DEV__) {
      return;
    }

    setState((prev) => ({ ...prev, isDownloading: true, error: null }));

    try {
      await Updates.fetchUpdateAsync();
      setState((prev) => ({
        ...prev,
        isDownloading: false,
        isUpdatePending: true,
        isUpdateAvailable: false,
      }));
    } catch (error) {
      console.warn('Error downloading update:', error);
      setState((prev) => ({
        ...prev,
        isDownloading: false,
        error: 'Failed to download update',
      }));
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if (__DEV__) {
      return;
    }

    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.warn('Error applying update:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to apply update',
      }));
    }
  }, []);

  const dismissUpdate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isUpdateAvailable: false,
      error: null,
    }));
  }, []);

  // Check for updates on mount and when app comes to foreground
  useEffect(() => {
    checkForUpdates();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkForUpdates();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [checkForUpdates]);

  return {
    ...state,
    checkForUpdates,
    downloadUpdate,
    applyUpdate,
    dismissUpdate,
  };
};
