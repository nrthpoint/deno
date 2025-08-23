import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { ThemedGradient } from '@/components/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { GroupType } from '@/types/Groups';
import { formatDistance } from '@/utils/distance';
import { newQuantity } from '@/utils/quantity';
import { formatDuration } from '@/utils/time';

interface VariationBarProps extends ModalProps {
  distribution: number[];
  label: string;
  width: number;
  groupType?: GroupType; // Add group type to determine formatting
}

const BAR_HEIGHT = 8;
const MARGIN = 20;
const BAR_Y = 24;
const LABEL_Y = BAR_Y + BAR_HEIGHT + 35;

export const VariationBar: React.FC<VariationBarProps> = ({
  distribution,
  label,
  width,
  groupType = 'distance', // Default to distance for backward compatibility
  ...modalProps
}) => {
  // Helper function to format values based on group type
  const formatValue = (value: number): string => {
    if (groupType === 'pace') {
      // TODO: Unit here will be wrong if switching to KM.
      return formatDistance(newQuantity(value, 'mi'));
    } else {
      // For distance and altitude groups, the distribution values are durations in seconds
      return formatDuration(newQuantity(Math.round(value), 's'));
    }
  };

  // Always include min and max, and up to 3 evenly spaced in between
  let values = Array.from(new Set(distribution)).sort((a, b) => a - b);
  let selected: number[] = [];

  if (values.length <= 5) {
    selected = values;
  } else {
    selected = [
      values[0],
      values[Math.floor((values.length - 1) * 0.25)],
      values[Math.floor((values.length - 1) * 0.5)],
      values[Math.floor((values.length - 1) * 0.75)],
      values[values.length - 1],
    ];
    selected = Array.from(new Set(selected));
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const barWidth = width - 2 * MARGIN;

  // Map selected values to x positions
  const positions = selected.map((val) => {
    const x = min === max ? barWidth / 2 + MARGIN : MARGIN + ((val - min) / (max - min)) * barWidth;
    return { x, value: val };
  });

  const content = (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>

      <Svg
        width={width}
        height={70}
      >
        {/* Bar */}
        <Rect
          x={MARGIN}
          y={BAR_Y}
          width={barWidth}
          height={BAR_HEIGHT}
          fill={colors.surface}
          rx={BAR_HEIGHT / 2}
        />

        {/* Dots */}
        {positions.map((dot, i) => {
          const isEnd = i === 0 || i === positions.length - 1;
          const lineHeight = isEnd ? 24 : 16;
          const y1 = BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2;
          const y2 = BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2;

          return (
            <Line
              key={i}
              x1={dot.x}
              x2={dot.x}
              y1={y1}
              y2={y2}
              stroke={colors.surface}
              strokeWidth={8}
              opacity={isEnd ? 1 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Min/Max labels */}
        <SvgText
          x={positions[0].x}
          y={LABEL_Y}
          fontSize={10}
          fill="#fff"
          textAnchor="middle"
        >
          {formatValue(min)}
        </SvgText>

        <SvgText
          x={positions[positions.length - 1].x}
          y={LABEL_Y}
          fontSize={10}
          fill="#fff"
          textAnchor="middle"
        >
          {formatValue(max)}
        </SvgText>
      </Svg>

      <ThemedGradient style={styles.gradient} />
    </View>
  );

  return (
    <ModalProvider {...modalProps}>
      <Card>{content}</Card>
    </ModalProvider>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    height: 500,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
    paddingVertical: 10,
    borderRadius: 8,
  },
  labelText: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
    ...getLatoFont('bold'),
  },
});
