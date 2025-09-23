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
  const { samples, enabled = true } = params;

  // If grouping is disabled, use unit-based grouping (1 mile, 1 km, 10 min, etc.)
  if (!enabled) {
    return createUnitGroups(params, config, timeRangeInDays);
  }

  const { tolerance = config.defaultTolerance, groupSize = config.defaultGroupSize } = params;

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

  // Calculate the nearest group based on groupSize, rounding down
  const nearestGroup = Math.floor(value.quantity / groupSize) * groupSize;
  // Create a string key for the group INCLUDING indoor/outdoor designation
  const baseGroupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);
  const indoorSuffix = sample.isIndoor ? '-indoor' : '-outdoor';
  const groupKey = baseGroupKey + indoorSuffix;

  // Check if the sample is within the group range (nearestGroup to nearestGroup + groupSize)
  // and within tolerance of the nearestGroup
  const isCloseEnough =
    value.quantity >= nearestGroup && value.quantity <= nearestGroup + groupSize + tolerance;

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
      `Run with ${config.property} ${value.quantity} ${value.unit} is not within the group range ${nearestGroup}-${nearestGroup + groupSize} ${value.unit} with tolerance ${tolerance}. Skipping.`,
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
 * Creates unit-based groups (1 mile, 1 km, 10 min, etc.) when grouping is disabled
 */
function createUnitGroups(
  params: GroupingParameters,
  config: GroupConfig,
  timeRangeInDays: TimeRange,
): Groups {
  const { samples, distanceUnit } = params;

  // Filter samples if a filter is provided
  const filteredSamples = config.filter ? samples.filter(config.filter) : samples;

  if (filteredSamples.length === 0) {
    console.warn(`No samples found for unit grouping by ${config.type}`);
    return {};
  }

  const groups: Groups = {};

  // Use default unit grouping sizes based on type
  const getUnitGroupSize = (): number => {
    switch (config.type) {
      case 'distance':
        return distanceUnit === 'km' ? 1 : 1; // 1 km or 1 mile
      case 'pace':
        return 0.5; // 30 seconds per km/mile
      case 'duration':
        return 10 * 60; // 10 minutes
      case 'elevation':
        return 100; // 100m
      default:
        return 1;
    }
  };

  const unitGroupSize = getUnitGroupSize();

  // Group all samples into unit-based groups
  for (const sample of filteredSamples) {
    const value = config.valueExtractor(sample);

    if (!value || value.quantity === undefined) {
      console.warn(`Sample missing ${config.property}, skipping`);
      continue;
    }

    // Calculate the unit group (floor to nearest unit)
    const unitGroup = Math.floor(value.quantity / unitGroupSize) * unitGroupSize;
    const baseGroupKey = unitGroup % 1 === 0 ? unitGroup.toString() : unitGroup.toFixed(1);
    const indoorSuffix = sample.isIndoor ? '-indoor' : '-outdoor';
    const groupKey = baseGroupKey + indoorSuffix;

    // Create or get the group for the current sample
    const group =
      groups[groupKey] ||
      (groups[groupKey] = createEmptyGroup(baseGroupKey, sample, config, distanceUnit));

    // Add indoor/outdoor designation to the group
    if (!group.isIndoor) {
      group.isIndoor = sample.isIndoor;
    }

    // Add all samples to their respective unit groups (no tolerance check)
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
 * Deletes groups that have no runs
 */
function deleteEmptyGroups(groups: Groups): void {
  for (const groupKey in groups) {
    if (groups[groupKey].runs.length === 0) {
      delete groups[groupKey];
    }
  }
}
