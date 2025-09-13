import { Ionicons } from '@expo/vector-icons';

import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatPace } from '@/utils/time';
import { findFastestRun, findSlowestRun } from '@/utils/workout';

/**
 * Distance-based group statistics calculator
 */
export class DistanceGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(group: Group, samples: readonly ExtendedWorkout[]): void {
    super.calculateStats(group, samples);

    group.highlight = findFastestRun(group.runs);
    group.worst = findSlowestRun(group.runs);

    group.totalVariation = getAbsoluteDifference(group.worst.duration, group.highlight.duration);
    group.variantDistribution = group.runs.map((run) => run.duration.quantity);

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
        console.warn(
          `Distance - generatePredictions: Failed to generate prediction for group ${group.title}:`,
          error,
        );
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
    const { prettyName } = group;

    group.stats = [
      {
        title: 'Fastest',
        description: `Your best performance for ${prettyName}`,
        items: [
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
        ],
      },
      {
        title: 'Slowest',
        description: `Your worst performance for ${prettyName}`,
        items: [
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
        ],
      },
      {
        title: 'Highest',
        description: `Your highest elevation workouts for ${prettyName}`,
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
        description: `Your lowest elevation workouts for ${prettyName}`,
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
      ...group.stats,
      {
        title: 'Cumulative',
        description: `Cumulative stats for ${prettyName}`,
        items: [
          {
            type: 'distance',
            label: 'Cumulative Distance',
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
            label: 'Cumulative Duration',
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
            type: 'elevation',
            label: 'Cumulative Elevation',
            value: group.totalElevation,
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
    ];
  }
}
