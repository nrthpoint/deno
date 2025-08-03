import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ComparisonRow } from './ComparisonRow';
import { SampleComparisonCardProps } from './SampleComparisonCard.types';

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
});
