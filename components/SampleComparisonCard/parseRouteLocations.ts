/**
 * Utility to parse a workout sample's route locations into a format suitable for RouteMap.
 * Assumes each sample has a `route` property with a `locations` array.
 * Optionally, you can pass a function to extract pace for each point.
 */
export interface LocationPoint {
  latitude: number;
  longitude: number;
  pace?: number;
}

/**
 * Calculates the pace (seconds per meter) between two points, given their timestamps and distance.
 * Returns undefined for the first point.
 */
function defaultPaceForIndex(idx: number, locations: any[]): number | undefined {
  if (idx === 0) return undefined;
  const prev = locations[idx - 1];
  const curr = locations[idx];

  if (!prev || !curr || !prev.date || !curr.date) return undefined;

  // Calculate time difference in seconds
  const t1 = new Date(prev.date).getTime() / 1000;
  const t2 = new Date(curr.date).getTime() / 1000;
  const dt = t2 - t1;

  // Calculate distance in meters using haversine formula
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const R = 6371000; // Earth radius in meters
  const dLat = toRad(curr.latitude - prev.latitude);
  const dLon = toRad(curr.longitude - prev.longitude);
  const lat1 = toRad(prev.latitude);
  const lat2 = toRad(curr.latitude);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  if (d < 0.5 || dt <= 0) return undefined; // skip zero/invalid segments

  return dt / d; // seconds per meter
}

export function parseRouteLocations(
  sample: any,
  getPaceForIndex?: (idx: number, locations: any[]) => number | undefined,
): LocationPoint[] {
  if (!sample?.route?.[0]?.locations) return [];

  const locations = sample.route[0].locations;

  return locations
    .filter((loc: any) => typeof loc.latitude === 'number' && typeof loc.longitude === 'number')
    .map((loc: any, idx: number) => ({
      latitude: loc.latitude,
      longitude: loc.longitude,
      pace: getPaceForIndex ? getPaceForIndex(idx, locations) : defaultPaceForIndex(idx, locations),
    }));
}
