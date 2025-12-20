import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { TrendCard } from '@/components/Trends/TrendCard';
import { colors } from '@/config/colors';
import { SCREEN_NAMES } from '@/constants/analytics';
import { usePageView } from '@/hooks/usePageView';

export default function TrendsScreen() {
  const router = useRouter();

  usePageView({ screenName: SCREEN_NAMES.TRENDS });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trends</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TrendCard
          title="Pace by Distance"
          description="See your average pace for different run distances."
          onPress={() => router.push('/trends/pace-by-distance')}
        />
        <TrendCard
          title="Weekly Patterns"
          description="Discover which days of the week you run your fastest, longest, and furthest runs."
          onPress={() => router.push('/trends/weekly-patterns')}
        />
      </ScrollView>
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
  container: {
    padding: 20,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
});
