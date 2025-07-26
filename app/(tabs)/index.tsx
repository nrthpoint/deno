import { useSettings } from '@/context/SettingsContext';
import { GroupType, useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import {
  ObjectTypeIdentifier,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ActivityIndicator, Button, Card, Text, useTheme } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

const saveableWorkoutStuff: readonly ObjectTypeIdentifier[] = [
  'HKWorkoutTypeIdentifier',
  'HKWorkoutRouteTypeIdentifier',
];

const tabOptions: GroupType[] = ['pace', 'distance'];

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(saveableWorkoutStuff);

  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const { groups, loading } = useGroupedActivityData({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
  });
  const [selectedOption, setSelectedOption] = useState<string>('1');
  const theme = useTheme();

  if (authorizationStatus !== 2) {
    return (
      <View style={styles.spinnerContainer}>
        <Button
          mode="contained"
          onPress={requestAuthorization}
          style={{ backgroundColor: theme.colors.primary }}
        >
          Request HealthKit Authorization
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator animating color="#fff" size="large" />
      </View>
    );
  }

  const options = Object.keys(groups);
  const selectedGroup = groups[selectedOption] || {};
  const highlight = selectedGroup.highlight;
  const itemSuffix = groupType === 'distance' ? 'm' : "'";

  return (
    <View style={styles.container}>
      <Carousel
        width={180} // width of each card
        height={200}
        data={options}
        scrollAnimationDuration={300}
        loop={true}
        onSnapToItem={(index) => setSelectedOption(options[index])}
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Text style={styles.carouselText}>
              {item}
              {itemSuffix}
            </Text>
          </View>
        )}
      />

      <View style={styles.tabRow}>
        {tabOptions.map((tab) => (
          <Button
            key={tab}
            mode={groupType === tab ? 'contained' : 'outlined'}
            onPress={() => setGroupingType(tab)}
            style={styles.tabButton}
          >
            {tab}
          </Button>
        ))}
      </View>

      {selectedGroup && (
        <ScrollView style={styles.statList}>
          {/* Group Stats */}
          <Text style={styles.sectionHeader}>Group Statistics</Text>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Percentage of Total Workouts</Text>
              <Text style={styles.statValue}>
                {selectedGroup.percentageOfTotalWorkouts?.toFixed(1)}%
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Text style={styles.statLabel}>Total Variation</Text>
              <Text style={styles.statValue}>
                {selectedGroup.totalVariation?.quantity?.toFixed(2)}{' '}
                {selectedGroup.totalVariation?.unit}
              </Text>
            </Card.Content>
          </Card>

          {/* Individual Highlight Run Stats */}
          {highlight && (
            <>
              <Text style={styles.sectionHeader}>Best Run</Text>
              <Card key={highlight.averagePace.quantity} style={styles.statCard}>
                <Card.Content>
                  <Text style={styles.statLabel}>Average Pace</Text>
                  <Text style={styles.statValue}>{highlight.prettyPace}</Text>
                </Card.Content>
              </Card>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  container: {
    flex: 1,
    backgroundColor: '#002B75',
    paddingTop: 60,
  },
  carousel: {
    marginTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
  },
  carouselItem: {
    width: 140,
    height: 150,
    borderWidth: 2,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeItem: {
    backgroundColor: '#fff',
  },
  carouselText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#002B75',
    fontFamily: 'OrelegaOne',
  },
  activeText: {
    color: '#1E5FD2',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  statList: {
    backgroundColor: '#0A0A0A',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  statCard: {
    backgroundColor: '#1C1C1C',
    marginVertical: 10,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 14,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'OrelegaOne',
  },
});
