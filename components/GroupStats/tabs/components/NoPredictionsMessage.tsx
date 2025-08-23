import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export const NoPredictionsMessage: React.FC = () => {
  return (
    <View style={styles.noPredictionsContainer}>
      <Text style={styles.noPredictionsText}>Not enough data for AI predictions</Text>
      <Text style={styles.noPredictionsSubtext}>
        Complete at least 2 workouts in this group to see AI-powered predictions and training
        recommendations.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noPredictionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 30,
    marginHorizontal: 5,
    marginVertical: 20,
    alignItems: 'center',
  },
  noPredictionsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  noPredictionsSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
