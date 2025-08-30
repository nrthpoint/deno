import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ComparisonCard } from '@/components/ComparisonCard/ComparisonCard';
import { SampleOption, SampleType } from '@/components/ComparisonCard/ComparisonCard.types';
import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { LatoFonts } from '@/config/fonts';

export interface ComparisonTabProps extends TabContentProps {
  selectedSample1Type: SampleType;
  selectedSample2Type: SampleType;
  onSample1Change: (type: SampleType) => void;
  onSample2Change: (type: SampleType) => void;
}

export const ComparisonTab = ({
  group,
  selectedSample1Type,
  selectedSample2Type,
  onSample1Change,
  onSample2Change,
}: ComparisonTabProps) => {
  // Create sample options from the group data
  const sampleOptions: SampleOption[] = [
    {
      type: 'highlight',
      label: 'Best Performance',
      workout: group.highlight,
    },
    {
      type: 'worst',
      label: 'Worst Performance',
      workout: group.worst,
    },
    {
      type: 'mostRecent',
      label: (() => {
        const today = new Date();
        const mostRecent = group.mostRecent.endDate;

        const diffTime = Math.floor(
          (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffTime === 0) return 'Today';
        if (diffTime === 1) return 'Yesterday';

        return `Most Recent (${diffTime}d)`;
      })(),
      workout: group.mostRecent,
    },
  ];

  // Get the selected samples based on the current selection
  const getSelectedSample = (type: SampleType) => {
    switch (type) {
      case 'highlight':
        return group.highlight;
      case 'worst':
        return group.worst;
      case 'mostRecent':
        return group.mostRecent;
      default:
        return group.highlight;
    }
  };

  const selectedSample1 = getSelectedSample(selectedSample1Type);
  const selectedSample2 = getSelectedSample(selectedSample2Type);
  const selectedSample1Label =
    sampleOptions.find((opt) => opt.type === selectedSample1Type)?.label || 'Sample 1';
  const selectedSample2Label =
    sampleOptions.find((opt) => opt.type === selectedSample2Type)?.label || 'Sample 2';

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Workout Comparison</Text>
      <Text style={styles.sectionDescription}>
        Compare your workouts side by side to see how they stack up against each other.
      </Text>

      <ComparisonCard
        sample1={selectedSample1}
        sample2={selectedSample2}
        sample1Label={selectedSample1Label}
        sample2Label={selectedSample2Label}
        sampleOptions={sampleOptions}
        onSample1Change={onSample1Change}
        onSample2Change={onSample2Change}
        selectedSample1Type={selectedSample1Type}
        selectedSample2Type={selectedSample2Type}
        propertiesToCompare={['duration', 'averagePace', 'distance', 'elevation', 'humidity']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 0,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginBottom: 20,
    paddingHorizontal: 5,
    lineHeight: 20,
  },
});
