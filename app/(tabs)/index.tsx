import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { getActivityIcon } from '@/components/GroupCarousel/getActivityIcon';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupConfigurator';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import {
  GroupTypeBottomSheetRef,
  GroupTypeBottomSheetWithRef,
} from '@/components/GroupTypeBottomSheet/GroupTypeBottomSheet';
import { OTAUpdatePrompt } from '@/components/OTAUpdate';
import { TimeRangeModal } from '@/components/TimeRangeModal/TimeRangeModal';
import { TutorialDebugger } from '@/components/Tutorial/Debug';
import { TutorialOverlay } from '@/components/Tutorial/TutorialOverlay';
import { tutorialSteps } from '@/components/Tutorial/tutorialSteps';
import { useTutorialDebug } from '@/components/Tutorial/useTutorialDebug';
import { colors } from '@/config/colors';
import { TimeRange } from '@/config/timeRanges';
import { SCREEN_NAMES } from '@/constants/analytics';
import { GroupStatsProvider } from '@/context/GroupStatsContext';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTutorialContext } from '@/context/TutorialContext';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { useGroupConfig } from '@/hooks/useGroupConfig';
import { usePageView } from '@/hooks/usePageView';
import { useWorkoutGroups } from '@/hooks/useWorkoutGroups';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

