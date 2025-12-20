import {
  AuthorizationRequestStatus,
  deleteObjects,
  queryWorkoutSamples,
  saveWorkoutSample,
  useHealthkitAuthorization,
  WorkoutQueryOptions,
} from '@kingstinct/react-native-healthkit';
import { usePostHog } from 'posthog-react-native';
import { createContext, ReactNode, useCallback, useEffect, useMemo, useReducer } from 'react';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutSubscription } from '@/hooks/useWorkoutSubscription';
import { handleAchievementNotifications } from '@/services/achievements';
import { addAppCreatedWorkoutUUID, removeAppCreatedWorkoutUUID } from '@/services/workoutStorage';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { logError } from '@/utils/analytics';
import { parseWorkoutSamples } from '@/utils/parser/parser';

import { WORKOUT_ACTIONS } from './actions';
import { workoutReducer } from './reducer';
import { SaveWorkoutParams, WorkoutContextType, WorkoutQuery, WorkoutQueryResult } from './types';
import { generateQueryKey } from './utils';

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const EMPTY_WORKOUT_GROUP: WorkoutQueryResult = {
  samples: [],
  loading: false,
  meta: {
    totalRuns: 0,
    totalDistance: {
      quantity: 0,
      unit: 'm',
    },
  },
  lastFetched: 0,
};

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const posthog = usePostHog();
  const { activityType, distanceUnit, timeRangeInDays } = useSettings();
  const [_authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    SampleTypesToRead,
    SampleTypesToWrite,
  );

  const initialState = {
    workoutCache: new Map(),
    selectedWorkouts: [],
    authorizationStatus: _authorizationStatus || AuthorizationRequestStatus.unknown,
  };

  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const defaultQuery = useMemo<WorkoutQuery>(
    () => ({
      activityType,
      distanceUnit,
      timeRangeInDays,
    }),
    [activityType, distanceUnit, timeRangeInDays],
  );

  const fetchWorkouts = useCallback(
    async (query?: Partial<WorkoutQuery>) => {
      const fullQuery: WorkoutQuery = {
        ...defaultQuery,
        ...query,
      };

      const queryKey = generateQueryKey(fullQuery);

      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, queryKey });

      try {
        if (_authorizationStatus !== AuthorizationRequestStatus.unnecessary) {
          logError(posthog, new Error('Authorization not granted'), {
            component: 'WorkoutProvider',
            action: 'fetchWorkouts',
            authorization_status: _authorizationStatus,
          });
          return;
        }

        const startDate = new Date(Date.now() - fullQuery.timeRangeInDays * 24 * 60 * 60 * 1000);
        const endDate = new Date();
        const options = {
          ascending: false,
          limit: 10000,
          filter: {
            workoutActivityType: 37,
            startDate,
            endDate,
          },
        } satisfies WorkoutQueryOptions;

        const originalSamples = await queryWorkoutSamples(options);

        const filteredSamples = originalSamples.filter((sample) => {
          return !fullQuery.activityType || sample.workoutActivityType === 37;
        });

        const parsedWorkouts = await parseWorkoutSamples({
          samples: filteredSamples,
          distanceUnit: fullQuery.distanceUnit,
        });

        const meta = {
          totalRuns: parsedWorkouts.length,
          totalDistance: {
            quantity: parsedWorkouts.reduce(
              (acc, sample) => acc + (sample?.distance?.quantity ?? 0),
              0,
            ),
            unit: fullQuery.distanceUnit,
          },
        };

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
        logError(posthog, error, {
          component: 'WorkoutProvider',
          action: 'fetchWorkouts',
          query_key: queryKey,
        });

        dispatch({
          type: WORKOUT_ACTIONS.SET_WORKOUT_DATA,
          queryKey,
          data: {
            samples: [],
            meta: { totalRuns: 0, totalDistance: { quantity: 0, unit: fullQuery.distanceUnit } },
            lastFetched: Date.now(),
          },
        });
      }
    },
    [_authorizationStatus, defaultQuery, posthog],
  );

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

        await removeAppCreatedWorkoutUUID(workout.uuid);

        dispatch({ type: WORKOUT_ACTIONS.REMOVE_WORKOUT_FROM_CACHE, workoutUuid: workout.uuid });

        console.log(`Successfully deleted workout with id: ${workout.uuid}`);
      } catch (error) {
        logError(posthog, error, {
          component: 'WorkoutProvider',
          action: 'deleteWorkout',
          workout_uuid: workout.uuid,
        });

        throw error;
      }
    },
    [posthog],
  );

  const saveWorkout = useCallback(
    async (params: SaveWorkoutParams) => {
      const { activityType, startDate, durationInMinutes, distance, isIndoor } = params;
      const { unit: distanceUnit, quantity: distanceValue } = distance;

      const endDate = new Date(startDate.getTime() + durationInMinutes * 60 * 1000);
      const distanceInMeters =
        distanceUnit === 'mi' ? distanceValue * 1609.34 : distanceValue * 1000;

      const result = await saveWorkoutSample(
        activityType,
        [], // No quantity samples
        startDate,
        endDate,
        {
          distance: distanceInMeters,
          energyBurned: undefined,
        },
        {
          HKIndoorWorkout: isIndoor,
          HKWasUserEntered: true,
        },
      );

      await addAppCreatedWorkoutUUID(result.uuid);
      await fetchWorkouts();

      return result;
    },
    [fetchWorkouts],
  );

  const workouts = useMemo(() => {
    const queryKey = generateQueryKey(defaultQuery);

    return state.workoutCache.get(queryKey) || EMPTY_WORKOUT_GROUP;
  }, [state.workoutCache, defaultQuery]);

  useEffect(() => {
    if (_authorizationStatus !== null) {
      dispatch({ type: WORKOUT_ACTIONS.SET_AUTHORIZATION_STATUS, status: _authorizationStatus });
    }

    if (_authorizationStatus === AuthorizationRequestStatus.unnecessary) {
      void fetchWorkouts();
    }
  }, [_authorizationStatus, fetchWorkouts]);

  useWorkoutSubscription(fetchWorkouts);

  const { selectedWorkouts, authorizationStatus } = state;

  return (
    <WorkoutContext.Provider
      value={{
        state,
        dispatch,
        query: defaultQuery,

        authorizationStatus,
        requestAuthorization,

        selectedWorkouts,
        setSelectedWorkouts,

        workouts,
        saveWorkout,
        deleteWorkout,
        fetchWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
