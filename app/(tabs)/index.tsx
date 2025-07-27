import { GroupStats } from '@/components/GroupStats';
import { useSettings } from '@/context/SettingsContext';
import { GroupType, useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import {
  ObjectTypeIdentifier,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
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
  const [selectedOption, setSelectedOption] = useState<string>('');
  const theme = useTheme();

  // Auto-select the first group when groups are loaded or groupType changes
  useEffect(() => {
    const firstKey = Object.keys(groups)[0];

    if (firstKey) {
      setSelectedOption(firstKey);
    }
  }, [groups, groupType]);

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

  // If no option is selected and we have groups, select the first one
  const actualSelectedOption = selectedOption || options[0];
  const selectedGroup = groups[actualSelectedOption];

  if (!selectedGroup) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={{ color: '#fff' }}>No data available for the selected group.</Text>
      </View>
    );
  }

  const itemSuffix = selectedGroup?.suffix || ' mi';

  return (
    <View style={styles.container}>
      <Carousel
        loop={false}
        width={180}
        height={200}
        data={options}
        scrollAnimationDuration={300}
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

      <GroupStats group={selectedGroup} />
    </View>
  );
}

export const styles = StyleSheet.create({
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
