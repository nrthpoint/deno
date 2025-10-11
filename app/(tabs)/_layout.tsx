import { Redirect } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

import { useWorkout } from '@/context/Workout';

export default function TabLayout() {
  const { workouts } = useWorkout();

  if (workouts.samples.length === 0) {
    return <Redirect href="/no-workouts" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="index"
        options={{
          titlePositionAdjustment: {
            vertical: 2,
          },
        }}
      >
        <Label>Home</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="trends">
        <Label>Trends</Label>
        <Icon
          sf={{ default: 'chart.line.uptrend.xyaxis', selected: 'chart.line.uptrend.xyaxis' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
