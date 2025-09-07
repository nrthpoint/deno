import { LengthUnit, WorkoutEvent } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export enum WorkoutEventType {
  pause = 1,
  resume = 2,
  lap = 3,
  marker = 4,
  motionPaused = 5,
  motionResumed = 6,
  segment = 7,
  pauseOrResumeRequest = 8,
}

export interface WorkoutSplit {
  splitNumber: number;
  distance: number;
  distanceUnit: LengthUnit;
  duration: number; // seconds
  pace: number; // seconds per unit
  startTime: Date;
  endTime: Date;
  cumulativeDistance: number;
  cumulativeTime: number;
}

const R = 6371000; // Earth radius in meters

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function convertDistance(meters: number, unit: LengthUnit): number {
  switch (unit) {
    case 'mi':
      return meters / 1609.34;
    case 'km':
      return meters / 1000;
    case 'm':
      return meters;
    default:
      return meters;
  }
}

function getWorkoutDistanceUnit(workout: ExtendedWorkout): LengthUnit {
  return (workout.totalDistance?.unit as LengthUnit) || 'mi';
}

function getSplitDistance(unit: LengthUnit): number {
  switch (unit) {
    case 'mi':
      return 1;
    case 'km':
      return 1;
    case 'm':
      return 1000;
    default:
      return 1;
  }
}

/**
 * Calculates splits from workout events (segments) by grouping segments into mile/km intervals
 * Each segment event has its own distance - we need to group them to form proper splits
 */
export function calculateSplitsFromEvents(
  workout: ExtendedWorkout,
  events: WorkoutEvent[],
): WorkoutSplit[] {
  try {
    // Filter for segment events (type 7) and pause/resume events
    const segmentEvents = events.filter((event) => event.type === WorkoutEventType.segment);
    const pauseEvents = events.filter(
      (event) =>
        event.type === WorkoutEventType.pause || event.type === WorkoutEventType.motionPaused,
    );
    const resumeEvents = events.filter(
      (event) =>
        event.type === WorkoutEventType.resume || event.type === WorkoutEventType.motionResumed,
    );

    if (segmentEvents.length === 0) {
      return [];
    }

    const distanceUnit = getWorkoutDistanceUnit(workout);
    const totalDistance = workout.totalDistance?.quantity || 0;
    const splitDistanceTarget = getSplitDistance(distanceUnit);

    // Sort segments by start date to get chronological order
    const sortedSegments = segmentEvents.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    // Calculate distance for each segment based on time proportion
    const segmentsWithDistance = sortedSegments.map((segment) => {
      const startTime = new Date(segment.startDate);
      const endTime = new Date(segment.endDate);
      const rawDuration = (endTime.getTime() - startTime.getTime()) / 1000;

      // Calculate active time (excluding pauses)
      const pausedTime = calculatePausedTimeInInterval(
        pauseEvents,
        resumeEvents,
        startTime,
        endTime,
      );
      const duration = Math.max(0, rawDuration - pausedTime);

      return {
        ...segment,
        startTime,
        endTime,
        duration,
        rawDuration,
      };
    });

    // Calculate total active time
    const totalActiveTime = segmentsWithDistance.reduce((sum, seg) => sum + seg.duration, 0);

    // Assign distance to each segment based on time proportion
    const segmentsWithCalculatedDistance = segmentsWithDistance.map((segment) => {
      const distanceProportion = segment.duration / totalActiveTime;
      const segmentDistance = totalDistance * distanceProportion;

      return {
        ...segment,
        distance: segmentDistance,
      };
    });

    // Now group segments into mile/km splits
    const splits: WorkoutSplit[] = [];
    let currentSplitDistance = 0;
    let currentSplitDuration = 0;
    let currentSplitStartTime: Date | null = null;
    let cumulativeDistance = 0;
    let cumulativeTime = 0;

    for (const segment of segmentsWithCalculatedDistance) {
      let remainingSegmentDistance = segment.distance;
      let segmentStartTime = segment.startTime;

      while (remainingSegmentDistance > 0) {
        // Start a new split if needed
        if (currentSplitStartTime === null) {
          currentSplitStartTime = segmentStartTime;
        }

        // Calculate how much of this segment fits in the current split
        const distanceNeededToCompleteSplit = splitDistanceTarget - currentSplitDistance;
        const segmentPortionForThisSplit = Math.min(
          remainingSegmentDistance,
          distanceNeededToCompleteSplit,
        );

        // Calculate duration proportion for this portion
        const durationProportion = segmentPortionForThisSplit / segment.distance;
        const durationForThisPortion = segment.duration * durationProportion;

        // Add to current split
        currentSplitDistance += segmentPortionForThisSplit;
        currentSplitDuration += durationForThisPortion;
        cumulativeDistance += segmentPortionForThisSplit;
        cumulativeTime += durationForThisPortion;

        // Check if we've completed a split
        if (
          currentSplitDistance >= splitDistanceTarget ||
          (remainingSegmentDistance === segmentPortionForThisSplit &&
            segment === segmentsWithCalculatedDistance[segmentsWithCalculatedDistance.length - 1])
        ) {
          // Calculate end time for this split
          const splitDurationMs = currentSplitDuration * 1000;
          const currentSplitEndTime = new Date(currentSplitStartTime!.getTime() + splitDurationMs);

          const pace = currentSplitDuration / Math.max(currentSplitDistance, 0.01);

          splits.push({
            splitNumber: splits.length + 1,
            distance: currentSplitDistance,
            distanceUnit,
            duration: currentSplitDuration,
            pace,
            startTime: currentSplitStartTime!,
            endTime: currentSplitEndTime,
            cumulativeDistance,
            cumulativeTime,
          });

          // Reset for next split
          currentSplitDistance = 0;
          currentSplitDuration = 0;
          currentSplitStartTime = null;
        }

        // Update remaining segment values
        remainingSegmentDistance -= segmentPortionForThisSplit;

        // Update segment start time for next iteration (if needed)
        if (remainingSegmentDistance > 0) {
          const portionDurationMs = durationForThisPortion * 1000;
          segmentStartTime = new Date(segmentStartTime.getTime() + portionDurationMs);
        }
      }
    }

    return splits;
  } catch (error) {
    console.error('Error calculating splits from events:', error);
    return [];
  }
}

