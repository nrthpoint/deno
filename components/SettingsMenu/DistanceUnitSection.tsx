import { LengthUnit } from '@kingstinct/react-native-healthkit';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/SettingsMenu/SectionHeader';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';

export const DistanceUnitSection: React.FC = () => {
  const posthog = usePostHog();
  const { distanceUnit, setDistanceUnit } = useSettings();

  return (
    <View style={styles.section}>
      <SectionHeader
        icon="settings-outline"
        title="Distance Unit"
        subtitle="Choose your preferred distance measurement"
      />
      <TabBar
        tabs={DISTANCE_UNIT_OPTIONS.filter((option) => option.value !== 'm').map((option) => ({
          id: option.value,
          label: option.label,
          disabled: !option.enabled,
        }))}
        activeTabId={distanceUnit}
        onTabPress={(id) => {
          const newUnit = id as unknown as LengthUnit;
          setDistanceUnit(newUnit);
          posthog?.capture(ANALYTICS_EVENTS.DISTANCE_UNIT_CHANGED, {
            $screen_name: 'settings',
            new_unit: newUnit,
            previous_unit: distanceUnit,
          });
        }}
        activeTabColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
});
