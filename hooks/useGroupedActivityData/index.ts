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
  const { workouts, meta, loading, authorizationStatus, requestAuthorization } = useWorkoutData({
    activityType,
    distanceUnit,
    timeRangeInDays,
  });

  const groups = useWorkoutGrouping({
    workouts,
    groupType,
    tolerance,
    groupSize,
  });

  return { groups, meta, loading, authorizationStatus, requestAuthorization };
}
