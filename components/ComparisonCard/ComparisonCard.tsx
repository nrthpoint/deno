import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ComparisonRow } from '@/components/ComparisonCard/ComparisonRow/ComparisonRow';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/WorkoutContext';

import { SampleComparisonCardProps } from './ComparisonCard.types';

/**
 * Card comparing two workout samples, with a map overlay of both routes and a pace heatmap.
 * @param props SampleComparisonCardProps
 */
export const ComparisonCard: React.FC<SampleComparisonCardProps> = (props) => {
  const { sample1, sample2, sample1Label, sample2Label, propertiesToCompare } = props;

  const { setSelectedWorkouts } = useWorkout();

  const isSameSample = sample1?.uuid && sample2?.uuid && sample1.uuid === sample2.uuid;

  const handleMapPress = () => {
    setSelectedWorkouts([sample1, sample2]);
    router.push('/map-detail?mode=comparison');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.headerLabel}>{sample1Label}</Text>
        {!isSameSample && <Text style={styles.headerLabel}>{sample2Label}</Text>}
      </View>

      {propertiesToCompare.map((property) =>
        isSameSample ? (
          <ComparisonRow
            key={property}
            property={property}
            sample1={sample1}
            sample1Label={sample1Label}
          />
        ) : (
          <ComparisonRow
            key={property}
            property={property}
            sample1={sample1}
            sample2={sample2}
            sample1Label={sample1Label}
            sample2Label={sample2Label}
          />
        ),
      )}

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
    padding: 16,
    marginVertical: 8,
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
});
