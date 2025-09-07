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
import { SampleDropdown } from './SampleDropdown';

/**
 * Card comparing two workout samples, with a map overlay of both routes and a pace heatmap.
 * @param props SampleComparisonCardProps
 */
export const ComparisonCard: React.FC<SampleComparisonCardProps> = (props) => {
  const {
    sample1,
    sample2,
    sample1Label,
    sample2Label,
    propertiesToCompare,
    sampleOptions,
    selectedSample1Type,
    selectedSample2Type,
    onSample1Change,
    onSample2Change,
  } = props;

  const { setSelectedWorkouts } = useWorkout();

  const showDropdowns =
    sampleOptions &&
    onSample1Change &&
    onSample2Change &&
    selectedSample1Type &&
    selectedSample2Type;

  const isSameSample = sample1?.uuid && sample2?.uuid && sample1.uuid === sample2.uuid;

  const handleMapPress = () => {
    setSelectedWorkouts([sample1, sample2]);
    router.push('/map-detail?mode=comparison');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {showDropdowns ? (
          <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
            <View style={{ flex: 1 }}>
              <SampleDropdown
                options={sampleOptions}
                selectedType={selectedSample1Type}
                onSelect={onSample1Change}
                placeholder="Select Sample 1"
              />
            </View>

            <View style={{ flex: 1 }}>
              <SampleDropdown
                options={sampleOptions}
                selectedType={selectedSample2Type}
                onSelect={onSample2Change}
                placeholder="Select Sample 2"
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.headerLabel}>{sample1Label}</Text>
            {!isSameSample && <Text style={styles.headerLabel}>{sample2Label}</Text>}
          </>
        )}
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
