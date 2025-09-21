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
      run.totalDistance.quantity > longest.totalDistance.quantity ? run : longest,
    );
    group.worst = group.runs.reduce((shortest, run) =>
      run.totalDistance.quantity < shortest.totalDistance.quantity ? run : shortest,
    );

    // Calculate variance in distance for this duration
    group.variantDistribution = group.runs.map((run) => run.totalDistance.quantity);
    group.totalVariation = getAbsoluteDifference(
      group.worst.totalDistance,
      group.highlight.totalDistance,
    );

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
        ],
      },
      {
        title: 'Shortest',
        description: `Your shortest distance at ${prettyName}${timeLabel} (${formatDaysAgo(group.worst.endDate)})`,
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
        ],
      },
      {
        title: 'Highest',
        description: `Your highest elevation workouts at ${prettyName}${timeLabel}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.greatestElevation.totalElevation,
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
            value: group.lowestElevation.totalElevation,
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
            type: 'distance',
            label: 'Distance',
            value: group.mostRecent.totalDistance,
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
            value: group.mostRecent.averagePace,
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
            value: group.mostRecent.totalElevation,
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
    ];
  }
}
