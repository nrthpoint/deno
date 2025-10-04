import { Ionicons } from '@expo/vector-icons';

import { TimeRange } from '@/config/timeRanges';
import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatDaysAgo } from '@/utils/time';
import { generateTimeLabel } from '@/utils/timeLabels';

/**
 * Duration-based group statistics calculator
 */
export class DurationGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(
    group: Group,
    samples: readonly ExtendedWorkout[],
    timeRangeInDays: TimeRange,
  ): void {
    super.calculateStats(group, samples, timeRangeInDays);

    // For duration groups, highlight is the run that went the furthest at this duration
    group.highlight = group.runs.reduce((longest, run) =>
      run.distance.quantity > longest.distance.quantity ? run : longest,
    );
    group.worst = group.runs.reduce((shortest, run) =>
      run.distance.quantity < shortest.distance.quantity ? run : shortest,
    );

    // Calculate variance in distance for this duration
    group.variantDistribution = group.runs.map((run) => run.distance.quantity);
    group.totalVariation = getAbsoluteDifference(group.worst.distance, group.highlight.distance);

    this.generateStats(group, timeRangeInDays);
  }

  private generateStats(group: Group, timeRangeInDays: TimeRange): void {
    const { prettyName } = group;
    const timeLabel = ` ${generateTimeLabel(timeRangeInDays)}`;

    group.stats = [
      {
        title: 'Furthest',
        description: `Your longest distance at ${prettyName}${timeLabel} (${formatDaysAgo(group.highlight.endDate)})`,
        items: [
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
        description: `Your shortest distance at ${prettyName}${timeLabel} (${formatDaysAgo(group.worst.endDate)})`,
        items: [
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
        description: `Your highest elevation workouts at ${prettyName}${timeLabel}`,
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
        description: `Your lowest elevation workouts at ${prettyName}${timeLabel}`,
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
        description: `Your most recent workout at ${prettyName}${timeLabel} (${formatDaysAgo(group.mostRecent.endDate)})`,
        items: [
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
        description: `Total cumulative stats at ${prettyName}${timeLabel}`,
        items: [
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
            type: 'elevation',
            label: 'Total Elevation',
            value: group.totalElevation,
            icon: (
              <Ionicons
                name="triangle-outline"
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
