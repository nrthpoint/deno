import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import {
  formatPropertyValue,
  getPropertyLabel,
} from '@/components/SampleComparisonCard/ComparisonRowUtils';
import { ColorProfile, colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { ComparisonRowProps } from './ComparisonRow.types';

export interface StatDisplayData {
  unit: string;
  displayValue: string;
  numericValue: number;
}

const BarChart = ({ width, colorProfile }: { width: number; colorProfile: ColorProfile }) => (
  <View style={styles.barContainer}>
    <Svg width="100%" height="20" style={{ borderWidth: 1 }}>
      <Rect x={0} y={0} width={`${width}%`} height="8" fill="#E0E0E0" />
      <Rect width="100%" height="8" x={0} y={6} fill={styles.betterValue.color} />
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

  let width = widthOne > widthTwo ? widthTwo : widthOne;

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
