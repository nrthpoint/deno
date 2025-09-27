import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Portal } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { SampleOption, SampleType } from './ComparisonCard.types';

interface SampleDropdownProps {
  options: SampleOption[];
  selectedType: SampleType;
  placeholder?: string;
  showShortLabel?: boolean;
  shortLabel?: string;
  onSelect: (type: SampleType) => void;
  style?: any;
}

export const SampleDropdown = ({
  options,
  selectedType,
  placeholder = 'Select Sample',
  onSelect,
  style,
}: SampleDropdownProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const selectedOption = options.find((option) => option.type === selectedType);

  // Define snap points for the bottom sheet
  const snapPoints = useMemo(() => {
    // Simple approach: calculate based on content
    const headerHeight = 60;
    const itemHeight = 65;
    const totalItems = options.length;
    const contentHeight = headerHeight + totalItems * itemHeight;

    // Convert to percentage, ensuring it's not too small or too large
    const maxHeight = Math.min(contentHeight, 500); // Maximum 500px

    return [maxHeight];
  }, [options.length]);

  // Handle opening the bottom sheet
  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // Handle closing the bottom sheet
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Handle option selection
  const handleSelectOption = useCallback(
    (type: SampleType) => {
      onSelect(type);
      handleClosePress();
    },
    [onSelect, handleClosePress],
  );

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const renderOptionItem = useCallback(
    ({ item }: { item: SampleOption }) => (
      <Pressable
        key={item.type}
        style={[styles.optionItem, selectedType === item.type && styles.selectedOptionItem]}
        onPress={() => handleSelectOption(item.type)}
      >
        <Text style={[styles.optionText, selectedType === item.type && styles.selectedOptionText]}>
          {item.label}
        </Text>
        {selectedType === item.type && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Pressable>
    ),
    [selectedType, handleSelectOption],
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.dropdownButton, style]}
        onPress={handleOpenPress}
      >
        <Text style={styles.dropdownText}>{selectedOption?.label || placeholder}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </Pressable>

      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.bottomSheetIndicator}
        >
          <BottomSheetView style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>{placeholder}</Text>
            </View>
            <ScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={true}
            >
              {options.map((item) => renderOptionItem({ item }))}
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  bottomSheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.gray,
    width: 40,
  },
  bottomSheetHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '40',
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'center',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray + '20',
  },
  selectedOptionItem: {
    backgroundColor: colors.neutral + '10',
  },
  optionText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontFamily: LatoFonts.bold,
  },
});
