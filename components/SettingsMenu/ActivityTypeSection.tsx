import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/SettingsMenu/SectionHeader';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';

export const ActivityTypeSection: React.FC = () => {
  const posthog = usePostHog();
  const { activityType, setActivityType } = useSettings();

  return (
    <View style={styles.section}>
      <SectionHeader
        icon="footsteps-outline"
        title="Activity Type"
        subtitle="Select your primary workout activity"
      />
      <TabBar
        tabs={[
          { id: String(WorkoutActivityType.running), label: 'Running' },
          { id: String(WorkoutActivityType.walking), label: 'Walking' },
        ]}
        activeTabId={String(activityType)}
        onTabPress={(value) => {
          const newActivityType = value as unknown as WorkoutActivityType;
          setActivityType(newActivityType);
          posthog?.capture(ANALYTICS_EVENTS.SETTING_CHANGED, {
            $screen_name: 'settings',
            setting: 'activity_type',
            new_value: newActivityType,
            previous_value: activityType,
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
