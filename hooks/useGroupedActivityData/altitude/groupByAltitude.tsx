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
import { Groups, Group } from '@/types/Groups';
import { PredictedWorkout } from '@/types/Prediction';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference, newQuantity, sumQuantities } from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import {
  calculatePaceFromDistanceAndDuration,
  findHighestElevationRun,
  findLowestElevationRun,
} from '@/utils/workout';

const DEFAULT_TOLERANCE = 50; // 50 meters/feet tolerance
const DEFAULT_GROUP_SIZE = 100; // 100 meters/feet increments

export const groupRunsByAltitude = (params: GroupingParameters): Groups => {
  const groups: Groups = {} as Groups;

  const { samples, tolerance = DEFAULT_TOLERANCE, groupSize = DEFAULT_GROUP_SIZE } = params;

  // Filter out samples without elevation data
  const samplesWithElevation = samples.filter(
    (sample) => sample.totalElevationAscended && sample.totalElevationAscended.quantity > 0,
  );

  if (samplesWithElevation.length === 0) {
    console.warn('No samples with elevation data found');
    return {};
  }

  for (const sample of samplesWithElevation) {
    parseSampleIntoGroup({ sample, tolerance, groupSize, groups });
  }

  for (const groupKey in groups) {
    calculateGroupStats({ group: groups[groupKey], samples: samplesWithElevation });
  }

  assignRankToGroups(groups);
  return sortGroupsByKeyInAscending(groups);
};

const parseSampleIntoGroup = ({
  sample,
  groups,
  tolerance = DEFAULT_TOLERANCE,
  groupSize = DEFAULT_GROUP_SIZE,
}: GroupingSampleParserParams) => {
  if (!sample.totalElevationAscended || sample.totalElevationAscended.quantity <= 0) {
    return groups;
  }

  const elevation = sample.totalElevationAscended;

  // Calculate the nearest group based on groupSize (e.g., 100m increments)
  const nearestGroup = Math.round(elevation.quantity / groupSize) * groupSize;
  const isCloseEnough = Math.abs(elevation.quantity - nearestGroup) <= tolerance;

  if (!isCloseEnough) {
    console.warn(
      `Run with elevation ${elevation.quantity}${elevation.unit} is not close enough to ${nearestGroup}${elevation.unit}. Skipping.`,
    );

    // Skip and return the groups as is.
    return groups;
  }

  // Create a string key for the group (e.g., "200" for 200m)
  const groupKey = nearestGroup.toString();

  // If the group for this elevation doesn't exist, create it
  if (!groups[groupKey]) {
    groups[groupKey] = {
      type: 'altitude',
      title: `${nearestGroup} ${elevation.unit}`,
      suffix: '',
      rank: 0,
      rankLabel: '',
      runs: [],
      highlight: sample,
      worst: sample,
      mostRecent: sample,
      percentageOfTotalWorkouts: 0,
      totalVariation: newQuantity(0, elevation.unit),
      totalDistance: newQuantity(0, sample.totalDistance.unit),
      totalDuration: newQuantity(0, 's'),
      totalElevationAscended: newQuantity(0, elevation.unit),
      averagePace: newQuantity(0, 'min/mi'),
      averageHumidity: newQuantity(0, '%'),
      prettyPace: '',
      durationDistribution: [],
      stats: [],
      predictions: {
        prediction4Week: null,
        prediction12Week: null,
        recommendations: [],
      },
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
    sample.totalElevationAscended || newQuantity(0, elevation.unit),
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
  // Add durationDistribution for dot plot
  group.durationDistribution = group.runs.map((run) => run.duration.quantity);
  group.averageHumidity = newQuantity(
    group.runs.reduce((sum, run) => sum + (run.humidity?.quantity || 0), 0) / group.runs.length,
    '%',
  );
  group.prettyPace = formatPace(group.averagePace);
  group.percentageOfTotalWorkouts = (group.runs.length / samples.length) * 100;
  group.highlight = findHighestElevationRun(group.runs);
  group.worst = findLowestElevationRun(group.runs);
  group.totalVariation = getAbsoluteDifference(
    group.highlight.totalElevationAscended,
    group.worst.totalElevationAscended,
  );

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
          label: 'Total Distance',
          value: group.totalDistance,
          workout: group.highlight,
          icon: <Ionicons name="location" size={40} color="#FFFFFF" />,
        },
        {
          label: 'Total Elevation Gain',
          type: 'altitude',
          value: group.totalElevationAscended,
          workout: group.highlight,
          icon: <Ionicons name="trending-up" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Elevation',
      items: [
        {
          type: 'altitude',
          label: 'Highest Elevation Gain',
          value: group.highlight.totalElevationAscended,
          workout: group.highlight,
          icon: <Ionicons name="trending-up" size={40} color="#FFFFFF" />,
        },
        {
          type: 'altitude',
          label: 'Lowest Elevation Gain',
          value: group.worst.totalElevationAscended,
          workout: group.worst,
          icon: <Ionicons name="trending-up" size={40} color="#FFFFFF" />,
        },
      ],
    },
    {
      title: 'Pace',
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
          label: 'Average Pace',
          value: group.averagePace,
          workout: group.highlight,
          icon: <Ionicons name="speedometer" size={40} color="#FFFFFF" />,
        },
      ],
    },
  ];

  return group;
};
