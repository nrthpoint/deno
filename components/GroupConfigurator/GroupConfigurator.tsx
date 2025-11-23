import React from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Button, Switch } from 'react-native-paper';

import { CardSlider } from '@/components/CardSlider/CardSlider';
import { GroupingConfigModalProps } from '@/components/GroupConfigurator/GroupConfigurator.types';
import { getConfigLabels } from '@/components/GroupConfigurator/GroupConfigurator.utils';
import { styles as modalStyles } from '@/components/Modal/Modal';
import { colors } from '@/config/colors';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

export const GroupingConfigModal: React.FC<GroupingConfigModalProps> = ({
  visible,
  groupType,
  distanceUnit,
  config,
  onDismiss,
  onConfigChange,
}) => {
  const { colorProfile } = useTheme();

  const labels = getConfigLabels(groupType, distanceUnit, config.groupSize || 1);

  const handleEnabledChange = (enabled: boolean) => {
    onConfigChange({ ...config, enabled });
  };

  const handleToleranceChange = (value: number) => {
    if (!config.groupSize) return;

    const maxTolerance = config.groupSize / 2;
    const constrainedValue = Math.min(value, maxTolerance);

    onConfigChange({ ...config, tolerance: constrainedValue });
  };

  const handleGroupSizeChange = (value: number) => {
    if (!config.tolerance) return;

    const maxTolerance = value / 2;
    const constrainedTolerance = Math.min(config.tolerance, maxTolerance);

    onConfigChange({ ...config, groupSize: value, tolerance: constrainedTolerance });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={modalStyles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemeProvider groupType={groupType}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>Advanced Grouping</Text>
                  <Text style={styles.toggleDescription}>
                    Group workouts by {groupType} with customizable tolerance and group size
                  </Text>
                </View>
                <Switch
                  value={config.enabled}
                  onValueChange={handleEnabledChange}
                  style={styles.switch}
                />
              </View>

              {config.enabled && config.groupSize !== undefined && (
                <>
                  <CardSlider
                    style={styles.slider}
                    title="Tolerance"
                    subheading={labels.tolerance.subheading}
                    value={config.tolerance}
                    unit={labels.tolerance.unit}
                    step={labels.tolerance.step}
                    thumbColor={colorProfile.primary}
                    minimumValue={labels.tolerance.min}
                    maximumValue={labels.tolerance.max}
                    minimumLabel={labels.tolerance.min.toString()}
                    maximumLabel={labels.tolerance.max.toString()}
                    onValueChange={handleToleranceChange}
                  />

                  <CardSlider
                    style={styles.slider}
                    title="Group Size"
                    subheading={labels.groupSize.subheading}
                    value={config.groupSize}
                    unit={labels.groupSize.unit}
                    step={labels.groupSize.step}
                    thumbColor={colorProfile.primary}
                    minimumValue={labels.groupSize.min}
                    maximumValue={labels.groupSize.max}
                    minimumLabel={labels.groupSize.min.toString()}
                    maximumLabel={labels.groupSize.max.toString()}
                    onValueChange={handleGroupSizeChange}
                  />
                </>
              )}

              <Button
                mode="contained"
                onPress={onDismiss}
                style={[styles.button]}
              >
                Apply
              </Button>
            </ThemeProvider>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    minHeight: 620,
    borderRadius: 12,
    width: '90%',
    gap: 20,
    padding: 20,
    backgroundColor: colors.background,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: colors.lightGray,
    lineHeight: 16,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  slider: {
    flex: 1,
    margin: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  button: {
    borderRadius: 8,
    backgroundColor: colors.neutral,
    color: colors.background,
  },
});
