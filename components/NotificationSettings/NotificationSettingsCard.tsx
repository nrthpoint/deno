/**
 * Notification Settings Component
 *
 * Allows users to configure their notification preferences for achievements
 */

import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Switch } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import {
  getNotificationSettings,
  NotificationSettings,
  sendTestNotification,
  updateNotificationSettings,
} from '@/utils/notifications';
import { subheading } from '@/utils/text';

export const NotificationSettingsCard = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    achievementsEnabled: true,
    soundEnabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await getNotificationSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await updateNotificationSettings({ [key]: value });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('Test Sent', 'A test notification has been sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Text>Loading notification settings...</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Notification Settings</Text>
        <Text style={styles.subtitle}>
          Configure when you want to receive achievement notifications
        </Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Enable Notifications</Text>
          <Text style={styles.settingDescription}>Receive notifications for new achievements</Text>
        </View>
        <Switch
          value={settings.enabled}
          onValueChange={(value) => handleSettingChange('enabled', value)}
          style={styles.switch}
        />
      </View>

      <View style={[styles.settingRow, !settings.enabled && styles.disabledRow]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, !settings.enabled && styles.disabledText]}>
            Achievement Alerts
          </Text>
          <Text style={[styles.settingDescription, !settings.enabled && styles.disabledText]}>
            Get notified when you achieve new personal bests
          </Text>
        </View>
        <Switch
          value={settings.achievementsEnabled}
          onValueChange={(value) => handleSettingChange('achievementsEnabled', value)}
          disabled={!settings.enabled}
          style={styles.switch}
        />
      </View>

      <View style={[styles.settingRow, !settings.enabled && styles.disabledRow]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, !settings.enabled && styles.disabledText]}>
            Sound Alerts
          </Text>
          <Text style={[styles.settingDescription, !settings.enabled && styles.disabledText]}>
            Play sound with achievement notifications
          </Text>
        </View>
        <Switch
          value={settings.soundEnabled}
          onValueChange={(value) => handleSettingChange('soundEnabled', value)}
          disabled={!settings.enabled}
          style={styles.switch}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={handleTestNotification}
          disabled={!settings.enabled}
          style={styles.testButton}
          labelStyle={{ color: colors.neutral }}
        >
          Send Test Notification
        </Button>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Achievement notifications will be sent when the app detects new personal bests, even
          when the app is closed. Make sure notifications are enabled in your device settings.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
  },
  header: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 24,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  disabledRow: {
    opacity: 0.5,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...subheading,
    marginTop: 0,
    color: colors.neutral,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
    color: colors.lightGray,
  },
  disabledText: {
    color: colors.lightGray,
    opacity: 0.6,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  buttonRow: {
    marginTop: 20,
    marginBottom: 16,
  },
  testButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    margin: 10,
  },
  infoBox: {
    margin: 12,
    marginTop: 0,
    backgroundColor: '#1e1a57',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: colors.lightGray,
    lineHeight: 20,
  },
});
