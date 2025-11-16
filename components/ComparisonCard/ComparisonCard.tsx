import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ComparisonRow } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { formatPropertyValue } from '@/components/ComparisonCard/ComparisonRow/ComparisonRowUtils';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { uppercase } from '@/utils/text';

import { SampleComparisonCardProps } from './ComparisonCard.types';

/**
 * Card comparing two workout samples with detailed metrics comparison.
 * @param props SampleComparisonCardProps
 */
export const ComparisonCard: React.FC<SampleComparisonCardProps> = (props) => {
  const { sample1, sample2, sample1Label, sample2Label, propertiesToCompare } = props;

  // Filter out properties where both values are 0
  const filteredProperties = propertiesToCompare.filter((property) => {
    const sample1Data = formatPropertyValue(property, sample1);
    const sample2Data = sample2 ? formatPropertyValue(property, sample2) : undefined;

    return sample1Data.numericValue !== 0 || (sample2Data && sample2Data.numericValue !== 0);
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.headerLabel}>{sample1Label}</Text>
        <Text style={styles.headerLabel}>{sample2Label}</Text>
      </View>

      <View style={styles.comparisonRowsContainer}>
        {filteredProperties.map((property, index) => (
          <ComparisonRow
            key={property}
            property={property}
            sample1={sample1}
            sample2={sample2}
            sample1Label={sample1Label}
            sample2Label={sample2Label}
            style={index % 2 === 1 ? { backgroundColor: colors.background } : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 16,
  },
  comparisonRowsContainer: {},
  headerLabel: {
    ...uppercase,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
});
