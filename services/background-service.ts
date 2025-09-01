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

import {
  checkAndNotifyNewAchievements,
  getPreviousAchievements,
  handleAchievementNotifications,
} from '@/services/achievements';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { parseWorkoutSamples } from '@/utils/parser';

const LAST_BACKGROUND_CHECK_KEY = 'lastBackgroundAchievementCheck';
const BACKGROUND_CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute for testing (was 30 minutes)

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
 * Debug function to check current vs previous achievements
 */
export const debugAchievements = async (): Promise<void> => {
  try {
    console.log('=== DEBUG ACHIEVEMENTS ===');

    // Check if HealthKit data is available
    const isAvailable = await isProtectedDataAvailable();
    console.log('HealthKit data available:', isAvailable);

    if (!isAvailable) {
      console.log('HealthKit data not available, skipping check');
      return;
    }

    // Get recent workouts (last 30 days)
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    console.log('Querying workouts from', startDate, 'to', endDate);

    const workouts = await queryWorkoutSamples({
      ascending: false,
      limit: 100,
      filter: {
        workoutActivityType: WorkoutActivityType.running,
        startDate,
        endDate,
      },
    });

    console.log('Raw HealthKit workouts:', workouts?.length || 0);

    const parsedWorkouts = await parseWorkoutSamples({
      samples: workouts || [],
      distanceUnit: 'mi', // Default to miles
    });

    console.log('Parsed workouts:', parsedWorkouts.length);

    // Get current and previous achievements for debugging
    const { extractCurrentAchievements } = await import('@/services/achievements');
    const previousAchievements = await getPreviousAchievements();
    const currentAchievements = extractCurrentAchievements(parsedWorkouts);

    console.log('Previous achievements:', previousAchievements);
    console.log('Current achievements:', currentAchievements);

    console.log('=== RUNNING BACKGROUND ACHIEVEMENT CHECK ===');
    await checkAndNotifyNewAchievements(parsedWorkouts);

    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Error in debug achievements:', error);
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
