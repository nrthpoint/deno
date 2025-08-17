import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { ComparisonRow } from './ComparisonRow';
import { parseRouteLocations } from './parseRouteLocations';
import { RouteMap } from './RouteMap';
import { SampleComparisonCardProps } from './SampleComparisonCard.types';
import { SampleDropdown } from './SampleDropdown';

/**
 * Card comparing two workout samples, with a map overlay of both routes and a pace heatmap.
 * @param props SampleComparisonCardProps
 */
export const SampleComparisonCard: React.FC<SampleComparisonCardProps> = (props) => {
  const {
    sample1,
    sample2,
    sample1Label,
    sample2Label,
    propertiesToCompare,
    colorProfile,
    sampleOptions,
    onSample1Change,
    onSample2Change,
    selectedSample1Type,
    selectedSample2Type,
  } = props;
  /**
   * Parse route locations for both samples. Optionally, you can pass a function to extract pace per point.
   * For now, we just use the locations as-is; you can enhance this to compute pace per segment.
   */
  const route1 = parseRouteLocations(sample1);
  const route2 = parseRouteLocations(sample2);
  const showDropdowns =
    sampleOptions &&
    onSample1Change &&
    onSample2Change &&
    selectedSample1Type &&
    selectedSample2Type;

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
            <Text style={styles.headerLabel}>{sample2Label}</Text>
          </>
        )}
      </View>

      {propertiesToCompare.map((property) => (
        <ComparisonRow
          colorProfile={colorProfile}
          key={property}
          property={property}
          sample1={sample1}
          sample2={sample2}
          sample1Label={sample1Label}
          sample2Label={sample2Label}
        />
      ))}

      {/* Map view overlaying both routes with pace heatmap */}
      {(route1.length > 1 || route2.length > 1) && <RouteMap route1={route1} route2={route2} />}
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
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 16,
    textAlign: 'center',
  },
});
