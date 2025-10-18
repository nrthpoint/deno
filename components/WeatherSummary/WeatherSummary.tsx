import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card/Card';
import { WeatherLoadingSpinner } from '@/components/WeatherLoadingSpinner';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkoutWeatherQuery } from '@/hooks/useWeatherQuery';
import { WeatherService } from '@/services/weather';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface WeatherSummaryProps {
  workout: ExtendedWorkout;
}

interface WeatherCondition {
  icon: keyof typeof Ionicons.glyphMap | string; // Allow custom weather icons
  label: string;
  value: string;
  color: string;
  percentage?: number; // For bar chart representation
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ workout }) => {
  const { data: weather, isLoading: loading, error } = useWorkoutWeatherQuery(workout);

  const getTemperatureData = (): WeatherCondition => {
    const temp = weather?.temperature ?? null;

    let color = colors.lightGray;
    let icon: keyof typeof Ionicons.glyphMap = 'thermometer-outline';

    if (temp !== null) {
      if (temp >= 25) {
        color = '#ff5722'; // Hot
        icon = 'thermometer';
      } else if (temp >= 15) {
        color = '#ff9800'; // Warm
        icon = 'thermometer';
      } else if (temp >= 5) {
        color = '#2196f3'; // Cool
        icon = 'thermometer-outline';
      } else {
        color = '#00bcd4'; // Cold
        icon = 'snow-outline';
      }
    }

    return {
      icon,
      label: 'Temperature',
      value: temp !== null ? `${temp}°C` : 'N/A',
      color,
      percentage: temp !== null ? Math.min(Math.max(((temp + 10) / 50) * 100, 0), 100) : 0,
    };
  };

  const getHumidityData = (): WeatherCondition => {
    const humidityValue = weather?.humidity ?? null;

    let color = colors.lightGray;
    let icon: keyof typeof Ionicons.glyphMap = 'water-outline';

    if (humidityValue !== null) {
      if (humidityValue >= 80) {
        color = '#2196f3'; // Very humid
        icon = 'water';
      } else if (humidityValue >= 60) {
        color = '#00bcd4'; // Humid
        icon = 'water';
      } else if (humidityValue >= 40) {
        color = '#4caf50'; // Comfortable
        icon = 'water-outline';
      } else {
        color = '#ff9800'; // Dry
        icon = 'water-outline';
      }
    }

    return {
      icon,
      label: 'Humidity',
      value: humidityValue !== null ? `${humidityValue}%` : 'N/A',
      color,
      percentage: humidityValue || 0,
    };
  };

  const getWindData = (): WeatherCondition => {
    const windSpeed = weather?.windSpeed ?? 0;
    const windDirection = weather?.windDirection ?? 0;
    const windSpeedKmh = WeatherService.convertWindSpeed(windSpeed, 'kmh');
    const windDirectionStr = WeatherService.getWindDirection(windDirection);

    let color = colors.lightGray;
    let icon: keyof typeof Ionicons.glyphMap = 'leaf-outline';

    if (windSpeedKmh >= 50) {
      color = '#f44336'; // Strong wind
      icon = 'leaf';
    } else if (windSpeedKmh >= 25) {
      color = '#ff9800'; // Moderate wind
      icon = 'leaf';
    } else if (windSpeedKmh >= 10) {
      color = '#2196f3'; // Light wind
      icon = 'leaf-outline';
    } else {
      color = '#4caf50'; // Calm
      icon = 'leaf-outline';
    }

    return {
      icon,
      label: 'Wind',
      value: windSpeedKmh > 0 ? `${windSpeedKmh} km/h ${windDirectionStr}` : 'Calm',
      color,
      percentage: Math.min((windSpeedKmh / 60) * 100, 100),
    };
  };

  const getPrecipitationData = (): WeatherCondition => {
    const precipitation = weather?.precipitation ?? 0;

    let color = colors.lightGray;
    let icon: keyof typeof Ionicons.glyphMap = 'water-outline';

    if (precipitation >= 4) {
      color = '#2196f3'; // Heavy rain
      icon = 'rainy';
    } else if (precipitation >= 0.5) {
      color = '#00bcd4'; // Moderate rain
      icon = 'rainy-outline';
    } else if (precipitation > 0) {
      color = '#4caf50'; // Light rain
      icon = 'water-outline';
    } else {
      color = '#ff9800'; // No rain
      icon = 'sunny-outline';
    }

    return {
      icon,
      label: 'Precipitation',
      value: precipitation > 0 ? `${precipitation.toFixed(1)} mm/h` : 'None',
      color,
      percentage: Math.min((precipitation / 10) * 100, 100),
    };
  };

  const getIndoorOutdoorData = (): WeatherCondition => {
    const isIndoor = workout.isIndoor;
    const weatherIcon = weather?.weatherIcon || '01d';
    const description = weather?.weatherDescription || (isIndoor ? 'Indoor' : 'Unknown');

    return {
      icon: isIndoor ? 'home' : WeatherService.getWeatherIcon(weatherIcon),
      label: 'Conditions',
      value: isIndoor ? 'Indoor' : description,
      color: isIndoor ? '#9c27b0' : '#ff9800',
      percentage: undefined, // No bar chart for conditions
    };
  };

  const conditions: WeatherCondition[] = [
    getTemperatureData(),
    getHumidityData(),
    getWindData(),
    getPrecipitationData(),
    getIndoorOutdoorData(),
  ];

  const renderWeatherBar = (condition: WeatherCondition) => {
    if (condition.percentage === undefined) return null;

    return (
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${condition.percentage}%`,
                backgroundColor: condition.color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <Card>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name="cloud"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.title}>Weather Conditions</Text>
          </View>

          <View style={styles.loadingContainer}>
            <WeatherLoadingSpinner
              size="large"
              message="Loading weather data..."
            />
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons
            name="cloud"
            size={24}
            color={colors.neutral}
          />
          <Text style={styles.title}>Weather Conditions</Text>
          {error && (
            <Ionicons
              name="warning"
              size={16}
              color="#ff9800"
              style={styles.warningIcon}
            />
          )}
        </View>
        <View style={styles.innerContainer}>
          {error && !weather && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="cloud-offline"
                size={32}
                color={colors.lightGray}
              />
              <Text style={styles.errorText}>{error.message || 'Failed to load weather data'}</Text>
            </View>
          )}

          <View style={styles.conditionsGrid}>
            {conditions.map((condition, index) => (
              <View
                key={index}
                style={styles.conditionItem}
              >
                <View style={styles.conditionHeader}>
                  <Ionicons
                    name={condition.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={condition.color}
                  />
                  <Text style={styles.conditionLabel}>{condition.label}</Text>
                </View>
                <Text style={[styles.conditionValue, { color: condition.color }]}>
                  {condition.value}
                </Text>
                {renderWeatherBar(condition)}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dataSourceNote}>
          <Ionicons
            name="information-circle"
            size={16}
            color={colors.lightGray}
          />
          <Text style={styles.dataSourceText}>
            {workout.isIndoor
              ? 'Indoor workout - external weather data may not apply'
              : error
                ? 'Using device sensors where available'
                : 'Weather data from OpenWeatherMap'}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 16,
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  innerContainer: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surfaceHighlight,
  },
  title: {
    fontSize: 13,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    marginLeft: 8,
    letterSpacing: 1.5,
  },
  conditionsGrid: {
    gap: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionItem: {
    marginBottom: 4,
    flexBasis: '45%',
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  conditionValue: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    //marginBottom: 8,
    marginVertical: 10,
  },
  barContainer: {
    marginBottom: 8,
  },
  barBackground: {
    height: 4,
    backgroundColor: colors.gray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  warningIcon: {
    marginLeft: 8,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginTop: 8,
    textAlign: 'center',
  },
  dataSourceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 0,
  },
  dataSourceText: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginLeft: 12,
    flex: 1,
    letterSpacing: 1.5,
    lineHeight: 20,
  },
});
