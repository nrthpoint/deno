import React from 'react';

import {
  GroupingParameters,
  GroupingSampleParserParams,
  GroupingStatsParams,
} from '@/hooks/useGroupedActivityData/interface';
import {
  assignRankToGroups,
  sortGroupsByKeyInAscending,
} from '@/hooks/useGroupedActivityData/sort';
import { newQuantity, subtractQuantities, sumQuantities } from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import {
  calculatePaceFromDistanceAndDuration,
  findFastestRun,
  findSlowestRun,
} from '@/utils/workout';
import { Ionicons } from '@expo/vector-icons';
import { Groups, Group } from '@/types/Groups';

const DEFAULT_TOLERANCE = 0.25; // 0.25 of a mile.
const DEFAULT_GROUP_SIZE = 1.0; // 1 mile increments

export const groupRunsByDistance = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;

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
      type: 'distance',
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
    } satisfies Group;
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
  group.totalVariation = subtractQuantities(group.worst.duration, group.highlight.duration);

  group.stats = [
    {
      type: 'default',
      label: 'Total Workouts',
      value: { quantity: group.runs?.length || 0, unit: group.runs?.length === 1 ? 'run' : 'runs' },
      icon: <Ionicons name="podium-outline" size={40} color="#FFFFFF" />,
      hasTooltip: true,
      detailTitle: 'Group Size',
      detailDescription: 'The total number of workout sessions included in this performance group.',
      additionalInfo: [
        { label: 'Average per Week', value: `${((group.runs?.length || 0) / 4).toFixed(1)}` },
        { label: 'Group Category', value: group.title || 'Performance Group' },
      ],
      workout: group.highlight,
    },
    {
      type: 'pace',
      label: 'Best Pace',
      value: group.highlight.averagePace,
      workout: group.highlight,
      icon: <Ionicons name="speedometer" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
    {
      type: 'pace',
      label: 'Worst Pace',
      value: group.worst.averagePace,
      workout: group.worst,
      icon: <Ionicons name="trending-down-outline" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
    {
      type: 'duration',
      label: 'Fastest Time',
      value: group.highlight.duration,
      workout: group.highlight,
      icon: <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
    {
      type: 'duration',
      label: 'Slowest Time',
      value: group.worst.duration,
      workout: group.worst,
      icon: <Ionicons name="thumbs-down-outline" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
    {
      type: 'distance',
      label: 'Cumulative Distance',
      value: group.totalDistance,
      workout: group.highlight,
      icon: <Ionicons name="person-add-outline" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
    {
      type: 'duration',
      label: 'Cumulative Duration',
      value: group.totalDuration,
      workout: group.highlight,
      icon: <Ionicons name="timer-outline" size={40} color="#FFFFFF" />,
      hasTooltip: false,
    },
  ];

  return group;
};
