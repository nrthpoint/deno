import React from 'react';
import { StyleSheet, View } from 'react-native';

import AppInfo from '@/components/AppInfo/AppInfo';
import { SectionHeader } from '@/components/SettingsMenu/SectionHeader';
import { colors } from '@/config/colors';

export const AppInfoSection: React.FC = () => {
  return (
    <View style={[styles.section, { borderBottomWidth: 0 }]}>
      <SectionHeader
        icon="information-circle-outline"
        title="App Info"
        subtitle="Version information and updates"
      />
      <AppInfo />
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
