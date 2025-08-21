import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import {
  GroupingParameters,
  GroupingStatsParams,
  IndividualSampleParserParams,
} from '@/hooks/useGroupedActivityData/interface';
import {
  assignRankToGroups,
  sortGroupsByKeyInAscending,
} from '@/hooks/useGroupedActivityData/sort';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group, Groups } from '@/types/Groups';
import { PredictedWorkout } from '@/types/Prediction';
import { convertShortUnitToLong } from '@/utils/distance';
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

export const groupRunsByDistance = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;

  const { samples, tolerance, groupSize } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

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
}: IndividualSampleParserParams): Groups => {
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
    // console.warn(
    //   `Run with distance ${distance.quantity} is not close enough to ${nearestGroup}${distance.unit}. Skipping.`,
    // );

    group.skipped++;

    // Skip and return the groups as is.
    return groups;
  }

  // Add the sample to the group
  group.runs.push(sample);

  // Aggregate the total distance, duration, and elevation ascended
  group.totalDistance = sumQuantities([group.totalDistance, sample.totalDistance]);
  group.totalDuration = sumQuantities([group.totalDuration, sample.duration]);
  group.totalElevation = sumQuantities([
    group.totalElevation,
    sample.totalElevation || newQuantity(0, 'm'),
  ]);

  if (sample.startDate > group.mostRecent.startDate) {
    group.mostRecent = sample;
  }

  return groups;
};

const createEmptyGroup = (key: string, sample: ExtendedWorkout): Group => {
  return {
    key,
    unit: convertShortUnitToLong(sample.totalDistance?.unit),
    type: 'distance',
    title: `${key}${sample.totalDistance?.unit}`,
    suffix: 'miles',
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
    totalElevation: newQuantity(0, 'm'),
    averagePace: newQuantity(0, 'min/mi'),
    averageHumidity: newQuantity(0, '%'),
    averageDuration: newQuantity(0, 's'),
    averageElevation: newQuantity(0, 'm'),
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

  const prettyName = `${group.key} ${group.unit}`;

  // Only include factual stats here (no predictions)
  group.stats = [
    {
      title: '🏃 Fastest',
      description: `Your best performance for ${prettyName}`,
      items: [
        {
          type: 'pace',
          label: 'Pace',
          value: group.highlight.averagePace,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="speedometer"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'duration',
          label: 'Time',
          value: group.highlight.duration,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="stopwatch-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'elevation',
          label: 'Elevation',
          value: group.highlight.totalElevation,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="arrow-up-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
    {
      title: '🐌 Slowest',
      description: `Your worst performance for ${prettyName}`,
      items: [
        {
          type: 'pace',
          label: 'Pace',
          value: group.worst.averagePace,
          workout: group.worst,
          icon: (
            <Ionicons
              name="speedometer"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'duration',
          label: 'Time',
          value: group.worst.duration,
          workout: group.worst,
          icon: (
            <Ionicons
              name="stopwatch-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'elevation',
          label: 'Elevation',
          value: group.worst.totalElevation,
          workout: group.worst,
          icon: (
            <Ionicons
              name="arrow-down-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
    {
      title: '〽️ Average',
      description: `Averages for ${prettyName}`,
      items: [
        {
          type: 'pace',
          label: 'Pace',
          value: group.averagePace,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="speedometer"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'duration',
          label: 'Time',
          value: group.averageDuration,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="stopwatch-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'elevation',
          label: 'Elevation',
          value: group.averageElevation,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="arrow-up-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
    {
      title: '📈 Cumulative',
      description: `Cumulative stats for ${prettyName}`,
      items: [
        {
          type: 'distance',
          label: 'Cumulative Distance',
          value: group.totalDistance,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="person-add-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'duration',
          label: 'Cumulative Duration',
          value: group.totalDuration,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="timer-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
        {
          type: 'elevation',
          label: 'Cumulative Elevation',
          value: group.totalElevation,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="arrow-up-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
  ];

  return group;
};
