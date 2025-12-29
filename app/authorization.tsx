import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { Redirect } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { useWorkout } from '@/context/Workout';
import { subheading } from '@/utils/text';

export default function AuthorizationScreen() {
  const { authorizationStatus, requestAuthorization } = useWorkout();

  if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>HealthKit Access</Text>
        <Text style={styles.description}>
          To track your running workouts and achievements, Deno needs access to your Health data.
        </Text>
        <Button
          mode="contained"
          onPress={requestAuthorization}
          style={styles.button}
          labelStyle={{
            color: '#fff',
            ...subheading,
            marginTop: 0,
            marginBottom: 0,
            paddingVertical: 10,
          }}
        >
          Grant Access
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.neutral,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: '90%',
  },
  button: {
    paddingHorizontal: 30,
    backgroundColor: colors.primary,
  },
});
