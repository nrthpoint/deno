import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Groups, Group } from '@/types/Groups';

export interface GroupingParameters {
  tolerance?: number; // Tolerance for grouping runs by distance/pace
  groupSize?: number; // Size of groupings (e.g., 0.5 mile increments, 0.5 minute pace increments)
  samples: readonly ExtendedWorkout[];
}

export interface GroupingSampleParserParams {
  sample: ExtendedWorkout;
  groups: Groups;
  tolerance?: number;
  groupSize?: number;
}

export interface GroupingStatsParams {
  group: Group;
  samples: readonly ExtendedWorkout[];
}
