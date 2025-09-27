/**
 * Achievement Notification System
 *
 * This module handles showing toast notifications when users achieve new personal bests.
 * It compares current workout achievements with previously stored achievements and shows
 * notifications only for new achievements.
 *
 * Features:
 * - Tracks fastest, longest, furthest, and highest elevation workouts by UUID
 * - Stores previous achievements in AsyncStorage for comparison
 * - Shows detailed toast notifications with workout metrics
 * - Prevents duplicate notifications for the same achievement
 *
 * Usage:
 * - Automatically called when workout data is loaded in useWorkoutData hook
 * - Can be tested manually using showTestAchievementNotification()
 * - Use clearPreviousAchievements() to reset stored achievements for testing
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { showAchievementNotification } from '@/services/notifications';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

const PREVIOUS_ACHIEVEMENTS_KEY = 'previousAchievements';

type PreviousAchievements = {
  fastest?: string; // UUID of previous fastest workout
  longest?: string; // UUID of previous longest workout
  furthest?: string; // UUID of previous furthest workout
  highestElevation?: string; // UUID of previous highest elevation workout
};

/**
 * Get previously stored achievement UUIDs
 */
export const getPreviousAchievements = async (): Promise<PreviousAchievements> => {
  try {
    const stored = await AsyncStorage.getItem(PREVIOUS_ACHIEVEMENTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error getting previous achievements:', error);
    return {};
  }
};

/**
 * Store current achievement UUIDs for future comparison
 */
export const storePreviousAchievements = async (
  achievements: PreviousAchievements,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(PREVIOUS_ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error storing previous achievements:', error);
  }
};

/**
 * Extract current achievement UUIDs from workouts
 */
export const extractCurrentAchievements = (workouts: ExtendedWorkout[]): PreviousAchievements => {
  if (workouts.length === 0) return {};

  const fastest = workouts.find((w) => w.achievements.isAllTimeFastest)?.uuid;
  const longest = workouts.find((w) => w.achievements.isAllTimeLongest)?.uuid;
  const furthest = workouts.find((w) => w.achievements.isAllTimeFurthest)?.uuid;
  const highestElevation = workouts.find((w) => w.achievements.isAllTimeHighestElevation)?.uuid;

  return {
    fastest,
    longest,
    furthest,
    highestElevation,
  };
};

/**
 * Compare current achievements with previous ones and show notifications for new achievements
 * Only shows notifications if this is called during an "active" state (not background refresh)
 */
export const checkAndNotifyNewAchievements = async (workouts: ExtendedWorkout[]): Promise<void> => {
  if (workouts.length === 0) return;

  const previousAchievements = await getPreviousAchievements();
  const currentAchievements = extractCurrentAchievements(workouts);

  // Check for new fastest workout
  if (currentAchievements.fastest && currentAchievements.fastest !== previousAchievements.fastest) {
    const fastestWorkout = workouts.find((w) => w.uuid === currentAchievements.fastest);
    if (fastestWorkout) {
      showAchievementNotification(
        '🏃‍♂️ New Personal Best!',
        `Fastest pace: ${fastestWorkout.prettyPace}`,
        fastestWorkout,
      );
    }
  }

  // Check for new longest workout
  if (currentAchievements.longest && currentAchievements.longest !== previousAchievements.longest) {
    const longestWorkout = workouts.find((w) => w.uuid === currentAchievements.longest);
    if (longestWorkout) {
      const duration = Math.round(longestWorkout.duration.quantity / 60);

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      const durationText = hours > 0 ? `${hours} hr ${minutes} mins` : `${duration} minutes`;

      showAchievementNotification(
        '⏱️ New Personal Best!',
        `Longest duration: ${durationText}`,
        longestWorkout,
      );
    }
  }

  // Check for new furthest workout
  if (
    currentAchievements.furthest &&
    currentAchievements.furthest !== previousAchievements.furthest
  ) {
    const furthestWorkout = workouts.find((w) => w.uuid === currentAchievements.furthest);
    if (furthestWorkout) {
      showAchievementNotification(
        '🏁 New Personal Best!',
        `Furthest distance: ${furthestWorkout.totalDistance.quantity.toFixed(2)} ${furthestWorkout.totalDistance.unit}`,
        furthestWorkout,
      );
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
      showAchievementNotification(
        '🏔️ New Personal Best!',
        `Highest elevation: ${Math.round(highestElevationWorkout.totalElevation.quantity)} ${highestElevationWorkout.totalElevation.unit}`,
        highestElevationWorkout,
      );
    }
  }

  // Store current achievements for next comparison
  await storePreviousAchievements(currentAchievements);
};

/**
 * Check for achievements when app opens or data refreshes
 */
export const handleAchievementNotifications = async (workouts: ExtendedWorkout[]) => {
  try {
    await checkAndNotifyNewAchievements(workouts);
  } catch (error) {
    console.error('Error handling achievement notifications:', error);
  }
};

/**
 * Clear stored achievements (useful for testing)
 */
export const clearPreviousAchievements = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PREVIOUS_ACHIEVEMENTS_KEY);
  } catch (error) {
    console.error('Error clearing previous achievements:', error);
  }
};
