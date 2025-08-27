import { useHealthkitAuthorization } from '@kingstinct/react-native-healthkit';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';

/**
 * Hook to handle HealthKit authorization for workout operations.
 * Requests both read and write permissions for workout data.
 */
export function useWorkoutAuthorization() {
  const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    SampleTypesToRead,
    SampleTypesToWrite,
  );

  return { authorizationStatus, requestAuthorization };
}
