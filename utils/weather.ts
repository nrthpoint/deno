import { WeatherConditions } from '@/services/weather';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

/**
 * Create weather conditions from HealthKit metadata
 */
export function createWeatherFromHealthKit(workout: ExtendedWorkout): WeatherConditions | null {
  const hasHealthKitWeather = workout.humidity.quantity > 0 || workout.temperature.quantity > 0;

  if (!hasHealthKitWeather) return null;

  const humidity = workout.humidity.quantity;
  const temperature = workout.temperature.quantity;

  return {
    temperature,
    humidity,
    windSpeed: 0,
    windDirection: 0,
    precipitation: 0,
    cloudCover: 50,
    pressure: 1013,
    visibility: 10,
    weatherDescription: workout.isIndoor ? 'Indoor workout' : 'n/a',
    weatherIcon: workout.isIndoor ? '01d' : '02d',
  };
}

/**
 * Merge external weather data with HealthKit data, preferring more accurate sources
 */
export function mergeWeatherData(
  externalWeather: WeatherConditions,
  workout: ExtendedWorkout,
): WeatherConditions {
  const { isIndoor, humidity, temperature } = workout;

  const hasHumidity = humidity.quantity > 0;
  const hasTemperature = temperature.quantity > 0;

  return {
    ...externalWeather,
    humidity: hasHumidity ? humidity.quantity : externalWeather.humidity,
    temperature: hasTemperature ? temperature.quantity : externalWeather.temperature,
    weatherDescription: isIndoor ? 'Indoor workout' : externalWeather.weatherDescription,
    weatherIcon: isIndoor ? '01d' : externalWeather.weatherIcon,
  };
}
