import {
  AuthorizationRequestStatus,
  deleteObjects,
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  useHealthkitAuthorization,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';
import { TimeRange } from '@/config/timeRanges';
import { handleAchievementNotifications } from '@/services/achievements';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { parseWorkoutSamples } from '@/utils/parser';

const WORKOUT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_WORKOUT_DATA: 'SET_WORKOUT_DATA',
  SET_SELECTED_WORKOUT: 'SET_SELECTED_WORKOUT',
  SET_SELECTED_WORKOUTS: 'SET_SELECTED_WORKOUTS',
  SET_AUTHORIZATION_STATUS: 'SET_AUTHORIZATION_STATUS',
  REMOVE_WORKOUT_FROM_CACHE: 'REMOVE_WORKOUT_FROM_CACHE',
} as const;

export type WorkoutQuery = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: TimeRange;
};

export type WorkoutQueryResult = {
  samples: ExtendedWorkout[];
  meta: {
    totalRuns: number;
    totalDistance: { quantity: number; unit: LengthUnit };
  };
  loading: boolean;
  lastFetched: number;
};

type WorkoutState = {
  workoutCache: Map<string, WorkoutQueryResult>;
  selectedWorkout: ExtendedWorkout | null;
  selectedWorkouts: ExtendedWorkout[];
  authorizationStatus: AuthorizationRequestStatus;
};

type WorkoutAction =
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

interface WorkoutContextType {
  state: WorkoutState;
  selectedWorkout: ExtendedWorkout | null;
  selectedWorkouts: ExtendedWorkout[];
  authorizationStatus: AuthorizationRequestStatus;
  dispatch: React.Dispatch<WorkoutAction>;
  requestAuthorization: () => void;
  setSelectedWorkout: (workout: ExtendedWorkout | null) => void;
  setSelectedWorkouts: (workouts: ExtendedWorkout[]) => void;
  deleteWorkout: (workout: ExtendedWorkout) => Promise<void>;
  fetchWorkouts: (query: WorkoutQuery) => Promise<void>;
  getWorkoutData: (query: WorkoutQuery) => WorkoutQueryResult | null;
}

const generateQueryKey = (query: WorkoutQuery): string => {
  return `${query.activityType}-${query.distanceUnit}-${query.timeRangeInDays}`;
};

const workoutReducer = (state: WorkoutState, action: WorkoutAction): WorkoutState => {
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
    case WORKOUT_ACTIONS.SET_SELECTED_WORKOUT:
      return { ...state, selectedWorkout: action.workout };
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

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

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
    (query: WorkoutQuery): WorkoutQueryResult | null => {
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
        console.log('Attempting to delete workout with id:', workout.uuid);
        const resp = await deleteObjects('HKWorkoutTypeIdentifier', { uuid: workout.uuid });

        console.log('HealthKit delete response:', resp);

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
        dispatch,
        selectedWorkout: state.selectedWorkout,
        selectedWorkouts: state.selectedWorkouts,
        authorizationStatus: state.authorizationStatus,
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

export const useWorkout = () => {
  const context = useContext(WorkoutContext);

  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }

  return context;
};
