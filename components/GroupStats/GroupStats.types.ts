import { TimeRange } from '@/config/timeRanges';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType, MetaWorkoutData } from '@/types/Groups';

export type TabType = 'stats' | 'predictions' | 'compare';

export interface GroupStatsProps {
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
  groupType: GroupType;
  timeRangeInDays: TimeRange;
}

export interface TabContentProps {
  group: Group;
  meta: MetaWorkoutData;
  allWorkouts: ExtendedWorkout[];
  groupType: GroupType;
  timeRangeInDays: TimeRange;
}
