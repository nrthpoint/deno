import { WorkoutQuery } from '@/context/WorkoutContext';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { ProfileStats } from '@/utils/profileStats';

export interface WeeklyTrendStats {
  fastestDay: {
    dayName: string;
    dayIndex: number;
    count: number;
    averagePace: number;
  };
  longestDay: {
    dayName: string;
    dayIndex: number;
    count: number;
    averageDuration: number;
  };
  shortestDay: {
    dayName: string;
    dayIndex: number;
    count: number;
    averageDuration: number;
  };
  highestElevationDay: {
    dayName: string;
    dayIndex: number;
    count: number;
    averageElevation: number;
  };
  furthestDay: {
    dayName: string;
    dayIndex: number;
    count: number;
    averageDistance: number;
  };
  dayDistribution: {
    dayName: string;
    dayIndex: number;
    count: number;
    percentage: number;
  }[];
}

export interface WorkoutAnalytics {
  profileStats: ProfileStats;
  weeklyTrends: WeeklyTrendStats;
  lastCalculated: number;
  workoutCount: number;
  queryKey: string;
}

export type WorkoutAnalyticsState = {
  analyticsCache: Map<string, WorkoutAnalytics>;
  loading: Map<string, boolean>;
};

export interface WorkoutAnalyticsContextType {
  getWorkoutAnalytics: (
    workouts: ExtendedWorkout[],
    query: WorkoutQuery,
    force?: boolean,
  ) => Promise<WorkoutAnalytics>;
  getWeeklyTrends: (
    workouts: ExtendedWorkout[],
    query: WorkoutQuery,
    force?: boolean,
  ) => Promise<WeeklyTrendStats>;
  isLoading: (query: WorkoutQuery) => boolean;
  clearCache: (queryKey?: string) => void;
}
