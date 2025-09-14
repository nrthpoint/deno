import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Portal } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { defaultUIConfig, tabLabels } from '@/config/ui';
import { GroupType } from '@/types/Groups';

interface GroupTypeOption {
  key: GroupType;
  label: string;
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

  // Get enabled group type options
  const enabledTabOptions = defaultUIConfig.tabOptions.filter((opt) => opt.enabled);
  const options: GroupTypeOption[] = enabledTabOptions.map((opt) => ({
    key: opt.key,
    label: tabLabels[opt.key],
  }));

  // Define snap points for the bottom sheet
  const snapPoints = useMemo(() => {
    const headerHeight = 60;
    const itemHeight = 65;
    const totalItems = options.length;
    const contentHeight = headerHeight + totalItems * itemHeight;

    const maxHeight = Math.min(contentHeight, 400);
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
        <Text
          style={[styles.optionText, selectedGroupType === item.key && styles.selectedOptionText]}
        >
          {item.label}
        </Text>
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
