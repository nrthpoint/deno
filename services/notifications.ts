/**
 * Notification Service
 *
 * This module handles in-app toast notifications for achievement alerts.
 */

import Toast from 'react-native-toast-message';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

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

/**
 * Show achievement toast notification
 */
export const showAchievementNotification = async (
  title: string,
  message: string,
  _workout: ExtendedWorkout,
): Promise<void> => {
  try {
    queueToast(`${title}: ${message}`, 'success', 4000);
  } catch (error) {
    console.error('Error showing achievement notification:', error);
  }
};
