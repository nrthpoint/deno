import { WorkoutGroupWithHighlightSet } from '@/types/workout';
import { groupRunsByDistance } from '@/utils/grouping/groupByDistance';
import { groupRunsByPace } from '@/utils/grouping/groupByPace';
import { parseWorkoutSamples } from '@/utils/parser';
import {
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';

export type GroupType = 'distance' | 'pace' | 'weather';
export const GROUP_TYPES = {
  Distance: 'distance' as GroupType,
  Pace: 'pace' as GroupType,
  Weather: 'weather' as GroupType,
};

type UseGroupedActivityDataParams = {
  activityType?: WorkoutActivityType;
  distanceUnit?: LengthUnit;
  timeRangeInDays?: number;
  groupType?: GroupType;
};

export function useGroupedActivityData({
  activityType = WorkoutActivityType.running,
  distanceUnit = 'mi',
  timeRangeInDays = 365,
  groupType = GROUP_TYPES.Distance,
}: UseGroupedActivityDataParams = {}) {
  const [groups, setGroups] = useState<WorkoutGroupWithHighlightSet>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const authorized = await isProtectedDataAvailable();

        if (!authorized) {
          console.log('Authorization not granted');
          setLoading(false);
          return;
        }

        const startDate = new Date(Date.now() - timeRangeInDays * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        // TODO: Filtering by activity type is not working as expected
        const samples = await queryWorkoutSamples({
          ascending: false,
          limit: 10000,
          filter: {
            startDate,
            endDate,
          },
        });

        const convertedRuns = parseWorkoutSamples({ samples, distanceUnit });

        if (convertedRuns.length === 0) {
          setGroups({});
          setLoading(false);

          return;
        }

        switch (groupType) {
          case GROUP_TYPES.Distance:
            setGroups(groupRunsByDistance(convertedRuns));
            break;
          case GROUP_TYPES.Pace:
            setGroups(groupRunsByPace(convertedRuns));
            break;
          default:
            setGroups(groupRunsByDistance(convertedRuns));
            break;
        }
      } catch (error) {
        console.error('Error fetching runs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [distanceUnit, timeRangeInDays, groupType, activityType]);

  return { groups, loading };
}
