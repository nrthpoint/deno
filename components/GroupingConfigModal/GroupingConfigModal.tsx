import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { colors, ColorProfile } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { getConfigLabels } from './utils';
import { GroupType } from '@/types/Groups';

export interface GroupingConfig {
  tolerance: number;
  groupSize: number;
}

export interface GroupingConfigModalProps {
  visible: boolean;
  groupType: GroupType;
  distanceUnit: string;
  config: GroupingConfig;
  colorProfile: ColorProfile;
  onDismiss: () => void;
  onConfigChange: (config: GroupingConfig) => void;
}

export const GroupingConfigModal = ({
  visible,
  groupType,
  distanceUnit,
  config,
  colorProfile,
  onDismiss,
  onConfigChange,
}: GroupingConfigModalProps) => {
  const labels = getConfigLabels(groupType, distanceUnit);

  const handleToleranceChange = (value: number) => {
    const roundedValue = Math.round(value * 10) / 10; // Round to 1 decimal place
    onConfigChange({ ...config, tolerance: roundedValue });
  };

  const handleGroupSizeChange = (value: number) => {
    const roundedValue = Math.round(value * 5) / 5; // Round to 0.2 increments
    onConfigChange({ ...config, groupSize: roundedValue });
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <View style={[styles.header, { borderBottomColor: colors.gray }]}>
          <Text style={styles.title}>Grouping Settings</Text>
          <IconButton icon="close" size={24} onPress={onDismiss} iconColor={colors.neutral} />
        </View>

        <View style={styles.content}>
          <View style={styles.sliderSection}>
            <Text style={styles.sliderLabel}>
              {labels.tolerance.label}: {config.tolerance.toFixed(1)} {labels.tolerance.unit}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={labels.tolerance.min}
              maximumValue={labels.tolerance.max}
              step={labels.tolerance.step}
              value={config.tolerance}
              onValueChange={handleToleranceChange}
              minimumTrackTintColor={colorProfile.primary}
              maximumTrackTintColor="#666"
              thumbTintColor={colorProfile.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>{labels.tolerance.min}</Text>
              <Text style={styles.sliderLabelText}>{labels.tolerance.max}</Text>
            </View>
          </View>

          <View style={styles.sliderSection}>
            <Text style={styles.sliderLabel}>
              {labels.groupSize.label}: {config.groupSize.toFixed(1)} {labels.groupSize.unit}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={labels.groupSize.min}
              maximumValue={labels.groupSize.max}
              step={labels.groupSize.step}
              value={config.groupSize}
              onValueChange={handleGroupSizeChange}
              minimumTrackTintColor={colorProfile.primary}
              maximumTrackTintColor="#666"
              thumbTintColor={colorProfile.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>{labels.groupSize.min}</Text>
              <Text style={styles.sliderLabelText}>{labels.groupSize.max}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.actions,
            { borderTopColor: colors.gray, backgroundColor: colorProfile.primary },
          ]}
        >
          <Button
            mode="contained"
            onPress={onDismiss}
            style={[styles.button, { backgroundColor: colorProfile.primary }]}
          >
            Apply Settings
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 12,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingLeft: 24,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  content: {
    padding: 24,
    flex: 1,
  },
  sliderSection: {
    marginBottom: 32,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    marginBottom: 16,
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
    borderTopWidth: 1,
    borderBottomStartRadius: 12,
    borderBottomRightRadius: 12,
  },
  button: {},
});
