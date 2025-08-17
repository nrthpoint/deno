import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import {
  formatPropertyValue,
  getPropertyLabel,
} from '@/components/SampleComparisonCard/ComparisonRowUtils';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { ComparisonRowProps } from './ComparisonRow.types';

export interface StatDisplayData {
  unit: string;
  displayValue: string;
  numericValue: number;
}

const BarChart = ({ width1, width2 }: { width1: number; width2: number }) => (
  <View style={styles.barContainer}>
    <Svg width="100%" height="20">
      {/* Sample 1 bar (top) */}
      <Rect x={0} y={0} width={`${width1}%`} height="7" fill={SAMPLE1_COLOR} rx={3} />
      {/* Sample 2 bar (bottom) */}
      <Rect x={0} y={10} width={`${width2}%`} height="7" fill={SAMPLE2_COLOR} rx={3} />
    </Svg>
  </View>
);

export const SAMPLE1_COLOR = '#2196f3'; // blue
export const SAMPLE2_COLOR = '#e91e63'; // pink

const Stats = ({
  sample1Data,
  sample2Data,
}: {
  sample1Data: StatDisplayData;
  sample2Data: StatDisplayData;
}) => (
  <View style={styles.valuesContainer}>
    <View style={[styles.valueSection, styles.leftValue]}>
      <Text style={[styles.valueText, { color: SAMPLE1_COLOR }]}>{sample1Data.displayValue}</Text>
      <Text style={styles.unitText}>{sample1Data.unit}</Text>
    </View>

    <View style={[styles.valueSection, styles.rightValue]}>
      <Text style={[styles.valueText, { color: SAMPLE2_COLOR }]}>{sample2Data.displayValue}</Text>
      <Text style={styles.unitText}>{sample2Data.unit}</Text>
    </View>
  </View>
);

export const ComparisonRow: React.FC<ComparisonRowProps> = ({ property, sample1, sample2 }) => {
  const sample1Data = formatPropertyValue(property, sample1);
  const sample2Data = formatPropertyValue(property, sample2);

  const maxValue = Math.max(sample1Data.numericValue, sample2Data.numericValue) || 1;

  const widthOne = (sample1Data.numericValue / maxValue) * 100;
  const widthTwo = (sample2Data.numericValue / maxValue) * 100;

  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.propertyLabel}>{getPropertyLabel(property)}</Text>
      <Stats sample1Data={sample1Data} sample2Data={sample2Data} />
      <BarChart width1={widthOne} width2={widthTwo} />
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
