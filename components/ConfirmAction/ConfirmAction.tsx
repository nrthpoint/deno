import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface ConfirmActionProps {
  children: React.ReactNode;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export const ConfirmAction: React.FC<ConfirmActionProps> = ({
  children,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          console.log('Opening ConfirmAction modal for:', title);
          setIsVisible(true);
        }}
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
              >
                {cancelText}
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirm}
                style={[styles.confirmButton, destructive && styles.destructiveButton]}
                labelStyle={[styles.confirmButtonText, destructive && styles.destructiveButtonText]}
              >
                {confirmText}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.gray,
  },
  cancelButtonText: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    color: colors.background,
    fontFamily: LatoFonts.bold,
  },
  destructiveButton: {
    backgroundColor: colors.error,
  },
  destructiveButtonText: {
    color: colors.background,
    fontFamily: LatoFonts.bold,
  },
});
