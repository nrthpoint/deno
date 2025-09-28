import { WorkoutQuery } from '@/context/Workout';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { WeeklyTrendStats } from './types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const generateQueryKey = (query: WorkoutQuery): string => {
  return `${query.activityType}-${query.distanceUnit}-${query.timeRangeInDays}`;
};

export const calculateWeeklyTrends = (workouts: ExtendedWorkout[]): WeeklyTrendStats => {
  if (workouts.length === 0) {
    const emptyDay = { dayName: 'No data', dayIndex: -1, count: 0 };
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

    if (workout.averagePace?.quantity) {
      dayStat.totalPace += workout.averagePace.quantity;
      dayStat.validPaceCount++;
    }

    if (workout.duration?.quantity) {
      dayStat.totalDuration += workout.duration.quantity;
      dayStat.validDurationCount++;
    }

    if (workout.totalElevation?.quantity) {
      dayStat.totalElevation += workout.totalElevation.quantity;
      dayStat.validElevationCount++;
    }

    if (workout.totalDistance?.quantity) {
      dayStat.totalDistance += workout.totalDistance.quantity;
      dayStat.validDistanceCount++;
    }
  });

  const fastestDay = dayStats
    .filter((day) => day.validPaceCount > 0)
    .reduce(
      (fastest, current) => {
        const currentAvg = current.totalPace / current.validPaceCount;
        const fastestAvg = fastest.totalPace / fastest.validPaceCount;
        return currentAvg < fastestAvg ? current : fastest;
      },
      dayStats.find((day) => day.validPaceCount > 0) || dayStats[0],
    );

  const longestDay = dayStats
    .filter((day) => day.validDurationCount > 0)
    .reduce(
      (longest, current) => {
        const currentAvg = current.totalDuration / current.validDurationCount;
        const longestAvg = longest.totalDuration / longest.validDurationCount;
        return currentAvg > longestAvg ? current : longest;
      },
      dayStats.find((day) => day.validDurationCount > 0) || dayStats[0],
    );

  const shortestDay = dayStats
    .filter((day) => day.validDurationCount > 0)
    .reduce(
      (shortest, current) => {
        const currentAvg = current.totalDuration / current.validDurationCount;
        const shortestAvg = shortest.totalDuration / shortest.validDurationCount;
        return currentAvg < shortestAvg ? current : shortest;
      },
      dayStats.find((day) => day.validDurationCount > 0) || dayStats[0],
    );

  const highestElevationDay = dayStats
    .filter((day) => day.validElevationCount > 0)
    .reduce(
      (highest, current) => {
        const currentAvg = current.totalElevation / current.validElevationCount;
        const highestAvg = highest.totalElevation / highest.validElevationCount;
        return currentAvg > highestAvg ? current : highest;
      },
      dayStats.find((day) => day.validElevationCount > 0) || dayStats[0],
    );

  const furthestDay = dayStats
    .filter((day) => day.validDistanceCount > 0)
    .reduce(
      (furthest, current) => {
        const currentAvg = current.totalDistance / current.validDistanceCount;
        const furthestAvg = furthest.totalDistance / furthest.validDistanceCount;
        return currentAvg > furthestAvg ? current : furthest;
      },
      dayStats.find((day) => day.validDistanceCount > 0) || dayStats[0],
    );

  const totalWorkouts = workouts.length;
  const dayDistribution = dayStats.map((day) => ({
    dayName: day.dayName,
    dayIndex: day.dayIndex,
    count: day.count,
    percentage: totalWorkouts > 0 ? (day.count / totalWorkouts) * 100 : 0,
  }));

  return {
    fastestDay: {
      dayName: fastestDay.dayName,
      dayIndex: fastestDay.dayIndex,
      count: fastestDay.count,
      averagePace:
        fastestDay.validPaceCount > 0 ? fastestDay.totalPace / fastestDay.validPaceCount : 0,
    },
    longestDay: {
      dayName: longestDay.dayName,
      dayIndex: longestDay.dayIndex,
      count: longestDay.count,
      averageDuration:
        longestDay.validDurationCount > 0
          ? longestDay.totalDuration / longestDay.validDurationCount
          : 0,
    },
    shortestDay: {
      dayName: shortestDay.dayName,
      dayIndex: shortestDay.dayIndex,
      count: shortestDay.count,
      averageDuration:
        shortestDay.validDurationCount > 0
          ? shortestDay.totalDuration / shortestDay.validDurationCount
          : 0,
    },
    highestElevationDay: {
      dayName: highestElevationDay.dayName,
      dayIndex: highestElevationDay.dayIndex,
      count: highestElevationDay.count,
      averageElevation:
        highestElevationDay.validElevationCount > 0
          ? highestElevationDay.totalElevation / highestElevationDay.validElevationCount
          : 0,
    },
    furthestDay: {
      dayName: furthestDay.dayName,
      dayIndex: furthestDay.dayIndex,
      count: furthestDay.count,
      averageDistance:
        furthestDay.validDistanceCount > 0
          ? furthestDay.totalDistance / furthestDay.validDistanceCount
          : 0,
    },
    dayDistribution,
  };
};