/**
 * Calculates total paused time within a given time interval
 */
function calculatePausedTimeInInterval(
  pauseEvents: WorkoutEvent[],
  resumeEvents: WorkoutEvent[],
  intervalStart: Date,
  intervalEnd: Date,
): number {
  let totalPausedTime = 0;

  for (const pauseEvent of pauseEvents) {
    const pauseTime = new Date(pauseEvent.startDate);

    // Find the corresponding resume event
    const resumeEvent = resumeEvents.find(
      (resume) => new Date(resume.startDate).getTime() > pauseTime.getTime(),
    );

    if (resumeEvent) {
      const resumeTime = new Date(resumeEvent.startDate);

      // Check if pause period overlaps with our interval
      const overlapStart = new Date(Math.max(pauseTime.getTime(), intervalStart.getTime()));
      const overlapEnd = new Date(Math.min(resumeTime.getTime(), intervalEnd.getTime()));

      if (overlapStart < overlapEnd) {
        totalPausedTime += (overlapEnd.getTime() - overlapStart.getTime()) / 1000;
      }
    }
  }

  return totalPausedTime;
}

/**
 * Enhanced split calculation that tries events first, falls back to GPS data
 */
export async function calculateWorkoutSplits(workout: ExtendedWorkout): Promise<WorkoutSplit[]> {
  try {
    // First, try to use workout events for more accurate splits
    if (workout.events && workout.events.length > 0) {
      const eventBasedSplits = calculateSplitsFromEvents(workout, workout.events);
      if (eventBasedSplits.length > 0) {
        return eventBasedSplits;
      }
    }

    // Fallback to GPS-based calculation
    const routes = await workout.proxy.getWorkoutRoutes();
    if (!routes || routes.length === 0 || !routes[0].locations) {
      return [];
    }

    const locations = routes[0].locations;
    if (locations.length < 2) {
      return [];
    }

    const distanceUnit = getWorkoutDistanceUnit(workout);
    const splitDistanceInMeters =
      getSplitDistance(distanceUnit) *
      (distanceUnit === 'mi' ? 1609.34 : distanceUnit === 'km' ? 1000 : 1);
    const splits: WorkoutSplit[] = [];

    let cumulativeDistance = 0;
    let cumulativeTime = 0;
    let splitStartTime = new Date(locations[0].date);
    let currentSplitDistance = 0;

    for (let i = 1; i < locations.length; i++) {
      const prevLocation = locations[i - 1];
      const currentLocation = locations[i];

      const segmentDistance = getDistanceMeters(
        prevLocation.latitude,
        prevLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude,
      );

      const timeDiff =
        (new Date(currentLocation.date).getTime() - new Date(prevLocation.date).getTime()) / 1000;

      cumulativeDistance += segmentDistance;
      cumulativeTime += timeDiff;
      currentSplitDistance += segmentDistance;

      // Check if we've completed a split
      if (currentSplitDistance >= splitDistanceInMeters || i === locations.length - 1) {
        const splitEndTime = new Date(currentLocation.date);
        const splitDuration = (splitEndTime.getTime() - splitStartTime.getTime()) / 1000;
        const splitDistanceConverted = convertDistance(currentSplitDistance, distanceUnit);
        const pace = splitDuration / splitDistanceConverted;

        splits.push({
          splitNumber: splits.length + 1,
          distance: splitDistanceConverted,
          distanceUnit,
          duration: splitDuration,
          pace,
          startTime: splitStartTime,
          endTime: splitEndTime,
          cumulativeDistance: convertDistance(cumulativeDistance, distanceUnit),
          cumulativeTime,
        });

        // Reset for next split
        splitStartTime = splitEndTime;
        currentSplitDistance = 0;
      }
    }

    return splits;
  } catch (error) {
    console.error('Error calculating workout splits:', error);
    return [];
  }
}

export function formatSplitTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatSplitPace(pace: number, unit: LengthUnit): string {
  const minutes = Math.floor(pace / 60);
  const seconds = Math.floor(pace % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/${unit}`;
}

export function calculateTimeDifference(
  time1: number,
  time2: number,
): { diff: number; isPositive: boolean; formatted: string } {
  const diff = Math.abs(time1 - time2);
  const isPositive = time1 > time2;

  let formatted: string;
  if (diff >= 60) {
    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff % 60);
    formatted = seconds > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${minutes}:00`;
  } else {
    formatted = `${Math.floor(diff)}s`;
  }

  return { diff, isPositive, formatted };
}
