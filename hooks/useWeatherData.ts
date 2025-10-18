import { useQueries } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getWeatherService, WeatherConditions } from '@/services/weather';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { getWorkoutLocation } from '@/utils/geolocation';
import { mergeWeatherData, createWeatherFromHealthKit } from '@/utils/weather';

export interface WeatherDataState {
  weather: WeatherConditions | null;
  loading: boolean;
  error: string | null;
}

interface WeatherQueryData {
  workout: ExtendedWorkout;
  location: { latitude: number; longitude: number } | null;
}

export function useWeatherData(workouts: ExtendedWorkout[]): Map<string, WeatherDataState> {
  const getWeatherForWorkout = useCallback(
    async (data: WeatherQueryData): Promise<WeatherConditions | null> => {
      const { workout, location } = data;

      if (!location) {
        return createWeatherFromHealthKit(workout);
      }

      const weatherService = getWeatherService();
      const workoutTimestamp = new Date(workout.startDate).getTime();
      const daysSinceWorkout = (Date.now() - workoutTimestamp) / (1000 * 60 * 60 * 24);

      let weatherData: WeatherConditions | null = null;

      try {
        weatherData =
          daysSinceWorkout <= 1
            ? await weatherService.getCurrentWeather(location.latitude, location.longitude)
            : await weatherService.getHistoricalWeather(
                location.latitude,
                location.longitude,
                workoutTimestamp,
              );

        return weatherData
          ? mergeWeatherData(weatherData, workout)
          : createWeatherFromHealthKit(workout);
      } catch (error) {
        console.error(`Error fetching weather for workout ${workout.uuid}:`, error);
        return createWeatherFromHealthKit(workout);
      }
    },
    [],
  );

  const queries = useQueries({
    queries: workouts.map((workout) => ({
      queryKey: ['weather', workout.uuid, workout.startDate],
      queryFn: async () => {
        const location = await getWorkoutLocation(workout);
        return getWeatherForWorkout({ workout, location });
      },
      enabled: !!workout,
      staleTime: 15 * 60 * 1000, // 15 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })),
  });

  const weatherMap = new Map<string, WeatherDataState>();

  workouts.forEach((workout, index) => {
    const query = queries[index];
    weatherMap.set(workout.uuid, {
      weather: query.data || null,
      loading: query.isLoading,
      error: query.error ? (query.error as Error).message : null,
    });
  });

  return weatherMap;
}
