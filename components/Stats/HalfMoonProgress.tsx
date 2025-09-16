import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { ThemedGradient } from '@/components/ThemedGradient';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';
import { subheading } from '@/utils/text';

interface HalfMoonProgressProps extends ModalProps {
  label: string;
  size: number;
}

export const HalfMoonProgress = ({ label, size = 120, ...modalProps }: HalfMoonProgressProps) => {
  const { group, meta } = useGroupStats();
  const value = group.runs.length;
  const total = meta.totalRuns;
  const percentage = Math.min((value / total) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Calculate the end angle for the progress arc (0 to 180 degrees)
  const progressAngle = (percentage / 100) * 180;
  const progressAngleRad = (progressAngle * Math.PI) / 180;

  // SVG path for background half circle
  const backgroundPath = `
    M ${strokeWidth / 2} ${center}
    A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}
  `;

  // SVG path for progress arc
  // Start from the left side (180 degrees) and move clockwise
  const startX = strokeWidth / 2;
  const startY = center;
  const endX = center + radius * Math.cos(Math.PI - progressAngleRad);
  const endY = center - radius * Math.sin(Math.PI - progressAngleRad);

  // Use large arc flag when the arc is greater than 180 degrees (but since we're only doing 0-180, it's when > 90)
  const largeArcFlag = progressAngle > 90 ? 1 : 0;

  const progressPath = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
  `;

  const content = (
    <View style={styles.container}>
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
          <Path
            d={progressPath}
            stroke={'#fff'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: '#fff' }]}>{percentage.toFixed(0)}</Text>
          <Text style={styles.valueTextUnit}>{`%`}</Text>
        </View>
        <Text style={styles.labelText}>{label}</Text>
      </View>

      <ThemedGradient style={styles.gradient} />
    </View>
  );

  const modalContent = <Text style={styles.modalValue}>{percentage.toFixed(1)}%</Text>;

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
    height: 500,
    zIndex: -1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 15,
    borderRadius: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    ...getLatoFont('bold'),
  },
  valueTextUnit: {
    fontSize: 10,
    paddingLeft: 4,
    color: '#ffffff',
    ...getLatoFont('regular'),
  },
  labelText: {
    ...subheading,
    textAlign: 'center',
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
