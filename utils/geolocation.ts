import { ExtendedWorkout } from '@/types/ExtendedWorkout';

/**
 * Get location coordinates from workout route
 */
export async function getWorkoutLocation(
  workout: ExtendedWorkout,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const routes = await workout.proxy.getWorkoutRoutes();

    if (
      !routes ||
      routes.length === 0 ||
      !routes[0].locations ||
      routes[0].locations.length === 0
    ) {
      return null;
    }

    // Use the first location point as the workout location
    const firstLocation = routes[0].locations[0];

    return {
      latitude: firstLocation.latitude,
      longitude: firstLocation.longitude,
    };
  } catch (error) {
    console.error('Error getting workout location:', error);
    return null;
  }
}
