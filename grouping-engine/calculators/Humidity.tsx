import { Ionicons } from '@expo/vector-icons';

import { TimeRange } from '@/config/timeRanges';
import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatDaysAgo } from '@/utils/time';
import { generateTimeLabel } from '@/utils/timeLabels';
import { findFastestRun, findSlowestRun } from '@/utils/workout';

/**
 * Humidity-based group statistics calculator
 */
export class HumidityGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(
    group: Group,
    samples: readonly ExtendedWorkout[],
    timeRangeInDays: TimeRange,
  ): void {
    super.calculateStats(group, samples, timeRangeInDays);

    group.highlight = findFastestRun(group.runs);
    group.worst = findSlowestRun(group.runs);

    group.totalVariation = getAbsoluteDifference(group.worst.duration, group.highlight.duration);
    group.variantDistribution = group.runs.map((run) => run.duration.quantity);

    this.generateStats(group, timeRangeInDays);
  }

  private generateStats(group: Group, timeRangeInDays: TimeRange): void {
    const { prettyName } = group;
    const timeLabel = ` ${generateTimeLabel(timeRangeInDays)}`;

    group.stats = [
      {
        title: 'Fastest',
        description: `Your best performance at ${prettyName}${timeLabel} (${formatDaysAgo(group.highlight.endDate)})`,
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
            type: 'humidity',
            label: 'Humidity',
            value: group.highlight.humidity,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="water-outline"
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
        ],
      },
      {
        title: 'Slowest',
        description: `Your worst performance at ${prettyName}${timeLabel} (${formatDaysAgo(group.worst.endDate)})`,
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
            type: 'humidity',
            label: 'Humidity',
            value: group.worst.humidity,
            workout: group.worst,
            icon: (
              <Ionicons
                name="water-outline"
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
        ],
      },
      {
        title: 'Most Recent',
        description: `Your most recent workout at ${prettyName}${timeLabel} (${formatDaysAgo(group.mostRecent.endDate)})`,
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
            type: 'humidity',
            label: 'Humidity',
            value: group.mostRecent.humidity,
            workout: group.mostRecent,
            icon: (
              <Ionicons
                name="water-outline"
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
        ],
      },
      ...group.stats,
      {
        title: 'Cumulative',
        description: `Total cumulative stats at ${prettyName}${timeLabel}`,
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
