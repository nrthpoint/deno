import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface DateTimeModalProps {
  visible: boolean;
  onClose: () => void;
  value: Date;
  mode: 'date' | 'time';
  onChange: (_event: any, _selectedDate?: Date) => void;
  title: string;
}

export const DateTimeModal: React.FC<DateTimeModalProps> = ({
  visible,
  onClose,
  value,
  mode,
  onChange,
  title,
}) => {
  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      onClose();
    }
    onChange(event, selectedDate);
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{title}</Text>

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={value}
                  mode={mode}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleChange}
                  style={styles.picker}
                  themeVariant="dark"
                />
              </View>

              {Platform.OS === 'ios' && (
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleDone}
                    style={styles.doneButton}
                    labelStyle={styles.buttonLabel}
                  >
                    Done
                  </Button>
                </View>
              )}
            </View>
          </TouchableOpacity>
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
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : 120,
  },
  buttonContainer: {
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
});
