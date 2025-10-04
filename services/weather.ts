import { Ionicons } from '@expo/vector-icons';

import { OpenWeatherHistoricalResponse, OpenWeatherResponse } from '@/types/OpenWeather';

export interface WeatherConditions {
  temperature?: number; // Celsius
  humidity?: number; // Percentage
  windSpeed?: number; // m/s
  windDirection?: number; // Degrees
  precipitation?: number; // mm/h
  cloudCover?: number; // Percentage
  pressure?: number; // hPa
  visibility?: number; // km
  weatherDescription?: string; // "Clear sky", "Light rain", etc.
  weatherIcon?: string; // Weather condition code
}

export interface WeatherServiceConfig {
  apiKey: string;
  baseUrl: string;
}

export class WeatherService {
  private config: WeatherServiceConfig;
  private cache: Map<string, { data: WeatherConditions; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor(config: WeatherServiceConfig) {
    this.config = config;
  }

  /**
   * Get historical weather data for a specific location and time
   */
  async getHistoricalWeather(
    latitude: number,
    longitude: number,
    timestamp: number, // Unix timestamp
  ): Promise<WeatherConditions | null> {
    try {
      const cacheKey = `${latitude},${longitude},${timestamp}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // For historical data, we need to use the One Call API 3.0 historical endpoint
      // Note: This requires a paid subscription for historical data beyond 5 days
      const url = `${this.config.baseUrl}/data/3.0/onecall/timemachine`;
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        dt: Math.floor(timestamp / 1000).toString(), // Convert to seconds
        appid: this.config.apiKey,
        units: 'metric',
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Weather API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = (await response.json()) as OpenWeatherHistoricalResponse;
      const weatherData = this.parseHistoricalWeatherData(data);

      if (weatherData) {
        this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      }

      return weatherData;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return null;
    }
  }

  /**
   * Get current weather data (fallback for recent workouts)
   */
  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherConditions | null> {
    try {
      const cacheKey = `current,${latitude},${longitude}`;
      const cached = this.cache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const url = `${this.config.baseUrl}/data/2.5/weather`;
      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        appid: this.config.apiKey,
        units: 'metric',
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Weather API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = (await response.json()) as OpenWeatherResponse;
      const weatherData = this.parseCurrentWeatherData(data);

      if (weatherData) {
        this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      }

      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  private parseHistoricalWeatherData(
    data: OpenWeatherHistoricalResponse,
  ): WeatherConditions | null {
    try {
      const current = data.data[0]; // Get the first (and likely only) data point

      return {
        temperature: Math.round(current.temp),
        humidity: current.humidity,
        windSpeed: current.wind_speed,
        windDirection: current.wind_deg || 0,
        precipitation: current.rain?.['1h'] || current.snow?.['1h'] || 0,
        cloudCover: current.clouds,
        pressure: current.pressure,
        visibility: (current.visibility || 10000) / 1000, // Convert to km
        weatherDescription: current.weather[0]?.description || 'Unknown',
        weatherIcon: current.weather[0]?.icon || '01d',
      };
    } catch (error) {
      console.error('Error parsing historical weather data:', error);
      return null;
    }
  }

  private parseCurrentWeatherData(data: OpenWeatherResponse): WeatherConditions | null {
    try {
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed || 0,
        windDirection: data.wind?.deg || 0,
        precipitation: data.rain?.['1h'] || data.snow?.['1h'] || 0,
        cloudCover: data.clouds?.all || 0,
        pressure: data.main.pressure,
        visibility: (data.visibility || 10000) / 1000, // Convert to km
        weatherDescription: data.weather[0]?.description || 'Unknown',
        weatherIcon: data.weather[0]?.icon || '01d',
      };
    } catch (error) {
      console.error('Error parsing current weather data:', error);
      return null;
    }
  }

  /**
   * Get weather icon name for Ionicons based on weather condition
   */
  static getWeatherIcon(
    weatherIcon: string,
    isDay: boolean = true,
  ): keyof typeof Ionicons.glyphMap {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      '01d': 'sunny', // Clear sky day
      '01n': 'moon', // Clear sky night
      '02d': 'partly-sunny', // Few clouds day
      '02n': 'cloudy-night', // Few clouds night
      '03d': 'cloud', // Scattered clouds
      '03n': 'cloud',
      '04d': 'cloudy', // Broken clouds
      '04n': 'cloudy',
      '09d': 'rainy', // Shower rain
      '09n': 'rainy',
      '10d': 'rainy', // Rain
      '10n': 'rainy',
      '11d': 'thunderstorm', // Thunderstorm
      '11n': 'thunderstorm',
      '13d': 'snow', // Snow
      '13n': 'snow',
      '50d': 'partly-sunny', // Mist/fog
      '50n': 'cloudy-night',
    };

    return iconMap[weatherIcon] || (isDay ? 'sunny' : 'moon');
  }

  /**
   * Get wind direction as compass string
   */
  static getWindDirection(degrees: number): string {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  /**
   * Convert wind speed from m/s to other units
   */
  static convertWindSpeed(speedMps: number, unit: 'kmh' | 'mph' | 'ms' = 'kmh'): number {
    switch (unit) {
      case 'kmh':
        return Math.round(speedMps * 3.6);
      case 'mph':
        return Math.round(speedMps * 2.237);
      case 'ms':
      default:
        return Math.round(speedMps);
    }
  }

  /**
   * Get precipitation intensity description
   */
  static getPrecipitationIntensity(precipitationMm: number): string {
    if (precipitationMm === 0) return 'None';
    if (precipitationMm < 0.5) return 'Light';
    if (precipitationMm < 4) return 'Moderate';
    if (precipitationMm < 16) return 'Heavy';
    return 'Extreme';
  }
}

// Singleton instance
let weatherServiceInstance: WeatherService | null = null;

export const getWeatherService = (): WeatherService => {
  if (!weatherServiceInstance) {
    const config: WeatherServiceConfig = {
      apiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '',
      baseUrl: 'https://api.openweathermap.org',
    };

    if (!config.apiKey) {
      console.warn('OpenWeatherMap API key not found. Weather data will not be available.');
    }

    weatherServiceInstance = new WeatherService(config);
  }

  return weatherServiceInstance;
};
