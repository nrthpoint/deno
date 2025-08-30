import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import {
  AppSettings,
  DeveloperSettings,
  GeneralSettings,
  NotificationsSettings,
  SettingsHeader,
  SettingsMenu,
  type SettingsMenuItem,
} from '@/components/SettingsMenu';
import { colors } from '@/config/colors';

type SettingsSection = 'menu' | 'general' | 'notifications' | 'developer' | 'app';

export default function ConfigurationScreen() {
  const [currentSection, setCurrentSection] = useState<SettingsSection>('menu');

  const menuItems: SettingsMenuItem[] = [
    {
      id: 'general',
      title: 'General',
      subtitle: 'Distance units, activity type, and time range',
      icon: 'settings-outline',
      onPress: () => setCurrentSection('general'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Push notifications and achievement alerts',
      icon: 'notifications-outline',
      onPress: () => setCurrentSection('notifications'),
    },
    {
      id: 'developer',
      title: 'Developer',
      subtitle: 'Testing tools and debugging features',
      icon: 'code-slash-outline',
      onPress: () => setCurrentSection('developer'),
    },
    {
      id: 'app',
      title: 'App',
      subtitle: 'Version info and updates',
      icon: 'information-circle-outline',
      onPress: () => setCurrentSection('app'),
    },
  ];

  const getSectionTitle = (section: SettingsSection): string => {
    switch (section) {
      case 'general':
        return 'General';
      case 'notifications':
        return 'Notifications';
      case 'developer':
        return 'Developer';
      case 'app':
        return 'App';
      default:
        return 'Settings';
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'general':
        return <GeneralSettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'developer':
        return <DeveloperSettings />;
      case 'app':
        return <AppSettings />;
      default:
        return <SettingsMenu items={menuItems} />;
    }
  };

  return (
    <View style={styles.screenContainer}>
      {currentSection === 'menu' ? (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      ) : (
        <SettingsHeader
          title={getSectionTitle(currentSection)}
          onBackPress={() => setCurrentSection('menu')}
        />
      )}
      <View style={styles.content}>{renderContent()}</View>
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
    color: '#fff',
    fontSize: 40,
    fontFamily: 'OrelegaOne',
    textAlign: 'left',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
