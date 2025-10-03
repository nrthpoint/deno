import { WorkoutQuery } from '@/context/Workout';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { WeeklyTrendStats } from './types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const emptyDay = { dayName: 'No data', dayIndex: -1, count: 0 };

export const generateQueryKey = (query: WorkoutQuery): string => {
  return `${query.activityType}-${query.distanceUnit}-${query.timeRangeInDays}`;
};

export const calculateWeeklyTrends = (workouts: ExtendedWorkout[]): WeeklyTrendStats => {
  if (workouts.length === 0) {
    return {
      fastestDay: { ...emptyDay, averagePace: 0 },
      longestDay: { ...emptyDay, averageDuration: 0 },
      shortestDay: { ...emptyDay, averageDuration: 0 },
      highestElevationDay: { ...emptyDay, averageElevation: 0 },
      furthestDay: { ...emptyDay, averageDistance: 0 },
      dayDistribution: [],
    };
  }

  const dayStats = Array(7)
    .fill(null)
    .map((_, index) => ({
      dayIndex: index,
      dayName: DAY_NAMES[index],
      count: 0,
      totalPace: 0,
      totalDuration: 0,
      totalElevation: 0,
      totalDistance: 0,
      validPaceCount: 0,
      validDurationCount: 0,
      validElevationCount: 0,
      validDistanceCount: 0,
    }));

  workouts.forEach((workout) => {
    const dayIndex = new Date(workout.startDate).getDay();
    const dayStat = dayStats[dayIndex];

    dayStat.count++;

    if (workout.pace?.quantity) {
      dayStat.totalPace += workout.pace.quantity;
      dayStat.validPaceCount++;
    }

    if (workout.duration?.quantity) {
      dayStat.totalDuration += workout.duration.quantity;
      dayStat.validDurationCount++;
    }

    if (workout.elevation?.quantity) {
      dayStat.totalElevation += workout.elevation.quantity;
      dayStat.validElevationCount++;
    }

    if (workout.distance?.quantity) {
      dayStat.totalDistance += workout.distance.quantity;
      dayStat.validDistanceCount++;
    }
  });

  const daysWithValidPace = dayStats.filter((day) => day.validPaceCount > 0);
  const fastestDay =
    daysWithValidPace.length > 0
      ? daysWithValidPace.reduce((fastest, current) => {
          const currentAvg = current.totalPace / current.validPaceCount;
          const fastestAvg = fastest.totalPace / fastest.validPaceCount;
          return currentAvg < fastestAvg ? current : fastest;
        })
      : null;

  const daysWithValidDuration = dayStats.filter((day) => day.validDurationCount > 0);
  const longestDay =
    daysWithValidDuration.length > 0
      ? daysWithValidDuration.reduce((longest, current) => {
          const currentAvg = current.totalDuration / current.validDurationCount;
          const longestAvg = longest.totalDuration / longest.validDurationCount;
          return currentAvg > longestAvg ? current : longest;
        })
      : null;

  const shortestDay =
    daysWithValidDuration.length > 0
      ? daysWithValidDuration.reduce((shortest, current) => {
          const currentAvg = current.totalDuration / current.validDurationCount;
          const shortestAvg = shortest.totalDuration / shortest.validDurationCount;
          return currentAvg < shortestAvg ? current : shortest;
        })
      : null;

  const daysWithValidElevation = dayStats.filter((day) => day.validElevationCount > 0);
  const highestElevationDay =
    daysWithValidElevation.length > 0
      ? daysWithValidElevation.reduce((highest, current) => {
          const currentAvg = current.totalElevation / current.validElevationCount;
          const highestAvg = highest.totalElevation / highest.validElevationCount;
          return currentAvg > highestAvg ? current : highest;
        })
      : null;

  const daysWithValidDistance = dayStats.filter((day) => day.validDistanceCount > 0);
  const furthestDay =
    daysWithValidDistance.length > 0
      ? daysWithValidDistance.reduce((furthest, current) => {
          const currentAvg = current.totalDistance / current.validDistanceCount;
          const furthestAvg = furthest.totalDistance / furthest.validDistanceCount;
          return currentAvg > furthestAvg ? current : furthest;
        })
      : null;

  const totalWorkouts = workouts.length;
  const dayDistribution = dayStats.map((day) => ({
    dayName: day.dayName,
    dayIndex: day.dayIndex,
    count: day.count,
    percentage: totalWorkouts > 0 ? (day.count / totalWorkouts) * 100 : 0,
  }));

  return {
    fastestDay: fastestDay
      ? {
          dayName: fastestDay.dayName,
          dayIndex: fastestDay.dayIndex,
          count: fastestDay.count,
          averagePace: fastestDay.totalPace / fastestDay.validPaceCount,
        }
      : { ...emptyDay, averagePace: 0 },
    longestDay: longestDay
      ? {
          dayName: longestDay.dayName,
          dayIndex: longestDay.dayIndex,
          count: longestDay.count,
          averageDuration: longestDay.totalDuration / longestDay.validDurationCount,
        }
      : { ...emptyDay, averageDuration: 0 },
    shortestDay: shortestDay
      ? {
          dayName: shortestDay.dayName,
          dayIndex: shortestDay.dayIndex,
          count: shortestDay.count,
          averageDuration: shortestDay.totalDuration / shortestDay.validDurationCount,
        }
      : { ...emptyDay, averageDuration: 0 },
    highestElevationDay: highestElevationDay
      ? {
          dayName: highestElevationDay.dayName,
          dayIndex: highestElevationDay.dayIndex,
          count: highestElevationDay.count,
          averageElevation:
            highestElevationDay.totalElevation / highestElevationDay.validElevationCount,
        }
      : { ...emptyDay, averageElevation: 0 },
    furthestDay: furthestDay
      ? {
          dayName: furthestDay.dayName,
          dayIndex: furthestDay.dayIndex,
          count: furthestDay.count,
          averageDistance: furthestDay.totalDistance / furthestDay.validDistanceCount,
        }
      : { ...emptyDay, averageDistance: 0 },
    dayDistribution,
  };
};
