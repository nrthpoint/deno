import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { TrendCard } from '@/components/Trends/TrendCard';
import { colors } from '@/config/colors';

export default function TrendsScreen() {
  const router = useRouter();
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trends</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <TrendCard
          title="Pace by Distance"
          description="See your average pace for different run distances."
          onPress={() => router.push('/pace-by-distance')}
        />
        {/* Add more TrendCard components here for other trends */}
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
