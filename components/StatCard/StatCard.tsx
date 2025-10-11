import { GlassView } from 'expo-glass-effect';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useTheme } from '@/context/ThemeContext';

import { StatCardProps } from './StatCard.types';
import { DisplayValue, formatQuantityValue } from './StatCard.utils';

const Value = ({ value, darkerBackground }: { value: DisplayValue; darkerBackground: boolean }) => {
  return value.map((component, index) => (
    <View
      key={index}
      style={styles.durationComponent}
    >
      <Text style={[styles.value, { color: darkerBackground ? colors.neutral : colors.neutral }]}>
        {component.displayValue}
      </Text>
      <Text style={[styles.unit, { color: darkerBackground ? colors.neutral : colors.neutral }]}>
        {component.unit}
      </Text>
    </View>
  ));
};

export const StatCard = ({
  stat: { icon, label, value, type = 'default', ...modalProps },
  accentColor,
  darkerBackground = false,
}: StatCardProps) => {
  const {
    colorProfile: { primary },
  } = useTheme();

  const formattedValue = formatQuantityValue(value, type);

  const cardContent = (
    <Card backgroundColor={darkerBackground ? colors.background : colors.surface}>
      <View style={styles.innerContainer}>
        <View style={[styles.accentStrip, { backgroundColor: accentColor || primary }]}>
          <GlassView
            style={styles.glassOverlay}
            glassEffectStyle="clear"
          >
            <View style={styles.iconContainer}>{icon}</View>
          </GlassView>
        </View>

        <View style={styles.content}>
          <Text
            style={[styles.label, { color: darkerBackground ? colors.neutral : colors.neutral }]}
          >
            {label}
          </Text>
          <View style={styles.valueContainer}>
            <Value
              value={formattedValue}
              darkerBackground={darkerBackground}
            />
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
    marginRight: 20,
    borderRadius: 8,
  },
  glassOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: LatoFonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  durationComponent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: 8,
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
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 1,
    marginLeft: 2,
  },
});
