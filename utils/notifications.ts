/**
 * Notification Service
 *
 * This module handles both in-app toast notifications and push notifications
 * for achievement alerts. It integrates with the existing achievement system
 * to provide notifications when the app is closed.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { checkForNewAchievementsInBackground } from '@/utils/backgroundAchievements';
import { NotificationSettings } from '@/utils/notifications.types';

const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';
const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

// Toast service to be initialized from a component with access to useToast hook
let toastService: {
  show: (message: string, options?: any) => void;
} | null = null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const defaultSettings: NotificationSettings = {
  enabled: true,
  achievementsEnabled: true,
  soundEnabled: true,
};

/**
 * Initialize notification service
 */
export const initializeNotifications = async (): Promise<boolean> => {
  try {
    // Request permission for notifications
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    console.log('Notifications initialized successfully');

    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);

    return false;
  }
};

/**
 * Initialize toast service with useToast hook
 */
export const initializeToastService = (toast: {
  show: (message: string, options?: any) => void;
}): void => {
  toastService = toast;
};

/**
 * Get current notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);

    return stored ? JSON.parse(stored) : defaultSettings;
  } catch (error) {
    console.error('Error getting notification settings:', error);

    return defaultSettings;
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
): Promise<void> => {
  try {
    const currentSettings = await getNotificationSettings();
    const updatedSettings = { ...currentSettings, ...settings };

    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error updating notification settings:', error);
  }
};

/**
 * Show achievement notification (both in-app and push)
 */
export const showAchievementNotification = async (
  title: string,
  message: string,
  workout: ExtendedWorkout,
  isAppActive: boolean = true,
): Promise<void> => {
  const settings = await getNotificationSettings();

  if (!settings.enabled || !settings.achievementsEnabled) {
    return;
  }

  try {
    if (isAppActive) {
      console.log('Showing in-app achievement toast:', { title, message, workout });

      // Use the new toast service (supports multiple toasts automatically)
      if (toastService) {
        toastService.show(`${title}: ${message}`, { type: 'success' });
      } else {
        console.warn(
          'Toast service not initialized. Call initializeToastService from a component.',
        );
      }
    } else {
      // Show push notification
      console.log('Scheduling push notification:', { title, message, workout });
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          sound: settings.soundEnabled,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            workoutId: workout.uuid,
            type: 'achievement',
          },
        },
        trigger: null, // Show immediately
      });
    }
  } catch (error) {
    console.error('Error showing achievement notification:', error);
  }
};

/**
 * Check if app is currently active/in foreground
 */
export const isAppActive = async (): Promise<boolean> => {
  try {
    const lastActiveTime = await AsyncStorage.getItem('lastActiveTime');

    if (!lastActiveTime) return false;

    const timeDiff = Date.now() - parseInt(lastActiveTime);

    // Consider app active if it was active in the last 30 seconds
    return timeDiff < 30000;
  } catch (error) {
    console.error('Error checking app active state:', error);
    return false;
  }
};

/**
 * Set app as active (call this when app comes to foreground)
 */
export const setAppActive = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('lastActiveTime', Date.now().toString());
  } catch (error) {
    console.error('Error setting app active:', error);
  }
};

/**
 * Register background task for achievement notifications
 */
export const registerBackgroundTask = async (): Promise<void> => {
  try {
    // Define the background task using TaskManager
    await TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
      try {
        console.log('Background task running - checking for achievements');

        await checkForNewAchievementsInBackground();

        console.log('Background achievement check completed');

        return { success: true };
      } catch (error) {
        console.error('Background task error:', error);

        return { success: false };
      }
    });

    console.log('Background task defined successfully');

    try {
      await BackgroundTask.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
        minimumInterval: 15000,
      });
      console.log('Background task registered with system successfully');
    } catch (registrationError) {
      console.error('Error registering background task with system:', registrationError);
      console.log('Background task defined but system registration failed');
    }

    // Check if task is registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
    console.log('Task registration status:', isRegistered);

    // Note: Background tasks require proper permissions and work better on physical devices
    console.log(
      'Note: Background execution requires production build on physical device for optimal performance',
    );
  } catch (error) {
    console.error('Error registering background task:', error);
  }
};

/**
 * Test notification (for development/debugging)
 */
export const sendTestNotification = async (): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏃‍♂️ Test Achievement!',
        body: 'This is a test notification for achievements',
        sound: true,
        data: {
          type: 'test',
        },
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

/**
 * Check background task status (for debugging)
 */
export const getBackgroundTaskStatus = async (): Promise<{
  isTaskDefined: boolean;
  isTaskRegistered: boolean;
  backgroundTaskStatus?: string;
}> => {
  try {
    const isTaskDefined = await TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK);
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    let backgroundTaskStatus = 'unknown';

    try {
      // Check if expo-background-task is available
      const status = await BackgroundTask.getStatusAsync();
      backgroundTaskStatus = status ? `available (${status})` : 'available';
    } catch {
      backgroundTaskStatus = 'not available';
    }

    return {
      isTaskDefined,
      isTaskRegistered,
      backgroundTaskStatus,
    };
  } catch (error) {
    console.error('Error getting background task status:', error);
    return {
      isTaskDefined: false,
      isTaskRegistered: false,
      backgroundTaskStatus: 'error',
    };
  }
};

/**
 * Unregister background task
 */
export const unregisterBackgroundTask = async (): Promise<void> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    if (isRegistered) {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log('Background task unregistered successfully');
    } else {
      console.log('Background task was not registered');
    }
  } catch (error) {
    console.error('Error unregistering background task:', error);
  }
};

/**
 * Cancel all pending notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

/**
 * Handle notification received while app is in foreground
 */
export const handleNotificationReceived = (notification: Notifications.Notification) => {
  const { data } = notification.request.content;

  console.log('Notification received:', notification);

  if (data?.type === 'achievement') {
    // Handle achievement notification
    console.log('Achievement notification received for workout:', data.workoutId);
  }
};

/**
 * Handle notification tap (when user taps on notification)
 */
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const { data } = response.notification.request.content;

  console.log('Notification tapped:', response);

  if (data?.type === 'achievement' && data?.workoutId) {
    // Navigate to workout detail or achievement screen
    console.log('Opening achievement for workout:', data.workoutId);
    // You can add navigation logic here
  }
};
