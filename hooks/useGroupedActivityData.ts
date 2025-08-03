import { MetaWorkoutData, WorkoutGroupWithHighlightSet } from '@/types/workout';
import { groupRunsByDistance } from '@/utils/grouping/distance/groupByDistance';
import { groupRunsByPace } from '@/utils/grouping/pace/groupByPace';
import { parseWorkoutSamples } from '@/utils/parser';
import { newQuantity } from '@/utils/quantity';
import {
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';

export type GroupType = 'distance' | 'pace';
export const GROUP_TYPES = {
  Distance: 'distance' as GroupType,
  Pace: 'pace' as GroupType,
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
  const [meta, setMeta] = useState<MetaWorkoutData>({
    totalRuns: 0,
    totalDistance: { quantity: 0, unit: distanceUnit },
  });
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
        const originalSamples = await queryWorkoutSamples({
          ascending: false,
          limit: 10000,
          filter: {
            startDate,
            endDate,
          },
        });

        console.log(`Fetched ${originalSamples.length} samples from HealthKit`);

        // Filter samples by activity type if specified
        const filteredSamples = originalSamples.filter((sample) => {
          return !activityType || sample.workoutActivityType === activityType;
        });

        setMeta({
          totalRuns: filteredSamples.length,
          totalDistance: newQuantity(
            filteredSamples.reduce(
              (acc, sample) => acc + (sample?.totalDistance?.quantity ?? 0),
              0,
            ),
            distanceUnit,
          ),
        });

        const samples = parseWorkoutSamples({ samples: filteredSamples, distanceUnit });

        if (samples.length === 0) {
          setGroups({});
          setLoading(false);

          return;
        }

        switch (groupType) {
          case GROUP_TYPES.Distance:
            setGroups(groupRunsByDistance({ samples }));
            break;
          case GROUP_TYPES.Pace:
            setGroups(groupRunsByPace({ samples }));
            break;
          default:
            setGroups(groupRunsByDistance({ samples }));
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

  return { groups, meta, loading };
}
