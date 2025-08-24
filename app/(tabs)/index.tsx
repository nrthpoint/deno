import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupingConfigModal';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import { ThemedGradient } from '@/components/ThemedGradient';
import { colors, tabColors } from '@/config/colors';
import { defaultUIConfig, getTabOptionConfig } from '@/config/ui';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useGroupedActivityData } from '@/hooks/useGroupedActivityData';
import { GroupingConfig } from '@/hooks/useGroupedActivityData/interface';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

const enabledTabOptions = defaultUIConfig.tabOptions.filter((opt) => opt.enabled);
const tabOptions: GroupType[] = enabledTabOptions.map((opt) => opt.key);

export default function Index() {
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();

  const scrollY = useRef(new Animated.Value(0)).current;

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
    <ThemeProvider groupType={groupType}>
      <Animated.ScrollView
        style={[styles.container, { backgroundColor: '#000' }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        {/* Authorization Overlay */}
        <AuthorizationOverlay
          authorizationStatus={authorizationStatus}
          requestAuthorization={requestAuthorization}
        />

        {/* Loading Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator
              animating
              color="#fff"
              size="large"
            />
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

        <GroupingConfigModal
          visible={configModalVisible}
          onDismiss={() => setConfigModalVisible(false)}
          groupType={groupType}
          distanceUnit={distanceUnit}
          config={{ tolerance, groupSize }}
          onConfigChange={handleConfigChange}
          tabOptions={tabOptions}
          tabLabels={tabLabels}
          onGroupTypeChange={setGroupingType}
        />

        <View>
          <Animated.View
            style={{
              ...styles.topContainer,
              transform: [{ translateY: scrollY }],
            }}
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                // Extends the background underneath the GroupStats so it says underneath the curved corners.
                bottom: -200,
                zIndex: -1,
              }}
            >
              {/* Gradient background */}
              <View
                style={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
              >
                <ThemedGradient />
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.headerTitle}>Groups</Text>
              <Text style={styles.headerSubtitle}>{tabLabels[groupType]}</Text>
            </View>

            {/* Settings Icon */}
            <View style={styles.settingsContainer}>
              <IconButton
                icon="cog"
                size={32}
                iconColor={colors.neutral}
                onPress={() => setConfigModalVisible(true)}
              />
            </View>

            <GroupCarousel
              options={options}
              colorProfile={colorProfile}
              itemSuffix={itemSuffix}
              tolerance={tolerance}
              groupType={groupType}
              distanceUnit={distanceUnit}
              setSelectedOption={setSelectedOption}
            />
          </Animated.View>
        </View>

        {selectedGroup && (
          <GroupStats
            group={selectedGroup}
            meta={meta}
          />
        )}
      </Animated.ScrollView>
    </ThemeProvider>
  );
}

export const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: 'red',
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'OrelegaOne',
    textAlign: 'left',
  },
  headerSubtitle: {
    ...subheading,
    marginTop: 10,
    color: '#fff',
  },
  container: {
    flex: 1,
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
    top: 75,
    right: 20,
    zIndex: 10,
  },
});
