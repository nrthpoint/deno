import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { useEffect } from 'react';

import { WorkoutQuery, useWorkout } from '@/context/Workout';

import { LengthUnit } from './useWorkoutSelectors';

export type MetaWorkoutData = {
  totalRuns: number;
  totalDistance: { quantity: number; unit: LengthUnit };
};

export const useWorkoutData = (query: WorkoutQuery) => {
  const { getWorkoutData, fetchWorkouts, authorizationStatus, requestAuthorization } = useWorkout();

  const DEFAULT_META: MetaWorkoutData = {
    totalRuns: 0,
    totalDistance: { quantity: 0, unit: query.distanceUnit },
  };

  const queryResult = getWorkoutData(query);
  const loading = queryResult?.loading ?? true;
  const meta = queryResult?.meta || DEFAULT_META;
  const samples = queryResult?.samples || [];

  useEffect(() => {
    if (authorizationStatus === AuthorizationRequestStatus.unnecessary && !queryResult) {
      fetchWorkouts(query);
    }
  }, [authorizationStatus, fetchWorkouts, query, queryResult]);

  return {
    samples,
    meta,
    loading,
    authorizationStatus,
    requestAuthorization,
  };
};
