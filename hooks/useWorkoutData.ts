import {
  AuthorizationRequestStatus,
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  useHealthkitAuthorization,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';

import { AllSampleTypesInApp } from '@/config/sampleIdentifiers';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { parseWorkoutSamples } from '@/utils/parser';

type UseWorkoutDataParams = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: number;
};

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: { quantity: number; unit: LengthUnit };
};

export function useWorkoutData({
  activityType,
  distanceUnit,
  timeRangeInDays,
}: UseWorkoutDataParams) {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(AllSampleTypesInApp);
  const [workouts, setWorkouts] = useState<ExtendedWorkout[]>([]);
  const [meta, setMeta] = useState<MetaWorkoutData>({
    totalRuns: 0,
    totalDistance: { quantity: 0, unit: distanceUnit },
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);

        const authorized = await isProtectedDataAvailable();

        if (!authorized) {
          console.error('useWorkoutData: Authorization not granted');
          setLoading(false);
          return;
        }

        const startDate = new Date(Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        const originalSamples = await queryWorkoutSamples({
          ascending: false,
          limit: 10000,
          filter: {
            workoutActivityType: activityType,
            startDate,
            endDate,
          },
        });

        // Filter samples by activity type if specified
        const filteredSamples = originalSamples.filter((sample) => {
          return !activityType || sample.workoutActivityType === activityType;
        });

        setMeta({
          totalRuns: filteredSamples.length,
          totalDistance: {
            quantity: filteredSamples.reduce(
              (acc, sample) => acc + (sample?.totalDistance?.quantity ?? 0),
              0,
            ),
            unit: distanceUnit,
          },
        });

        const parsedWorkouts = await parseWorkoutSamples({
          samples: filteredSamples,
          distanceUnit,
        });

        setWorkouts(parsedWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
      fetchWorkouts();
    }
  }, [distanceUnit, timeRangeInDays, activityType, authorizationStatus]);

  return { workouts, meta, loading, authorizationStatus, requestAuthorization };
}
