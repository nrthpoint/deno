import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { colors } from '@/config/colors';

interface WeatherLoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  style?: object;
}

export const WeatherLoadingSpinner: React.FC<WeatherLoadingSpinnerProps> = ({
  size = 'small',
  message = 'Loading weather...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={colors.primary}
        style={styles.spinner}
      />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: colors.neutral,
  },
});
