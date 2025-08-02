import { WorkoutGroupWithHighlight, WorkoutGroupWithHighlightSet } from '@/types/workout';
import {
  GroupingParameters,
  GroupingSampleParserParams,
  GroupingStatsParams,
} from '@/utils/grouping/interface';
import { sortGroupsByRunCount } from '@/utils/grouping/sort';
import { newQuantity, sumQuantities } from '@/utils/quantity';
import {
  calculatePaceFromDistanceAndDuration,
  findFastestRun,
  findSlowestRun,
  formatPace,
} from '@/utils/workout';

const DEFAULT_TOLERANCE = 0.25; // 0.25 of a mile.

export const groupRunsByDistance = (params: GroupingParameters): WorkoutGroupWithHighlightSet => {
  const groups: WorkoutGroupWithHighlightSet = {} as WorkoutGroupWithHighlightSet;

  const { samples, tolerance = DEFAULT_TOLERANCE } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groups });
  }

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  sortGroupsByRunCount(groups);

  return groups;
};

const parseSampleIntoGroup = ({ sample, groups, tolerance = 0.25 }: GroupingSampleParserParams) => {
  const distance = sample.totalDistance;
  const nearestMile = Math.round(distance.quantity);
  const isCloseEnough = Math.abs(distance.quantity - nearestMile) <= tolerance;

  if (!isCloseEnough) {
    console.warn(
      `Run with distance ${distance.quantity} is not close enough to a whole number. Skipping.`,
    );

    // Skip and return the groups as is.
    return groups;
  }

  // If the group for this distance doesn't exist, create it
  if (!groups[nearestMile]) {
    groups[nearestMile] = {
      title: `${nearestMile} ${sample.totalDistance?.unit}`,
      suffix: '',
      rank: 0,
      rankLabel: '',
      runs: [],
      highlight: sample,
      worst: sample,
      percentageOfTotalWorkouts: 0,
      totalVariation: newQuantity(0, 's'),
      totalDistance: newQuantity(0, 'mi'),
      totalDuration: newQuantity(0, 's'),
      averagePace: newQuantity(0, 'min/mile'),
      prettyPace: '',
      stats: [],
    } satisfies WorkoutGroupWithHighlight;
  }

  const group = groups[nearestMile];

  group.runs.push(sample);
  group.totalDistance = sumQuantities([group.totalDistance, sample.totalDistance]);
  group.totalDuration = sumQuantities([group.totalDuration, sample.duration]);

  return groups;
};

const calculateGroupStats = ({ group, samples }: GroupingStatsParams) => {
  group.averagePace = calculatePaceFromDistanceAndDuration(
    group.totalDistance,
    group.totalDuration,
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
