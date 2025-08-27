import { Ionicons } from '@expo/vector-icons';

import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import { findHighestElevationRun, findLowestElevationRun } from '@/utils/workout';

/**
 * Elevation-based group statistics calculator
 */
export class ElevationGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(group: Group, samples: readonly ExtendedWorkout[]): void {
    super.calculateStats(group, samples);

    group.variantDistribution = group.runs.map((run) => run.duration.quantity);

    group.highlight = findHighestElevationRun(group.runs);
    group.worst = findLowestElevationRun(group.runs);

    group.totalVariation = getAbsoluteDifference(
      group.highlight.totalElevation,
      group.worst.totalElevation,
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
        title: 'Overview',
        items: [
          {
            type: 'distance',
            label: 'Total Distance',
            value: group.totalDistance,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="location"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            label: 'Total Elevation Gain',
            type: 'elevation',
            value: group.totalElevation,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="trending-up"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
        ],
      },
      {
        title: 'Elevation',
        items: [
          {
            type: 'elevation',
            label: 'Highest Elevation Gain',
            value: group.highlight.totalElevation,
            workout: group.highlight,
            icon: (
              <Ionicons
                name="trending-up"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'elevation',
            label: 'Lowest Elevation Gain',
            value: group.worst.totalElevation,
            workout: group.worst,
            icon: (
              <Ionicons
                name="trending-up"
                size={40}
                color="#FFFFFF"
              />
            ),
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
            icon: (
              <Ionicons
                name="speedometer"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'pace',
            label: 'Average Pace',
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
        ],
      },
    ];
  }
}
