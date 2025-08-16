import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfig } from '@/components/GroupConfigurator/GroupingConfig.types';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupingConfigModal';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import { TabButtons } from '@/components/TabButtons/TabButtons';
import { tabColors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';
import { useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { GroupType } from '@/types/Groups';

const tabOptions: GroupType[] = ['pace', 'distance', 'altitude'];

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
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();

  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>({
    distance: getDefaultConfig('distance'),
    pace: getDefaultConfig('pace'),
    altitude: getDefaultConfig('altitude'),
  });

  const { tolerance, groupSize } = groupingConfigs[groupType];
  const { groups, meta, loading, authorizationStatus, requestAuthorization } =
    useGroupedActivityData({
      activityType,
      distanceUnit,
      timeRangeInDays,
      groupType,
      tolerance,
      groupSize,
    });

  const options = Object.keys(groups);
  const [selectedOption, setSelectedOption] = useState<string>(options[0] || '');
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

  const selectedGroup = groups[selectedOption];
  const hasNoData = !loading && !selectedGroup && authorizationStatus === 2;
  const itemSuffix = selectedGroup?.suffix || '';
  const colorProfile = tabColors[groupType];

  return (
    <View style={[styles.container, { backgroundColor: colorProfile.primary }]}>
      {/* Low-poly Background */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: -1,
        }}
        pointerEvents="none"
      >
        {/* Background Images - PNG overlays with fallback colors */}
        {groupType === 'distance' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#1e3a8a',
              opacity: 0.3,
            }}
          >
            {/* Uncomment when you add distance-background.png to assets/images/
            <Image
              source={require('@/assets/images/distance-background.png')}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
            */}
          </View>
        )}
        {groupType === 'pace' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#065f46',
              opacity: 0.3,
            }}
          >
            {/* Uncomment when you add pace-background.png to assets/images/
            <Image
              source={require('@/assets/images/pace-background.png')}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
            */}
          </View>
        )}
        {groupType === 'altitude' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#6d28d9',
              opacity: 0.3,
            }}
          >
            {/* Uncomment when you add altitude-background.png to assets/images/
            <Image
              source={require('@/assets/images/altitude-background.png')}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
            */}
          </View>
        )}
      </View>

      {/* Authorization Overlay */}
      <AuthorizationOverlay
        authorizationStatus={authorizationStatus}
        requestAuthorization={requestAuthorization}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating color="#fff" size="large" />
        </View>
      )}

      {/* No Data Overlay */}
      {hasNoData && (
        <View style={styles.noDataOverlay}>
          <Text style={{ color: '#fff', textAlign: 'center', paddingHorizontal: 20 }}>
            No data available for the selected group.
          </Text>
        </View>
      )}

      {/* Settings Icon */}
      <View style={styles.settingsContainer}>
        <IconButton
          icon="cog"
          size={24}
          iconColor="#FFFFFF"
          onPress={() => setConfigModalVisible(true)}
        />
      </View>

      <GroupingConfigModal
        visible={configModalVisible}
        onDismiss={() => setConfigModalVisible(false)}
        groupType={groupType}
        distanceUnit={distanceUnit}
        config={{ tolerance, groupSize }}
        onConfigChange={handleConfigChange}
        colorProfile={colorProfile}
      />

      <GroupCarousel
        options={options}
        colorProfile={colorProfile}
        itemSuffix={itemSuffix}
        tolerance={tolerance}
        groupType={groupType}
        distanceUnit={distanceUnit}
        setSelectedOption={setSelectedOption}
      />

      <TabButtons
        tabOptions={tabOptions}
        groupType={groupType}
        colorProfile={colorProfile}
        tabOptionLabels={tabOptionLabels}
        setGroupingType={setGroupingType}
      />

      {selectedGroup && <GroupStats group={selectedGroup} meta={meta} tabColor={colorProfile} />}
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 100,
  },
  noDataOverlay: {
    position: 'absolute',
    top: 350, // Position below carousel area
    left: 0,
    right: 0,
    bottom: 0, // Above tab buttons
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 50, // Lower than loading overlay
  },
  settingsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
