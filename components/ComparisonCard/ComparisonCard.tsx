import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ComparisonRow } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { formatPropertyValue } from '@/components/ComparisonCard/ComparisonRow/ComparisonRowUtils';
import { colors } from '@/config/colors';

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
      <View style={styles.comparisonRowsContainer}>
        {filteredProperties.map((property) => (
          <ComparisonRow
            key={property}
            property={property}
            sample1={sample1}
            sample2={sample2}
            sample1Label={sample1Label}
            sample2Label={sample2Label}
            style={{ backgroundColor: colors.surface }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  comparisonRowsContainer: {},
});
