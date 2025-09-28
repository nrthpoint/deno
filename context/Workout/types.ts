import {
  AuthorizationRequestStatus,
  LengthUnit,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';

import { TimeRange } from '@/config/timeRanges';
import { WorkoutAction } from '@/context/Workout/actions';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

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

export type WorkoutState = {
  workoutCache: Map<string, WorkoutQueryResult>;
  selectedWorkout: ExtendedWorkout | null;
  selectedWorkouts: ExtendedWorkout[];
  authorizationStatus: AuthorizationRequestStatus;
};

export interface WorkoutContextType {
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
