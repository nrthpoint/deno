import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { useCallback, useEffect } from 'react';

import { useWorkout, WorkoutQuery } from '@/context/WorkoutContext';

export const useWorkoutData = (query: WorkoutQuery) => {
  const { getWorkoutData, fetchWorkouts, authorizationStatus } = useWorkout();

  const queryResult = getWorkoutData(query);

  useEffect(() => {
    if (authorizationStatus === AuthorizationRequestStatus.unnecessary && !queryResult) {
      fetchWorkouts(query);
    }
  }, [authorizationStatus, fetchWorkouts, query, queryResult]);

  return {
    samples: queryResult?.samples || [],
    meta: queryResult?.meta || {
      totalRuns: 0,
      totalDistance: { quantity: 0, unit: query.distanceUnit },
    },
    loading: queryResult?.loading ?? true,
    authorizationStatus,
    requestAuthorization: useWorkout().requestAuthorization,
  };
};

export const useWorkoutSelection = () => {
  const { selectedWorkout, selectedWorkouts, setSelectedWorkout, setSelectedWorkouts } =
    useWorkout();

  return {
    selectedWorkout,
    selectedWorkouts,
    setSelectedWorkout,
    setSelectedWorkouts,
  };
};

export const useWorkoutActions = () => {
  const { deleteWorkout, fetchWorkouts } = useWorkout();

  const refetch = useCallback(
    (query: WorkoutQuery) => {
      fetchWorkouts(query);
    },
    [fetchWorkouts],
  );

  return {
    deleteWorkout,
    refetch,
  };
};
