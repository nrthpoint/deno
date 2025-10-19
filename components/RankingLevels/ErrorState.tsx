import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface ErrorStateProps {
  error: Error;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card style={styles.errorCard}>
      <View style={styles.cardContent}>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
});
