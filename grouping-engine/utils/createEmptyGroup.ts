import { LengthUnit } from '@kingstinct/react-native-healthkit';

import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, GroupType } from '@/types/Groups';
import { newQuantity } from '@/utils/quantity';

/**
 * Creates an empty group with all default properties
 */
export function createEmptyGroup(
  key: string,
  sample: ExtendedWorkout,
  config: GroupConfig,
  distanceUnit: LengthUnit,
  groupSize: number,
): Group {
  return {
    key,
    type: config.type,
    unit: config.unitFormatter(key, sample, distanceUnit),
    title:
      config.titleFormatter?.({
        key,
        sample,
        distanceUnit,
        groupSize,
        useBidirectionalTolerance: config.useBidirectionalTolerance,
      }) ?? key,
    suffix: config.suffixFormatter(distanceUnit),
    rank: 0,
    skipped: 0,
    rankLabel: '',
    runs: [],
    highlight: sample,
    worst: sample,
    greatestElevation: sample,
    lowestElevation: sample,
    mostRecent: sample,
    oldest: sample,
    percentageOfTotalWorkouts: 0,
    totalVariation: newQuantity(0, getVariationUnit(config.type, distanceUnit)),
    totalDistance: newQuantity(0, distanceUnit),
    totalDuration: newQuantity(0, 's'),
    totalElevation: newQuantity(0, 'm'),
    averagePace: newQuantity(0, `min/${distanceUnit}`),
    averageHumidity: newQuantity(0, '%'),
    averageDuration: newQuantity(0, 's'),
    averageDistance: newQuantity(0, distanceUnit),
    averageElevation: newQuantity(0, 'm'),
    averageTemperature: newQuantity(0, '°C'),
    prettyPace: '',
    prettyName: ``,
    variantDistribution: [],
    stats: [],
    predictions: {
      prediction4Week: null,
      prediction12Week: null,
    },
  } satisfies Group;
}

/**
 * Gets the appropriate unit for variation calculation based on group type
 */
function getVariationUnit(groupType: GroupType, distanceUnit: LengthUnit): string {
  switch (groupType) {
    case 'distance':
      return 's'; // duration variation for distance groups
    case 'pace':
      return distanceUnit; // distance variation for pace groups
    case 'elevation':
      return 'm'; // elevation variation for elevation groups
    default:
      return 's';
  }
}
