import { Ionicons } from '@expo/vector-icons';

import { TimeRange } from '@/config/timeRanges';
import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatDaysAgo } from '@/utils/time';
import { generateTimeLabel } from '@/utils/timeLabels';
import { findLongestRun, findShortestRun } from '@/utils/workout';

/**
 * Pace-based group statistics calculator
 */
export class PaceGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(
    group: Group,
    samples: readonly ExtendedWorkout[],
    timeRangeInDays: TimeRange,
  ): void {
    super.calculateStats(group, samples, timeRangeInDays);

    group.highlight = findLongestRun(group.runs);
    group.worst = findShortestRun(group.runs);
    group.variantDistribution = group.runs.map((run) => run.distance.quantity);
    group.totalVariation = getAbsoluteDifference(group.worst.distance, group.highlight.distance);

    this.generatePredictions(group);
    this.generateStats(group, timeRangeInDays);
  }

  private generatePredictions(group: Group): void {
    if (group.runs.length >= 2) {
      try {
        const prediction4Week = generateWorkoutPrediction(group, 4);
        const prediction12Week = generateWorkoutPrediction(group, 12);

        group.predictions = {
          prediction4Week,
          prediction12Week,
        };
      } catch (error) {
        console.warn(
          `Pace - generatePredictions: Failed to generate prediction for group ${group.title}:`,
          error,
        );
      }
    }
  }

  private generateStats(group: Group, timeRangeInDays: TimeRange): void {
    const timeLabel = ` ${generateTimeLabel(timeRangeInDays)}`;

    group.stats = [
      {
        title: 'Furthest',
        description: `The longest run at this pace${timeLabel} (${formatDaysAgo(group.highlight.endDate)})`,
        items: [
          {
            type: 'pace',
            label: 'Pace',
            value: group.highlight.pace,
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
            type: 'distance',
            label: 'Distance',
            value: group.highlight.distance,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="map-outline"
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
            value: group.highlight.elevation,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="triangle-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      {
        title: 'Shortest',
        description: `The shortest run at this pace${timeLabel} (${formatDaysAgo(group.worst.endDate)})`,
        items: [
          {
            type: 'pace',
            label: 'Pace',
            value: group.worst.pace,
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
            type: 'distance',
            label: 'Distance',
            value: group.worst.distance,
            workout: group.worst,
            icon: (
              <Ionicons
                name="map-outline"
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
            value: group.worst.elevation,
            workout: group.worst,
            icon: (
              <Ionicons
                name="triangle-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      {
        title: 'Highest',
        description: `Your highest elevation workouts at this pace${timeLabel}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.greatestElevation.elevation,
            workout: group.greatestElevation,
            icon: (
              <Ionicons
                name="triangle"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      {
        title: 'Lowest',
        description: `Your lowest elevation workouts at this pace${timeLabel}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.lowestElevation.elevation,
            workout: group.lowestElevation,
            icon: (
              <Ionicons
                name="triangle-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      {
        title: 'Most Recent',
        description: `Your most recent workout at this pace${timeLabel} (${formatDaysAgo(group.mostRecent.endDate)})`,
        items: [
          {
            type: 'pace',
            label: 'Pace',
            value: group.mostRecent.pace,
            workout: group.mostRecent,
            icon: (
              <Ionicons
                name="speedometer"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'distance',
            label: 'Distance',
            value: group.mostRecent.distance,
            workout: group.mostRecent,
            icon: (
              <Ionicons
                name="map-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'duration',
            label: 'Time',
            value: group.mostRecent.duration,
            workout: group.mostRecent,
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
            value: group.mostRecent.elevation,
            workout: group.mostRecent,
            icon: (
              <Ionicons
                name="triangle-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      ...group.stats,
      {
        title: 'Cumulative',
        description: `The total cumulative stats at this pace${timeLabel}`,
        items: [
          {
            type: 'distance',
            label: 'Total Distance',
            value: group.totalDistance,
            icon: (
              <Ionicons
                name="map-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'duration',
            label: 'Total Time',
            value: group.totalDuration,
            icon: (
              <Ionicons
                name="timer-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            label: 'Runs',
            type: 'default',
            value: { quantity: group.runs.length, unit: 'runs' },
            icon: (
              <Ionicons
                name="fitness-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
    ];
  }
}
