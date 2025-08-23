import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/context/ThemeContext';

interface ThemedGradientProps {
  style?: any;
}

export const ThemedGradient: React.FC<ThemedGradientProps> = ({ style }) => {
  const { gradientColors } = useTheme();

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    />
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
