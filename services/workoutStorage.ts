/**
 * Workout UUID Storage Service
 *
 * This service tracks UUIDs of workouts created by this app to determine
 * which workouts can be deleted (Apple only allows deletion of workouts
 * created by the same app that's trying to delete them).
 *
 * Features:
 * - Stores UUIDs of app-created workouts in AsyncStorage
 * - Provides methods to check if a workout can be deleted
 * - Handles cleanup of old/invalid UUIDs
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_CREATED_WORKOUTS_KEY = 'appCreatedWorkouts';

/**
 * Get all UUIDs of workouts created by this app
 */
export const getAppCreatedWorkoutUUIDs = async (): Promise<Set<string>> => {
  try {
    const stored = await AsyncStorage.getItem(APP_CREATED_WORKOUTS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch (error) {
    console.error('Error getting app-created workout UUIDs:', error);
    return new Set();
  }
};

/**
 * Add a UUID to the list of app-created workouts
 */
export const addAppCreatedWorkoutUUID = async (uuid: string): Promise<void> => {
  try {
    const existingUUIDs = await getAppCreatedWorkoutUUIDs();
    existingUUIDs.add(uuid);
    await AsyncStorage.setItem(APP_CREATED_WORKOUTS_KEY, JSON.stringify([...existingUUIDs]));
  } catch (error) {
    console.error('Error adding app-created workout UUID:', error);
  }
};

/**
 * Remove a UUID from the list of app-created workouts
 * (useful for cleanup after successful deletion)
 */
export const removeAppCreatedWorkoutUUID = async (uuid: string): Promise<void> => {
  try {
    const existingUUIDs = await getAppCreatedWorkoutUUIDs();
    existingUUIDs.delete(uuid);
    await AsyncStorage.setItem(APP_CREATED_WORKOUTS_KEY, JSON.stringify([...existingUUIDs]));
  } catch (error) {
    console.error('Error removing app-created workout UUID:', error);
  }
};

/**
 * Check if a workout can be deleted by this app
 */
export const canDeleteWorkout = async (uuid: string): Promise<boolean> => {
  try {
    const appCreatedUUIDs = await getAppCreatedWorkoutUUIDs();
    return appCreatedUUIDs.has(uuid);
  } catch (error) {
    console.error('Error checking if workout can be deleted:', error);
    return false;
  }
};

/**
 * Clear all stored UUIDs (for testing/debugging)
 */
export const clearAppCreatedWorkoutUUIDs = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(APP_CREATED_WORKOUTS_KEY);
  } catch (error) {
    console.error('Error clearing app-created workout UUIDs:', error);
  }
};
