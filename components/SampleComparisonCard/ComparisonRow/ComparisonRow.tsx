import { StyleSheet, Text, View } from 'react-native';

import { BarChart } from '@/components/SampleComparisonCard/ComparisonRow/BarChart';
import {
  formatPropertyValue,
  getPropertyLabel,
} from '@/components/SampleComparisonCard/ComparisonRow/ComparisonRowUtils';
import { colors, SAMPLE1_COLOR, SAMPLE2_COLOR } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { ComparisonRowProps } from './ComparisonRow.types';

export interface StatDisplayData {
  unit: string;
  displayValue: string;
  numericValue: number;
}

const Stats = ({
  sample1Data,
  sample2Data,
}: {
  sample1Data: StatDisplayData;
  sample2Data?: StatDisplayData;
}) => (
  <View style={styles.valuesContainer}>
    <View style={[styles.valueSection, styles.leftValue]}>
      <Text style={[styles.valueText, { color: SAMPLE1_COLOR }]}>{sample1Data.displayValue}</Text>
      <Text style={styles.unitText}>{sample1Data.unit}</Text>
    </View>

    {sample2Data && (
      <View style={[styles.valueSection, styles.rightValue]}>
        <Text style={[styles.valueText, { color: SAMPLE2_COLOR }]}>{sample2Data.displayValue}</Text>
        <Text style={styles.unitText}>{sample2Data.unit}</Text>
      </View>
    )}
  </View>
);

export const ComparisonRow: React.FC<ComparisonRowProps> = ({ property, sample1, sample2 }) => {
  const sample1Data = formatPropertyValue(property, sample1);
  const sample2Data = sample2 ? formatPropertyValue(property, sample2) : undefined;

  const maxValue = sample2Data
    ? Math.max(sample1Data.numericValue, sample2Data.numericValue) || 1
    : sample1Data.numericValue || 1;

  const widthOne = Math.max((sample1Data.numericValue / maxValue) * 100, 1);
  const widthTwo = sample2Data ? Math.max((sample2Data.numericValue / maxValue) * 100, 1) : 0;

  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.propertyLabel}>{getPropertyLabel(property)}</Text>
      <Stats
        sample1Data={sample1Data}
        sample2Data={sample2Data}
      />
      <BarChart
        width1={widthOne}
        width2={widthTwo}
      />
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
});