export default function Index() {
  usePageView({ screenName: SCREEN_NAMES.HOME });

  const {
    distanceUnit,
    timeRangeInDays,
    activityType,
    advancedGroupingEnabled,
    setTimeRange,
    setAdvancedGroupingEnabled,
  } = useSettings();
  const { getConfig, updateConfig } = useGroupConfig();
  const {
    isVisible: tutorialVisible,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    skipTutorial,
    completeTutorial,
    startTutorial,
  } = useTutorialContext();

  const { isDebugEnabled } = useTutorialDebug();
  const [showDebugger, setShowDebugger] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const groupTypeBottomSheetRef = useRef<GroupTypeBottomSheetRef>(null);

  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [timeRangeModalVisible, setTimeRangeModalVisible] = useState(false);

  // Load persisted group type on mount
  useEffect(() => {
    AsyncStorage.getItem('selectedGroupType').then((storedGroupType) => {
      if (storedGroupType && Object.keys(GROUPING_CONFIGS).includes(storedGroupType)) {
        setGroupingType(storedGroupType as GroupType);
      }
    });
  }, []);

  // Persist group type when it changes
  const handleGroupTypeChange = (newGroupType: GroupType) => {
    setGroupingType(newGroupType);
    AsyncStorage.setItem('selectedGroupType', newGroupType);
  };

  // Handle time range modal close and commit changes
  const handleTimeRangeModalClose = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
    setTimeRangeModalVisible(false);
  };

  /*
   * Get the grouping configuration for the selected group type
   */
  const { enabled, groupSize } = getConfig(groupType);

  /*
   * 3. Fetch workout groups based on the current configuration
   */
  const { groups, meta, samples, loading, authorizationStatus } = useWorkoutGroups({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
    groupSize,
  });

  /*
   * 4. Get all options for the carousel
   */
  const options = Object.keys(groups);
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Load persisted selected option on mount and when groupType changes
  useEffect(() => {
    const storageKey = `selectedOption_${groupType}`;

    AsyncStorage.getItem(storageKey).then((storedOption) => {
      if (storedOption && options.includes(storedOption)) {
        setSelectedOption(storedOption);
      } else if (options.length > 0) {
        setSelectedOption(options[0]);
      }
    });
  }, [groupType, options]);

  // Persist selected option when it changes
  const handleSelectedOptionChange = (newOption: string) => {
    setSelectedOption(newOption);
    const storageKey = `selectedOption_${groupType}`;
    AsyncStorage.setItem(storageKey, newOption);
  };

  const selectedGroup = groups[selectedOption];
  const isAuthorized = authorizationStatus === 2;
  const noData = !loading && !selectedGroup && !isAuthorized;

  const Header = () => (
    <TouchableOpacity
      style={styles.header}
      onPress={() => groupTypeBottomSheetRef.current?.open()}
      activeOpacity={0.7}
    >
      <Text style={styles.headerTitle}>Groups</Text>
      <Text style={styles.headerSubtitle}>{GROUPING_CONFIGS[groupType].label}</Text>
    </TouchableOpacity>
  );

  const Settings = () => (
    <View style={styles.settingsContainer}>
      <IconButton
        icon="plus"
        size={32}
        iconColor={colors.neutral}
        onPress={() => router.push('/add-workout')}
      />
      <IconButton
        icon="clock-outline"
        size={32}
        iconColor={colors.neutral}
        onPress={() => setTimeRangeModalVisible(true)}
        onLongPress={() => setAdvancedGroupingEnabled(!advancedGroupingEnabled)}
      />
      {advancedGroupingEnabled && (
        <IconButton
          icon="cog"
          size={32}
          iconColor={colors.neutral}
          onPress={() => setConfigModalVisible(true)}
          onLongPress={startTutorial}
        />
      )}
    </View>
  );

  const ActivityIcon = () => (
    <View style={styles.activityIconContainer}>
      <IconButton
        icon={getActivityIcon(activityType)}
        size={24}
        iconColor="#fff"
      />
    </View>
  );

  return (
    <ThemeProvider groupType={groupType}>
      {/* OTA Update Prompt */}
      <OTAUpdatePrompt autoDownload={false} />
      {/* No Data Overlay */}
      {noData && (
        <View style={styles.noDataOverlay}>
          <Text style={{ color: '#fff', textAlign: 'center', paddingHorizontal: 20 }}>
            No data available for the selected group.
          </Text>
        </View>
      )}
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 0, paddingTop: 0 }}
        contentInsetAdjustmentBehavior="never"
        contentInset={{ top: -68, bottom: 0 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        {advancedGroupingEnabled && (
          <GroupingConfigModal
            visible={configModalVisible}
            onDismiss={() => setConfigModalVisible(false)}
            groupType={groupType}
            distanceUnit={distanceUnit}
            config={{ enabled, groupSize }}
            onConfigChange={(config) => updateConfig(groupType, config)}
          />
        )}

        {/* Time Range Modal */}
        <TimeRangeModal
          visible={timeRangeModalVisible}
          onClose={handleTimeRangeModalClose}
          initialTimeRange={timeRangeInDays}
        />

        <GroupTypeBottomSheetWithRef
          ref={groupTypeBottomSheetRef}
          selectedGroupType={groupType}
          onSelect={handleGroupTypeChange}
        />

        <View
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            height: 400,
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: scrollY }],
            }}
          >
            <Header />
            <Settings />
            <ActivityIcon />

            <GroupCarousel
              options={options}
              groupType={groupType}
              selectedOption={selectedOption}
              setSelectedOption={handleSelectedOptionChange}
              groups={groups}
            />
          </Animated.View>
        </View>

        {selectedGroup && (
          <GroupStatsProvider
            group={selectedGroup}
            meta={meta}
            allWorkouts={samples}
            groupType={groupType}
            timeRangeInDays={timeRangeInDays}
          >
            <GroupStats />
          </GroupStatsProvider>
        )}
      </Animated.ScrollView>
      {/* Tutorial Overlay */}
      {tutorialVisible && currentStep && (
        <TutorialOverlay
          visible={tutorialVisible}
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          onNext={nextStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}

      {__DEV__ && isDebugEnabled && !tutorialVisible && (
        <>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => setShowDebugger(!showDebugger)}
            activeOpacity={0.8}
          >
            <Text style={styles.debugButtonText}>🐛</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={startTutorial}
            activeOpacity={0.8}
          >
            <Text style={styles.debugButtonText}>▶️</Text>
          </TouchableOpacity>
        </>
      )}

      {__DEV__ && showDebugger && (
        <TutorialDebugger
          visible={showDebugger}
          initialSteps={tutorialSteps}
          currentStepIndex={0}
          onClose={() => setShowDebugger(false)}
          onStepChange={(index) => console.log('Step changed to:', index)}
        />
      )}
    </ThemeProvider>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  activityIconContainer: {
    position: 'absolute',
    top: 150,
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
    position: 'absolute',
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
  noDataOverlay: {
    position: 'absolute',
    top: 350,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 50,
  },
  settingsContainer: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  tutorialButton: {
    position: 'absolute',
    bottom: 100,
    right: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  debugButtonText: {
    fontSize: 28,
  },
});
