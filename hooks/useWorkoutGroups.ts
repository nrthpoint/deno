import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { useMemo } from 'react';

import { TimeRange } from '@/config/timeRanges';
import { useWorkout } from '@/context/Workout';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { groupWorkouts } from '@/grouping-engine/GroupingEngine';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

type UseGroupedActivityDataParams = {
  activityType: WorkoutActivityType;
  distanceUnit: LengthUnit;
  timeRangeInDays: TimeRange;
  groupType: GroupType;
} & GroupingConfig;

export function useWorkoutGroups({
  distanceUnit,
  timeRangeInDays,
  groupType,
  tolerance,
  groupSize,
}: UseGroupedActivityDataParams) {
  const { workouts, authorizationStatus, requestAuthorization } = useWorkout();
  const { samples, loading, meta } = workouts;

  const config = GROUPING_CONFIGS[groupType];

  const groups = useMemo(() => {
    if (loading || samples.length === 0) {
      return {};
    }

    return groupWorkouts(
      {
        samples,
        tolerance,
        groupSize,
        distanceUnit,
      },
      config,
      timeRangeInDays,
    );
  }, [samples, tolerance, groupSize, distanceUnit, config, timeRangeInDays, loading]);

  return { groups, meta, samples, loading, authorizationStatus, requestAuthorization };
}
