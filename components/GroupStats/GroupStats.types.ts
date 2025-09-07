import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, MetaWorkoutData } from '@/types/Groups';

export type TabType = 'stats' | 'predictions' | 'compare';

export interface GroupStatsProps {
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
}

export interface TabContentProps {
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
}
