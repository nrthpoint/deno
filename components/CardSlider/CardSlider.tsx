import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading, uppercase } from '@/utils/text';

interface CardSliderProps {
  title: string;
  subheading?: string;
  value: number;
  unit?: string;
  style?: object;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  onValueChange: (value: number) => void;
  minimumLabel?: string;
  maximumLabel?: string;
  thumbColor?: string;
  minimumTrackColor?: string;
  maximumTrackColor?: string;
  formatValue?: (value: number) => string;
}

export const CardSlider: React.FC<CardSliderProps> = ({
  title,
  subheading,
  value,
  unit,
  style,
  minimumValue,
  maximumValue,
  step = 0.1,
  minimumLabel,
  maximumLabel,
  thumbColor = colors.primary,
  minimumTrackColor = colors.neutral,
  maximumTrackColor = '#272727',
  onValueChange,
  formatValue,
}) => {
  const displayValue = formatValue ? formatValue(value) : value.toFixed(1);

  return (
    <Card style={style}>
      <View style={styles.cardContent}>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderTitle}>{title}</Text>
          {subheading && <Text style={styles.sliderSubheading}>{subheading}</Text>}
          {displayValue && (
            <Text style={styles.sliderValue}>
              {displayValue}
              {unit && ` ${unit}`}
            </Text>
          )}
          <Slider
            style={styles.slider}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            value={value}
            onValueChange={onValueChange}
            minimumTrackTintColor={minimumTrackColor}
            maximumTrackTintColor={maximumTrackColor}
            thumbTintColor={thumbColor}
          />
          {(minimumLabel || maximumLabel) && (
            <View style={styles.labelsContainer}>
              <Text style={styles.label}>{minimumLabel || minimumValue}</Text>
              <Text style={styles.label}>{maximumLabel || maximumValue}</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: 16,
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  sliderTitle: {
    ...subheading,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 0,
    marginBottom: 0,
  },
  sliderSubheading: {
    color: '#888',
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sliderValue: {
    ...uppercase,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...subheading,
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#888',
  },
});
