import { GroupStats } from '@/components/GroupStats/GroupStats';
import {
  GroupingConfigModal,
  GroupingConfig,
} from '@/components/GroupingConfigModal/GroupingConfigModal';
import { tabColors } from '@/config/colors';
import { AllSampleTypesInApp } from '@/config/sampleIdentifiers';
import { useSettings } from '@/context/SettingsContext';
import { useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { GroupType } from '@/types/groups';
import { useHealthkitAuthorization } from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, IconButton } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

const tabOptions: GroupType[] = ['pace', 'distance', 'altitude'];

// Default configurations for each group type
const getDefaultConfig = (groupType: GroupType): GroupingConfig => {
  switch (groupType) {
    case 'distance':
      return { tolerance: 0.25, groupSize: 1.0 };
    case 'pace':
      return { tolerance: 0.5, groupSize: 1.0 };
    case 'altitude':
      return { tolerance: 50, groupSize: 100 };
    default:
      return { tolerance: 0.25, groupSize: 1.0 };
  }
};

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(AllSampleTypesInApp);

  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>({
    distance: getDefaultConfig('distance'),
    pace: getDefaultConfig('pace'),
    altitude: getDefaultConfig('altitude'),
  });

  const currentConfig = groupingConfigs[groupType];

  const { groups, meta, loading } = useGroupedActivityData({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
    tolerance: currentConfig.tolerance,
    groupSize: currentConfig.groupSize,
  });

  const [selectedOption, setSelectedOption] = useState<string>('');
  const tabOptionLabels: Record<GroupType, string> = {
    pace: 'Pace',
    distance: distanceUnit === 'km' ? 'Kilometers' : 'Miles',
    altitude: 'Altitude',
  };

  const handleConfigChange = (config: GroupingConfig) => {
    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: config,
    }));
  };

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
  const colorProfile = tabColors[groupType];

  return (
    <View style={[styles.container, { backgroundColor: colorProfile.primary }]}>
      {/* Settings Icon */}
      <View style={styles.settingsContainer}>
        <IconButton
          icon="cog"
          size={24}
          iconColor="#FFFFFF"
          onPress={() => setConfigModalVisible(true)}
        />
      </View>

      <Carousel
        loop={false}
        width={180}
        height={180}
        data={options}
        scrollAnimationDuration={300}
        onSnapToItem={(index) => setSelectedOption(options[index])}
        snapEnabled={true}
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Text style={[styles.carouselText, { color: colorProfile.primary }]}>
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
              { color: groupType === tab ? colorProfile.primary : '#FFFFFF' },
            ]}
            buttonColor={groupType === tab ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)'}
          >
            {tabOptionLabels[tab]}
          </Button>
        ))}
      </View>

      <GroupStats group={selectedGroup} meta={meta} tabColor={colorProfile} />

      {/* Configuration Modal */}
      <GroupingConfigModal
        visible={configModalVisible}
        onDismiss={() => setConfigModalVisible(false)}
        groupType={groupType}
        distanceUnit={distanceUnit}
        config={currentConfig}
        onConfigChange={handleConfigChange}
        colorProfile={colorProfile}
      />
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
  settingsContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
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
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 'bold',
  },
});
