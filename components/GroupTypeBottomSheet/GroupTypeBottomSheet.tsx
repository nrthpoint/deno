import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Portal } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { GroupType } from '@/types/Groups';

interface GroupTypeOption {
  key: GroupType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

interface GroupTypeBottomSheetProps {
  selectedGroupType: GroupType;
  onSelect: (groupType: GroupType) => void;
}

export interface GroupTypeBottomSheetRef {
  open: () => void;
}

export const GroupTypeBottomSheetWithRef = React.forwardRef<
  GroupTypeBottomSheetRef,
  GroupTypeBottomSheetProps
>(function GroupTypeBottomSheetWithRef({ selectedGroupType, onSelect }, ref) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const enabledConfigs = Object.entries(GROUPING_CONFIGS).filter(([, config]) => config.enabled);

  const options: GroupTypeOption[] = enabledConfigs.map(([key, config]) => ({
    key: key as GroupType,
    label: config.label,
    icon: config.icon,
    description: config.description,
  }));

  const snapPoints = useMemo(() => {
    const headerHeight = 60;
    const itemHeight = 85; // Increased to accommodate icon and description
    const totalItems = options.length;
    const contentHeight = headerHeight + totalItems * itemHeight;

    const maxHeight = Math.min(contentHeight, 500);

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
    (groupType: GroupType) => {
      onSelect(groupType);
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
    ({ item }: { item: GroupTypeOption }) => (
      <Pressable
        key={item.key}
        style={[styles.optionItem, selectedGroupType === item.key && styles.selectedOptionItem]}
        onPress={() => handleSelectOption(item.key)}
      >
        <View style={styles.optionContent}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon}
              size={34}
              color={selectedGroupType === item.key ? colors.neutral : colors.lightGray}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.optionText,
                selectedGroupType === item.key && styles.selectedOptionText,
              ]}
            >
              {item.label}
            </Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
        </View>
        {selectedGroupType === item.key && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </Pressable>
    ),
    [selectedGroupType, handleSelectOption],
  );

  // Expose the open function for external use
  React.useImperativeHandle(
    ref,
    () => ({
      open: handleOpenPress,
    }),
    [handleOpenPress],
  );

  return (
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
            <Text style={styles.bottomSheetTitle}>Select Grouping Type</Text>
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
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.background,
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
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    marginRight: 20,
    width: 34,
  },
  textContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 6,
  },
  selectedOptionText: {
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    lineHeight: 20,
    paddingRight: 20,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.neutral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.background,
    fontSize: 12,
    fontFamily: LatoFonts.bold,
  },
});
