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
  const {
    samples,
    tolerance = config.defaultTolerance,
    groupSize = config.defaultGroupSize,
  } = params;

  // Filter samples if a filter is provided
  const filteredSamples = config.filter ? samples.filter(config.filter) : samples;

  if (filteredSamples.length === 0) {
    console.warn(`No samples found for grouping by ${config.type}`);
    return {};
  }

  const groups: Groups = {};

  // Group all samples
  for (const sample of filteredSamples) {
    parseSampleIntoGroup({
      sample,
      groups,
      tolerance,
      groupSize,
      distanceUnit: params.distanceUnit,
      config,
    });
  }

  // Remove empty groups
  deleteEmptyGroups(groups);

  // Calculate stats for each group using the appropriate calculator
  const statCalculator = createStatCalculator(config);

  for (const groupKey in groups) {
    statCalculator.calculateStats(groups[groupKey], filteredSamples, timeRangeInDays);
  }

  // Assign ranks and sort
  assignRankToGroups(groups);

  return sortGroupsByKeyInAscending(groups);
}

/**
 * Parses a single sample into the appropriate group
 */
function parseSampleIntoGroup({
  sample,
  groups,
  tolerance,
  groupSize,
  distanceUnit,
  config,
}: IndividualSampleParserParams & { config: GroupConfig }): void {
  const value = config.valueExtractor(sample);

  if (!value || value.quantity === undefined) {
    console.warn(`Sample missing ${config.property}, skipping`);
    return;
  }

  // Calculate the nearest group based on groupSize
  const nearestGroup = Math.round(value.quantity / groupSize) * groupSize;

  console.log(
    `Sample with ${config.property} ${value.quantity} ${value.unit} assigned to group ${nearestGroup} ${value.unit}`,
  );

  // Create a string key for the group INCLUDING indoor/outdoor designation
  const baseGroupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);
  const indoorSuffix = sample.isIndoor ? '-indoor' : '-outdoor';
  const groupKey = baseGroupKey + indoorSuffix;

  // Check if the sample is close enough to the group
  const isCloseEnough = Math.abs(value.quantity - nearestGroup) <= tolerance;

  // Create or get the group for the current sample
  const group =
    groups[groupKey] ||
    (groups[groupKey] = createEmptyGroup(baseGroupKey, sample, config, distanceUnit));

  // Add indoor/outdoor designation to the group
  if (!group.isIndoor) {
    group.isIndoor = sample.isIndoor;
  }

  if (!isCloseEnough) {
    console.warn(
      `Run with ${config.property} ${value.quantity} ${value.unit} is not close enough to ${nearestGroup} ${value.unit} with a tolerance of ${tolerance}. Skipping.`,
    );

    group.skipped = (group.skipped || 0) + 1;

    return;
  }

  // Add the sample to the group
  group.runs.push(sample);

  // Aggregate the totals
  group.totalDistance = sumQuantities([group.totalDistance, sample.totalDistance]);
  group.totalDuration = sumQuantities([group.totalDuration, sample.duration]);
  group.totalElevation = sumQuantities([
    group.totalElevation,
    sample.totalElevation || { unit: 'm', quantity: 0 },
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
