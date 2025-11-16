import { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { CardSlider } from '@/components/CardSlider/CardSlider';
import { colors } from '@/config/colors';
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS, TimeRange } from '@/config/timeRanges';

interface TimeRangeModalProps {
  visible: boolean;
  onClose: (newTimeRange: TimeRange) => void;
  initialTimeRange: TimeRange;
}

export function TimeRangeModal({ visible, onClose, initialTimeRange }: TimeRangeModalProps) {
  const [tempTimeRange, setTempTimeRange] = useState<TimeRange>(initialTimeRange);

  // Sync temp time range when modal opens
  useEffect(() => {
    if (visible) {
      setTempTimeRange(initialTimeRange);
    }
  }, [visible, initialTimeRange]);

  const handleClose = () => {
    onClose(tempTimeRange);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.timeRangeModalContent}>
              <CardSlider
                title={TIME_RANGE_LABELS[tempTimeRange]}
                value={Math.max(
                  0,
                  TIME_RANGE_OPTIONS.findIndex((option) => option.value === tempTimeRange),
                )}
                minimumValue={0}
                maximumValue={TIME_RANGE_OPTIONS.length - 1}
                step={1}
                onValueChange={(sliderValue) => {
                  const index = Math.round(sliderValue);
                  if (index >= 0 && index < TIME_RANGE_OPTIONS.length) {
                    setTempTimeRange(TIME_RANGE_OPTIONS[index].value);
                  }
                }}
                minimumLabel={TIME_RANGE_OPTIONS[0].label}
                maximumLabel={TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
                thumbColor={colors.primary}
                minimumTrackColor={colors.neutral}
                maximumTrackColor="#121212"
                formatValue={() => ''}
                style={styles.slider}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 140, // Offset from top, just below the icon
  },
  timeRangeModalContent: {
    width: '90%',
    alignSelf: 'center',
  },
  slider: {
    backgroundColor: colors.background,
    height: 120,
  },
});
