import { WorkoutGroupWithHighlight, WorkoutGroupWithHighlightSet } from '@/types/workout';
import {
  GroupingParameters,
  GroupingSampleParserParams,
  GroupingStatsParams,
} from '@/utils/grouping/interface';
import { sortGroupsByRunCount } from '@/utils/grouping/sort';
import { newQuantity, sumQuantities } from '@/utils/quantity';
import { findLongestRun, findShortestRun } from '@/utils/workout';

const DEFAULT_TOLERANCE = 0.5; // Half a minute
const DEFAULT_GROUP_SIZE = 1.0; // 1 minute increments

export const groupRunsByPace = (params: GroupingParameters): WorkoutGroupWithHighlightSet => {
  const groups: WorkoutGroupWithHighlightSet = {} as WorkoutGroupWithHighlightSet;

  const { samples, tolerance = DEFAULT_TOLERANCE, groupSize = DEFAULT_GROUP_SIZE } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  sortGroupsByRunCount(groups);

  return groups;
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance = 0.5,
  groupSize = 1.0,
}: GroupingSampleParserParams) => {
  console.log(
    `Parsing sample with pace: ${sample.averagePace.quantity} ${sample.averagePace.unit}`,
  );

  // Calculate the nearest group based on groupSize (e.g., 0.5 minute increments)
  const nearestGroup = Math.round(sample.averagePace.quantity / groupSize) * groupSize;
  const isCloseEnough = Math.abs(sample.averagePace.quantity - nearestGroup) <= tolerance;

  if (!isCloseEnough) {
    console.warn(
      `Run with pace ${sample.averagePace.quantity} min/mile is not close enough to ${nearestGroup} min/mile. Skipping.`,
    );

    // Skip and return the groups as is.
    return groups;
  }

  // Create a string key for the group (e.g., "7.5" for 7.5 min/mile)
  const groupKey = nearestGroup.toFixed(1);

  // If the group for this pace doesn't exist, create it
  if (!groups[groupKey]) {
    groups[groupKey] = {
      title: `${nearestGroup.toFixed(1)} min/mile`,
      rank: 0,
      suffix: "'",
      runs: [],
      rankLabel: '',
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

  group.runs.push(sample);
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
  group.averageHumidity = newQuantity(
    group.runs.reduce((sum, run) => sum + (run.humidity?.quantity || 0), 0) / group.runs.length,
    '%',
  );
  group.percentageOfTotalWorkouts = (group.runs.length / samples.length) * 100;
  group.highlight = findLongestRun(group.runs);
  group.worst = findShortestRun(group.runs);

  // Calculate the total variation in distance
  const diffInDistance = Math.abs(
    group.highlight.totalDistance.quantity - group.worst.totalDistance.quantity,
  );
  group.totalVariation = newQuantity(diffInDistance, group.highlight.totalDistance.unit);

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
      label: 'Best Duration',
      value: group.highlight.duration,
    },
    {
      type: 'duration',
      label: 'Worst Duration',
      value: group.worst.duration,
    },
    {
      type: 'distance',
      label: 'Best Distance',
      value: group.highlight.totalDistance,
    },
    {
      type: 'distance',
      label: 'Worst Distance',
      value: group.worst.totalDistance,
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
