import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SampleOption, SampleType } from './SampleComparisonCard.types';

interface SampleDropdownProps {
  options: SampleOption[];
  selectedType: SampleType;
  placeholder?: string;
  onSelect: (type: SampleType) => void;
}

export const SampleDropdown = ({
  options,
  selectedType,
  placeholder = 'Select Sample',
  onSelect,
}: SampleDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find((option) => option.type === selectedType);

  const handleSelect = (type: SampleType) => {
    onSelect(type);
    setIsVisible(false);
  };

  return (
    <>
      <Pressable style={styles.dropdownButton} onPress={() => setIsVisible(true)}>
        <Text style={styles.dropdownText}>{selectedOption?.label || placeholder}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </Pressable>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <View style={styles.dropdownContainer}>
            {options.map((option) => (
              <Pressable
                key={option.type}
                style={[styles.dropdownItem, selectedType === option.type && styles.selectedItem]}
                onPress={() => handleSelect(option.type)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedType === option.type && styles.selectedItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    width: '100%',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.neutral,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral,
    minWidth: 150,
    maxWidth: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral + '20',
  },
  selectedItem: {
    backgroundColor: colors.primary + '20',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
  selectedItemText: {
    fontFamily: LatoFonts.bold,
    color: colors.primary,
  },
});
