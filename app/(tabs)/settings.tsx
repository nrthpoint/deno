import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ActivityTypeSection } from '@/components/SettingsMenu/ActivityTypeSection';
import { AgeSection } from '@/components/SettingsMenu/AgeSection';
import { AppInfoSection } from '@/components/SettingsMenu/AppInfoSection';
import { DistanceUnitSection } from '@/components/SettingsMenu/DistanceUnitSection';
import { GenderSection } from '@/components/SettingsMenu/GenderSection';
import { colors } from '@/config/colors';
import { OrelegaOneFonts } from '@/config/fonts';
import { SCREEN_NAMES } from '@/constants/analytics';
import { usePageView } from '@/hooks/usePageView';

export default function ConfigurationScreen() {
  usePageView({ screenName: SCREEN_NAMES.SETTINGS });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <DistanceUnitSection />
        <ActivityTypeSection />
        <AgeSection />
        <GenderSection />
        <AppInfoSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.neutral,
    fontSize: 40,
    fontFamily: OrelegaOneFonts.regular,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
