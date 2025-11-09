import { GlassView } from 'expo-glass-effect';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { AnimatedCounter } from '@/components/Stats/AnimatedCounter';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont, LatoFonts } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';

interface HalfMoonProgressProps extends ModalProps {
  label: string;
  size: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const HalfMoonProgress = ({ label, size = 120, ...modalProps }: HalfMoonProgressProps) => {
  const { group, meta } = useGroupStats();
  const value = group?.runs?.length ?? 0;
  const total = meta?.totalRuns ?? 0;
  const percentage = total > 0 ? Math.round(Math.min((value / total) * 100, 100)) : 0;

  const animatedPercentage = useSharedValue(0);

  useEffect(() => {
    animatedPercentage.value = withTiming(percentage, { duration: 800 });
  }, [percentage, animatedPercentage]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const startX = strokeWidth / 2;
  const startY = center;
  const rightX = center + radius;

  const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${rightX} ${startY}`;

  const animatedProps = useAnimatedProps(() => {
    const progressAngleDeg = (animatedPercentage.value / 100) * 180;
    const progressAngleRad = (progressAngleDeg * Math.PI) / 180;
    const angleRad = Math.PI - progressAngleRad;
    const endX = center + radius * Math.cos(angleRad);
    const endY = center - radius * Math.sin(angleRad);
    const largeArcFlag = progressAngleDeg >= 180 ? 1 : 0;
    const progressPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    return {
      d: progressPath,
    };
  });

  const content = (
    <View style={styles.container}>
      <ThemedGradient style={styles.gradient} />
      <GlassView
        style={styles.glassOverlay}
        glassEffectStyle="clear"
      >
        <View style={[styles.svgContainer, { width: size, height: size / 2 + strokeWidth }]}>
          <Svg
            width={size}
            height={size / 2 + strokeWidth}
          >
            {/* Background half circle */}
            <Path
              d={backgroundPath}
              stroke={colors.surface}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />

            {/* Progress arc */}
            <AnimatedPath
              animatedProps={animatedProps}
              stroke={'#fff'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.valueContainer}>
            <AnimatedCounter
              value={percentage}
              style={styles.valueText}
            />
            <Text style={styles.valueTextUnit}>{`%`}</Text>
          </View>

          <Text style={styles.labelText}>{label}</Text>
        </View>
      </GlassView>
    </View>
  );

  const modalContent = <Text style={styles.modalValue}>{percentage}%</Text>;

  return (
    <>
      <ModalProvider
        {...modalProps}
        modalChildren={modalContent}
      >
        <Card>{content}</Card>
      </ModalProvider>
    </>
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
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 8,
  },
  glassOverlay: {
    paddingVertical: 15,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  svgContainer: {
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    ...getLatoFont('bold'),
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  valueTextUnit: {
    ...getLatoFont('regular'),
    fontSize: 10,
    paddingLeft: 4,
    color: colors.background,
  },
  labelText: {
    //...subheading,
    marginTop: 10,
    color: colors.background,
    textAlign: 'center',
    fontFamily: LatoFonts.regular,
    marginBottom: 0,
  },
  modalValue: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
    ...getLatoFont('bold'),
  },
});
