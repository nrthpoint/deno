import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />
      <Text style={styles.loadingText}>Loading performance levels...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
});
