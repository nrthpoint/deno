import { WorkoutAnalytics } from './types';

export const WORKOUT_ANALYTICS_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ANALYTICS: 'SET_ANALYTICS',
  CLEAR_CACHE: 'CLEAR_CACHE',
} as const;

export type WorkoutAnalyticsAction =
  | { type: typeof WORKOUT_ANALYTICS_ACTIONS.SET_LOADING; queryKey: string; loading: boolean }
  | {
      type: typeof WORKOUT_ANALYTICS_ACTIONS.SET_ANALYTICS;
      queryKey: string;
      analytics: WorkoutAnalytics;
    }
  | { type: typeof WORKOUT_ANALYTICS_ACTIONS.CLEAR_CACHE; queryKey?: string };
