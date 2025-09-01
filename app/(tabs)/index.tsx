import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupConfigurator';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import { ThemedGradient } from '@/components/ThemedGradient';
import { colors, tabColors } from '@/config/colors';
import { getTabOptionConfig, tabLabels } from '@/config/ui';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { useWorkoutGroups } from '@/hooks/useWorkoutGroups';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

export default function Index() {
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);

  /*
   * 1. Define state for grouping configurations
   */
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>({
    distance: {
      tolerance: getTabOptionConfig('distance').tolerance,
      groupSize: getTabOptionConfig('distance').groupSize,
    },
    pace: {
      tolerance: getTabOptionConfig('pace').tolerance,
      groupSize: getTabOptionConfig('pace').groupSize,
    },
    elevation: {
      tolerance: getTabOptionConfig('elevation').tolerance,
      groupSize: getTabOptionConfig('elevation').groupSize,
    },
    duration: {
      tolerance: getTabOptionConfig('duration').tolerance,
      groupSize: getTabOptionConfig('duration').groupSize,
    },
  });

  /*
   * 2. Destructure the grouping configuration for the selected group type
   */
  const { tolerance, groupSize } = groupingConfigs[groupType];

  /*
   * 3. Fetch workout groups based on the current configuration
   */
  const { groups, meta, loading, authorizationStatus, requestAuthorization } = useWorkoutGroups({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
    tolerance,
    groupSize,
  });

  /*
   * 4. Get all options for the carousel
   */
  const options = Object.keys(groups);
  const [selectedOption, setSelectedOption] = useState<string>('');

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
      {/* Authorization Overlay - moved outside ScrollView to cover entire viewport */}
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

      <Animated.ScrollView
        style={styles.container}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <GroupingConfigModal
          visible={configModalVisible}
          onDismiss={() => setConfigModalVisible(false)}
          groupType={groupType}
          distanceUnit={distanceUnit}
          config={{ tolerance, groupSize }}
          onConfigChange={handleConfigChange}
          onGroupTypeChange={setGroupingType}
        />

        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
          <Animated.View
            style={{
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

            {/* Settings and Add Workout Icons */}
            <View style={styles.settingsContainer}>
              <IconButton
                icon="plus"
                size={32}
                iconColor={colors.neutral}
                onPress={() => router.push('/add-workout')}
              />
              <IconButton
                icon="cog"
                size={32}
                iconColor={colors.neutral}
                onPress={() => setConfigModalVisible(true)}
              />
            </View>

            {/* add a dynamic small white icon here that is centered above the carousel and represented the activity type in a visual way */}
            <View style={styles.activityIconContainer}>
              <IconButton
                icon={getActivityIcon(activityType)}
                size={24}
                iconColor="#fff"
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
              groups={groups}
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

const getActivityIcon = (activityType: WorkoutActivityType) => {
  switch (activityType) {
    case WorkoutActivityType.running:
      return 'run';
    case WorkoutActivityType.walking:
      return 'walk';
    case WorkoutActivityType.cycling:
      return 'bike';
    default:
      return 'run';
  }
};

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  activityIconContainer: {
    position: 'absolute',
    top: 130,
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -24 }],
    zIndex: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});
