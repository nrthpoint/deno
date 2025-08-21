import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupingConfigModal';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import { TabButtons } from '@/components/TabButtons/TabButtons';
import { tabColors } from '@/config/colors';
import { defaultUIConfig, getTabOptionConfig } from '@/config/ui';
import { useSettings } from '@/context/SettingsContext';
import { useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { GroupingConfig } from '@/hooks/useGroupedActivityData/interface';
import { GroupType } from '@/types/Groups';

const enabledTabOptions = defaultUIConfig.tabOptions.filter((opt) => opt.enabled);
const tabOptions: GroupType[] = enabledTabOptions.map((opt) => opt.key);

export default function Index() {
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();

  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>({
    distance: {
      tolerance: getTabOptionConfig('distance').tolerance,
      groupSize: getTabOptionConfig('distance').groupSize,
    },
    pace: {
      tolerance: getTabOptionConfig('pace').tolerance,
      groupSize: getTabOptionConfig('pace').groupSize,
    },
    altitude: {
      tolerance: getTabOptionConfig('altitude').tolerance,
      groupSize: getTabOptionConfig('altitude').groupSize,
    },
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
  const [selectedOption, setSelectedOption] = useState<string>('');
  const tabLabels: Record<GroupType, string> = {
    pace: getTabOptionConfig('pace').label,
    distance: getTabOptionConfig('distance').label,
    altitude: getTabOptionConfig('altitude').label,
  };

  const handleConfigChange = (config: GroupingConfig) => {
    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: config,
    }));
  };

  // Update selectedOption when options change and selectedOption is not valid
  useEffect(() => {
    if (options.length > 0 && !options.includes(selectedOption)) {
      setSelectedOption(options[0]);
    }
  }, [options, selectedOption]);

  const selectedGroup = groups[selectedOption];
  const hasNoData = !loading && !selectedGroup && authorizationStatus === 2;
  const itemSuffix = selectedGroup?.suffix || '';
  const colorProfile = tabColors[groupType];

  return (
    <View style={[styles.container, { backgroundColor: colorProfile.primary }]}>
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
        tabOptionLabels={tabLabels}
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
