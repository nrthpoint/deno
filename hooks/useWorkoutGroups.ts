import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';

import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { groupWorkouts } from '@/grouping-engine/GroupingEngine';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { GroupType } from '@/types/Groups';

type UseGroupedActivityDataParams = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: number;
  groupType: GroupType;
  tolerance: number;
  groupSize: number;
};

export function useWorkoutGroups({
  activityType,
  distanceUnit,
  timeRangeInDays,
  groupType,
  tolerance,
  groupSize,
}: UseGroupedActivityDataParams) {
  const { samples, meta, loading, authorizationStatus, requestAuthorization } = useWorkoutData({
    activityType,
    distanceUnit,
    timeRangeInDays,
  });

  const config = GROUPING_CONFIGS[groupType];

  const groups = groupWorkouts(
    {
      samples,
      tolerance: tolerance ?? config.defaultTolerance,
      groupSize: groupSize ?? config.defaultGroupSize,
      distanceUnit,
    },
    config,
  );

  return { groups, meta, loading, authorizationStatus, requestAuthorization };
}
