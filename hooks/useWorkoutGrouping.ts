import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { groupRunsByAltitude } from '@/hooks/useGroupedActivityData/altitude/groupByAltitude';
import { groupRunsByDistance } from '@/hooks/useGroupedActivityData/distance/groupByDistance';
import { groupRunsByPace } from '@/hooks/useGroupedActivityData/pace/groupByPace';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { GROUP_TYPES, GroupType, Groups } from '@/types/Groups';

type UseWorkoutGroupingParams = {
  samples: ExtendedWorkout[];
  groupType: GroupType;
  tolerance: number;
  groupSize: number;
  distanceUnit: LengthUnit;
};

export function useWorkoutGrouping({
  samples,
  groupType,
  tolerance,
  groupSize,
  distanceUnit,
}: UseWorkoutGroupingParams): Groups {
  if (samples.length === 0) {
    return {};
  }

  const params = { samples, tolerance, groupSize, distanceUnit };

  switch (groupType) {
    case GROUP_TYPES.Distance:
      return groupRunsByDistance(params);
    case GROUP_TYPES.Pace:
      return groupRunsByPace(params);
    case GROUP_TYPES.Altitude:
      return groupRunsByAltitude(params);
    default:
      return groupRunsByDistance(params);
  }
}
