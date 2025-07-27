import { LatoFonts } from '@/config/fonts';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  backgroundColor?: string;
  accentColor?: string;
  detailTitle?: string;
  detailDescription?: string;
  additionalInfo?: { label: string; value: string }[];
  hasTooltip?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  backgroundColor = '#2A2A2A',
  accentColor = '#1C1C1C',
  detailTitle,
  detailDescription,
  additionalInfo,
  hasTooltip = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (hasTooltip) {
      setModalVisible(true);
    }
  };

  const cardContent = (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.accentStrip, { backgroundColor: accentColor }]}>
        <View style={styles.iconContainer}>{icon}</View>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      {hasTooltip && (
        <View style={styles.infoButton}>
          <Ionicons name="information-circle" size={20} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  return (
    <>
      {hasTooltip ? (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          {cardContent}
        </TouchableOpacity>
      ) : (
        cardContent
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
                <View style={[styles.modalIcon, { backgroundColor: accentColor }]}>{icon}</View>
                <Text style={styles.modalTitle}>{detailTitle || label}</Text>
              </View>

              <Text style={styles.modalValue}>{value}</Text>

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
                buttonColor={accentColor}
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
    flexDirection: 'row',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  accentStrip: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: LatoFonts.regular,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  infoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    flex: 1,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  modalValue: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: LatoFonts.regular,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  additionalInfoContainer: {
    marginBottom: 24,
  },
  additionalInfoTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  infoLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: LatoFonts.regular,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textAlign: 'right',
  },
  closeButton: {
    marginTop: 8,
  },
});
