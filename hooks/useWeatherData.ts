import { useCallback, useEffect, useState } from 'react';

import { getWeatherService, WeatherConditions } from '@/services/weather';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { getWorkoutLocation } from '@/utils/geolocation';
import { mergeWeatherData, createWeatherFromHealthKit } from '@/utils/weather';

export interface WeatherDataState {
  weather: WeatherConditions | null;
  loading: boolean;
  error: string | null;
}

export function useWeatherData(workouts: ExtendedWorkout[]): Map<string, WeatherDataState> {
  const [weatherMap, setWeatherMap] = useState<Map<string, WeatherDataState>>(new Map());

  const fetchWeatherData = useCallback(async () => {
    if (workouts.length === 0) {
      setWeatherMap(new Map());
      return;
    }

    const newMap = new Map<string, WeatherDataState>();
    workouts.forEach((w) => newMap.set(w.uuid, { weather: null, loading: true, error: null }));
    setWeatherMap(new Map(newMap));

    for (const workout of workouts) {
      try {
        const location = await getWorkoutLocation(workout);

        let weatherData: WeatherConditions | null = null;

        if (location) {
          const weatherService = getWeatherService();
          const workoutTimestamp = new Date(workout.startDate).getTime();
          const daysSinceWorkout = (Date.now() - workoutTimestamp) / (1000 * 60 * 60 * 24);

          weatherData =
            daysSinceWorkout <= 1
              ? await weatherService.getCurrentWeather(location.latitude, location.longitude)
              : await weatherService.getHistoricalWeather(
                  location.latitude,
                  location.longitude,
                  workoutTimestamp,
                );
        }

        const finalWeather = weatherData
          ? mergeWeatherData(weatherData, workout)
          : createWeatherFromHealthKit(workout);

        setWeatherMap((prev) => {
          const updated = new Map(prev);

          updated.set(workout.uuid, {
            weather: finalWeather,
            loading: false,
            error: finalWeather ? null : 'Weather data not available',
          });
          return updated;
        });
      } catch (err) {
        console.error(`Error fetching weather for workout ${workout.uuid}:`, err);

        const fallbackWeather = createWeatherFromHealthKit(workout);

        setWeatherMap((prev) => {
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
  }, [workouts]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return weatherMap;
}
