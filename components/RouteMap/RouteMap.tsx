import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';

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
  const [routes, setRouteSegments] = useState<RouteSegments>([]);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processRouteChunk = useCallback(
    async (
      routeData: any[],
      chunkSize: number = 1,
    ): Promise<{ segments: RouteSegments; region: Region | undefined }> => {
      const allSegments: RouteSegments = [];
      const allLocations: any[] = [];

      // Process routes in small chunks with delays to allow UI updates
      for (let i = 0; i < routeData.length; i += chunkSize) {
        const chunk = routeData.slice(i, i + chunkSize);

        // Process each chunk
        const chunkResults = await Promise.all(
          chunk.map(async (route) => {
            const locations = parseRouteLocations(route.locations);
            const segments = getSegments(locations);
            return { locations, segments };
          }),
        );

        // Add results to collections
        chunkResults.forEach(({ locations, segments }) => {
          allLocations.push(locations);
          allSegments.push(segments);
        });

        // Yield control back to the UI thread between chunks
        if (i + chunkSize < routeData.length) {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      const region = allLocations.length > 0 ? calculateInitialRegion(allLocations) : undefined;
      return { segments: allSegments, region };
    },
    [],
  );

  useEffect(() => {
    let isCancelled = false;

    const fetchRoutes = async () => {
      if (samples.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all route data first (this is usually fast)
        const allRoutes = await Promise.all(
          samples.map(async (sample) => {
            try {
              const routes = await sample.proxy.getWorkoutRoutes();
              return routes[0]; // Take first route
            } catch (err) {
              console.warn('Failed to fetch route for sample:', err);
              return null;
            }
          }),
        );

        // Filter out failed fetches
        const validRoutes = allRoutes.filter((route) => route && route.locations);

        if (isCancelled) return;

        if (validRoutes.length === 0) {
          setRouteSegments([]);
          setInitialRegion(undefined);
          setIsLoading(false);
          return;
        }

        // Process the route data in a non-blocking way
        const { segments, region } = await processRouteChunk(validRoutes, 2);

        if (!isCancelled) {
          setRouteSegments(segments);
          setInitialRegion(region);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error fetching routes:', err);
          setError('Failed to load route data');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchRoutes();

    // Cleanup function to cancel ongoing operations
    return () => {
      isCancelled = true;
    };
  }, [samples, processRouteChunk]);

  // Memoize the polylines to prevent unnecessary re-renders
  const polylines = useMemo(() => {
    return routes
      .map((route, routeIdx) =>
        route.map((seg, idx) => (
          <Polyline
            key={`route${routeIdx}-seg${idx}`}
            coordinates={seg.coords}
            strokeColor={seg.color}
            strokeWidth={routeStyles[routeIdx]?.strokeWidth || 4}
            lineDashPattern={routeStyles[routeIdx]?.lineDashPattern}
          />
        )),
      )
      .flat();
  }, [routes]);

  if (error) {
    return (
      <View style={[styles.mapContainer, styles.centerContent]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
          />
        </View>
      )}
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
        {polylines}
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
