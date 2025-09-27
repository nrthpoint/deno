/**
 * Background Achievements Checker
 *
 * This module handles checking for new achievements when the app is in the background.
 * It works with HealthKit to fetch new workout data and check for achievements
 * without requiring the app to be active.
 */

import {
  isProtectedDataAvailable,
  queryWorkoutSamples,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { handleAchievementNotifications } from '@/services/achievements';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { parseWorkoutSamples } from '@/utils/parser';

const LAST_BACKGROUND_CHECK_KEY = 'lastBackgroundAchievementCheck';
const BACKGROUND_NOTIFICATION_TASK = 'background-notification-task';
const BACKGROUND_CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute for testing (was 30 minutes)

/**
 * Register background task for achievement notifications
 */
export const registerBackgroundTask = async (): Promise<void> => {
  try {
    console.log('Registering background task...');

    // Define the background task
    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async () => {
      console.log('Background task executing...');

      try {
        await checkForNewAchievementsInBackground();
        console.log('Background task completed successfully');

        return BackgroundTask.BackgroundTaskResult.Success;
      } catch (error) {
        console.error('Background task error:', error);

        return BackgroundTask.BackgroundTaskResult.Failed;
      }
    });

    // Register the background task
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);

    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
      console.log('Background task registered successfully');
    } else {
      console.log('Background task already registered');
    }
  } catch (error) {
    console.error('Error registering background task:', error);
  }
};

/**
 * Check for new achievements in background
 */
export const checkForNewAchievementsInBackground = async (): Promise<void> => {
  try {
    console.log('Starting background achievement check...');

    // Check if enough time has passed since last check
    const lastCheck = await AsyncStorage.getItem(LAST_BACKGROUND_CHECK_KEY);
    const now = Date.now();

    if (lastCheck && now - parseInt(lastCheck) < BACKGROUND_CHECK_INTERVAL) {
      console.log('Background check skipped - too soon since last check');
      return;
    }

    // Check HealthKit authorization
    const isAvailable = await isProtectedDataAvailable();
    if (!isAvailable) {
      console.log('HealthKit not available for background check');
      return;
    }

    // Fetch recent workouts (last 7 days to be safe)
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    let workouts = await queryWorkoutSamples({
      ascending: false,
      limit: 100,
      filter: {
        startDate,
        endDate,
      },
    });

    workouts = workouts.filter(
      (workout) => workout.workoutActivityType === WorkoutActivityType.running,
    );

    if (!workouts || workouts.length === 0) {
      console.log('No workouts found in background check');
      await AsyncStorage.setItem(LAST_BACKGROUND_CHECK_KEY, now.toString());
      return;
    }

    // Parse workouts to get achievements
    let parsedWorkouts: ExtendedWorkout[] = [];
    try {
      parsedWorkouts = await parseWorkoutSamples({
        samples: workouts,
        distanceUnit: 'mi', // Default to miles, could be made configurable
      });
    } catch (error) {
      console.error('Error parsing workout samples:', error);
      await AsyncStorage.setItem(LAST_BACKGROUND_CHECK_KEY, now.toString());
      return;
    }

    console.log(`Parsed ${parsedWorkouts.length} workouts in background check`);
    // Check for new achievements
    await handleAchievementNotifications(parsedWorkouts);

    // Update last check time
    await AsyncStorage.setItem(LAST_BACKGROUND_CHECK_KEY, now.toString());

    console.log('Background achievement check completed');
  } catch (error) {
    console.error('Error in background achievement check:', error);
  }
};

/**
 * Schedule the next background check (if needed)
 */
export const scheduleNextBackgroundCheck = async (): Promise<void> => {
  try {
    // This would typically be handled by the background task manager
    // but we can set a flag to indicate when the next check should happen
    const nextCheckTime = Date.now() + BACKGROUND_CHECK_INTERVAL;
    await AsyncStorage.setItem('nextBackgroundCheckTime', nextCheckTime.toString());
  } catch (error) {
    console.error('Error scheduling next background check:', error);
  }
};

/**
 * Get time until next background check
 */
export const getTimeUntilNextCheck = async (): Promise<number> => {
  try {
    const nextCheckTime = await AsyncStorage.getItem('nextBackgroundCheckTime');
    if (!nextCheckTime) return 0;

    const timeUntilNext = parseInt(nextCheckTime) - Date.now();
    return Math.max(0, timeUntilNext);
  } catch (error) {
    console.error('Error getting time until next check:', error);
    return 0;
  }
};

/**
 * Force a background achievement check (for testing)
 */
export const forceBackgroundCheck = async (): Promise<void> => {
  try {
    // Clear the last check time to force a new check
    await AsyncStorage.removeItem(LAST_BACKGROUND_CHECK_KEY);
    await checkForNewAchievementsInBackground();
  } catch (error) {
    console.error('Error forcing background check:', error);
  }
};
