import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Card } from '@/components/Card/Card';
import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { subheading } from '@/utils/text';

interface HalfMoonProgressProps extends ModalProps {
  value: number;
  total: number;
  label: string;
  size: number;
}

export const HalfMoonProgress = ({
  value,
  total,
  label,
  size = 120,
  ...modalProps
}: HalfMoonProgressProps) => {
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
            stroke="#ffffff20"
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
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: colors.surfaceHighlight,
    margin: 10,
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
  infoButton: {
    position: 'absolute',
    top: -10,
    right: -3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  modalValue: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
    ...getLatoFont('bold'),
  },
});
