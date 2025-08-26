import { Ionicons } from '@expo/vector-icons';

import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import { findLongestRun, findShortestRun } from '@/utils/workout';

/**
 * Pace-based group statistics calculator
 */
export class PaceGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(group: Group, samples: readonly ExtendedWorkout[]): void {
    super.calculateStats(group, samples);

    group.highlight = findLongestRun(group.runs);
    group.worst = findShortestRun(group.runs);

    // Variation is length of run at this pace
    group.variantDistribution = group.runs.map((run) => run.totalDistance.quantity);
    group.totalVariation = getAbsoluteDifference(
      group.worst.totalDistance,
      group.highlight.totalDistance,
    );

    this.generatePredictions(group);
    this.generateStats(group);
  }

  private generatePredictions(group: Group): void {
    if (group.runs.length >= 2) {
      try {
        const prediction4Week = generateWorkoutPrediction(group, 4);
        const prediction12Week = generateWorkoutPrediction(group, 12);

        group.predictions = {
          prediction4Week,
          prediction12Week,
          recommendations: this.generateRecommendations(prediction4Week),
        };
      } catch (error) {
        console.warn(`Failed to generate prediction for group ${group.title}:`, error);
      }
    }
  }

  private generateRecommendations(prediction4Week: any): string[] {
    const recommendations: string[] = [];

    if (prediction4Week && prediction4Week.recommendedTraining?.length > 0) {
      prediction4Week.recommendedTraining.forEach((rec: any) => {
        const workoutName = rec.workoutType
          .replace('_', ' ')
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
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

    return recommendations;
  }

  private generateStats(group: Group): void {
    group.stats = [
      {
        title: 'Furthest',
        description: 'The longest run at this pace',
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
        title: 'Highest Elevation',
        description: 'The highest elevation gain at this pace',
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
        description: 'The shortest run at this pace',
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
        title: 'Lowest Elevation',
        description: 'The lowest elevation gain at this pace',
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
      {
        title: 'Cumulative',
        description: 'The total cumulative stats at this pace',
        items: [
          {
            type: 'distance',
            label: 'Distance',
            value: group.totalDistance,
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
  }
}
