import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { CardSlider } from '@/components/CardSlider/CardSlider';
import { getActivityIcon } from '@/components/GroupCarousel/getActivityIcon';
import { GroupCarousel } from '@/components/GroupCarousel/GroupCarousel';
import { GroupingConfigModal } from '@/components/GroupConfigurator/GroupConfigurator';
import { GroupStats } from '@/components/GroupStats/GroupStats';
import {
  GroupTypeBottomSheetRef,
  GroupTypeBottomSheetWithRef,
} from '@/components/GroupTypeBottomSheet/GroupTypeBottomSheet';
import { TutorialOverlay } from '@/components/Tutorial/TutorialOverlay';
import { colors } from '@/config/colors';
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS, TimeRange } from '@/config/timeRanges';
import { GroupStatsProvider } from '@/context/GroupStatsContext';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTutorialContext } from '@/context/TutorialContext';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { useGroupConfig } from '@/hooks/useGroupConfig';
import { useWorkoutGroups } from '@/hooks/useWorkoutGroups';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

export default function Index() {
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const groupTypeBottomSheetRef = useRef<GroupTypeBottomSheetRef>(null);

  const [groupType, setGroupingType] = useState<GroupType>('distance');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [timeRangeModalVisible, setTimeRangeModalVisible] = useState(false);
  const [tempTimeRange, setTempTimeRange] = useState<TimeRange>(timeRangeInDays);

  // Load persisted group type on mount
  useEffect(() => {
    AsyncStorage.getItem('selectedGroupType').then((storedGroupType) => {
      if (storedGroupType && Object.keys(GROUPING_CONFIGS).includes(storedGroupType)) {
        setGroupingType(storedGroupType as GroupType);
      }
    });
  }, []);

  // Sync temp time range when modal opens
  useEffect(() => {
    if (timeRangeModalVisible) {
      setTempTimeRange(timeRangeInDays);
    }
  }, [timeRangeModalVisible, timeRangeInDays]);

  // Persist group type when it changes
  const handleGroupTypeChange = (newGroupType: GroupType) => {
    setGroupingType(newGroupType);
    AsyncStorage.setItem('selectedGroupType', newGroupType);
  };

  // Handle time range modal close and commit changes
  const handleTimeRangeModalClose = () => {
    setTimeRange(tempTimeRange);
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={timeRangeModalVisible}
          onRequestClose={handleTimeRangeModalClose}
        >
          <TouchableWithoutFeedback onPress={handleTimeRangeModalClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.timeRangeModalContent}>
                <CardSlider
                  title={TIME_RANGE_LABELS[tempTimeRange]}
                  value={Math.max(
                    0,
                    TIME_RANGE_OPTIONS.findIndex((option) => option.value === tempTimeRange),
                  )}
                  minimumValue={0}
                  maximumValue={TIME_RANGE_OPTIONS.length - 1}
                  step={1}
                  onValueChange={(sliderValue) => {
                    const index = Math.round(sliderValue);
                    if (index >= 0 && index < TIME_RANGE_OPTIONS.length) {
                      setTempTimeRange(TIME_RANGE_OPTIONS[index].value);
                    }
                  }}
                  minimumLabel={TIME_RANGE_OPTIONS[0].label}
                  maximumLabel={TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
                  thumbColor={colors.primary}
                  minimumTrackColor={colors.neutral}
                  maximumTrackColor="#121212"
                  formatValue={() => ''}
                  style={styles.slider}
                />

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleTimeRangeModalClose}
                >
                  <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timeRangeModalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  slider: {
    height: 120,
  },
  /*   modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  }, */
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.neutral,
    fontSize: 16,
    fontWeight: '600',
  },
});
