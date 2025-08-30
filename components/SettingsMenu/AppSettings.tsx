import React from 'react';
import { ScrollView } from 'react-native';

import AppInfo from '@/components/AppInfo/AppInfo';
import { styles } from '@/components/SettingsMenu/DeveloperSettings';

export const AppSettings: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppInfo />
    </ScrollView>
  );
};
