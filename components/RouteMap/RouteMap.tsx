import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Text } from 'react-native-paper';
import Svg, { Line } from 'react-native-svg';

import { parseRouteLocations } from '@/components/RouteMap/parseRouteLocations';
import { RouteMapProps, RouteSegments } from '@/components/RouteMap/RouteMap.types';
import {
  calculateInitialRegion,
  getSegments,
  getSegmentsBySplits,
  reduceRoutePoints,
} from '@/components/RouteMap/RouteMap.utils';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';

const routeStyles = [
  { strokeWidth: 4, lineDashPattern: undefined },
  { strokeWidth: 4, lineDashPattern: [8, 8] },
  { strokeWidth: 4, lineDashPattern: [2, 6] },
  { strokeWidth: 4, lineDashPattern: [1, 2] },
];

type PaceDisplayMode = 'per-minute' | 'per-mile';
type MapType = 'standard' | 'satellite';

export const RouteMap = ({
  samples,
  previewMode = false,
  onPress,
  maxPoints = 50,
  style,
  sampleLabels,
}: RouteMapProps) => {
  const posthog = usePostHog();
  const { distanceUnit } = useSettings();
  const [routes, setRouteSegments] = useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationData, setHasLocationData] = useState(true);
  const [paceDisplayMode, setPaceDisplayMode] = useState<PaceDisplayMode>('per-minute');
  const [mapType, setMapType] = useState<MapType>('standard');
  const [visibleRoutes, setVisibleRoutes] = useState<boolean[]>(samples.map(() => true));

  useEffect(() => {
    // Reset visibility when samples change
    setVisibleRoutes(samples.map(() => true));
  }, [samples]);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoading(true);

      const routePromises = samples.map((sample) => sample.proxy.getWorkoutRoutes());

      Promise.all(routePromises)
        .then((allRoutes) => {
          // Check if any routes have location data
          const hasAnyLocationData = allRoutes.some(
            (route) =>
              route && route.length > 0 && route[0].locations && route[0].locations.length > 0,
          );

          if (!hasAnyLocationData) {
            setHasLocationData(false);
            return;
          }

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
          setHasLocationData(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchRoutes();
  }, [samples, previewMode, maxPoints, paceDisplayMode, distanceUnit]);

  const toggleRouteVisibility = (index: number) => {
    setVisibleRoutes((prev) => {
      const newVisibility = [...prev];
      const willBeVisible = !newVisibility[index];
      newVisibility[index] = willBeVisible;

      // Track route toggle
      posthog?.capture(ANALYTICS_EVENTS.MAP_ROUTE_TOGGLED, {
        $screen_name: previewMode ? 'comparison_tab' : 'route_map_modal',
        route_index: index,
        route_label: sampleLabels?.[index] || null,
        is_visible: willBeVisible,
        preview_mode: previewMode,
      });

      return newVisibility;
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.mapContainer, styles.loadingContainer, style]}>
        <ActivityIndicator
          size="large"
          color="#ffffff"
        />
      </View>
    );
  }

  // Hide the map if there's no location data
  if (!hasLocationData) {
    return null;
  }

  const MapComponent = (
    <View
      style={[
        styles.mapContainer,
        previewMode && styles.previewContainer,
        !previewMode && { flex: 1, marginBottom: 50 },
        style,
      ]}
    >
      {!previewMode && (
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWithLabel}>
            <View style={styles.toggleLabel}>
              <Text style={styles.toggleLabelText}>
                {paceDisplayMode === 'per-minute' ? 'Per Min' : 'Per Mile'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconToggle}
              onPress={() => {
                const newMode = paceDisplayMode === 'per-minute' ? 'per-mile' : 'per-minute';
                setPaceDisplayMode(newMode);

                posthog?.capture(ANALYTICS_EVENTS.MAP_PACE_MODE_CHANGED, {
                  $screen_name: 'route_map_modal',
                  new_mode: newMode,
                  preview_mode: previewMode,
                });
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={paceDisplayMode === 'per-minute' ? 'time-outline' : 'speedometer-outline'}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconToggle}
            onPress={() => {
              const newMapType = mapType === 'standard' ? 'satellite' : 'standard';
              setMapType(newMapType);

              posthog?.capture(ANALYTICS_EVENTS.MAP_TYPE_CHANGED, {
                $screen_name: 'route_map_modal',
                new_type: newMapType,
                preview_mode: previewMode,
              });
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={mapType === 'standard' ? 'layers-outline' : 'map-outline'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        mapType={mapType === 'satellite' ? 'hybrid' : 'standard'}
        initialRegion={initialRegion}
        scrollEnabled={!previewMode}
        zoomEnabled={!previewMode}
        pitchEnabled={false}
        rotateEnabled={false}
        userInterfaceStyle="dark"
      >
        {routes.map((route, routeIdx) =>
          visibleRoutes[routeIdx]
            ? route.map((seg, idx) => (
                <Polyline
                  key={`route${routeIdx}-seg${idx}`}
                  coordinates={seg.coords}
                  strokeColor={seg.color}
                  strokeWidth={routeStyles[routeIdx]?.strokeWidth || 4}
                  lineDashPattern={routeStyles[routeIdx]?.lineDashPattern}
                />
              ))
            : null,
        )}
      </MapView>

      {/* Route Labels */}
      {sampleLabels && sampleLabels.length > 0 && (
        <View style={styles.labelsContainer}>
          {sampleLabels.map((label, index) => {
            if (index >= routes.length || !routes[index] || routes[index].length === 0) {
              return null;
            }

            const routeStyle = routeStyles[index] || routeStyles[0];
            const isDashed = routeStyle.lineDashPattern !== undefined;
            const isVisible = visibleRoutes[index];
            const lineColor = routes[index][0]?.color || colors.primary;

            return (
              <TouchableOpacity
                key={`label-${index}`}
                style={[styles.labelBadge, { opacity: isVisible ? 1 : 0.4 }]}
                onPress={() => toggleRouteVisibility(index)}
                activeOpacity={0.7}
              >
                {isDashed ? (
                  <Svg
                    height="2"
                    width="20"
                    style={styles.labelLine}
                  >
                    <Line
                      x1="0"
                      y1="1"
                      x2="20"
                      y2="1"
                      stroke={lineColor}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  </Svg>
                ) : (
                  <View
                    style={[
                      styles.labelLine,
                      {
                        backgroundColor: lineColor,
                      },
                    ]}
                  />
                )}
                <Text style={styles.labelText}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
    overflow: 'hidden',
  },
  previewContainer: {
    height: 200,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 2,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  toggleWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  toggleLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: LatoFonts.bold,
  },
  iconToggle: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  labelsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 2,
    gap: 8,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
  },
  labelLine: {
    width: 20,
    height: 2,
  },
  labelText: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
  },
});
