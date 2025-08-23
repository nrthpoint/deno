import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { LatoFonts } from '@/config/fonts';

export const PredictionsHeader: React.FC = () => {
  return (
    <>
      <Text style={styles.sectionHeader}>Predictions</Text>
      <Text style={styles.sectionDescription}>
        Compare your predicted performance over the next 4 and 12 weeks.
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
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
