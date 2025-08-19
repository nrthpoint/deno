import { WorkoutRouteLocation } from '@kingstinct/react-native-healthkit';
import { LatLng } from 'react-native-maps';

import { LocationPoint } from '@/components/RouteMap/parseRouteLocations';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

// Original proxy types.
export type RouteLocationPoints = readonly WorkoutRouteLocation[];
export type RouteLocations = RouteLocationPoints[];

// Parsed with pace
export type RouteLocationWithPace = LocationPoint[];
export type RouteLocationsWithPace = LocationPoint[][];
export type RouteSegments = {
  coords: LatLng[];
  color: string;
}[][];

// Component props
export interface RouteMapProps {
  samples: ExtendedWorkout[];
}
