import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { Redirect } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useFeatureFlag } from 'posthog-react-native';

import { useWorkout } from '@/context/Workout';

export default function TabLayout() {
  const { workouts, authorizationStatus } = useWorkout();
  const showTrends = useFeatureFlag('trends');

  // Redirect to authorization if not authorized
  if (authorizationStatus !== AuthorizationRequestStatus.unnecessary) {
    return <Redirect href="/authorization" />;
  }

  if (workouts.samples.length === 0) {
    return <Redirect href="/no-workouts" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>
      {showTrends && (
        <NativeTabs.Trigger name="trends">
          <NativeTabs.Trigger.Label>Trends</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis' }}
          />
        </NativeTabs.Trigger>
      )}
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
