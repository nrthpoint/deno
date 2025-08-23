import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';

import { GroupingConfigModalProps } from '@/components/GroupConfigurator/GroupingConfig.types';
import { getConfigLabels } from '@/components/GroupConfigurator/GroupingConfigModalUtils';
import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

export const GroupingConfigModal: React.FC<GroupingConfigModalProps> = ({
  visible,
  groupType,
  distanceUnit,
  config,
  tabOptions,
  tabLabels,
  onDismiss,
  onConfigChange,
  onGroupTypeChange,
}) => {
  const { colorProfile } = useTheme();
  const labels = getConfigLabels(groupType, distanceUnit);

  const handleToleranceChange = (value: number) => {
    const roundedValue = Math.round(value * 10) / 10; // Round to 1 decimal place
    onConfigChange({ ...config, tolerance: roundedValue });
  };

  const handleGroupSizeChange = (value: number) => {
    const roundedValue = Math.round(value * 5) / 5; // Round to 0.2 increments
    onConfigChange({ ...config, groupSize: roundedValue });
  };

  const handleTabPress = (tabId: string | number) => {
    onGroupTypeChange(tabId as GroupType);
  };

  // Convert tab options to TabOption format
  const tabs: TabOption[] = tabOptions.map((option) => ({
    id: option,
    label: tabLabels[option],
  }));

  // Shared slider style properties using theme colors
  const baseSliderProps = {
    style: styles.slider,
    maximumTrackTintColor: '#272727',
    thumbTintColor: colorProfile.primary,
    minimumTrackTintColor: colors.lightGray,
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ThemeProvider groupType={groupType}>
          {/* <View style={[styles.header]}>
            <Text style={styles.title}>Settings</Text>
          </View> */}

          {/* Tab Bar for Group Type Selection */}
          <View style={styles.tabBarContainer}>
            <TabBar
              tabs={tabs}
              activeTabId={groupType}
              onTabPress={handleTabPress}
              activeTabColor={colorProfile.primary}
              activeTextColor="#FFFFFF"
              inactiveTextColor={colors.lightGray}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>{labels.tolerance.label}</Text>
              <Text style={styles.sliderValue}>
                {config.tolerance.toFixed(1)} {labels.tolerance.unit}
              </Text>
              <Slider
                {...baseSliderProps}
                minimumValue={labels.tolerance.min}
                maximumValue={labels.tolerance.max}
                step={labels.tolerance.step}
                value={config.tolerance}
                onValueChange={handleToleranceChange}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>{labels.tolerance.min}</Text>
                <Text style={styles.sliderLabelText}>{labels.tolerance.max}</Text>
              </View>
            </View>

            <View style={styles.sliderSection}>
              <Text style={styles.sliderLabel}>{labels.groupSize.label}</Text>
              <Text style={styles.sliderValue}>
                {config.groupSize.toFixed(1)} {labels.groupSize.unit}
              </Text>
              <Slider
                {...baseSliderProps}
                minimumValue={labels.groupSize.min}
                maximumValue={labels.groupSize.max}
                step={labels.groupSize.step}
                value={config.groupSize}
                onValueChange={handleGroupSizeChange}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>{labels.groupSize.min}</Text>
                <Text style={styles.sliderLabelText}>{labels.groupSize.max}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.actions]}>
            <Button
              mode="contained"
              onPress={onDismiss}
              style={[styles.button]}
            >
              Apply
            </Button>
          </View>
        </ThemeProvider>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.surface,
    margin: 20,
    minHeight: 480,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 10,
  },
  tabBarContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  content: {
    padding: 24,
    paddingTop: 10,
    flex: 1,
  },
  sliderSection: {
    marginBottom: 32,
  },
  sliderLabel: {
    ...subheading,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderValue: {
    marginBottom: 16,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#888',
  },
  actions: {
    padding: 16,
  },
  button: {
    borderRadius: 8,
    backgroundColor: colors.neutral,
    color: colors.background,
  },
});
