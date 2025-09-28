import {
  AuthorizationRequestStatus,
  deleteObjects,
  isProtectedDataAvailable,
  queryWorkoutSamples,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { createContext, useReducer, ReactNode, useCallback, useEffect } from 'react';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';
import { handleAchievementNotifications } from '@/services/achievements';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { parseWorkoutSamples } from '@/utils/parser';

import { WORKOUT_ACTIONS } from './actions';
import { workoutReducer } from './reducer';
import { WorkoutContextType, WorkoutQuery } from './types';
import { generateQueryKey } from './utils';

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    SampleTypesToRead,
    SampleTypesToWrite,
  );

  const [state, dispatch] = useReducer(workoutReducer, {
    workoutCache: new Map(),
    selectedWorkout: null,
    selectedWorkouts: [],
    authorizationStatus: authorizationStatus || AuthorizationRequestStatus.unknown,
  });

  useEffect(() => {
    if (authorizationStatus !== null) {
      dispatch({ type: WORKOUT_ACTIONS.SET_AUTHORIZATION_STATUS, status: authorizationStatus });
    }
  }, [authorizationStatus]);

  const fetchWorkouts = useCallback(async (query: WorkoutQuery) => {
    const queryKey = generateQueryKey(query);
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, queryKey });

    try {
      const authorized = await isProtectedDataAvailable();
      if (!authorized) {
        console.error('WorkoutProvider: Authorization not granted.');
        return;
      }

      const startDate = new Date(Date.now() - query.timeRangeInDays * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const originalSamples = await queryWorkoutSamples({
        ascending: false,
        limit: 10000,
        filter: {
          workoutActivityType: query.activityType,
          startDate,
          endDate,
        },
      });

      const filteredSamples = originalSamples.filter((sample) => {
        return !query.activityType || sample.workoutActivityType === query.activityType;
      });

      const meta = {
        totalRuns: filteredSamples.length,
        totalDistance: {
          quantity: filteredSamples.reduce(
            (acc, sample) => acc + (sample?.totalDistance?.quantity ?? 0),
            0,
          ),
          unit: query.distanceUnit,
        },
      };

      const parsedWorkouts = await parseWorkoutSamples({
        samples: filteredSamples,
        distanceUnit: query.distanceUnit,
      });

      dispatch({
        type: WORKOUT_ACTIONS.SET_WORKOUT_DATA,
        queryKey,
        data: {
          samples: parsedWorkouts,
          meta,
          lastFetched: Date.now(),
        },
      });

      await handleAchievementNotifications(parsedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      dispatch({
        type: WORKOUT_ACTIONS.SET_WORKOUT_DATA,
        queryKey,
        data: {
          samples: [],
          meta: { totalRuns: 0, totalDistance: { quantity: 0, unit: query.distanceUnit } },
          lastFetched: Date.now(),
        },
      });
    }
  }, []);

  const getWorkoutData = useCallback(
    (query: WorkoutQuery) => {
      const queryKey = generateQueryKey(query);
      return state.workoutCache.get(queryKey) || null;
    },
    [state.workoutCache],
  );

  const setSelectedWorkout = useCallback((workout: ExtendedWorkout | null) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_SELECTED_WORKOUT, workout });
  }, []);

  const setSelectedWorkouts = useCallback((workouts: ExtendedWorkout[]) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_SELECTED_WORKOUTS, workouts });
  }, []);

  const deleteWorkout = useCallback(
    async (workout: ExtendedWorkout): Promise<void> => {
      try {
        const resp = await deleteObjects('HKWorkoutTypeIdentifier', { uuid: workout.uuid });

        if (!resp || resp === 0) {
          throw new Error(`Failed to delete workout with id: ${workout.uuid}`);
        }

        if (state.selectedWorkout?.uuid === workout.uuid) {
          dispatch({ type: WORKOUT_ACTIONS.SET_SELECTED_WORKOUT, workout: null });
        }

        dispatch({
          type: WORKOUT_ACTIONS.SET_SELECTED_WORKOUTS,
          workouts: state.selectedWorkouts.filter((w) => w.uuid !== workout.uuid),
        });

        dispatch({ type: WORKOUT_ACTIONS.REMOVE_WORKOUT_FROM_CACHE, workoutUuid: workout.uuid });
      } catch (error) {
        console.error('Failed to delete workout:', error);
        throw error;
      }
    },
    [state.selectedWorkout, state.selectedWorkouts],
  );

  return (
    <WorkoutContext.Provider
      value={{
        state,
        selectedWorkout: state.selectedWorkout,
        selectedWorkouts: state.selectedWorkouts,
        authorizationStatus: state.authorizationStatus,
        dispatch,
        requestAuthorization,
        setSelectedWorkout,
        setSelectedWorkouts,
        deleteWorkout,
        fetchWorkouts,
        getWorkoutData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
