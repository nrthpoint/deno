import { Ionicons } from '@expo/vector-icons';
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
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, Groups } from '@/types/Groups';
import { PredictedWorkout } from '@/types/Prediction';
import { generateWorkoutPrediction } from '@/utils/prediction';
import {
  calculatePercentage,
  getAbsoluteDifference,
  newQuantity,
  sumQuantities,
} from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import {
  calculateAverageDuration,
  calculatePaceFromDistanceAndDuration,
  findFastestRun,
  findSlowestRun,
} from '@/utils/workout';

const DEFAULT_TOLERANCE = 0.25; // 0.25 of a mile.
const DEFAULT_GROUP_SIZE = 1.0; // 1 mile increments

export const groupRunsByDistance = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;

  const { samples, tolerance = DEFAULT_TOLERANCE, groupSize = DEFAULT_GROUP_SIZE } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

  // delete groups with no runs
  deleteEmptyGroups(groups);

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  assignRankToGroups(groups);

  return sortGroupsByKeyInAscending(groups);
};

export const deleteEmptyGroups = (groups: Groups) => {
  for (const groupKey in groups) {
    if (groups[groupKey].runs.length === 0) {
      delete groups[groupKey];
    }
  }
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance = 0.25,
  groupSize = 1.0,
}: GroupingSampleParserParams): Groups => {
  const distance = sample.totalDistance;

  // Calculate the nearest group based on groupSize (e.g., 0.5 mile increments)
  const nearestGroup = Math.round(distance.quantity / groupSize) * groupSize;

  // Create a string key for the group (e.g., "5.0" for 5.0 miles)
  const groupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);

  // Check if the sample is close enough to the group
  const isCloseEnough = Math.abs(distance.quantity - nearestGroup) <= tolerance;

  // Create or get the group for the current sample
  const group = groups[groupKey] || (groups[groupKey] = createEmptyGroup(groupKey, sample));

  if (!isCloseEnough) {
    console.warn(
      `Run with distance ${distance.quantity} is not close enough to ${nearestGroup}${distance.unit}. Skipping.`,
    );

    group.skipped++;

    // Skip and return the groups as is.
    return groups;
  }

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

const createEmptyGroup = (key: string, sample: ExtendedWorkout): Group => {
  return {
    type: 'distance',
    title: `${key} ${sample.totalDistance?.unit}`,
    suffix: '',
    rank: 0,
    skipped: 0,
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
    averagePace: newQuantity(0, 'min/mi'),
    averageHumidity: newQuantity(0, '%'),
    averageDuration: newQuantity(0, 's'),
    prettyPace: '',
    variantDistribution: [],
    stats: [],
    predictions: {
      prediction4Week: null,
      prediction12Week: null,
      recommendations: [],
    },
  } satisfies Group;
};

const calculateGroupStats = ({ group, samples }: GroupingStatsParams) => {
  let prediction4Week: PredictedWorkout | null = null;
  let prediction12Week: PredictedWorkout | null = null;

  const recommendations: string[] = [];
  const totalHumidity = group.runs.reduce((sum, run) => sum + (run.humidity?.quantity || 0), 0);
  const averageHumidity = totalHumidity / group.runs.length || 0;

  group.averagePace = calculatePaceFromDistanceAndDuration(
    group.totalDistance,
    group.totalDuration,
  );
  group.averageDuration = calculateAverageDuration(group.runs);
  group.variantDistribution = group.runs.map((run) => run.duration.quantity);
  group.averageHumidity = newQuantity(averageHumidity, '%');
  group.prettyPace = formatPace(group.averagePace);
  group.percentageOfTotalWorkouts = calculatePercentage(group.runs.length, samples.length);
  group.highlight = findFastestRun(group.runs);
  group.worst = findSlowestRun(group.runs);
  group.totalVariation = getAbsoluteDifference(group.worst.duration, group.highlight.duration);

  if (group.runs.length >= 2) {
    try {
      prediction4Week = generateWorkoutPrediction(group, 4);
      prediction12Week = generateWorkoutPrediction(group, 12);

      // Convert training recommendations to simple bullet points (use 4-week for recommendations)
      if (prediction4Week && prediction4Week.recommendedTraining.length > 0) {
        prediction4Week.recommendedTraining.forEach((rec) => {
          const workoutName = rec.workoutType
            .replace('_', ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          const frequency = `${rec.frequency}x per week`;
          const intensity = rec.intensity.toUpperCase();

          let bullet = `${workoutName} (${frequency}, ${intensity} intensity)`;

          if (rec.duration) {
            bullet += ` - ${rec.duration.quantity} ${rec.duration.unit}`;
          }
          if (rec.targetPace) {
            bullet += ` at ${formatPace(rec.targetPace)}`;
          }

          bullet += ` - ${rec.reason}`;

          recommendations.push(bullet);
        });
      }
    } catch (error) {
      console.warn(`Failed to generate prediction for group ${group.title}:`, error);
    }
  }

  // Set predictions separately from stats
  group.predictions = {
    prediction4Week,
    prediction12Week,
    recommendations,
  };

  // Only include factual stats here (no predictions)
  group.stats = [
    {
      title: 'Fastest',
      description: 'Best performance in this distance group',
      items: [
        {
          type: 'pace',
          label: 'Best Pace',
          value: group.highlight.averagePace,
          workout: group.highlight,
          icon: <Ionicons name="speedometer" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Fastest Time',
          value: group.highlight.duration,
          workout: group.highlight,
          icon: <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Slowest',
      description: 'Worst performance in this distance group',
      items: [
        {
          type: 'pace',
          label: 'Worst Pace',
          value: group.highlight.averagePace,
          workout: group.highlight,
          icon: <Ionicons name="trending-down-outline" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Slowest Time',
          value: group.worst.duration,
          workout: group.worst,
          icon: <Ionicons name="thumbs-down-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Averages',
      description: 'Average performance in this distance group',
      items: [
        {
          type: 'pace',
          label: 'Average Pace',
          value: group.averagePace,
          workout: group.highlight,
          icon: <Ionicons name="speedometer" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Average Time',
          value: group.averageDuration,
          workout: group.highlight,
          icon: <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Cumulative',
      description: 'Overall performance across all runs in this distance group',
      items: [
        {
          type: 'distance',
          label: 'Cumulative Distance',
          value: group.totalDistance,
          workout: group.highlight,
          icon: <Ionicons name="person-add-outline" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Cumulative Duration',
          value: group.totalDuration,
          workout: group.highlight,
          icon: <Ionicons name="timer-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
  ];

  return group;
};
