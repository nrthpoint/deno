/**
 * Notification Status Component
 *
 * Shows the current status of the notification system and provides
 * helpful information to users about their notification setup.
 */

import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { getNotificationSettings } from '@/utils/notifications';
import { subheading } from '@/utils/text';

interface NotificationStatus {
  permissionGranted: boolean;
  settingsEnabled: boolean;
  achievementsEnabled: boolean;
  soundEnabled: boolean;
}

export const NotificationStatusCard = () => {
  const [status, setStatus] = useState<NotificationStatus>({
    permissionGranted: false,
    settingsEnabled: false,
    achievementsEnabled: false,
    soundEnabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      // Check system permissions
      const { status: permissionStatus } = await Notifications.getPermissionsAsync();
      const permissionGranted = permissionStatus === 'granted';

      // Check app settings
      const settings = await getNotificationSettings();

      setStatus({
        permissionGranted,
        settingsEnabled: settings.enabled,
        achievementsEnabled: settings.achievementsEnabled,
        soundEnabled: settings.soundEnabled,
      });
    } catch (error) {
      console.error('Error loading notification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? 'check-circle' : 'alert-circle';
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? colors.tertiary : '#ff6b6b';
  };

  if (loading) {
    return (
      <Card style={styles.card}>
        <Text>Loading notification status...</Text>
      </Card>
    );
  }

  const allEnabled =
    status.permissionGranted && status.settingsEnabled && status.achievementsEnabled;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Notification Status</Text>
        <IconButton
          icon={getStatusIcon(allEnabled)}
          iconColor={getStatusColor(allEnabled)}
          size={24}
          onPress={loadStatus}
        />
      </View>

      <View style={styles.statusList}>
        <View style={styles.statusItem}>
          <IconButton
            icon={getStatusIcon(status.permissionGranted)}
            iconColor={getStatusColor(status.permissionGranted)}
            size={20}
            style={styles.statusIcon}
          />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>System Permission</Text>
            <Text style={styles.statusDescription}>
              {status.permissionGranted
                ? 'Notifications are allowed by the system'
                : 'Grant permission in device settings'}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <IconButton
            icon={getStatusIcon(status.settingsEnabled)}
            iconColor={getStatusColor(status.settingsEnabled)}
            size={20}
            style={styles.statusIcon}
          />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>App Notifications</Text>
            <Text style={styles.statusDescription}>
              {status.settingsEnabled
                ? 'Notifications are enabled in app'
                : 'Enable notifications in settings below'}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <IconButton
            icon={getStatusIcon(status.achievementsEnabled)}
            iconColor={getStatusColor(status.achievementsEnabled)}
            size={20}
            style={styles.statusIcon}
          />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Achievement Alerts</Text>
            <Text style={styles.statusDescription}>
              {status.achievementsEnabled
                ? 'Achievement notifications are active'
                : 'Achievement notifications are disabled'}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <IconButton
            icon={status.soundEnabled ? 'volume-high' : 'volume-off'}
            iconColor={getStatusColor(status.soundEnabled)}
            size={20}
            style={styles.statusIcon}
          />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Sound Alerts</Text>
            <Text style={styles.statusDescription}>
              {status.soundEnabled
                ? 'Notifications will play sound'
                : 'Notifications will be silent'}
            </Text>
          </View>
        </View>
      </View>

      {allEnabled && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>
            ✅ Everything is set up! You&apos;ll receive notifications for new achievements.
          </Text>
        </View>
      )}

      {!allEnabled && (
        <View style={styles.warningMessage}>
          <Text style={styles.warningText}>
            ⚠️ Complete the setup above to receive achievement notifications when the app is closed.
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
  },
  header: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral,
  },
  statusList: {
    gap: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    margin: 0,
    marginRight: 8,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    ...subheading,
    marginTop: 0,
    color: colors.neutral,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    color: colors.lightGray,
    lineHeight: 16,
    marginTop: 4,
  },
  successMessage: {
    backgroundColor: '#1a4a3a',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.tertiary,
  },
  successText: {
    color: colors.tertiary,
    fontSize: 12,
    lineHeight: 16,
  },
  warningMessage: {
    margin: 12,
    backgroundColor: '#4a3a1a',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffaa00',
  },
  warningText: {
    color: '#ffaa00',
    fontSize: 12,
    lineHeight: 20,
  },
});
