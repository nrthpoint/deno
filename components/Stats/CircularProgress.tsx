import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { AnimatedCounter } from '@/components/Stats/AnimatedCounter';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { createCirclePath, createProgressPath } from '@/utils/circularProgress';
import { subheading } from '@/utils/text';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CIRCLE_SIZE = 42;
const STROKE_WIDTH = 5;

export interface CircularProgressProps {
  /**
   * The progress percentage to display (0-100)
   */
  percentage: number;

  /**
   * Label text displayed below the percentage
   */
  label: string;

  /**
   * Optional gradient colors for the background
   * If not provided, uses default themed gradient
   */
  gradientColors?: { start: string; end: string };

  /**
   * Optional gradient opacity (0-1)
   * If not provided, gradient will use default opacity
   */
  gradientOpacity?: number;
}

/**
 * CircularProgress - A reusable circular progress indicator with animated percentage
 *
 * Displays a circular progress ring with:
 * - Animated percentage counter
 * - Customizable gradient background
 * - Smooth animation on value changes
 * - SVG-based circular progress path
 *
 * @example
 * ```tsx
 * <CircularProgress
 *   percentage={75}
 *   label="Progress"
 *   gradientColors={{ start: '#4CAF50', end: '#388E3C' }}
 *   gradientOpacity={0.8}
 * />
 * ```
 */
export const CircularProgress = ({
  percentage,
  label,
  gradientColors,
  gradientOpacity,
}: CircularProgressProps) => {
  const animatedPercentageRef = useRef(useSharedValue(0));
  const animatedPercentage = animatedPercentageRef.current;

  useEffect(() => {
    animatedPercentage.value = withTiming(percentage, { duration: 800 });
  }, [percentage, animatedPercentage]);

  const radius = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const center = CIRCLE_SIZE / 2;

  // Full circle path (background)
  const backgroundPath = createCirclePath(center, radius, STROKE_WIDTH);

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    return {
      d: createProgressPath(animatedPercentage.value, center, radius, STROKE_WIDTH),
    };
  });

  return (
    <View style={styles.container}>
      {gradientColors ? (
        <LinearGradient
          colors={[gradientColors.start, gradientColors.end]}
          style={[styles.gradient, gradientOpacity !== undefined && { opacity: gradientOpacity }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      ) : (
        <ThemedGradient style={styles.gradient} />
      )}

      <View style={styles.circleRow}>
        <Svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
        >
          <Path
            d={backgroundPath}
            stroke={colors.surface}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedPath
            animatedProps={animatedProps}
            stroke={'#fff'}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>

        <View>
          <View style={styles.percentageRow}>
            <AnimatedCounter
              value={percentage}
              style={styles.valueText}
            />
            <Text style={styles.percentageSymbol}>%</Text>
          </View>

          <Text style={styles.title}>{label}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    margin: 0,
    padding: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    ...getLatoFont('bold'),
    fontSize: 20,
    fontWeight: '600',
    zIndex: 1,
    color: colors.background,
    marginLeft: 15,
    marginTop: 5,
  },
  percentageSymbol: {
    color: colors.background,
    marginLeft: 3,
    marginBottom: -10,
  },
  title: {
    ...subheading,
    flex: 1,
    fontSize: 10,
    marginLeft: 16,
    letterSpacing: 1,
    marginTop: 5,
    color: colors.background,
    wordWrap: 'break-word',
  },
});
