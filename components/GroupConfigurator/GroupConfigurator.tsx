import React from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Button } from 'react-native-paper';

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

  const labels = getConfigLabels(groupType, distanceUnit);

  const handleToleranceChange = (value: number) => {
    onConfigChange({ ...config, tolerance: value });
  };

  const handleGroupSizeChange = (value: number) => {
    onConfigChange({ ...config, groupSize: value });
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
    minHeight: 480,
    borderRadius: 12,
    width: '90%',
    gap: 20,
    padding: 20,
    backgroundColor: colors.background,
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
