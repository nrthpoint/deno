import { ColorProfile, colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { convertDurationToMinutes, formatPace } from '@/utils/time';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { ComparisonRowProps } from './ComparisonRow.types';
import { ComparisonProperty } from './SampleComparisonCard.types';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface StatDisplayData {
  displayValue: string;
  unit: string;
  numericValue: number;
}

const formatPropertyValue = (
  property: ComparisonProperty,
  workout: ExtendedWorkout,
): StatDisplayData => {
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
      return 'Avg. Pace';
    case 'distance':
      return 'Distance';
    case 'elevation':
      return 'Elevation';
    default:
      return property;
  }
};

const BarChart = ({ width, colorProfile }: { width: number; colorProfile: ColorProfile }) => (
  <View style={styles.barContainer}>
    <Svg width="100%" height="20" style={{ borderWidth: 1 }}>
      <Rect x={0} y={0} width={`${width}%`} height="8" fill="#E0E0E0" />
      <Rect width="100%" height="8" x={0} y={6} fill={colorProfile.primary} />
    </Svg>
  </View>
);

const Stats = ({
  sample1Data,
  sample2Data,
  sample1Better,
}: {
  sample1Data: StatDisplayData;
  sample2Data: StatDisplayData;
  sample1Better: boolean;
}) => (
  <View style={styles.valuesContainer}>
    <View style={[styles.valueSection, styles.leftValue]}>
      <Text style={[styles.valueText, sample1Better && styles.betterValue]}>
        {sample1Data.displayValue}
      </Text>
      <Text style={styles.unitText}>{sample1Data.unit}</Text>
    </View>

    <View style={[styles.valueSection, styles.rightValue]}>
      <Text style={[styles.valueText, !sample1Better && styles.betterValue]}>
        {sample2Data.displayValue}
      </Text>
      <Text style={styles.unitText}>{sample2Data.unit}</Text>
    </View>
  </View>
);

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  property,
  sample1,
  sample2,
  colorProfile,
}) => {
  const sample1Data = formatPropertyValue(property, sample1);
  const sample2Data = formatPropertyValue(property, sample2);

  let widthOne = (sample1Data.numericValue / sample2Data.numericValue) * 100 || 0;
  let widthTwo = (sample2Data.numericValue / sample1Data.numericValue) * 100 || 0;

  let lowerIsBetter = property === 'averagePace' || property === 'duration';
  let sample1Better = lowerIsBetter
    ? sample1Data.numericValue < sample2Data.numericValue
    : sample1Data.numericValue > sample2Data.numericValue;

  let width = widthOne > widthTwo ? widthOne : widthTwo;

  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.propertyLabel}>{getPropertyLabel(property)}</Text>
      <Stats sample1Data={sample1Data} sample2Data={sample2Data} sample1Better={sample1Better} />
      <BarChart width={width} colorProfile={colorProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
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
