import { WorkoutGroupWithHighlight, WorkoutGroupWithHighlightSet } from '@/types/workout';
import {
  GroupingParameters,
  GroupingSampleParserParams,
  GroupingStatsParams,
} from '@/utils/grouping/interface';
import { assignRankToGroups, sortGroupsByKeyInAscending } from '@/utils/grouping/sort';
import { newQuantity, sumQuantities } from '@/utils/quantity';
import {
  calculatePaceFromDistanceAndDuration,
  findFastestRun,
  findSlowestRun,
  formatPace,
} from '@/utils/workout';

const DEFAULT_TOLERANCE = 0.25; // 0.25 of a mile.
const DEFAULT_GROUP_SIZE = 1.0; // 1 mile increments

export const groupRunsByDistance = (params: GroupingParameters): WorkoutGroupWithHighlightSet => {
  const groups: WorkoutGroupWithHighlightSet = {} as WorkoutGroupWithHighlightSet;

  const { samples, tolerance = DEFAULT_TOLERANCE, groupSize = DEFAULT_GROUP_SIZE } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  assignRankToGroups(groups);
  return sortGroupsByKeyInAscending(groups);
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance = 0.25,
  groupSize = 1.0,
}: GroupingSampleParserParams) => {
  const distance = sample.totalDistance;

  // Calculate the nearest group based on groupSize (e.g., 0.5 mile increments)
  const nearestGroup = Math.round(distance.quantity / groupSize) * groupSize;
  const isCloseEnough = Math.abs(distance.quantity - nearestGroup) <= tolerance;

  if (!isCloseEnough) {
    console.warn(
      `Run with distance ${distance.quantity} is not close enough to ${nearestGroup}${distance.unit}. Skipping.`,
    );

    // Skip and return the groups as is.
    return groups;
  }

  // Create a string key for the group (e.g., "5.0" for 5.0 miles)
  const groupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);

  // If the group for this distance doesn't exist, create it
  if (!groups[groupKey]) {
    groups[groupKey] = {
      title: `${nearestGroup.toFixed(1)} ${sample.totalDistance?.unit}`,
      suffix: '',
      rank: 0,
      rankLabel: '',
      runs: [],
      highlight: sample,
      worst: sample,
      mostRecent: sample,
      percentageOfTotalWorkouts: 0,
      totalVariation: newQuantity(0, 's'),
      totalDistance: newQuantity(0, 'mi'),
      totalDuration: newQuantity(0, 's'),
      totalElevationAscended: newQuantity(0, 'm'),
      averagePace: newQuantity(0, 'min/mile'),
      averageHumidity: newQuantity(0, '%'),
      prettyPace: '',
      stats: [],
    } satisfies WorkoutGroupWithHighlight;
  }

  const group = groups[groupKey];

  // Add the sample to the group
  group.runs.push(sample);

  // Aggregate the total distance, duration, and elevation ascended
  group.totalDistance = sumQuantities([group.totalDistance, sample.totalDistance]);
  group.totalDuration = sumQuantities([group.totalDuration, sample.duration]);
  group.totalElevationAscended = sumQuantities([
    group.totalElevationAscended,
    sample.totalElevationAscended || newQuantity(0, 'm'),
  ]);

  if (sample.startDate > group.mostRecent.startDate) {
    group.mostRecent = sample;
  }

  return groups;
};

const calculateGroupStats = ({ group, samples }: GroupingStatsParams) => {
  group.averagePace = calculatePaceFromDistanceAndDuration(
    group.totalDistance,
    group.totalDuration,
  );
  group.averageHumidity = newQuantity(
    group.runs.reduce((sum, run) => sum + (run.humidity?.quantity || 0), 0) / group.runs.length,
    '%',
  );
  group.prettyPace = formatPace(group.averagePace);
  group.percentageOfTotalWorkouts = (group.runs.length / samples.length) * 100;
  group.highlight = findFastestRun(group.runs);
  group.worst = findSlowestRun(group.runs);

  const diff = group.worst.duration.quantity - group.highlight.duration.quantity;
  group.totalVariation = newQuantity(Math.abs(diff), group.totalDuration.unit);

  group.stats = [
    {
      type: 'pace',
      label: 'Best Pace',
      value: group.highlight.averagePace,
    },
    {
      type: 'pace',
      label: 'Worst Pace',
      value: group.worst.averagePace,
    },
    {
      type: 'duration',
      label: 'Fastest Time',
      value: group.highlight.duration,
    },
    {
      type: 'duration',
      label: 'Slowest Run',
      value: group.worst.duration,
    },
    {
      type: 'distance',
      label: 'Cumulative Distance',
      value: group.totalDistance,
    },
    {
      type: 'duration',
      label: 'Cumulative Duration',
      value: group.totalDuration,
    },
  ];

  return group;
};
