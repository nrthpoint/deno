import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import {
  GroupingConfig,
  GroupingConfigModal,
} from '@/components/GroupingConfigModal/GroupingConfigModal';
import { TabButtons } from '@/components/TabButtons/TabButtons';
import { tabColors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';
import { useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { GroupType } from '@/types/GroupTypes';
import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text } from 'react-native-paper';

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

const AuthorizationOverlay = ({
  authorizationStatus,
  requestAuthorization,
}: {
  authorizationStatus: AuthorizationRequestStatus | null;
  requestAuthorization: () => Promise<AuthorizationRequestStatus>;
}) => {
  if (authorizationStatus === AuthorizationRequestStatus.unnecessary) {
    return null;
  }

  return (
    <View style={styles.authorizationOverlay}>
      <View style={styles.authorizationCard}>
        <Text style={styles.authorizationTitle}>Authorization Required</Text>
        <Text style={styles.authorizationText}>
          To access your workout data, please grant permission in the Health app.
        </Text>
        <Button mode="contained" onPress={requestAuthorization} style={styles.authorizationButton}>
          Grant Permission
        </Button>
      </View>
    </View>
  );
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
  authorizationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 200,
  },
  authorizationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authorizationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  authorizationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  authorizationButton: {
    paddingHorizontal: 30,
  },
  settingsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
