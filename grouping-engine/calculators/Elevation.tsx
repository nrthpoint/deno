import { Ionicons } from '@expo/vector-icons';

import { TimeRange } from '@/config/timeRanges';
import { BaseGroupStatCalculator } from '@/grouping-engine/calculators/Base';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { generateWorkoutPrediction } from '@/utils/prediction';
import { getAbsoluteDifference } from '@/utils/quantity';
import { formatPace, formatDaysAgo } from '@/utils/time';
import { generateTimeLabel } from '@/utils/timeLabels';
import { findHighestElevationRun, findLowestElevationRun } from '@/utils/workout';

/**
 * Elevation-based group statistics calculator
 */
export class ElevationGroupStatCalculator extends BaseGroupStatCalculator {
  calculateStats(
    group: Group,
    samples: readonly ExtendedWorkout[],
    timeRangeInDays?: TimeRange,
  ): void {
    super.calculateStats(group, samples, timeRangeInDays);

    group.variantDistribution = group.runs.map((run) => run.duration.quantity);

    group.highlight = findHighestElevationRun(group.runs);
    group.worst = findLowestElevationRun(group.runs);

    group.totalVariation = getAbsoluteDifference(
      group.highlight.totalElevation,
      group.worst.totalElevation,
    );

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

  private generateStats(group: Group, timeRangeInDays?: TimeRange): void {
    const timeLabel = timeRangeInDays ? ` ${generateTimeLabel(timeRangeInDays)}` : '';
    group.stats = [
      {
        title: 'Overview',
        description: `Your elevation stats overview${timeLabel}`,
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
        title: 'Highest',
        description: `Your highest workouts at this elevation${timeLabel}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.highlight.totalElevation,
            workout: group.highlight,
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
        description: `Your lowest workouts at this elevation${timeLabel}`,
        items: [
          {
            type: 'elevation',
            label: 'Elevation',
            value: group.worst.totalElevation,
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
      {
        title: 'Most Recent',
        description: `Your most recent workout at this elevation${timeLabel} (${formatDaysAgo(group.mostRecent.endDate)})`,
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
        ],
      },
    ];
  }
}
