import { LengthUnit } from '@kingstinct/react-native-healthkit';
import { useCallback } from 'react';

import { useWorkout, WorkoutQuery } from '@/context/Workout';

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

export { LengthUnit };
