import {
  AuthorizationRequestStatus,
  LengthUnit,
  Quantity,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';

import { TimeRange } from '@/config/timeRanges';
import { WorkoutAction } from '@/context/Workout/actions';
import { ExtendedWorkout, WorkoutProxy } from '@/types/ExtendedWorkout';

export type WorkoutQuery = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: TimeRange;
};

type WorkoutQueryMeta = {
  totalRuns: number;
  totalDistance: { quantity: number; unit: LengthUnit };
};

export type WorkoutQueryResult = {
  samples: ExtendedWorkout[];
  meta: WorkoutQueryMeta;
  loading: boolean;
  lastFetched: number;
};

export type WorkoutState = {
  workoutCache: Map<string, WorkoutQueryResult>;
  selectedWorkouts: ExtendedWorkout[];
  authorizationStatus: AuthorizationRequestStatus;
};

export type SaveWorkoutParams = {
  startDate: Date;
  activityType: WorkoutActivityType;
  durationInMinutes: number;
  distance: Quantity;
  isIndoor: boolean;
};

export interface WorkoutContextType {
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
  query: WorkoutQuery;

  authorizationStatus: AuthorizationRequestStatus;
  requestAuthorization: () => Promise<AuthorizationRequestStatus>;

  selectedWorkouts: ExtendedWorkout[];
  setSelectedWorkouts: (workouts: ExtendedWorkout[]) => void;

  workouts: WorkoutQueryResult;
  fetchWorkouts: (query?: Partial<WorkoutQuery>) => Promise<void>;
  deleteWorkout: (workout: ExtendedWorkout) => Promise<void>;
  saveWorkout: (params: SaveWorkoutParams) => Promise<WorkoutProxy>;
}
