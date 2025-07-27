import { GroupStats } from '@/components/GroupStats';
import { AllSampleTypesInApp } from '@/config/sampleIdentifiers';
import { useSettings } from '@/context/SettingsContext';
import { GroupType, useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { useHealthkitAuthorization } from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

const tabOptions: GroupType[] = ['pace', 'distance'];
const tabColours: Record<GroupType, string> = {
  pace: '#1E5FD2',
  distance: '#FF5722',
  weather: '#4CAF50',
};

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(AllSampleTypesInApp);

  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const { groups, loading } = useGroupedActivityData({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
  });
  const [selectedOption, setSelectedOption] = useState<string>('');

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
        <Button mode="contained" onPress={requestAuthorization}>
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

  // Get the available options for the carousel
  const options = Object.keys(groups);

  // Select the currently active option
  const actualSelectedOption = selectedOption || options[0];

  // Selected group item.
  const selectedGroup = groups[actualSelectedOption];

  if (!selectedGroup) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={{ color: '#fff' }}>No data available for the selected group.</Text>
      </View>
    );
  }

  const itemSuffix = selectedGroup.suffix || '';
  const currentTabColor = tabColours[groupType];

  return (
    <View style={[styles.container, { backgroundColor: currentTabColor }]}>
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
            <Text style={[styles.carouselText, { color: currentTabColor }]}>
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
            mode="contained"
            onPress={() => setGroupingType(tab)}
            style={styles.tabButton}
            labelStyle={[
              styles.tabButtonText,
              { color: groupType === tab ? currentTabColor : '#FFFFFF' },
            ]}
            buttonColor={groupType === tab ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)'}
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
    verticalAlign: 'middle',
    lineHeight: 140,
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
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
    borderRadius: 5,
  },
  tabButtonText: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
