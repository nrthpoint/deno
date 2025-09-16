import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ComparisonRow } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/WorkoutContext';
import { uppercase } from '@/utils/text';

import { SampleComparisonCardProps } from './ComparisonCard.types';

/**
 * Card comparing two workout samples, with a map overlay of both routes and a pace heatmap.
 * @param props SampleComparisonCardProps
 */
export const ComparisonCard: React.FC<SampleComparisonCardProps> = (props) => {
  const { sample1, sample2, sample1Label, sample2Label, propertiesToCompare } = props;

  const { setSelectedWorkouts } = useWorkout();

  const handleMapPress = () => {
    setSelectedWorkouts([sample1, sample2]);
    router.push('/map-detail?mode=comparison');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.headerLabel}>{sample1Label}</Text>
        <Text style={styles.headerLabel}>{sample2Label}</Text>
      </View>

      <View style={styles.comparisonRowsContainer}>
        {propertiesToCompare.map((property, index) => (
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

      <RouteMap
        samples={[sample1, sample2]}
        previewMode={true}
        onPress={handleMapPress}
        maxPoints={30}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
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
