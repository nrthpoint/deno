import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';

import { parseRouteLocations } from '@/components/RouteMap/parseRouteLocations';
import { RouteMapProps, RouteSegments } from '@/components/RouteMap/RouteMap.types';
import {
  calculateInitialRegion,
  getSegments,
  getSegmentsBySplits,
  reduceRoutePoints,
} from '@/components/RouteMap/RouteMap.utils';
import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';

const routeStyles = [
  { strokeWidth: 4, lineDashPattern: undefined },
  { strokeWidth: 4, lineDashPattern: [8, 8] },
  { strokeWidth: 4, lineDashPattern: [2, 6] },
  { strokeWidth: 4, lineDashPattern: [1, 2] },
];

type PaceDisplayMode = 'per-minute' | 'per-mile';

const paceDisplayTabs: TabOption[] = [
  { id: 'per-minute', label: 'Per Minute' },
  { id: 'per-mile', label: 'Per Mile' },
];

export const RouteMap = ({
  samples,
  previewMode = false,
  onPress,
  maxPoints = 50,
}: RouteMapProps) => {
  const { distanceUnit } = useSettings();
  const [routes, setRouteSegments] = useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [paceDisplayMode, setPaceDisplayMode] = useState<PaceDisplayMode>('per-minute');

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);

      const routePromises = samples.map((sample) => sample.proxy.getWorkoutRoutes());

      Promise.all(routePromises)
        .then((allRoutes) => {
          const allRoutesLocations = allRoutes.map((route) => {
            const parsedLocations = parseRouteLocations(route[0].locations);

            return previewMode
              ? reduceRoutePoints(parsedLocations, maxPoints)
              : reduceRoutePoints(parsedLocations, 200);
          });

          const allRouteSegments = allRoutesLocations.map((route) =>
            paceDisplayMode === 'per-minute'
              ? getSegments(route)
              : getSegmentsBySplits(route, distanceUnit),
          );
          const initialRegion = calculateInitialRegion(allRoutesLocations);

          setRouteSegments(allRouteSegments);
          setInitialRegion(initialRegion);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchRoutes();
  }, [samples, previewMode, maxPoints, paceDisplayMode, distanceUnit]);

  if (isLoading) {
    return (
      <View style={[styles.mapContainer, styles.loadingContainer]}>
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
      {!previewMode && (
        <View style={styles.tabContainer}>
          <TabBar
            tabs={paceDisplayTabs}
            activeTabId={paceDisplayMode}
            onTabPress={(tabId) => setPaceDisplayMode(tabId as PaceDisplayMode)}
            activeTabColor={colors.primary}
            activeTextColor={colors.neutral}
            inactiveTextColor={colors.lightGray}
          />
        </View>
      )}

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
  tabContainer: {
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
