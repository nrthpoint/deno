import { Ionicons } from '@expo/vector-icons';
import { LengthUnit } from '@kingstinct/react-native-healthkit';
import React from 'react';

import { deleteEmptyGroups } from '@/hooks/useGroupedActivityData/distance/groupByDistance';
import {
  GroupingParameters,
  IndividualSampleParserParams,
  GroupingStatsParams,
} from '@/hooks/useGroupedActivityData/interface';
import { assignRankToGroups } from '@/hooks/useGroupedActivityData/sort';
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
import { calculateAverageDuration, findLongestRun, findShortestRun } from '@/utils/workout';

export const groupRunsByPace = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;
  const { samples } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ ...params, sample, groups });
  }

  deleteEmptyGroups(groups);

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  assignRankToGroups(groups);
  return groups;
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance,
  groupSize,
}: IndividualSampleParserParams): Groups => {
  const pace = sample.averagePace;

  // Calculate the nearest group based on groupSize (e.g., 1 min increments)
  const nearestGroup = Math.round(pace.quantity / groupSize) * groupSize;

  // Create a string key for the group (e.g., "7.5" for 7.5 min/mile)
  const groupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);

  // Check if the sample is close enough to the group
  const isCloseEnough = Math.abs(pace.quantity - nearestGroup) <= tolerance;

  // Create or get the group for the current sample
  const group = groups[groupKey] || (groups[groupKey] = createEmptyGroup(groupKey, sample));

  if (!isCloseEnough) {
    console.warn(
      `Run with pace ${pace.quantity} min/mile is not close enough to ${nearestGroup} min/mile. Skipping.`,
    );

    group.skipped = (group.skipped || 0) + 1;

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

const createEmptyGroup = (
  key: string,
  sample: ExtendedWorkout,
  distanceUnit: LengthUnit,
): Group => {
  return {
    type: 'pace',
    title: `${key} min/mile`,
    suffix: 'min/mile',
    rank: 0,
    skipped: 0,
    rankLabel: '',
    runs: [],
    highlight: sample,
    worst: sample,
    mostRecent: sample,
    percentageOfTotalWorkouts: 0,
    totalVariation: newQuantity(0, distanceUnit),
    totalDistance: newQuantity(0, distanceUnit),
    totalDuration: newQuantity(0, 's'),
    totalElevation: newQuantity(0, 'm'),
    averagePace: newQuantity(0, `min/${distanceUnit}`),
    averageDuration: newQuantity(0, 's'),
    averageHumidity: newQuantity(0, '%'),
    averageElevation: newQuantity(0, 'm'),
    prettyPace: '',
    variantDistribution: [],
    stats: [],
    predictions: {
      prediction4Week: null,
      prediction12Week: null,
      recommendations: [],
    },
    key: '',
    unit: 'min/mile',
  } satisfies Group;
};

const calculateGroupStats = ({ group, samples }: GroupingStatsParams) => {
  let prediction4Week: PredictedWorkout | null = null;
  let prediction12Week: PredictedWorkout | null = null;

  const recommendations: string[] = [];

  group.averageDuration = calculateAverageDuration(group.runs);
  group.averageHumidity = newQuantity(
    group.runs.reduce((sum, run) => sum + (run.humidity?.quantity || 0), 0) / group.runs.length,
    '%',
  );
  group.variantDistribution = group.runs.map((run) => run.duration.quantity);
  group.percentageOfTotalWorkouts = calculatePercentage(group.runs.length, samples.length);
  group.highlight = findLongestRun(group.runs);
  group.worst = findShortestRun(group.runs);

  // Variation is length of run at this pace.
  group.totalVariation = getAbsoluteDifference(
    group.worst.totalDistance,
    group.highlight.totalDistance,
  );

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

  group.stats = [
    {
      title: 'Furthest',
      items: [
        {
          type: 'distance',
          label: 'Distance',
          value: group.highlight.totalDistance,
          workout: group.highlight,
          icon: (
            <Ionicons
              name="map-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
    {
      title: 'Shortest',
      items: [
        {
          type: 'distance',
          label: 'Distance',
          value: group.worst.totalDistance,
          workout: group.worst,
          icon: (
            <Ionicons
              name="map-outline"
              size={40}
              color="#FFFFFF"
            />
          ),
        },
      ],
    },
    {
      title: 'Cumulative',
      items: [
        {
          type: 'distance',
          label: 'Distance',
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
          label: 'Duration',
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
      ],
    },
  ];

  return group;
};
