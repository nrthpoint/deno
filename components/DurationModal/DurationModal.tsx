import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { uppercase } from '@/utils/text';

interface DurationModalProps {
  visible: boolean;
  value: string;
  onClose: () => void;
  onChange: (_duration: string) => void;
}

const parseDuration = (durationString: string) => {
  const parts = durationString.split(':');

  const minutes = parts[0] ? parseInt(parts[0], 10) : 0;
  const seconds = parts[1] ? parseInt(parts[1], 10) : 0;

  return { minutes: Math.max(0, minutes), seconds: Math.max(0, Math.min(59, seconds)) };
};

export const DurationModal: React.FC<DurationModalProps> = ({
  visible,
  value,
  onClose,
  onChange,
}) => {
  const { minutes: initialMinutes, seconds: initialSeconds } = parseDuration(value);

  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds);

  const handleDone = () => {
    const formattedDuration = `${selectedMinutes.toString().padStart(2, '0')}:${selectedSeconds.toString().padStart(2, '0')}`;

    onChange(formattedDuration);
    onClose();
  };

  const handleCancel = () => {
    setSelectedMinutes(initialMinutes);
    setSelectedSeconds(initialSeconds);

    onClose();
  };

  const adjustMinutes = (increment: number) => {
    setSelectedMinutes((prev) => Math.max(0, Math.min(999, prev + increment)));
  };

  const adjustSeconds = (increment: number) => {
    setSelectedSeconds((prev) => Math.max(0, Math.min(59, prev + increment)));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <View style={styles.modalContent}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>
              {selectedMinutes.toString().padStart(2, '0')}:
              {selectedSeconds.toString().padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Minutes</Text>
              <View style={styles.valueContainer}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustMinutes(-1)}
                >
                  <Text style={styles.adjustButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.valueDisplay}>
                  <Text style={styles.valueText}>{selectedMinutes}</Text>
                </View>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustMinutes(1)}
                >
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickButtons}>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => adjustMinutes(5)}
                >
                  <Text style={styles.quickButtonText}>+5m</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => adjustMinutes(10)}
                >
                  <Text style={styles.quickButtonText}>+10m</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>Seconds</Text>
              <View style={styles.valueContainer}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustSeconds(-1)}
                >
                  <Text style={styles.adjustButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.valueDisplay}>
                  <Text style={styles.valueText}>
                    {selectedSeconds.toString().padStart(2, '0')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustSeconds(1)}
                >
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickButtons}>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => adjustSeconds(15)}
                >
                  <Text style={styles.quickButtonText}>+15s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickButton}
                  onPress={() => adjustSeconds(30)}
                >
                  <Text style={styles.quickButtonText}>+30s</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
              labelStyle={styles.cancelButtonLabel}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleDone}
              style={[styles.button, styles.doneButton]}
              labelStyle={styles.doneButtonLabel}
            >
              Done
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  pickerSection: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    ...uppercase,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  adjustButton: {
    width: 36,
    height: 36,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  valueDisplay: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 6,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  quickButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
    borderColor: colors.gray,
  },
  quickButtonText: {
    ...uppercase,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'center',
    paddingVertical: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: colors.gray,
  },
  cancelButtonLabel: {
    ...uppercase,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  doneButton: {
    backgroundColor: colors.primary,
  },
  doneButtonLabel: {
    ...uppercase,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
});
