/**
 * Notification Service
 *
 * This module handles both in-app toast notifications and push notifications
 * for achievement alerts. It integrates with the existing achievement system
 * to provide notifications when the app is closed.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

import { NotificationSettings } from '@/services/notifications.types';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

interface QueuedToast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

let toastQueue: QueuedToast[] = [];
let isProcessingQueue = false;

/**
 * Process the toast queue with slide down animations
 */
const processToastQueue = async (): Promise<void> => {
  if (isProcessingQueue || toastQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (toastQueue.length > 0) {
    const toast = toastQueue.shift();
    if (!toast) continue;

    Toast.show({
      type: toast.type,
      text1: toast.message,
      visibilityTime: toast.duration || 3000,
      autoHide: true,
      topOffset: 60,
    });

    // Wait for the toast to show and hide before showing the next one
    await new Promise((resolve) => setTimeout(resolve, (toast.duration || 3000) + 500));
  }

  isProcessingQueue = false;
};

/**
 * Add toast to queue
 */
const queueToast = (
  message: string,
  type: 'success' | 'error' | 'info' = 'success',
  duration?: number,
): void => {
  toastQueue.push({ message, type, duration });
  processToastQueue();
};

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
      queueToast(`${title}: ${message}`, 'success', 4000);
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
/* export const isAppActive = async (): Promise<boolean> => {
  try {
    const lastActiveTime = await AsyncStorage.getItem('lastActiveTime');

    if (!lastActiveTime) return false;

    const timeDiff = Date.now() - parseInt(lastActiveTime);

    // Consider app active if last activity was within 5 minutes
    return timeDiff < 5 * 60 * 1000;
  } catch (error) {
    console.error('Error checking app active status:', error);

    return false;
  }
};
 */
/**
 * Set app as active (call this when app comes to foreground)
 */
/* export const setAppActive = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('lastActiveTime', Date.now().toString());
  } catch (error) {
    console.error('Error setting app active:', error);
  }
}; */

export const sendTestNotification = async (): Promise<void> => {
  try {
    const settings = await getNotificationSettings();

    if (!settings.enabled) {
      console.log('Notifications are disabled');

      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from your workout app!',
        sound: settings.soundEnabled,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          type: 'test',
        },
      },
      trigger: null, // Show immediately
    });

    console.log('Test notification sent');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

export const getBackgroundTaskStatus = async (): Promise<{
  isTaskDefined: boolean;
  isTaskRegistered: boolean;
  backgroundTaskStatus?: string;
}> => {
  try {
    const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK);
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    return {
      isTaskDefined,
      isTaskRegistered,
    };
  } catch (error) {
    console.error('Error getting background task status:', error);

    return {
      isTaskDefined: false,
      isTaskRegistered: false,
      backgroundTaskStatus: `Error: ${error}`,
    };
  }
};

export const unregisterBackgroundTask = async (): Promise<void> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    if (isRegistered) {
      await TaskManager.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log('Background task unregistered');
    }
  } catch (error) {
    console.error('Error unregistering background task:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

export const handleNotificationReceived = (notification: Notifications.Notification) => {
  console.log('Notification received:', notification);
};

export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  console.log('Notification response:', response);

  // Handle notification tap
  const data = response.notification.request.content.data;

  if (data?.workoutId) {
    // Navigate to workout details
    console.log('Navigate to workout:', data.workoutId);
  }
};
