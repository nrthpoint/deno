import { groupRunsByAltitude } from '@/hooks/useGroupedActivityData/altitude/groupByAltitude';
import { groupRunsByDistance } from '@/hooks/useGroupedActivityData/distance/groupByDistance';
import { groupRunsByPace } from '@/hooks/useGroupedActivityData/pace/groupByPace';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GroupType, Groups, GROUP_TYPES } from '@/types/Groups';

type UseWorkoutGroupingParams = {
  workouts: ExtendedWorkout[];
  groupType: GroupType;
  tolerance: number;
  groupSize: number;
};

export function useWorkoutGrouping({
  workouts,
  groupType,
  tolerance,
  groupSize,
}: UseWorkoutGroupingParams): Groups {
  if (workouts.length === 0) {
    return {};
  }

  switch (groupType) {
    case GROUP_TYPES.Distance:
      return groupRunsByDistance({ samples: workouts, tolerance, groupSize });
    case GROUP_TYPES.Pace:
      return groupRunsByPace({ samples: workouts, tolerance, groupSize });
    case GROUP_TYPES.Altitude:
      return groupRunsByAltitude({ samples: workouts, tolerance, groupSize });
    default:
      return groupRunsByDistance({ samples: workouts, tolerance, groupSize });
  }
}
