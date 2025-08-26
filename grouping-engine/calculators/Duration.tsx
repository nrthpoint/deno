import { Ionicons } from '@expo/vector-icons';

import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { getAbsoluteDifference } from '@/utils/quantity';

/**
 * Duration-based group statistics calculator
 */
export class DurationGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(group: Group, samples: readonly ExtendedWorkout[]): void {
    super.calculateStats(group, samples);

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

    this.generateStats(group);
  }

  private generateStats(group: Group): void {
    const { prettyName } = group;

    group.stats = [
      {
        title: 'Furthest',
        description: `Your longest distance at ${prettyName}`,
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
        title: 'Highest',
        description: `Your highest elevation gain at ${prettyName}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.greatestElevation.totalElevation,
            workout: group.greatestElevation,
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
        title: 'Shortest',
        description: `Your shortest distance at ${prettyName}`,
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
        title: 'Lowest',
        description: `Your lowest elevation gain at ${prettyName}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.lowestElevation.totalElevation,
            workout: group.lowestElevation,
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
      ...group.stats,
    ];
  }
}
