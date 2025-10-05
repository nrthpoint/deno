import { TimeRange } from '@/config/timeRanges';
import { createStatCalculator } from '@/grouping-engine/GroupStatCalculator';
import { GroupConfig } from '@/grouping-engine/types/GroupConfig';
import { GroupingParameters, IndividualSampleParserParams } from '@/grouping-engine/types/Grouping';
import { createEmptyGroup } from '@/grouping-engine/utils/createEmptyGroup';
import { Groups } from '@/types/Groups';
import { sumQuantities } from '@/utils/quantity';
import { assignRankToGroups, sortGroupsByKeyInAscending } from '@/utils/sort';

/**
 * Generic grouping engine that can group workouts by any property
 */
export function groupWorkouts(
  params: GroupingParameters,
  config: GroupConfig,
  timeRangeInDays: TimeRange,
): Groups {
  const { samples, distanceUnit } = params;
  const { groupSize = config.defaultGroupSize } = params;

  const filteredSamples = config.filter ? samples.filter(config.filter) : samples;

  if (filteredSamples.length === 0) {
    console.warn(`No samples found for grouping by ${config.type}`);
    return {};
  }

  const groups: Groups = {};

  // Group all samples - every sample will be placed in exactly one group
  for (const sample of filteredSamples) {
    parseSampleIntoGroup({
      sample,
      groups,
      groupSize,
      distanceUnit,
      config,
    });
  }

  deleteEmptyGroups(groups);

  const statCalculator = createStatCalculator(config);

  for (const groupKey in groups) {
    statCalculator.calculateStats(groups[groupKey], filteredSamples, timeRangeInDays);
  }

  assignRankToGroups(groups);

  return sortGroupsByKeyInAscending(groups);
}

/**
 * Calculates the nearest group key and creates a unique group identifier
 */
function calculateGroupKey(
  value: number,
  groupSize: number,
  isIndoor: boolean,
): {
  nearestGroup: number;
  baseGroupKey: string;
  groupKey: string;
} {
  // Calculate the nearest group based on groupSize, rounding down
  const nearestGroup = Math.floor(value / groupSize) * groupSize;

  // Create a string key for the group INCLUDING indoor/outdoor designation
  const baseGroupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);
  const indoorSuffix = isIndoor ? '-indoor' : '-outdoor';
  const groupKey = baseGroupKey + indoorSuffix;

  return { nearestGroup, baseGroupKey, groupKey };
}

/**
 * Parses a single sample into the appropriate group
 * Every sample is guaranteed to be placed in exactly one group based on its calculated group key
 */
function parseSampleIntoGroup({
  sample,
  groups,
  groupSize,
  distanceUnit,
  config,
}: Omit<IndividualSampleParserParams, 'tolerance'> & { config: GroupConfig }): void {
  const value = config.valueExtractor(sample);

  if (!value || value.quantity === undefined) {
    console.warn(`Sample missing ${config.property}, skipping`);
    return;
  }

  // Calculate group key and nearest group value
  const { baseGroupKey, groupKey } = calculateGroupKey(value.quantity, groupSize, sample.isIndoor);

  // Create or get the group for the current sample
  const group =
    groups[groupKey] ||
    (groups[groupKey] = createEmptyGroup(baseGroupKey, sample, config, distanceUnit, groupSize));

  // Add indoor/outdoor designation to the group
  if (!group.isIndoor) {
    group.isIndoor = sample.isIndoor;
  }

  // Add the sample to the group - every sample is always included
  group.runs.push(sample);

  // Aggregate the totals
  group.totalDistance = sumQuantities([group.totalDistance, sample.distance]);
  group.totalDuration = sumQuantities([group.totalDuration, sample.duration]);
  group.totalElevation = sumQuantities([
    group.totalElevation,
    sample.elevation || { unit: 'm', quantity: 0 },
  ]);

  // Update most recent run
  if (sample.startDate > group.mostRecent.startDate) {
    group.mostRecent = sample;
  }
}

/**
 * Deletes groups that have no runs
 */
function deleteEmptyGroups(groups: Groups): void {
  for (const groupKey in groups) {
    if (groups[groupKey].runs.length === 0) {
      delete groups[groupKey];
    }
  }
}
