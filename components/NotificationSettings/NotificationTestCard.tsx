/**
 * Notification Test Helper Component
 *
 * This component provides easy access to test various notification features
 * during development and debugging.
 */

import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

import { colors } from '@/config/colors';
// import { forceBackgroundCheck, getTimeUntilNextCheck } from '@/utils/backgroundAchievements';
import { cancelAllNotifications, sendTestNotification } from '@/utils/notificationService';

export const NotificationTestCard = () => {
  const [loading, setLoading] = useState(false);

  const handleTestNotification = async () => {
    try {
      setLoading(true);
      await sendTestNotification();
      Alert.alert('Test Sent', 'A test notification has been sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const handleForceBackgroundCheck = async () => {
    try {
      setLoading(true);
      // await forceBackgroundCheck();
      Alert.alert('Background Check', 'Background achievement check would be triggered here');
    } catch (error) {
      console.error('Error forcing background check:', error);
      Alert.alert('Error', 'Failed to trigger background check');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckNextCheckTime = async () => {
    try {
      // const timeUntilNext = await getTimeUntilNextCheck();
      // const minutes = Math.floor(timeUntilNext / (1000 * 60));
      const message = 'Background check timing would be shown here';
      Alert.alert('Next Check Time', message);
    } catch (error) {
      console.error('Error checking next check time:', error);
      Alert.alert('Error', 'Failed to check next check time');
    }
  };

  const handleCancelNotifications = async () => {
    try {
      setLoading(true);
      await cancelAllNotifications();
      Alert.alert('Cancelled', 'All pending notifications have been cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('Error', 'Failed to cancel notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>🧪 Notification Testing</Text>
        <Text style={styles.subtitle}>Test notification features and background processes</Text>

        <View style={styles.buttonGrid}>
          <Button
            mode="contained"
            onPress={handleTestNotification}
            disabled={loading}
            style={styles.button}
          >
            Send Test Notification
          </Button>

          <Button
            mode="outlined"
            onPress={handleForceBackgroundCheck}
            disabled={loading}
            style={styles.button}
          >
            Force Background Check
          </Button>

          <Button
            mode="outlined"
            onPress={handleCheckNextCheckTime}
            disabled={loading}
            style={styles.button}
          >
            Check Next Check Time
          </Button>

          <Button
            mode="outlined"
            onPress={handleCancelNotifications}
            disabled={loading}
            style={[styles.button, styles.dangerButton]}
          >
            Cancel All Notifications
          </Button>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🛠️ These controls are for development and testing purposes. Use them to verify that
            notifications are working properly and to test background achievement detection.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    backgroundColor: colors.surface,
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
    marginBottom: 20,
  },
  buttonGrid: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  dangerButton: {
    borderColor: '#ff4444',
  },
  infoBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    marginTop: 16,
  },
  infoText: {
    fontSize: 12,
    color: colors.lightGray,
    lineHeight: 16,
  },
});
