import { useQuery } from '@tanstack/react-query';

import { getWeatherService, WeatherConditions } from '@/services/weather';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { getWorkoutLocation } from '@/utils/geolocation';
import { mergeWeatherData, createWeatherFromHealthKit } from '@/utils/weather';

export const useCurrentWeatherQuery = (
  latitude: number,
  longitude: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['weather', 'current', latitude, longitude],
    queryFn: async () => {
      const weatherService = getWeatherService();
      return weatherService.getCurrentWeather(latitude, longitude);
    },
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useHistoricalWeatherQuery = (
  latitude: number,
  longitude: number,
  timestamp: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['weather', 'historical', latitude, longitude, timestamp],
    queryFn: async () => {
      const weatherService = getWeatherService();
      return weatherService.getHistoricalWeather(latitude, longitude, timestamp);
    },
    enabled: enabled && !!latitude && !!longitude && !!timestamp,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (historical data doesn't change)
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const useWorkoutWeatherQuery = (workout: ExtendedWorkout) => {
  return useQuery({
    queryKey: ['weather', 'workout', workout.uuid, workout.startDate],
    queryFn: async (): Promise<WeatherConditions | null> => {
      const location = await getWorkoutLocation(workout);

      if (!location) {
        return createWeatherFromHealthKit(workout);
      }

      const weatherService = getWeatherService();
      const workoutTimestamp = new Date(workout.startDate).getTime();
      const daysSinceWorkout = (Date.now() - workoutTimestamp) / (1000 * 60 * 60 * 24);

      try {
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

        return weatherData
          ? mergeWeatherData(weatherData, workout)
          : createWeatherFromHealthKit(workout);
      } catch (error) {
        console.error(`Error fetching weather for workout ${workout.uuid}:`, error);
        return createWeatherFromHealthKit(workout);
      }
    },
    enabled: !!workout,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};
