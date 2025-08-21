import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { StatCardProps } from './StatCard.types';
import { formatQuantityValue } from './StatCard.utils';

export const StatCard = ({
  stat: {
    icon,
    label,
    value,
    type = 'default',
    backgroundColor = colors.surface,
    accentColor = colors.accent,
    ...modalProps
  },
}: StatCardProps) => {
  const { displayValue, unit } = formatQuantityValue(value, type);

  const cardContent = (
    <Card backgroundColor={backgroundColor}>
      <View style={styles.innerContainer}>
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]}>
          <View style={styles.iconContainer}>{icon}</View>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{displayValue}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
        </View>
      </View>
    </Card>
  );

  return <ModalProvider {...modalProps}>{cardContent}</ModalProvider>;
};

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
  },
  accentStrip: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: LatoFonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: LatoFonts.regular,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
