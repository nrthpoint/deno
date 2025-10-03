import { Ionicons } from '@expo/vector-icons';

import { TimeRange } from '@/config/timeRanges';
import { GroupStatCalculator } from '@/grouping-engine/GroupStatCalculator';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { convertShortUnitToLong } from '@/utils/distance';
import { formatPace } from '@/utils/pace';
import { calculatePercentage } from '@/utils/quantity';
import { generateTimeLabel } from '@/utils/timeLabels';
import {
  getGreatestElevationWorkout,
  getLowestElevationWorkout,
  getMostFrequentDistance,
  getMostFrequentDuration,
  getMostFrequentElevation,
  getMostFrequentHumidity,
  getMostFrequentPace,
  getMostFrequentTemperature,
  getMostRecentWorkout,
  getOldestWorkout,
} from '@/utils/workout';

/**
 * Basic group statistics calculator that handles common stats
 */
export class BaseGroupStatCalculator implements GroupStatCalculator {
  calculateStats(
    group: Group,
    samples: readonly ExtendedWorkout[],
    timeRangeInDays?: TimeRange,
  ): void {
    group.prettyName = `${group.key} ${convertShortUnitToLong({
      unit: group.unit,
      amount: group.key === 'All' ? samples.length : parseInt(group.key, 10),
    })}`;

    // Calculate basic percentage
    group.prettyPace = formatPace(group.averagePace);
    group.percentageOfTotalWorkouts = calculatePercentage(group.runs.length, samples.length);

    // Averages - Most frequent
    group.averagePace = getMostFrequentPace(group.runs);
    group.averageDuration = getMostFrequentDuration(group.runs);
    group.averageHumidity = getMostFrequentHumidity(group.runs);
    group.averageTemperature = getMostFrequentTemperature(group.runs);

    group.mostRecent = getMostRecentWorkout(group.runs);
    group.oldest = getOldestWorkout(group.runs);
    group.greatestElevation = getGreatestElevationWorkout(group.runs);
    group.lowestElevation = getLowestElevationWorkout(group.runs);
    group.averageDistance = getMostFrequentDistance(group.runs);
    group.averageElevation = getMostFrequentElevation(group.runs);

    // Initialize empty stats array
    const timeLabel = timeRangeInDays ? ` ${generateTimeLabel(timeRangeInDays)}` : '';
    group.stats = [
      {
        title: 'Most Common',
        description: `These are the most common stats for ${group.prettyName}${timeLabel}`,
        items: [
          {
            type: 'pace',
            label: 'Pace',
            value: group.averagePace,
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
            value: group.averageDuration,
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
            value: group.averageDistance,
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
            label: 'Elevation',
            value: group.averageElevation,
            icon: (
              <Ionicons
                name="triangle-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'humidity',
            label: 'Humidity',
            value: group.averageHumidity,
            icon: (
              <Ionicons
                name="water-outline"
                size={40}
                color="#FFFFFF"
              />
            ),
          },
          {
            type: 'temperature',
            label: 'Temperature',
            value: group.averageTemperature,
            icon: (
              <Ionicons
                name="thermometer-outline"
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
