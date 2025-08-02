import {
  ExtendedWorkout,
  WorkoutGroupWithHighlight,
  WorkoutGroupWithHighlightSet,
} from '@/types/workout';

export interface GroupingParameters {
  tolerance?: number; // Tolerance for grouping runs by distance
  samples: readonly ExtendedWorkout[];
}

export interface GroupingSampleParserParams {
  sample: ExtendedWorkout;
  groups: WorkoutGroupWithHighlightSet;
  tolerance?: number;
}

export interface GroupingStatsParams {
  group: WorkoutGroupWithHighlight;
  samples: readonly ExtendedWorkout[];
}
