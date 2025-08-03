import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { GroupType } from '@/hooks/useGroupedActivityData';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export interface GroupingConfig {
  tolerance: number;
  groupSize: number;
}

export interface GroupingConfigModalProps {
  visible: boolean;
  onDismiss: () => void;
  groupType: GroupType;
  distanceUnit: string;
  config: GroupingConfig;
  onConfigChange: (config: GroupingConfig) => void;
}

const getConfigLabels = (groupType: GroupType, distanceUnit: string) => {
  switch (groupType) {
    case 'distance':
      return {
        tolerance: {
          label: 'Distance Tolerance',
          unit: distanceUnit,
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Distance Grouping',
          unit: distanceUnit,
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
    case 'pace':
      return {
        tolerance: {
          label: 'Pace Tolerance',
          unit: 'min',
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Pace Grouping',
          unit: 'min',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
    default:
      return {
        tolerance: {
          label: 'Tolerance',
          unit: '',
          min: 0.1,
          max: 1.0,
          step: 0.1,
        },
        groupSize: {
          label: 'Group Size',
          unit: '',
          min: 0.2,
          max: 2.0,
          step: 0.2,
        },
      };
  }
};

export const GroupingConfigModal: React.FC<GroupingConfigModalProps> = ({
  visible,
  onDismiss,
  groupType,
  distanceUnit,
  config,
  onConfigChange,
}) => {
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
        <View style={styles.header}>
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
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#666"
              thumbTintColor="#4CAF50"
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
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#666"
              thumbTintColor="#4CAF50"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>{labels.groupSize.min}</Text>
              <Text style={styles.sliderLabelText}>{labels.groupSize.max}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button mode="contained" onPress={onDismiss} style={styles.button}>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
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
    fontWeight: '600',
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
    borderTopColor: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
  },
});
