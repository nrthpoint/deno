import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatPace } from '@/utils/workout';
import { convertDurationToMinutes } from '@/utils/time';
import {
  SampleComparisonCardProps,
  ComparisonRowProps,
  ComparisonProperty,
} from './SampleComparisonCard.types';
import { ExtendedWorkout } from '@/types/workout';

const formatPropertyValue = (
  property: ComparisonProperty,
  workout: ExtendedWorkout,
): { displayValue: string; unit: string; numericValue: number } => {
  switch (property) {
    case 'duration':
      const durationInMinutes = convertDurationToMinutes(workout.duration);

      return {
        displayValue: `${durationInMinutes}`,
        unit: 'min',
        numericValue: durationInMinutes,
      };

    case 'averagePace':
      const paceFormatted = formatPace(workout.averagePace);
      const paceMatch = paceFormatted.match(/^(\d+:\d+)\s*(.*)$/);

      if (paceMatch) {
        return {
          displayValue: paceMatch[1],
          unit: paceMatch[2] || workout.averagePace.unit,
          numericValue: workout.averagePace.quantity,
        };
      }

      return {
        displayValue: paceFormatted,
        unit: '',
        numericValue: workout.averagePace.quantity,
      };

    case 'distance':
      return {
        displayValue: workout.totalDistance.quantity.toFixed(2),
        unit: workout.totalDistance.unit || '',
        numericValue: workout.totalDistance.quantity,
      };

    case 'elevation':
      // Assuming elevation data might be in workout statistics
      const elevation = workout.totalElevationAscended || { quantity: 0, unit: 'ft' };
      return {
        displayValue: elevation.quantity.toFixed(0),
        unit: elevation.unit || 'ft',
        numericValue: elevation.quantity,
      };

    case 'humidity':
      // Assuming humidity data is available in the workout
      const humidity = workout.humidity || { quantity: 0, unit: '%' };
      return {
        displayValue: humidity.quantity.toFixed(0),
        unit: humidity.unit || '%',
        numericValue: humidity.quantity,
      };

    default:
      return {
        displayValue: '0',
        unit: '',
        numericValue: 0,
      };
  }
};

const getPropertyLabel = (property: ComparisonProperty): string => {
  switch (property) {
    case 'duration':
      return 'Duration';
    case 'averagePace':
      return 'Avg Pace';
    case 'distance':
      return 'Distance';
    case 'elevation':
      return 'Elevation';
    default:
      return property;
  }
};

const ComparisonRow: React.FC<ComparisonRowProps> = ({ property, sample1, sample2 }) => {
  const sample1Data = formatPropertyValue(property, sample1);
  const sample2Data = formatPropertyValue(property, sample2);

  // Calculate which sample performs better (lower is better for pace and duration, higher for distance and elevation)
  const lowerIsBetter = property === 'averagePace' || property === 'duration';
  const sample1Better = lowerIsBetter
    ? sample1Data.numericValue < sample2Data.numericValue
    : sample1Data.numericValue > sample2Data.numericValue;

  // Calculate percentage for bar chart
  const width = sample1Better
    ? (sample2Data.numericValue / sample1Data.numericValue) * 100
    : (sample1Data.numericValue / sample2Data.numericValue) * 100;

  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.propertyLabel}>{getPropertyLabel(property)}</Text>

      <View style={styles.valuesContainer}>
        {/* Sample 1 Value */}
        <View style={[styles.valueSection, styles.leftValue]}>
          <Text style={[styles.valueText, sample1Better && styles.betterValue]}>
            {sample1Data.displayValue}
          </Text>
          <Text style={styles.unitText}>{sample1Data.unit}</Text>
        </View>

        {/* Sample 2 Value */}
        <View style={[styles.valueSection, styles.rightValue]}>
          <Text style={[styles.valueText, !sample1Better && styles.betterValue]}>
            {sample2Data.displayValue}
          </Text>
          <Text style={styles.unitText}>{sample2Data.unit}</Text>
        </View>
      </View>

      {/* Bar Chart */}
      <View style={styles.barContainer}>
        <Svg width="100%" height="20" viewBox="0 0 100 20">
          {/* Base Bar (Better Value) */}
          <Rect
            width="100%"
            height="8"
            x={-130}
            y={6}
            fill={sample1Better ? '#4CAF50' : '#FF9800'}
          />
          {/* Comparison Bar (Lesser Value) */}
          <Rect x="-130" y="6" width={`${width}%`} height="8" fill="#E0E0E0" />
        </Svg>
      </View>
    </View>
  );
};

export const SampleComparisonCard = ({
  sample1,
  sample2,
  sample1Label,
  sample2Label,
  propertiesToCompare,
}: SampleComparisonCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.headerLabel}>{sample1Label}</Text>
        <Text style={styles.headerLabel}>{sample2Label}</Text>
      </View>

      {propertiesToCompare.map((property) => (
        <ComparisonRow
          key={property}
          property={property}
          sample1={sample1}
          sample2={sample2}
          sample1Label={sample1Label}
          sample2Label={sample2Label}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonRow: {
    marginBottom: 8,
    marginTop: 8,
  },
  propertyLabel: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  valuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  valueSection: {
    flex: 1,
    alignItems: 'center',
  },
  leftValue: {
    alignItems: 'flex-start',
  },
  rightValue: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    fontWeight: '600',
  },
  betterValue: {
    color: '#4CAF50',
  },
  unitText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#888',
    marginTop: 2,
  },
  sampleLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#666',
    marginTop: 4,
  },
  barContainer: {
    height: 20,
  },
});
