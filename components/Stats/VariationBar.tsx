import { GlassView } from 'expo-glass-effect';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';
import { formatDistance } from '@/utils/distance';
import { newQuantity } from '@/utils/quantity';
import { formatDuration } from '@/utils/time';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
interface VariationBarProps extends ModalProps {
  label: string;
  width: number;
}

const BAR_HEIGHT = 4;
const MARGIN = 20;
const BAR_Y = 24;
const LABEL_Y = BAR_Y + BAR_HEIGHT + 35;
const END_BAR_WIDTH = 4;
const INTERVAL_BAR_WIDTH = 4;
const MAX_LINES = 5; // Maximum number of lines we'll ever show

export const VariationBar: React.FC<VariationBarProps> = ({ label, width, ...modalProps }) => {
  const { group } = useGroupStats();
  const distribution = group.variantDistribution;
  const groupType = group.type;

  // Create shared values for each possible line (must be at top level)
  const line0Position = useSharedValue(0);
  const line1Position = useSharedValue(0);
  const line2Position = useSharedValue(0);
  const line3Position = useSharedValue(0);
  const line4Position = useSharedValue(0);
  const line0Opacity = useSharedValue(0);
  const line1Opacity = useSharedValue(0);
  const line2Opacity = useSharedValue(0);
  const line3Opacity = useSharedValue(0);
  const line4Opacity = useSharedValue(0);
  const line0IsEnd = useSharedValue(0);
  const line1IsEnd = useSharedValue(0);
  const line2IsEnd = useSharedValue(0);
  const line3IsEnd = useSharedValue(0);
  const line4IsEnd = useSharedValue(0);
  const minLabelX = useSharedValue(0);
  const maxLabelX = useSharedValue(0);

  // Arrays for easier access - memoized to prevent useEffect dependency issues
  const linePositions = useMemo(
    () => [line0Position, line1Position, line2Position, line3Position, line4Position],
    [line0Position, line1Position, line2Position, line3Position, line4Position],
  );
  const lineOpacities = useMemo(
    () => [line0Opacity, line1Opacity, line2Opacity, line3Opacity, line4Opacity],
    [line0Opacity, line1Opacity, line2Opacity, line3Opacity, line4Opacity],
  );
  const lineIsEnd = useMemo(
    () => [line0IsEnd, line1IsEnd, line2IsEnd, line3IsEnd, line4IsEnd],
    [line0IsEnd, line1IsEnd, line2IsEnd, line3IsEnd, line4IsEnd],
  );

  // Create animated props for each line at top level
  const line0AnimatedProps = useAnimatedProps(() => {
    const isEnd = line0IsEnd.value > 0.5;
    const lineHeight = isEnd ? 24 : 16;
    const strokeWidth = isEnd ? END_BAR_WIDTH : INTERVAL_BAR_WIDTH;
    return {
      x1: line0Position.value,
      x2: line0Position.value,
      y1: BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2,
      y2: BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2,
      opacity: line0Opacity.value,
      strokeWidth,
    };
  });

  const line1AnimatedProps = useAnimatedProps(() => {
    const isEnd = line1IsEnd.value > 0.5;
    const lineHeight = isEnd ? 24 : 16;
    const strokeWidth = isEnd ? END_BAR_WIDTH : INTERVAL_BAR_WIDTH;
    return {
      x1: line1Position.value,
      x2: line1Position.value,
      y1: BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2,
      y2: BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2,
      opacity: line1Opacity.value,
      strokeWidth,
    };
  });

  const line2AnimatedProps = useAnimatedProps(() => {
    const isEnd = line2IsEnd.value > 0.5;
    const lineHeight = isEnd ? 24 : 16;
    const strokeWidth = isEnd ? END_BAR_WIDTH : INTERVAL_BAR_WIDTH;
    return {
      x1: line2Position.value,
      x2: line2Position.value,
      y1: BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2,
      y2: BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2,
      opacity: line2Opacity.value,
      strokeWidth,
    };
  });

  const line3AnimatedProps = useAnimatedProps(() => {
    const isEnd = line3IsEnd.value > 0.5;
    const lineHeight = isEnd ? 24 : 16;
    const strokeWidth = isEnd ? END_BAR_WIDTH : INTERVAL_BAR_WIDTH;
    return {
      x1: line3Position.value,
      x2: line3Position.value,
      y1: BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2,
      y2: BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2,
      opacity: line3Opacity.value,
      strokeWidth,
    };
  });

  const line4AnimatedProps = useAnimatedProps(() => {
    const isEnd = line4IsEnd.value > 0.5;
    const lineHeight = isEnd ? 24 : 16;
    const strokeWidth = isEnd ? END_BAR_WIDTH : INTERVAL_BAR_WIDTH;
    return {
      x1: line4Position.value,
      x2: line4Position.value,
      y1: BAR_Y + BAR_HEIGHT / 2 - lineHeight / 2,
      y2: BAR_Y + BAR_HEIGHT / 2 + lineHeight / 2,
      opacity: line4Opacity.value,
      strokeWidth,
    };
  });

  // Animated props for text elements
  const minLabelAnimatedProps = useAnimatedProps(() => ({
    x: [minLabelX.value],
  }));

  const maxLabelAnimatedProps = useAnimatedProps(() => ({
    x: [maxLabelX.value],
  }));

  // Helper function to format values based on group type
  const formatValue = (value: number): string => {
    if (groupType === 'pace') {
      // TODO: Unit here will be wrong if switching to KM.
      return formatDistance(newQuantity(value, 'mi'));
    } else {
      // For distance and elevation groups, the distribution values are durations in seconds
      return formatDuration(newQuantity(Math.round(value), 's'), 1);
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

  // Animate positions when they change
  useEffect(() => {
    // Update each line's position and opacity
    for (let i = 0; i < MAX_LINES; i++) {
      if (i < positions.length) {
        linePositions[i].value = withTiming(positions[i].x, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        lineOpacities[i].value = withTiming(1, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        lineIsEnd[i].value = withTiming(i === 0 || i === positions.length - 1 ? 1 : 0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        lineOpacities[i].value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }
    }

    // Update label positions
    if (positions.length > 0) {
      minLabelX.value = withTiming(positions[0].x, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      maxLabelX.value = withTiming(positions[positions.length - 1].x, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [positions, min, max, linePositions, lineOpacities, lineIsEnd, minLabelX, maxLabelX]);

  const content = (
    <View style={styles.container}>
      <ThemedGradient style={styles.gradient} />
      <GlassView
        style={styles.glassOverlay}
        glassEffectStyle="clear"
      >
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
          <AnimatedLine
            stroke={colors.surface}
            strokeLinecap="round"
            animatedProps={line0AnimatedProps}
          />
          <AnimatedLine
            stroke={colors.surface}
            strokeLinecap="round"
            animatedProps={line1AnimatedProps}
          />
          <AnimatedLine
            stroke={colors.surface}
            strokeLinecap="round"
            animatedProps={line2AnimatedProps}
          />
          <AnimatedLine
            stroke={colors.surface}
            strokeLinecap="round"
            animatedProps={line3AnimatedProps}
          />
          <AnimatedLine
            stroke={colors.surface}
            strokeLinecap="round"
            animatedProps={line4AnimatedProps}
          />

          {/* Min/Max labels */}
          <AnimatedSvgText
            y={LABEL_Y}
            fontSize={10}
            fontWeight={'bold'}
            fill={colors.background}
            textAnchor="middle"
            animatedProps={minLabelAnimatedProps}
          >
            {formatValue(min).toUpperCase()}
          </AnimatedSvgText>

          <AnimatedSvgText
            y={LABEL_Y}
            fontSize={10}
            fontWeight={'bold'}
            fill={colors.background}
            textAnchor="middle"
            animatedProps={maxLabelAnimatedProps}
          >
            {formatValue(max).toUpperCase()}
          </AnimatedSvgText>
        </Svg>
      </GlassView>
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
    borderRadius: 8,
  },
  glassOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  labelText: {
    fontSize: 12,
    color: colors.background,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
    ...getLatoFont('bold'),
  },
});
