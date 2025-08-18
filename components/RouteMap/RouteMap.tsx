import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import { LocationPoint } from '@/components/RouteMap/parseRouteLocations';

export interface RouteMapProps {
  routes: LocationPoint[][];
}

/**
 * Returns a color for a given pace value. Adjust thresholds as needed.
 */
function getPaceColor(pace?: number): string {
  if (pace === undefined) return '#888';
  if (pace < 300) return '#00e676';
  if (pace < 360) return '#ffeb3b';

  return '#ff1744';
}

/**
 * Renders a map with two routes and pace-based heat coloring.
 */
export const RouteMap: React.FC<RouteMapProps> = ({ routes }) => {
  // Filter out undefined/null routes
  const filteredRoutes = React.useMemo(() => routes.filter(Boolean) as LocationPoint[][], [routes]);

  // Calculate region to fit all points from all routes
  const initialRegion = React.useMemo(() => {
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
  }, [filteredRoutes]);

  // Helper to split route into segments for heatmap coloring
  function getSegments(route: LocationPoint[]) {
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
  }

  // Assign a color or style for each route (fallback to default if more than 2)
  const routeStyles = [
    { strokeWidth: 4, lineDashPattern: undefined },
    { strokeWidth: 4, lineDashPattern: [8, 8] },
    { strokeWidth: 4, lineDashPattern: [2, 6] },
    { strokeWidth: 4, lineDashPattern: [1, 2] },
  ];

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        userInterfaceStyle="dark"
      >
        {filteredRoutes.map((route, routeIdx) =>
          getSegments(route).map((seg, idx) => (
            <Polyline
              key={`route${routeIdx}-seg${idx}`}
              coordinates={seg.coords}
              strokeColor={seg.color}
              strokeWidth={routeStyles[routeIdx]?.strokeWidth || 4}
              lineDashPattern={routeStyles[routeIdx]?.lineDashPattern}
            />
          )),
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
