import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Line } from 'react-native-svg';
import { getLatoFont } from '@/config/fonts';

interface VariationDataPoint {
  value: number;
  displayText: string;
}

interface VariationBarProps {
  values: number[] | VariationDataPoint[];
  color: string;
  label: string;
  unit?: string;
  width?: number;
  height?: number;
  detailTitle?: string;
  detailDescription?: string;
  additionalInfo?: { label: string; value: string }[];
  hasTooltip?: boolean;
}

export const VariationBar: React.FC<VariationBarProps> = ({
  values,
  color,
  label,
  unit = '',
  width = 200,
  height = 60,
  detailTitle,
  detailDescription,
  additionalInfo,
  hasTooltip = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (values.length === 0) return null;

  // Normalize the values to extract numeric values for calculations
  const numericValues = values.map((val) => (typeof val === 'number' ? val : val.value));

  // Check if we have objects with display text
  const hasDisplayText = values.length > 0 && typeof values[0] === 'object';

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
  const barHeight = 5;
  const margin = 20;

  // Calculate positions
  const range = max - min;
  const normalizedAvg =
    range > 0 ? ((average - min) / range) * (width - 2 * margin) : (width - 2 * margin) / 2;
  const avgPosition = margin + normalizedAvg;

  // Get display values for min, max, average
  const getDisplayValue = (value: number, fallbackUnit: string = unit) => {
    if (hasDisplayText) {
      // Find the object that matches this value, or use the closest one
      const dataPoint = (values as VariationDataPoint[]).find(
        (v) => Math.abs(v.value - value) < 0.01,
      );
      return dataPoint ? dataPoint.displayText : `${value.toFixed(1)}${fallbackUnit}`;
    }
    return `${value.toFixed(1)}${fallbackUnit}`;
  };

  const handlePress = () => {
    if (hasTooltip) {
      setModalVisible(true);
    }
  };

  const variationContent = (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { width, height }]}>
        <Svg width={width} height={height}>
          {/* Background bar */}
          <Rect
            x={margin}
            y={(height - barHeight) / 2}
            width={width - 2 * margin}
            height={barHeight}
            fill="#f0f0f0"
            rx={barHeight / 2}
          />

          {/* Range indicator */}
          <Rect
            x={margin}
            y={(height - barHeight) / 2}
            width={width - 2 * margin}
            height={barHeight}
            fill={color}
            opacity={0.3}
            rx={barHeight / 2}
          />

          {/* Average line */}
          <Line
            x1={avgPosition}
            y1={(height - barHeight) / 2 - 5}
            x2={avgPosition}
            y2={(height + barHeight) / 2 + 5}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.textContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: color }]}>{getDisplayValue(min)}</Text>
            <Text style={styles.statLabel}>Min</Text>
          </View>

          {/* <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: color }]}>{getDisplayValue(average)}</Text>
            <Text style={styles.statLabel}>Avg</Text>
          </View> */}

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: color }]}>{getDisplayValue(max)}</Text>
            <Text style={styles.statLabel}>Max</Text>
          </View>
        </View>

        <Text style={styles.labelText}>{label}</Text>
      </View>

      {hasTooltip && (
        <View style={styles.infoButton}>
          <Ionicons name="information-circle" size={16} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  return (
    <>
      {hasTooltip ? (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {variationContent}
        </TouchableOpacity>
      ) : (
        variationContent
      )}

      {hasTooltip && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={[styles.modalIcon, { backgroundColor: color }]}>
                  <Ionicons name="trending-up" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.modalTitle}>{detailTitle || label}</Text>
              </View>

              <View style={styles.modalValueContainer}>
                <Text style={[styles.modalValue, { color: color }]}>
                  {getDisplayValue(min)} - {getDisplayValue(max)}
                </Text>
                <Text style={styles.modalSubValue}>Avg: {getDisplayValue(average)}</Text>
              </View>

              {detailDescription && (
                <Text style={styles.modalDescription}>{detailDescription}</Text>
              )}

              {additionalInfo && additionalInfo.length > 0 && (
                <View style={styles.additionalInfoContainer}>
                  <Text style={styles.additionalInfoTitle}>Additional Details</Text>
                  {additionalInfo.map((info, index) => (
                    <View key={index} style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{info.label}:</Text>
                      <Text style={styles.infoValue}>{info.value}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
                buttonColor={color}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svgContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
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
    fontWeight: 'bold',
    ...getLatoFont('bold'),
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    ...getLatoFont('regular'),
  },
  labelText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    ...getLatoFont('regular'),
  },
  infoButton: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    maxWidth: 320,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    flex: 1,
    ...getLatoFont('bold'),
  },
  modalValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalValue: {
    fontSize: 24,
    textAlign: 'center',
    ...getLatoFont('bold'),
  },
  modalSubValue: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    ...getLatoFont('regular'),
  },
  modalDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    ...getLatoFont('regular'),
  },
  additionalInfoContainer: {
    marginBottom: 20,
  },
  additionalInfoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    ...getLatoFont('bold'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    ...getLatoFont('regular'),
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    ...getLatoFont('bold'),
  },
  closeButton: {
    marginTop: 8,
  },
});
