import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';

import { ModalProps } from '@/components/Modal/Modal.types';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { useWorkout } from '@/context/WorkoutContext';
import { subheading } from '@/utils/text';

export const ModalProvider = ({
  children,
  modalTitle,
  modalDescription,
  modalInfo,
  modalChildren,
  workout,
  color,
}: { children: React.ReactNode } & ModalProps) => {
  const { setSelectedWorkout } = useWorkout();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    if (workout) {
      setSelectedWorkout(workout);
      router.push('/workout-detail');
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>

      {modalVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
          <View
            style={styles.modalOverlay}
            onTouchEnd={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{modalTitle}</Text>
              </View>

              {modalChildren}

              {modalDescription && <Text style={styles.modalDescription}>{modalDescription}</Text>}

              {modalInfo && modalInfo.length > 0 && (
                <View style={styles.additionalInfoContainer}>
                  <Text style={styles.additionalInfoTitle}>Additional Details</Text>
                  {modalInfo.map((info, index) => (
                    <View
                      key={index}
                      style={styles.infoRow}
                    >
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surfaceHighlight,
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
  modalTitle: {
    ...subheading,
    color: '#FFFFFF',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
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
    ...subheading,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    ...subheading,
    color: '#CCCCCC',
    marginTop: 0,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    ...getLatoFont('bold'),
  },
  closeButton: {
    marginTop: 8,
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#FFFFFF',
  },
});
