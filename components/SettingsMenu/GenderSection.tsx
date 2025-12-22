import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/SettingsMenu/SectionHeader';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';

export const GenderSection: React.FC = () => {
  const posthog = usePostHog();
  const { gender, setGender } = useSettings();

  return (
    <View style={styles.section}>
      <SectionHeader
        icon="person-outline"
        title="Gender"
        subtitle="Select your gender for more accurate performance comparisons"
      />
      <TabBar
        tabs={[
          { id: 'Male', label: 'Male' },
          { id: 'Female', label: 'Female' },
          { id: 'Other', label: 'Other' },
        ]}
        activeTabId={gender || ''}
        onTabPress={(id) => {
          const newGender = id as 'Male' | 'Female' | 'Other';
          setGender(newGender);
          posthog?.capture(ANALYTICS_EVENTS.SETTING_CHANGED, {
            $screen_name: 'settings',
            setting: 'gender',
            new_value: newGender,
            previous_value: gender,
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
