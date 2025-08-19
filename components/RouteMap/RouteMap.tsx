import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { parseRouteLocations } from '@/components/RouteMap/parseRouteLocations';
import { RouteMapProps, RouteSegments } from '@/components/RouteMap/RouteMap.types';
import { calculateInitialRegion, getSegments } from '@/components/RouteMap/RouteMap.utils';

const routeStyles = [
  { strokeWidth: 4, lineDashPattern: undefined },
  { strokeWidth: 4, lineDashPattern: [8, 8] },
  { strokeWidth: 4, lineDashPattern: [2, 6] },
  { strokeWidth: 4, lineDashPattern: [1, 2] },
];

export const RouteMap: React.FC<RouteMapProps> = ({ samples }) => {
  const [routes, setRouteSegments] = React.useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = React.useState<Region | undefined>();

  useEffect(() => {
    const fetchRoutes = async () => {
      const allRoutes = await Promise.all(
        samples.map(async (sample) => await sample.proxy.getWorkoutRoutes()),
      );

      const allRoutesLocations = allRoutes.map((route) => parseRouteLocations(route[0].locations));
      const allRouteSegments = allRoutesLocations.map(getSegments);
      const initialRegion = calculateInitialRegion(allRoutesLocations);

      setRouteSegments(allRouteSegments);
      setInitialRegion(initialRegion);
    };

    fetchRoutes();
  }, [samples]);

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
        {routes.map((route, routeIdx) =>
          route.map((seg, idx) => (
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
