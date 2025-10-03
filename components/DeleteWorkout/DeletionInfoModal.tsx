import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface DeletionInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DeletionInfoModal: React.FC<DeletionInfoModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Can&apos;t Delete Workout</Text>
          <Text style={styles.message}>
            This workout cannot be deleted because it wasn&apos;t created by this app. Apple only
            allows apps to delete workouts they created.
          </Text>
          <Text style={styles.subMessage}>
            To delete this workout, please use the Health app on your iPhone.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onClose}
              style={styles.okButton}
              labelStyle={styles.okButtonText}
            >
              Got it
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginBottom: 16,
    textAlign: 'left',
    lineHeight: 20,
  },
  subMessage: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginBottom: 12,
    textAlign: 'left',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  okButton: {
    backgroundColor: colors.primary,
    minWidth: 100,
  },
  okButtonText: {
    color: colors.background,
    fontFamily: LatoFonts.bold,
  },
});
