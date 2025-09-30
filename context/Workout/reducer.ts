import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { WORKOUT_ACTIONS, WorkoutAction } from './actions';
import { WorkoutState } from './types';

export const workoutReducer = (state: WorkoutState, action: WorkoutAction): WorkoutState => {
  switch (action.type) {
    case WORKOUT_ACTIONS.SET_LOADING: {
      const newCache = new Map(state.workoutCache);
      const existing = newCache.get(action.queryKey) || {
        samples: [],
        meta: { totalRuns: 0, totalDistance: { quantity: 0, unit: 'meter' as LengthUnit } },
        loading: true,
        lastFetched: 0,
      };
      newCache.set(action.queryKey, { ...existing, loading: true });
      return { ...state, workoutCache: newCache };
    }

    case WORKOUT_ACTIONS.SET_WORKOUT_DATA: {
      const newCache = new Map(state.workoutCache);

      newCache.set(action.queryKey, { ...action.data, loading: false });

      return { ...state, workoutCache: newCache };
    }

    case WORKOUT_ACTIONS.SET_SELECTED_WORKOUTS:
      return { ...state, selectedWorkouts: action.workouts };

    case WORKOUT_ACTIONS.SET_AUTHORIZATION_STATUS:
      return { ...state, authorizationStatus: action.status };

    case WORKOUT_ACTIONS.REMOVE_WORKOUT_FROM_CACHE: {
      const newCache = new Map(state.workoutCache);

      for (const [key, queryResult] of newCache.entries()) {
        const filteredSamples = queryResult.samples.filter((w) => w.uuid !== action.workoutUuid);

        if (filteredSamples.length !== queryResult.samples.length) {
          newCache.set(key, {
            ...queryResult,
            samples: filteredSamples,
            meta: {
              totalRuns: filteredSamples.length,
              totalDistance: {
                quantity: filteredSamples.reduce(
                  (acc, sample) => acc + (sample?.totalDistance?.quantity ?? 0),
                  0,
                ),
                unit: queryResult.meta.totalDistance.unit,
              },
            },
          });
        }
      }
      return { ...state, workoutCache: newCache };
    }

    default:
      return state;
  }
};
