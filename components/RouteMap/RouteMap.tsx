import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { parseRouteLocations } from '@/components/RouteMap/parseRouteLocations';
import { RouteMapProps, RouteSegments } from '@/components/RouteMap/RouteMap.types';
import {
  calculateInitialRegion,
  getSegments,
  reduceRoutePoints,
} from '@/components/RouteMap/RouteMap.utils';
import { colors } from '@/config/colors';

const routeStyles = [
  { strokeWidth: 4, lineDashPattern: undefined },
  { strokeWidth: 4, lineDashPattern: [8, 8] },
  { strokeWidth: 4, lineDashPattern: [2, 6] },
  { strokeWidth: 4, lineDashPattern: [1, 2] },
];

export const RouteMap = ({
  samples,
  previewMode = false,
  onPress,
  maxPoints = 50,
}: RouteMapProps) => {
  const [routes, setRouteSegments] = useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);

      const routePromises = samples.map((sample) => sample.proxy.getWorkoutRoutes());

      Promise.all(routePromises)
        .then((allRoutes) => {
          const allRoutesLocations = allRoutes.map((route) => {
            const parsedLocations = parseRouteLocations(route[0].locations);
            return previewMode ? reduceRoutePoints(parsedLocations, maxPoints) : parsedLocations;
          });
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
  }, [samples, previewMode, maxPoints]);

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

  const MapComponent = (
    <View
      style={[
        styles.mapContainer,
        previewMode && styles.previewContainer,
        !previewMode && { flex: 1, marginBottom: 50 },
      ]}
    >
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        scrollEnabled={!previewMode}
        zoomEnabled={!previewMode}
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

  if (previewMode && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
      >
        {MapComponent}
      </TouchableOpacity>
    );
  }

  return MapComponent;
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  previewContainer: {
    height: 200,
    marginTop: 12,
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
