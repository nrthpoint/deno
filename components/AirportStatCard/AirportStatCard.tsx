import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AnimatedCounter } from '@/components/Stats/AnimatedCounter';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { uppercase } from '@/utils/text';

interface AirportStatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const AirportStatCard: React.FC<AirportStatCardProps> = ({ label, value, unit }) => {
  const isNumeric = typeof value === 'number';

  return (
    <View style={styles.container}>
      <ThemedGradient style={styles.gradient} />
      <GlassView
        style={styles.glassOverlay}
        glassEffectStyle="clear"
      >
        <Text style={styles.cardLabel}>{label}</Text>
        <View style={styles.cardValueContainer}>
          {isNumeric ? (
            <AnimatedCounter
              value={value}
              style={styles.cardValue}
            />
          ) : (
            <Text style={styles.cardValue}>{value}</Text>
          )}
          {unit && <Text style={styles.cardUnit}>{unit}</Text>}
        </View>
      </GlassView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    borderRadius: 8,
  },
  glassOverlay: {
    padding: 16,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardLabel: {
    ...uppercase,
    fontSize: 12,
    color: colors.background,
    marginBottom: 8,
    letterSpacing: 1.5,
    fontFamily: LatoFonts.bold,
  },
  cardValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValue: {
    fontSize: 40,
    color: colors.background,
    fontFamily: LatoFonts.bold,
    letterSpacing: -0.5,
  },
  cardUnit: {
    ...uppercase,
    fontSize: 12,
    color: colors.background,
    marginLeft: 10,
    fontFamily: LatoFonts.bold,
  },
});
