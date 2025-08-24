import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { parseRouteLocations } from '@/components/RouteMap/parseRouteLocations';
import { RouteMapProps, RouteSegments } from '@/components/RouteMap/RouteMap.types';
import { calculateInitialRegion, getSegments } from '@/components/RouteMap/RouteMap.utils';
import { colors } from '@/config/colors';

const routeStyles = [
  { strokeWidth: 4, lineDashPattern: undefined },
  { strokeWidth: 4, lineDashPattern: [8, 8] },
  { strokeWidth: 4, lineDashPattern: [2, 6] },
  { strokeWidth: 4, lineDashPattern: [1, 2] },
];

export const RouteMap = ({ samples }: RouteMapProps) => {
  const [routes, setRouteSegments] = useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);

      const routePromises = samples.map((sample) => sample.proxy.getWorkoutRoutes());

      Promise.all(routePromises)
        .then((allRoutes) => {
          const allRoutesLocations = allRoutes.map((route) =>
            parseRouteLocations(route[0].locations),
          );
          const allRouteSegments = allRoutesLocations.map(getSegments);
          const initialRegion = calculateInitialRegion(allRoutesLocations);

          setRouteSegments(allRouteSegments);
          setInitialRegion(initialRegion);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchRoutes();
  }, [samples]);

  if (isLoading) {
    return (
      <View style={[styles.mapContainer, styles.loadingContainer]}>
        {/* Add your loading component here, e.g., ActivityIndicator */}
        <ActivityIndicator
          size="large"
          color="#ffffff"
        />
      </View>
    );
  }

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
    height: 550,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
