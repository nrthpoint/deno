import { useCallback, useEffect, useMemo, useState } from 'react';

import { getWeatherService, WeatherConditions } from '@/services/weatherService';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface WeatherDataState {
  weather: WeatherConditions | null;
  loading: boolean;
  error: string | null;
}

export interface UseWeatherDataResult extends WeatherDataState {
  refetch: () => void;
}

/**
 * Hook to fetch weather data for a workout
 * Attempts to get weather data from:
 * 1. Workout start location (if available)
 * 2. Historical weather API
 * 3. Falls back to HealthKit data if external API fails
 */
export function useWeatherData(workout: ExtendedWorkout | null): UseWeatherDataResult {
  const [state, setState] = useState<WeatherDataState>({
    weather: null,
    loading: false,
    error: null,
  });

  const fetchWeatherData = useCallback(async () => {
    if (!workout) {
      setState({ weather: null, loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // First, try to get location from workout route
      const location = await getWorkoutLocation(workout);

      if (!location) {
        // No location data, fall back to HealthKit weather data
        const fallbackWeather = createWeatherFromHealthKit(workout);
        setState({ weather: fallbackWeather, loading: false, error: null });
        return;
      }

      const weatherService = getWeatherService();
      const workoutTimestamp = new Date(workout.startDate).getTime();
      const daysSinceWorkout = (Date.now() - workoutTimestamp) / (1000 * 60 * 60 * 24);

      let weatherData: WeatherConditions | null = null;

      if (daysSinceWorkout <= 1) {
        // For recent workouts (within 24 hours), use current weather
        weatherData = await weatherService.getCurrentWeather(location.latitude, location.longitude);
      } else {
        // For older workouts, try historical weather
        weatherData = await weatherService.getHistoricalWeather(
          location.latitude,
          location.longitude,
          workoutTimestamp,
        );
      }

      if (!weatherData) {
        // External API failed, fall back to HealthKit data
        const fallbackWeather = createWeatherFromHealthKit(workout);
        setState({
          weather: fallbackWeather,
          loading: false,
          error: fallbackWeather ? null : 'Weather data not available',
        });
        return;
      }

      // Merge external weather data with any available HealthKit data
      const mergedWeather = mergeWeatherData(weatherData, workout);
      setState({ weather: mergedWeather, loading: false, error: null });
    } catch (error) {
      console.error('Error fetching weather data:', error);

      // Fall back to HealthKit data
      const fallbackWeather = createWeatherFromHealthKit(workout);
      setState({
        weather: fallbackWeather,
        loading: false,
        error: fallbackWeather ? null : 'Failed to fetch weather data',
      });
    }
  }, [workout]);

  const refetch = useCallback(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Get location coordinates from workout route
 */
async function getWorkoutLocation(
  workout: ExtendedWorkout,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const routes = await workout.proxy.getWorkoutRoutes();

    if (
      !routes ||
      routes.length === 0 ||
      !routes[0].locations ||
      routes[0].locations.length === 0
    ) {
      return null;
    }

    // Use the first location point as the workout location
    const firstLocation = routes[0].locations[0];
    return {
      latitude: firstLocation.latitude,
      longitude: firstLocation.longitude,
    };
  } catch (error) {
    console.error('Error getting workout location:', error);
    return null;
  }
}

/**
 * Create weather conditions from HealthKit metadata
 */
function createWeatherFromHealthKit(workout: ExtendedWorkout): WeatherConditions | null {
  const hasHealthKitWeather = workout.metadata?.HKWeatherTemperature || workout.humidity;

  if (!hasHealthKitWeather) {
    return null;
  }

  // Get humidity from either source
  let humidity = 0;
  if (workout.humidity?.quantity !== undefined && workout.humidity?.quantity !== null) {
    humidity = Math.round(workout.humidity.quantity);
  } else if (workout.metadata?.HKWeatherHumidity) {
    humidity = Math.round(Number(workout.metadata.HKWeatherHumidity) * 100);
  }

  // Get temperature if available
  let temperature = 20; // Default reasonable temperature
  if (workout.metadata?.HKWeatherTemperature) {
    temperature = Math.round(Number(workout.metadata.HKWeatherTemperature));
  }

  return {
    temperature,
    humidity,
    windSpeed: 0, // Not available from HealthKit
    windDirection: 0,
    precipitation: 0,
    cloudCover: 50, // Default
    pressure: 1013, // Standard atmospheric pressure
    visibility: 10, // Default good visibility
    weatherDescription: workout.isIndoor ? 'Indoor workout' : 'n/a',
    weatherIcon: workout.isIndoor ? '01d' : '02d',
  };
}

/**
 * Merge external weather data with HealthKit data, preferring more accurate sources
 */
function mergeWeatherData(
  externalWeather: WeatherConditions,
  workout: ExtendedWorkout,
): WeatherConditions {
  // Prefer HealthKit humidity data if available (it's from the actual device)
  let humidity = externalWeather.humidity;

  if (workout.humidity?.quantity !== undefined && workout.humidity?.quantity !== null) {
    humidity = Math.round(workout.humidity.quantity);
  } else if (workout.metadata?.HKWeatherHumidity) {
    humidity = Math.round(Number(workout.metadata.HKWeatherHumidity) * 100);
  }

  return {
    ...externalWeather,
    humidity,
    // If it's an indoor workout, override some external conditions
    weatherDescription: workout.isIndoor ? 'Indoor workout' : externalWeather.weatherDescription,
    weatherIcon: workout.isIndoor ? '01d' : externalWeather.weatherIcon,
  };
}

/**
 * Hook for multiple workouts weather data
 */
export function useMultipleWeatherData(workouts: ExtendedWorkout[]): Map<string, WeatherDataState> {
  const [weatherDataMap, setWeatherDataMap] = useState<Map<string, WeatherDataState>>(new Map());

  const workoutIds = useMemo(
    () =>
      workouts
        .map((w) => w.uuid)
        .sort()
        .join(','),
    [workouts],
  );

  useEffect(() => {
    if (workouts.length === 0) {
      setWeatherDataMap(new Map());
      return;
    }

    const fetchAllWeatherData = async () => {
      const newWeatherDataMap = new Map<string, WeatherDataState>();

      // Initialize all workouts as loading
      workouts.forEach((workout) => {
        newWeatherDataMap.set(workout.uuid, {
          weather: null,
          loading: true,
          error: null,
        });
      });
      setWeatherDataMap(new Map(newWeatherDataMap));

      // Fetch weather data for each workout sequentially to avoid too many concurrent requests
      for (const workout of workouts) {
        try {
          const location = await getWorkoutLocation(workout);

          if (!location) {
            const fallbackWeather = createWeatherFromHealthKit(workout);

            setWeatherDataMap((prev) => {
              const updated = new Map(prev);
              updated.set(workout.uuid, { weather: fallbackWeather, loading: false, error: null });
              return updated;
            });

            continue;
          }

          const weatherService = getWeatherService();
          const workoutTimestamp = new Date(workout.startDate).getTime();
          const daysSinceWorkout = (Date.now() - workoutTimestamp) / (1000 * 60 * 60 * 24);

          let weatherData: WeatherConditions | null = null;

          if (daysSinceWorkout <= 1) {
            weatherData = await weatherService.getCurrentWeather(
              location.latitude,
              location.longitude,
            );
          } else {
            weatherData = await weatherService.getHistoricalWeather(
              location.latitude,
              location.longitude,
              workoutTimestamp,
            );
          }

          const finalWeather = weatherData
            ? mergeWeatherData(weatherData, workout)
            : createWeatherFromHealthKit(workout);

          setWeatherDataMap((prev) => {
            const updated = new Map(prev);
            updated.set(workout.uuid, {
              weather: finalWeather,
              loading: false,
              error: finalWeather ? null : 'Weather data not available',
            });
            return updated;
          });
        } catch (error) {
          console.error(`Error fetching weather for workout ${workout.uuid}:`, error);

          const fallbackWeather = createWeatherFromHealthKit(workout);

          setWeatherDataMap((prev) => {
            const updated = new Map(prev);
            updated.set(workout.uuid, {
              weather: fallbackWeather,
              loading: false,
              error: fallbackWeather ? null : 'Failed to fetch weather data',
            });
            return updated;
          });
        }
      }
    };

    fetchAllWeatherData();
  }, [workoutIds, workouts]);

  return weatherDataMap;
}
