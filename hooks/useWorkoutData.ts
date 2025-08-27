import {
  AuthorizationRequestStatus,
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  useHealthkitAuthorization,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';
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
  const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    SampleTypesToRead,
    SampleTypesToWrite,
  );
  const [samples, setSamples] = useState<ExtendedWorkout[]>([]);
  const [meta, setMeta] = useState<MetaWorkoutData>({
    totalRuns: 0,
    totalDistance: { quantity: 0, unit: distanceUnit },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);

      const authorized = await isProtectedDataAvailable();

      if (!authorized) {
        console.error('useWorkoutData: Authorization not granted.');
        setLoading(false);
        return;
      }

      // Clear any refresh flag since we're fetching now
      await AsyncStorage.removeItem('workoutDataNeedsRefresh');

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

      setSamples(parsedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distanceUnit, timeRangeInDays, activityType, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
      fetchWorkouts();
    }
  }, [fetchWorkouts, authorizationStatus]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
        // Check if we need to refresh due to new workout being added
        AsyncStorage.getItem('workoutDataNeedsRefresh').then((needsRefresh) => {
          if (needsRefresh) {
            refresh();
          }
        });
      }
    }, [authorizationStatus, refresh]),
  );

  return {
    samples,
    meta,
    loading,
    authorizationStatus,
    requestAuthorization,
    refresh,
  };
}
