import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useMultipleWeatherData } from '@/hooks/useWeatherData';
import { WeatherService } from '@/services/weatherService';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { subheading, uppercase } from '@/utils/text';

interface WeatherComparisonProps {
  workout1: ExtendedWorkout;
  workout2: ExtendedWorkout;
  workout1Label: string;
  workout2Label: string;
}

interface WeatherMetric {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  workout1Value: string;
  workout2Value: string;
  workout1Raw: number | null;
  workout2Raw: number | null;
  difference: string;
  color: string;
  isDifferent: boolean;
}

export const WeatherComparison: React.FC<WeatherComparisonProps> = ({
  workout1,
  workout2,
  workout1Label,
  workout2Label,
}) => {
  const workouts = useMemo(() => [workout1, workout2], [workout1, workout2]);
  const weatherDataMap = useMultipleWeatherData(workouts);
  const weather1Data = weatherDataMap.get(workout1.uuid);
  const weather2Data = weatherDataMap.get(workout2.uuid);

  const loading = weather1Data?.loading || weather2Data?.loading;
  const weather1 = weather1Data?.weather;
  const weather2 = weather2Data?.weather;

  const getTemperatureComparison = (): WeatherMetric => {
    const temp1 = weather1?.temperature ?? null;
    const temp2 = weather2?.temperature ?? null;

    let difference = 'N/A';
    let color = colors.lightGray;
    let isDifferent = false;

    if (temp1 !== null && temp2 !== null) {
      const diff = temp1 - temp2;
      isDifferent = Math.abs(diff) >= 2; // Consider 2°C+ as significant difference
      difference = diff > 0 ? `+${diff}°C` : `${diff}°C`;

      if (Math.abs(diff) >= 10) {
        color = '#ff5722'; // Large difference
      } else if (Math.abs(diff) >= 5) {
        color = '#ff9800'; // Moderate difference
      } else if (isDifferent) {
        color = '#2196f3'; // Small difference
      } else {
        color = '#4caf50'; // Similar
      }
    }

    return {
      label: 'Temperature',
      icon: 'thermometer',
      workout1Value: temp1 !== null ? `${temp1}°C` : 'N/A',
      workout2Value: temp2 !== null ? `${temp2}°C` : 'N/A',
      workout1Raw: temp1,
      workout2Raw: temp2,
      difference,
      color,
      isDifferent,
    };
  };

  const getHumidityComparison = (): WeatherMetric => {
    const humidity1 = weather1?.humidity ?? null;
    const humidity2 = weather2?.humidity ?? null;

    let difference = 'N/A';
    let color = colors.lightGray;
    let isDifferent = false;

    if (humidity1 !== null && humidity2 !== null) {
      const diff = humidity1 - humidity2;
      isDifferent = Math.abs(diff) >= 10; // Consider 10%+ as significant difference
      difference = diff > 0 ? `+${diff}%` : `${diff}%`;

      if (Math.abs(diff) >= 30) {
        color = '#ff5722'; // Large difference
      } else if (Math.abs(diff) >= 20) {
        color = '#ff9800'; // Moderate difference
      } else if (isDifferent) {
        color = '#2196f3'; // Small difference
      } else {
        color = '#4caf50'; // Similar
      }
    }

    return {
      label: 'Humidity',
      icon: 'water',
      workout1Value: humidity1 !== null ? `${humidity1}%` : 'N/A',
      workout2Value: humidity2 !== null ? `${humidity2}%` : 'N/A',
      workout1Raw: humidity1,
      workout2Raw: humidity2,
      difference,
      color,
      isDifferent,
    };
  };

  const getWindComparison = (): WeatherMetric => {
    const wind1 = weather1?.windSpeed ?? null;
    const wind2 = weather2?.windSpeed ?? null;
    const wind1Kmh = wind1 !== null ? WeatherService.convertWindSpeed(wind1, 'kmh') : null;
    const wind2Kmh = wind2 !== null ? WeatherService.convertWindSpeed(wind2, 'kmh') : null;

    let difference = 'N/A';
    let color = colors.lightGray;
    let isDifferent = false;

    if (wind1Kmh !== null && wind2Kmh !== null) {
      const diff = wind1Kmh - wind2Kmh;
      isDifferent = Math.abs(diff) >= 5; // Consider 5 km/h+ as significant difference
      difference = diff > 0 ? `+${diff} km/h` : `${diff} km/h`;

      if (Math.abs(diff) >= 20) {
        color = '#ff5722'; // Large difference
      } else if (Math.abs(diff) >= 10) {
        color = '#ff9800'; // Moderate difference
      } else if (isDifferent) {
        color = '#2196f3'; // Small difference
      } else {
        color = '#4caf50'; // Similar
      }
    }

    const getWindDisplay = (windKmh: number | null, windDir: number | null) => {
      if (windKmh === null) return 'N/A';
      if (windKmh === 0) return 'Calm';
      const direction = windDir !== null ? WeatherService.getWindDirection(windDir) : '';
      return `${windKmh} km/h ${direction}`.trim();
    };

    return {
      label: 'Wind',
      icon: 'leaf',
      workout1Value: getWindDisplay(wind1Kmh, weather1?.windDirection ?? null),
      workout2Value: getWindDisplay(wind2Kmh, weather2?.windDirection ?? null),
      workout1Raw: wind1Kmh,
      workout2Raw: wind2Kmh,
      difference,
      color,
      isDifferent,
    };
  };

  const getPrecipitationComparison = (): WeatherMetric => {
    const precipitation1 = weather1?.precipitation ?? null;
    const precipitation2 = weather2?.precipitation ?? null;

    let difference = 'N/A';
    let color = colors.lightGray;
    let isDifferent = false;

    if (precipitation1 !== null && precipitation2 !== null) {
      const diff = precipitation1 - precipitation2;
      isDifferent = Math.abs(diff) >= 0.5; // Consider 0.5mm/h+ as significant difference
      difference = diff > 0 ? `+${diff.toFixed(1)} mm/h` : `${diff.toFixed(1)} mm/h`;

      if (Math.abs(diff) >= 2) {
        color = '#ff5722'; // Large difference
      } else if (Math.abs(diff) >= 1) {
        color = '#ff9800'; // Moderate difference
      } else if (isDifferent) {
        color = '#2196f3'; // Small difference
      } else {
        color = '#4caf50'; // Similar
      }
    }

    const getPrecipitationDisplay = (precipitation: number | null) => {
      if (precipitation === null) return 'N/A';
      if (precipitation === 0) return 'None';
      return `${precipitation.toFixed(1)} mm/h`;
    };

    return {
      label: 'Precipitation',
      icon: 'rainy',
      workout1Value: getPrecipitationDisplay(precipitation1),
      workout2Value: getPrecipitationDisplay(precipitation2),
      workout1Raw: precipitation1,
      workout2Raw: precipitation2,
      difference,
      color,
      isDifferent,
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getEnvironmentComparison = (): WeatherMetric => {
    const isIndoor1 = workout1.isIndoor;
    const isIndoor2 = workout2.isIndoor;
    const desc1 = weather1?.weatherDescription || (isIndoor1 ? 'Indoor' : 'Unknown');
    const desc2 = weather2?.weatherDescription || (isIndoor2 ? 'Indoor' : 'Unknown');
    const isDifferent = desc1 !== desc2;

    return {
      label: 'Conditions',
      icon: 'cloud',
      workout1Value: desc1,
      workout2Value: desc2,
      workout1Raw: isIndoor1 ? 1 : 0,
      workout2Raw: isIndoor2 ? 1 : 0,
      difference: isDifferent ? 'Different' : 'Same',
      color: isDifferent ? '#ff9800' : '#4caf50',
      isDifferent,
    };
  };

  const metrics: WeatherMetric[] = [
    getTemperatureComparison(),
    getHumidityComparison(),
    getWindComparison(),
    getPrecipitationComparison(),
    // getEnvironmentComparison(),
  ];

  const renderDifferenceIndicator = (metric: WeatherMetric) => {
    if (!metric.isDifferent) {
      return (
        <View style={styles.similarIndicator}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color="#4caf50"
          />
          <Text style={[styles.differenceText, { color: '#4caf50' }]}>Similar</Text>
        </View>
      );
    }

    return (
      <View style={styles.differenceIndicator}>
        <Ionicons
          name="trending-up"
          size={16}
          color={metric.color}
        />
        <Text style={[styles.differenceText, { color: metric.color }]}>{metric.difference}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <Card>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons
              name="analytics"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.title}>Weather Comparison</Text>
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
            <Text style={styles.loadingText}>Loading weather data...</Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    // <Card>
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Ionicons
          name="analytics"
          size={24}
          color={colors.primary}
        />
        <Text style={styles.title}>Weather Comparison</Text>
      </View> */}

      <View style={styles.comparisonTable}>
        <View style={styles.headerRow}>
          <View style={styles.metricColumn}>
            <Text style={styles.conditionHeaderText}></Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.headerText}>{workout1Label}</Text>
          </View>
          <View style={styles.valueColumn}>
            <Text style={styles.headerText}>{workout2Label}</Text>
          </View>
          <View style={styles.differenceColumn}>
            <Text style={styles.headerText}></Text>
          </View>
        </View>

        {metrics.map((metric, index) => (
          <View
            key={index}
            style={[styles.metricRow, index === metrics.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={styles.metricColumn}>
              <View style={styles.metricInfo}>
                <Ionicons
                  name={metric.icon}
                  size={18}
                  color={metric.color}
                />
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            </View>

            <View style={styles.valueColumn}>
              <Text style={styles.valueText}>{metric.workout1Value}</Text>
            </View>

            <View style={styles.valueColumn}>
              <Text style={styles.valueText}>{metric.workout2Value}</Text>
            </View>

            <View style={styles.differenceColumn}>{renderDifferenceIndicator(metric)}</View>
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>
          <Text style={{ color: '#4caf50' }}>Green</Text> = Similar conditions •{' '}
          <Text style={{ color: '#ff9800' }}>Orange</Text> = Notable difference
        </Text>
        <Text style={styles.dataSourceText}>
          Weather data from external service and device sensors
        </Text>
      </View>
    </View>
    // </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    marginTop: 0,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginLeft: 8,
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  metricRow: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  metricColumn: {
    flex: 1.5,
    justifyContent: 'center',
  },
  valueColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  differenceColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    ...uppercase,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
  },
  conditionHeaderText: {
    ...uppercase,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textAlign: 'left',
  },
  metricInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLabel: {
    ...subheading,
    marginTop: 0,
    marginBottom: 0,
    fontFamily: LatoFonts.bold,
    color: '#FFF',
    marginLeft: 8,
  },
  valueText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
  },
  differenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  similarIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  differenceText: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginTop: 12,
  },
  legend: {
    padding: 8,
    paddingVertical: 12,
    //backgroundColor: colors.surface,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  dataSourceText: {
    fontSize: 10,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
