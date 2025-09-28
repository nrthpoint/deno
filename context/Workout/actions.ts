import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { WorkoutQueryResult } from './types';

export const WORKOUT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_WORKOUT_DATA: 'SET_WORKOUT_DATA',
  SET_SELECTED_WORKOUT: 'SET_SELECTED_WORKOUT',
  SET_SELECTED_WORKOUTS: 'SET_SELECTED_WORKOUTS',
  SET_AUTHORIZATION_STATUS: 'SET_AUTHORIZATION_STATUS',
  REMOVE_WORKOUT_FROM_CACHE: 'REMOVE_WORKOUT_FROM_CACHE',
} as const;

export type WorkoutAction =
  | { type: typeof WORKOUT_ACTIONS.SET_LOADING; queryKey: string }
  | {
      type: typeof WORKOUT_ACTIONS.SET_WORKOUT_DATA;
      queryKey: string;
      data: Omit<WorkoutQueryResult, 'loading'>;
    }
  | { type: typeof WORKOUT_ACTIONS.SET_SELECTED_WORKOUT; workout: ExtendedWorkout | null }
  | { type: typeof WORKOUT_ACTIONS.SET_SELECTED_WORKOUTS; workouts: ExtendedWorkout[] }
  | { type: typeof WORKOUT_ACTIONS.SET_AUTHORIZATION_STATUS; status: AuthorizationRequestStatus }
  | { type: typeof WORKOUT_ACTIONS.REMOVE_WORKOUT_FROM_CACHE; workoutUuid: string };
