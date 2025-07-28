import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { getLatoFont } from '@/config/fonts';

interface HalfMoonProgressProps {
  value: number;
  total: number;
  color: string;
  label: string;
  size?: number;
  detailTitle?: string;
  detailDescription?: string;
  additionalInfo?: { label: string; value: string }[];
  hasTooltip?: boolean;
}

export const HalfMoonProgress: React.FC<HalfMoonProgressProps> = ({
  value,
  total,
  color,
  label,
  size = 120,
  detailTitle,
  detailDescription,
  additionalInfo,
  hasTooltip = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
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
  const endX = center + radius * Math.cos(Math.PI - progressAngleRad);
  const endY = center - radius * Math.sin(Math.PI - progressAngleRad);

  const progressPath = `
    M ${strokeWidth / 2} ${center}
    A ${radius} ${radius} 0 ${progressAngle > 90 ? 1 : 0} 1 ${endX} ${endY}
  `;

  const handlePress = () => {
    if (hasTooltip) {
      setModalVisible(true);
    }
  };

  const progressContent = (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { width: size, height: size / 2 + strokeWidth }]}>
        <Svg width={size} height={size / 2 + strokeWidth}>
          {/* Background half circle */}
          <Path
            d={backgroundPath}
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <Path
            d={progressPath}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.valueText, { color: color }]}>{percentage.toFixed(0)}%</Text>
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
          {progressContent}
        </TouchableOpacity>
      ) : (
        progressContent
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
                  <Ionicons name="pie-chart" size={40} color="#FFFFFF" />
                </View>
                <Text style={styles.modalTitle}>{detailTitle || label}</Text>
              </View>

              <Text style={styles.modalValue}>{percentage.toFixed(1)}%</Text>

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
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    ...getLatoFont('bold'),
  },
  labelText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    ...getLatoFont('regular'),
  },
  infoButton: {
    position: 'absolute',
    top: -10,
    right: -3,
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
  modalValue: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
    ...getLatoFont('bold'),
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
