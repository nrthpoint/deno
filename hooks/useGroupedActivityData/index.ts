import {
  AuthorizationRequestStatus,
  isProtectedDataAvailable,
  LengthUnit,
  queryWorkoutSamples,
  useHealthkitAuthorization,
  WorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';

import { AllSampleTypesInApp } from '@/config/sampleIdentifiers';
import { groupRunsByAltitude } from '@/hooks/useGroupedActivityData/altitude/groupByAltitude';
import { groupRunsByDistance } from '@/hooks/useGroupedActivityData/distance/groupByDistance';
import { groupRunsByPace } from '@/hooks/useGroupedActivityData/pace/groupByPace';
import { GroupType, Groups, MetaWorkoutData, GROUP_TYPES } from '@/types/Groups';
import { parseWorkoutSamples } from '@/utils/parser';
import { newQuantity } from '@/utils/quantity';

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
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(AllSampleTypesInApp);
  const [groups, setGroups] = useState<Groups>({});
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
          console.error('useGroupedActivityData: Authorization not granted');

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
            workoutActivityType: activityType,
            startDate,
            endDate,
          },
        });

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

        const samples = await parseWorkoutSamples({ samples: filteredSamples, distanceUnit });

        if (samples.length === 0) {
          setGroups({});
          setLoading(false);

          return;
        }

        switch (groupType) {
          case GROUP_TYPES.Distance:
            setGroups(groupRunsByDistance({ samples, tolerance, groupSize }));
            break;
          case GROUP_TYPES.Pace:
            setGroups(groupRunsByPace({ samples, tolerance, groupSize }));
            break;
          case GROUP_TYPES.Altitude:
            setGroups(groupRunsByAltitude({ samples, tolerance, groupSize }));
            break;
          default:
            setGroups(groupRunsByDistance({ samples, tolerance, groupSize }));
            break;
        }
      } catch (error) {
        console.error('Error fetching runs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
      fetchRuns();
    }
  }, [
    distanceUnit,
    timeRangeInDays,
    groupType,
    activityType,
    tolerance,
    groupSize,
    authorizationStatus,
  ]);

  return { groups, meta, loading, authorizationStatus, requestAuthorization };
}
