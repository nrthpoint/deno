import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { getLatoFont } from '@/config/fonts';
import { newQuantity } from '@/utils/quantity';
import { formatDuration } from '@/utils/time';

interface VariationBarProps extends ModalProps {
  distribution: number[];
  color: string;
  label: string;
  width: number;
}

const BAR_HEIGHT = 8;
const MARGIN = 20;
const BAR_Y = 24;
const LABEL_Y = BAR_Y + BAR_HEIGHT + 25;

export const VariationBar: React.FC<VariationBarProps> = ({
  distribution,
  color,
  label,
  width = 200,
  ...modalProps
}) => {
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

      <Svg width={width} height={60}>
        {/* Bar */}
        <Rect
          x={MARGIN}
          y={BAR_Y}
          width={barWidth}
          height={BAR_HEIGHT}
          fill="#ffffff25"
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
              stroke={color}
              strokeWidth={2}
              opacity={isEnd ? 0.95 : 0.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Min/Max labels */}
        <SvgText x={positions[0].x} y={LABEL_Y} fontSize={10} fill="#fff" textAnchor="start">
          {formatDuration(newQuantity(Math.round(min), 's'))}
        </SvgText>

        <SvgText
          x={positions[positions.length - 1].x}
          y={BAR_Y + BAR_HEIGHT + 25}
          fontSize={10}
          fill="#fff"
          textAnchor="end"
        >
          {formatDuration(newQuantity(Math.round(max), 's'))}
        </SvgText>
      </Svg>
    </View>
  );

  return <ModalProvider {...modalProps}>{content}</ModalProvider>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  svgContainer: {},
  textContainer: {
    maxWidth: '100%',
    alignItems: 'center',
    marginTop: -10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 160,
    marginBottom: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    ...getLatoFont('bold'),
  },
  statLabel: {
    fontSize: 10,
    color: '#ffffff',
    textTransform: 'uppercase',
    ...getLatoFont('regular'),
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
  infoButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
});
