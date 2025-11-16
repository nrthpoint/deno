import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { AnimatedCounter } from '@/components/Stats/AnimatedCounter';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';
import { subheading } from '@/utils/text';

interface ConsistencyScoreProps extends ModalProps {
  label: string;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CIRCLE_SIZE = 42;
const strokeWidth = 5;

/**
 * Gets the background opacity based on consistency score
 * Higher consistency = more opaque background
 */
function getBackgroundOpacity(score: number): number {
  // Map 0-100 score to 0.3-0.8 opacity
  return 0.3 + (score / 100) * 0.5;
}

/**
 * Gets the gradient colors based on consistency score
 * Green hues for high consistency, yellow/orange for medium, red for low
 */
function getConsistencyColors(score: number): { start: string; end: string } {
  if (score >= 80) {
    // High consistency - green
    return { start: 'rgba(76, 175, 80, 0.8)', end: 'rgba(56, 142, 60, 0.9)' };
  } else if (score >= 60) {
    // Medium-high consistency - light green
    return { start: 'rgba(139, 195, 74, 0.8)', end: 'rgba(104, 159, 56, 0.9)' };
  } else if (score >= 40) {
    // Medium consistency - yellow/orange
    return { start: 'rgba(255, 193, 7, 0.8)', end: 'rgba(251, 140, 0, 0.9)' };
  } else if (score >= 20) {
    // Low-medium consistency - orange
    return { start: 'rgba(255, 152, 0, 0.8)', end: 'rgba(245, 124, 0, 0.9)' };
  } else {
    // Low consistency - red
    return { start: 'rgba(244, 67, 54, 0.8)', end: 'rgba(211, 47, 47, 0.9)' };
  }
}

export const ConsistencyScore = ({ label, ...modalProps }: ConsistencyScoreProps) => {
  const { group } = useGroupStats();
  const score = group?.consistencyScore ?? 0;

  const animatedPercentageRef = useRef(useSharedValue(0));
  const animatedPercentage = animatedPercentageRef.current;

  useEffect(() => {
    animatedPercentage.value = withTiming(score, { duration: 800 });
  }, [score, animatedPercentage]);

  const radius = (CIRCLE_SIZE - strokeWidth) / 2;
  const center = CIRCLE_SIZE / 2;

  // Full circle path (background)
  const backgroundPath = `
    M ${center} ${strokeWidth / 2}
    A ${radius} ${radius} 0 1 1 ${center} ${CIRCLE_SIZE - strokeWidth / 2}
    A ${radius} ${radius} 0 1 1 ${center} ${strokeWidth / 2}
  `;

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    // Cap at 99.9% to avoid completing a full circle (which would result in no visible arc)
    const cappedPercentage = Math.min(animatedPercentage.value, 99.9);
    const progressAngleDeg = (cappedPercentage / 100) * 360;
    const progressAngleRad = (progressAngleDeg * Math.PI) / 180;

    const workletRadius = (CIRCLE_SIZE - strokeWidth) / 2;
    const workletCenter = CIRCLE_SIZE / 2;

    // Start at top of circle (12 o'clock position)
    const startX = workletCenter;
    const startY = strokeWidth / 2;

    // Calculate end point based on progress
    const endX = workletCenter + workletRadius * Math.sin(progressAngleRad);
    const endY = workletCenter - workletRadius * Math.cos(progressAngleRad);

    const largeArcFlag = progressAngleDeg > 180 ? 1 : 0;
    const progressPath = `M ${startX} ${startY} A ${workletRadius} ${workletRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    return {
      d: progressPath,
    };
  });

  const consistencyColors = getConsistencyColors(score);

  const content = (
    <View style={styles.container}>
      <ThemedGradient
        style={styles.gradient}
        colors={[consistencyColors.start, consistencyColors.end]}
        opacity={getBackgroundOpacity(score)}
      />

      <View style={styles.circleRow}>
        <Svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
        >
          <Path
            d={backgroundPath}
            stroke={colors.surface}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          <AnimatedPath
            animatedProps={animatedProps}
            stroke={'#fff'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AnimatedCounter
              value={score}
              style={styles.valueText}
            />
            <Text style={{ color: colors.background, marginLeft: 3, marginBottom: -10 }}>%</Text>
          </View>

          <Text style={styles.title}>{label}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <ModalProvider {...modalProps}>{content}</ModalProvider>
    </>
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
  valueText: {
    ...getLatoFont('bold'),
    fontSize: 20,
    fontWeight: '600',
    zIndex: 1,
    color: colors.background,
    marginLeft: 15,
    marginTop: 5,
  },
  title: {
    ...subheading,
    flex: 1,
    fontSize: 10,
    marginLeft: 19,
    letterSpacing: 1,
    marginTop: 5,
    color: colors.background,
    wordWrap: 'break-word',
  },
});
