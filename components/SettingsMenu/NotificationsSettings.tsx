import React from 'react';
import { ScrollView } from 'react-native';

import { NotificationSettingsCard } from '@/components/NotificationSettings/NotificationSettingsCard';
import { NotificationStatusCard } from '@/components/NotificationSettings/NotificationStatusCard';
import { styles } from '@/components/SettingsMenu/DeveloperSettings';

export const NotificationsSettings: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NotificationStatusCard />
      <NotificationSettingsCard />
    </ScrollView>
  );
};
