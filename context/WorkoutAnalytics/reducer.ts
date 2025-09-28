import { WORKOUT_ANALYTICS_ACTIONS, WorkoutAnalyticsAction } from './actions';
import { WorkoutAnalyticsState } from './types';

export const workoutAnalyticsReducer = (
  state: WorkoutAnalyticsState,
  action: WorkoutAnalyticsAction,
): WorkoutAnalyticsState => {
  switch (action.type) {
    case WORKOUT_ANALYTICS_ACTIONS.SET_LOADING: {
      const newLoading = new Map(state.loading);

      newLoading.set(action.queryKey, action.loading);

      return { ...state, loading: newLoading };
    }

    case WORKOUT_ANALYTICS_ACTIONS.SET_ANALYTICS: {
      const newCache = new Map(state.analyticsCache);
      const newLoading = new Map(state.loading);

      newCache.set(action.queryKey, action.analytics);
      newLoading.set(action.queryKey, false);

      return { ...state, analyticsCache: newCache, loading: newLoading };
    }

    case WORKOUT_ANALYTICS_ACTIONS.CLEAR_CACHE: {
      if (action.queryKey) {
        const newCache = new Map(state.analyticsCache);
        const newLoading = new Map(state.loading);

        newCache.delete(action.queryKey);
        newLoading.delete(action.queryKey);

        return { ...state, analyticsCache: newCache, loading: newLoading };
      }
      return { analyticsCache: new Map(), loading: new Map() };
    }

    default:
      return state;
  }
};
