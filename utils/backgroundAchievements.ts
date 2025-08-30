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

import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import {
  extractCurrentAchievements,
  getPreviousAchievements,
  storePreviousAchievements,
} from '@/utils/achievements';
import { parseWorkoutSamples } from '@/utils/parser';

import { showAchievementNotification } from './notificationService';

const LAST_BACKGROUND_CHECK_KEY = 'lastBackgroundAchievementCheck';
const BACKGROUND_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

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

    const workouts = await queryWorkoutSamples({
      ascending: false,
      limit: 100,
      filter: {
        workoutActivityType: WorkoutActivityType.running,
        startDate,
        endDate,
      },
    });

    if (!workouts || workouts.length === 0) {
      console.log('No workouts found in background check');
      await AsyncStorage.setItem(LAST_BACKGROUND_CHECK_KEY, now.toString());
      return;
    }

    // Parse workouts to get achievements
    const parsedWorkouts = await parseWorkoutSamples({
      samples: workouts,
      distanceUnit: 'mi', // Default to miles, could be made configurable
    });

    // Check for new achievements
    await checkAndNotifyBackgroundAchievements(parsedWorkouts);

    // Update last check time
    await AsyncStorage.setItem(LAST_BACKGROUND_CHECK_KEY, now.toString());

    console.log('Background achievement check completed');
  } catch (error) {
    console.error('Error in background achievement check:', error);
  }
};

/**
 * Check for new achievements and send push notifications
 */
const checkAndNotifyBackgroundAchievements = async (workouts: ExtendedWorkout[]): Promise<void> => {
  if (workouts.length === 0) return;

  try {
    const previousAchievements = await getPreviousAchievements();
    const currentAchievements = extractCurrentAchievements(workouts);

    // Track if any new achievements were found
    let hasNewAchievements = false;

    // Check for new fastest workout
    if (
      currentAchievements.fastest &&
      currentAchievements.fastest !== previousAchievements.fastest
    ) {
      const fastestWorkout = workouts.find((w) => w.uuid === currentAchievements.fastest);
      if (fastestWorkout) {
        await showAchievementNotification(
          '🏃‍♂️ New Personal Best!',
          `Fastest pace: ${fastestWorkout.prettyPace}`,
          fastestWorkout,
          false, // App is not active
        );
        hasNewAchievements = true;
      }
    }

    // Check for new longest workout
    if (
      currentAchievements.longest &&
      currentAchievements.longest !== previousAchievements.longest
    ) {
      const longestWorkout = workouts.find((w) => w.uuid === currentAchievements.longest);
      if (longestWorkout) {
        const duration = Math.round(longestWorkout.duration.quantity / 60);
        await showAchievementNotification(
          '⏱️ New Personal Best!',
          `Longest duration: ${duration} minutes`,
          longestWorkout,
          false,
        );
        hasNewAchievements = true;
      }
    }

    // Check for new furthest workout
    if (
      currentAchievements.furthest &&
      currentAchievements.furthest !== previousAchievements.furthest
    ) {
      const furthestWorkout = workouts.find((w) => w.uuid === currentAchievements.furthest);
      if (furthestWorkout) {
        await showAchievementNotification(
          '🏁 New Personal Best!',
          `Furthest distance: ${furthestWorkout.totalDistance.quantity.toFixed(2)} ${furthestWorkout.totalDistance.unit}`,
          furthestWorkout,
          false,
        );
        hasNewAchievements = true;
      }
    }

    // Check for new highest elevation workout
    if (
      currentAchievements.highestElevation &&
      currentAchievements.highestElevation !== previousAchievements.highestElevation
    ) {
      const highestElevationWorkout = workouts.find(
        (w) => w.uuid === currentAchievements.highestElevation,
      );
      if (highestElevationWorkout) {
        await showAchievementNotification(
          '🏔️ New Personal Best!',
          `Highest elevation: ${Math.round(highestElevationWorkout.totalElevation.quantity)} ${highestElevationWorkout.totalElevation.unit}`,
          highestElevationWorkout,
          false,
        );
        hasNewAchievements = true;
      }
    }

    // Store current achievements for next comparison
    if (hasNewAchievements) {
      await storePreviousAchievements(currentAchievements);
      console.log('New achievements found and notifications sent');
    }
  } catch (error) {
    console.error('Error checking background achievements:', error);
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
