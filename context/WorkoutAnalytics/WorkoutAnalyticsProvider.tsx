import { createContext, ReactNode, useCallback, useReducer } from 'react';

import { WorkoutQuery } from '@/context/Workout';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { calculateProfileStats } from '@/utils/profileStats';

import { WORKOUT_ANALYTICS_ACTIONS } from './actions';
import { workoutAnalyticsReducer } from './reducer';
import { WeeklyTrendStats, WorkoutAnalytics, WorkoutAnalyticsContextType } from './types';
import { calculateWeeklyTrends, generateQueryKey } from './utils';

export const WorkoutAnalyticsContext = createContext<WorkoutAnalyticsContextType | undefined>(
  undefined,
);

export const WorkoutAnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(workoutAnalyticsReducer, {
    analyticsCache: new Map(),
    loading: new Map(),
  });

  const getWorkoutAnalytics = useCallback(
    async (workouts: ExtendedWorkout[], query: WorkoutQuery): Promise<WorkoutAnalytics> => {
      const queryKey = generateQueryKey(query);
      const cached = state.analyticsCache.get(queryKey);

      if (cached && cached.workoutCount === workouts.length) {
        const cacheAge = Date.now() - cached.lastCalculated;
        const maxCacheAge = 5 * 60 * 1000; // 5 minutes

        if (cacheAge < maxCacheAge) {
          return cached;
        }
      }

      dispatch({ type: WORKOUT_ANALYTICS_ACTIONS.SET_LOADING, queryKey, loading: true });

      try {
        const [profileStats, weeklyTrends] = await Promise.all([
          calculateProfileStats(workouts, query.distanceUnit),
          Promise.resolve(calculateWeeklyTrends(workouts)),
        ]);

        const analytics: WorkoutAnalytics = {
          profileStats,
          weeklyTrends,
          lastCalculated: Date.now(),
          workoutCount: workouts.length,
          queryKey,
        };

        dispatch({ type: WORKOUT_ANALYTICS_ACTIONS.SET_ANALYTICS, queryKey, analytics });

        return analytics;
      } catch (error) {
        console.error('Error calculating workout analytics:', error);

        dispatch({ type: WORKOUT_ANALYTICS_ACTIONS.SET_LOADING, queryKey, loading: false });

        throw error;
      }
    },
    [state.analyticsCache],
  );

  const getWeeklyTrends = useCallback(
    async (workouts: ExtendedWorkout[], query: WorkoutQuery): Promise<WeeklyTrendStats> => {
      const analytics = await getWorkoutAnalytics(workouts, query);

      return analytics.weeklyTrends;
    },
    [getWorkoutAnalytics],
  );

  const isLoading = useCallback(
    (query: WorkoutQuery): boolean => {
      const queryKey = generateQueryKey(query);

      return state.loading.get(queryKey) || false;
    },
    [state.loading],
  );

  const clearCache = useCallback((queryKey?: string) => {
    dispatch({ type: WORKOUT_ANALYTICS_ACTIONS.CLEAR_CACHE, queryKey });
  }, []);

  return (
    <WorkoutAnalyticsContext.Provider
      value={{
        getWorkoutAnalytics,
        getWeeklyTrends,
        isLoading,
        clearCache,
      }}
    >
      {children}
    </WorkoutAnalyticsContext.Provider>
  );
};
