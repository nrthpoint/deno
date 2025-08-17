import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { LatLng, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

import { SAMPLE1_COLOR, SAMPLE2_COLOR } from '@/components/SampleComparisonCard/ComparisonRow';

/**
 * Props for RouteMap
 * @param route1 Array of location objects for sample 1
 * @param route2 Array of location objects for sample 2
 * @param pace1 Array of pace values (seconds per km or mile) for sample 1
 * @param pace2 Array of pace values for sample 2
 * @param color1 Polyline color for sample 1
 * @param color2 Polyline color for sample 2
 */
export interface RouteMapProps {
  route1: { latitude: number; longitude: number; pace?: number }[];
  route2?: { latitude: number; longitude: number; pace?: number }[];
}

/**
 * Returns a color for a given pace value. Adjust thresholds as needed.
 */
function getPaceColor(pace: number | undefined): string {
  if (pace === undefined) return '#888';

  if (pace < 300) return '#00e676'; // fast (under 5:00/km)
  if (pace < 360) return '#ffeb3b'; // moderate (5:00-6:00/km)

  return '#ff1744'; // slow (over 6:00/km)
}

/**
 * Renders a map with two routes and pace-based heat coloring.
 */
export const RouteMap: React.FC<RouteMapProps> = ({ route1, route2 }) => {
  // Center map on the first point of route1 or route2
  const initialRegion = React.useMemo(() => {
    const first = route1[0] || route2?.[0];
    return first
      ? {
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : undefined;
  }, [route1, route2]);

  // Helper to split route into segments for heatmap coloring
  function getSegments(route: typeof route1) {
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

  return (
    <View style={styles.mapContainer}>
      {/* {initialRegion && ( */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* Route 1 with heat coloring */}
        {getSegments(route1).map((seg, idx) => (
          <Polyline
            key={`r1-${idx}`}
            coordinates={seg.coords}
            strokeColor={SAMPLE1_COLOR}
            strokeWidth={4}
          />
        ))}

        {/* Route 2 with heat coloring */}
        {route2 &&
          getSegments(route2).map((seg, idx) => (
            <Polyline
              key={`r2-${idx}`}
              coordinates={seg.coords}
              strokeColor={SAMPLE2_COLOR}
              strokeWidth={4}
              lineDashPattern={[8, 8]}
            />
          ))}
      </MapView>
      {/* )} */}
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
