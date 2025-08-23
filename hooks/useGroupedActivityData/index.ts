import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';

import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useWorkoutGrouping } from '@/hooks/useWorkoutGrouping';
import { GroupType } from '@/types/Groups';

type UseGroupedActivityDataParams = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: number;
  groupType: GroupType;
  tolerance: number;
  groupSize: number;
};

export function useGroupedActivityData({
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

  const groups = useWorkoutGrouping({
    samples,
    groupType,
    tolerance,
    groupSize,
    distanceUnit,
  });

  return { groups, meta, loading, authorizationStatus, requestAuthorization };
}
