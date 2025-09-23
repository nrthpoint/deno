import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { useMemo } from 'react';

import { TimeRange } from '@/config/timeRanges';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { groupWorkouts } from '@/grouping-engine/GroupingEngine';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { GroupType } from '@/types/Groups';

type UseGroupedActivityDataParams = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: TimeRange;
  groupType: GroupType;
  enabled: boolean;
  tolerance?: number;
  groupSize?: number;
};

export function useWorkoutGroups({
  activityType,
  distanceUnit,
  timeRangeInDays,
  groupType,
  enabled,
  tolerance,
  groupSize,
}: UseGroupedActivityDataParams) {
  const { samples, meta, loading, authorizationStatus, requestAuthorization, refresh } =
    useWorkoutData({
      activityType,
      distanceUnit,
      timeRangeInDays,
    });

  const config = GROUPING_CONFIGS[groupType];

  // Memoize the expensive groupWorkouts calculation
  const groups = useMemo(() => {
    if (loading || samples.length === 0) {
      return {};
    }

    return groupWorkouts(
      {
        samples,
        enabled,
        tolerance: tolerance ?? config.defaultTolerance,
        groupSize: groupSize ?? config.defaultGroupSize,
        distanceUnit,
      },
      config,
      timeRangeInDays,
    );
  }, [samples, enabled, tolerance, groupSize, distanceUnit, config, timeRangeInDays, loading]);

  return { groups, meta, samples, loading, authorizationStatus, requestAuthorization, refresh };
}
