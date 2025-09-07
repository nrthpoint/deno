import { LatLng, Region } from 'react-native-maps';

import { LocationPoint } from '@/components/RouteMap/parseRouteLocations';
import { RouteLocationsWithPace } from '@/components/RouteMap/RouteMap.types';
import { PACING } from '@/config/colors';

export const getPaceColor = (pace?: number): string => {
  if (pace === undefined) return PACING.undefined;

  if (pace < 180) return PACING.veryFast;
  if (pace < 300) return PACING.fast;
  if (pace < 360) return PACING.medium;

  return PACING.slow;
};

/**
 * Calculates the initial region for the map view based on the filtered routes.
 * @param filteredRoutes The filtered routes to calculate the region for.
 * @returns The initial region for the map view.
 */
export const calculateInitialRegion = (
  filteredRoutes: RouteLocationsWithPace,
): Region | undefined => {
  const allPoints = filteredRoutes.flat();

  if (allPoints.length === 0) return undefined;

  let minLat = allPoints[0].latitude;
  let maxLat = allPoints[0].latitude;
  let minLng = allPoints[0].longitude;
  let maxLng = allPoints[0].longitude;

  for (const pt of allPoints) {
    if (pt.latitude < minLat) minLat = pt.latitude;
    if (pt.latitude > maxLat) maxLat = pt.latitude;
    if (pt.longitude < minLng) minLng = pt.longitude;
    if (pt.longitude > maxLng) maxLng = pt.longitude;
  }

  // Add some padding
  const latPadding = (maxLat - minLat) * 0.2 || 0.01;
  const lngPadding = (maxLng - minLng) * 0.2 || 0.01;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: maxLat - minLat + latPadding,
    longitudeDelta: maxLng - minLng + lngPadding,
  };
};

export const getSegments = (route: LocationPoint[]) => {
  const segments: { coords: LatLng[]; color: string }[] = [];

  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1];
    const curr = route[i];

    segments.push({
      coords: [prev, curr],
      color: getPaceColor(curr.pace),
    });
  }

  return segments;
};

/**
 * Reduces the number of points in a route for preview mode performance
 */
export const reduceRoutePoints = (route: LocationPoint[], maxPoints: number): LocationPoint[] => {
  if (route.length <= maxPoints) return route;

  const step = Math.floor(route.length / maxPoints);
  const reducedRoute: LocationPoint[] = [];

  // Always include the first point
  reducedRoute.push(route[0]);

  // Sample points at regular intervals
  for (let i = step; i < route.length - step; i += step) {
    reducedRoute.push(route[i]);
  }

  // Always include the last point
  reducedRoute.push(route[route.length - 1]);

  return reducedRoute;
};
