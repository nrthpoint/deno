import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import {
  GroupingParameters,
  GroupingSampleParserParams,
  GroupingStatsParams,
} from '@/hooks/useGroupedActivityData/interface';
import { assignRankToGroups } from '@/hooks/useGroupedActivityData/sort';
import { Groups, Group } from '@/types/Groups';
import { PredictedWorkout } from '@/types/Prediction';
import { generateWorkoutPrediction } from '@/utils/prediction';
import {
  calculatePercentage,
  getAbsoluteDifference,
  newQuantity,
  sumQuantities,
} from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import { findLongestRun, findShortestRun } from '@/utils/workout';

const DEFAULT_TOLERANCE = 0.5; // Half a minute
const DEFAULT_GROUP_SIZE = 1.0; // 1 minute increments

export const groupRunsByPace = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;

  const { samples, tolerance = DEFAULT_TOLERANCE, groupSize = DEFAULT_GROUP_SIZE } = params;

  for (const sample of samples) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples });
  }

  assignRankToGroups(groups);

  return groups;
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance = 0.5,
  groupSize = 1.0,
}: GroupingSampleParserParams) => {
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
  const groupKey = nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1);

  // If the group for this pace doesn't exist, create it
  if (!groups[groupKey]) {
    groups[groupKey] = {
      type: 'pace',
      title: `${nearestGroup % 1 === 0 ? nearestGroup.toString() : nearestGroup.toFixed(1)} min/mile`,
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
      durationDistribution: [],
      prettyPace: '',
      stats: [],
      predictions: {
        prediction4Week: null,
        prediction12Week: null,
        recommendations: [],
      },
    } satisfies Group;
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
  // Add durationDistribution for dot plot
  group.durationDistribution = group.runs.map((run) => run.duration.quantity);
  group.percentageOfTotalWorkouts = calculatePercentage(group.runs.length, samples.length);
  group.highlight = findLongestRun(group.runs);
  group.worst = findShortestRun(group.runs);
  group.totalVariation = getAbsoluteDifference(group.worst.duration, group.highlight.duration);

  // Generate AI prediction if we have enough data
  let prediction4Week: PredictedWorkout | null = null;
  let prediction12Week: PredictedWorkout | null = null;
  const recommendations: string[] = [];

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
      title: 'Overview',
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
    {
      title: 'Pace Performance',
      items: [
        {
          type: 'pace',
          label: 'Best Pace',
          value: group.highlight.averagePace,
          workout: group.highlight,
          icon: <Ionicons name="speedometer" size={40} color="#FFFFFF" />,
        },
        {
          type: 'pace',
          label: 'Worst Pace',
          value: group.worst.averagePace,
          workout: group.worst,
          icon: <Ionicons name="trending-down-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Distance & Duration Records',
      items: [
        {
          type: 'distance',
          label: 'Best Distance',
          value: group.highlight.totalDistance,
          workout: group.highlight,
          icon: <Ionicons name="location" size={40} color="#FFFFFF" />,
        },
        {
          type: 'distance',
          label: 'Worst Distance',
          value: group.worst.totalDistance,
          workout: group.worst,
          icon: <Ionicons name="location" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Fastest Time',
          value: group.highlight.duration,
          workout: group.highlight,
          icon: <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />,
        },
        {
          type: 'duration',
          label: 'Slowest Time',
          value: group.worst.duration,
          workout: group.worst,
          icon: <Ionicons name="stopwatch-outline" size={40} color="#FFFFFF" />,
        },
      ],
    },
  ];

  return group;
};
