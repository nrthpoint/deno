import { RouteLocationPoints, RouteLocationWithPace } from '@/components/RouteMap/RouteMap.types';

/**
 * Utility to parse a workout sample's route locations into a format suitable for RouteMap.
 * Assumes each sample has a `route` property with a `locations` array.
 * Optionally, you can pass a function to extract pace for each point.
 */
const R = 6371000; // Earth radius in meters

export interface LocationPoint {
  latitude: number;
  longitude: number;
  pace: number;
}

/**
 * Converts degrees to radians.
 */
function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculates the time difference in seconds between two points with date properties.
 */
function getTimeDifferenceSeconds(prev: any, curr: any): number | undefined {
  if (!prev?.date || !curr?.date) return undefined;

  const t1 = new Date(prev.date).getTime() / 1000;
  const t2 = new Date(curr.date).getTime() / 1000;

  return t2 - t1;
}

/**
 * Calculates the distance in meters between two latitude/longitude points using the haversine formula.
 */
function getDistanceMeters(prev: any, curr: any): number {
  const dLat = toRadians(curr.latitude - prev.latitude);
  const dLon = toRadians(curr.longitude - prev.longitude);

  const lat1 = toRadians(prev.latitude);
  const lat2 = toRadians(curr.latitude);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates the pace (seconds per meter) between two points, given their timestamps and distance.
 */
function calculatePaceForIndex(idx: number, locations: RouteLocationPoints): number {
  if (idx === 0) return 0;

  const prev = locations[idx - 1];
  const curr = locations[idx];

  if (!prev || !curr) {
    return 0;
  }

  const dt = getTimeDifferenceSeconds(prev, curr);
  const d = getDistanceMeters(prev, curr);

  // skip zero/invalid segments
  if (d < 0.5 || !dt || dt <= 0) return 0;

  return (dt / d) * 1000; // seconds per kilometer
}

export function parseRouteLocations(locations: RouteLocationPoints): RouteLocationWithPace {
  return locations.map((loc, idx) => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
    pace: calculatePaceForIndex(idx, locations),
  }));
}
