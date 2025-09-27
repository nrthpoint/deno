import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { styles } from '@/components/SettingsMenu/DeveloperSettings';
import { colors } from '@/config/colors';

export const NotificationsSettings: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.cardContent}>
          <Text
            variant="titleLarge"
            style={[styles.heading, { marginTop: 0 }]}
          >
            Toast Notifications
          </Text>
          <Text style={[styles.subheading, { color: colors.lightGray }]}>
            Achievement notifications are shown as toast messages when the app is active. No
            configuration needed - they appear automatically when you achieve new personal bests.
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};
