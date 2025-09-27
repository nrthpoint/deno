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
import { TutorialOverlay } from '@/components/Tutorial/TutorialOverlay';
import { colors, tabColors } from '@/config/colors';
import { tabLabels } from '@/config/ui';
import { GroupStatsProvider } from '@/context/GroupStatsContext';
import { useSettings } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTutorialContext } from '@/context/TutorialContext';
import { useGroupConfig } from '@/hooks/useGroupConfig';
import { useWorkoutGroups } from '@/hooks/useWorkoutGroups';
import { GroupType } from '@/types/Groups';
import { subheading } from '@/utils/text';

export default function Index() {
  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
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

  /*
   * Get the grouping configuration for the selected group type
   */
  const { enabled, tolerance, groupSize } = getConfig(groupType);

  /*
   * 3. Fetch workout groups based on the current configuration
   */
  const { groups, meta, samples, loading, authorizationStatus } = useWorkoutGroups({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
    enabled,
    tolerance,
    groupSize,
  });

  /*
   * 4. Get all options for the carousel
   */
  const options = Object.keys(groups);
  const [selectedOption, setSelectedOption] = useState<string>('');

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
          config={{ enabled, tolerance, groupSize }}
          onConfigChange={(config) => updateConfig(groupType, config)}
        />

        <GroupTypeBottomSheetWithRef
          ref={groupTypeBottomSheetRef}
          selectedGroupType={groupType}
          onSelect={setGroupingType}
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
            <TouchableOpacity
              style={styles.header}
              onPress={() => groupTypeBottomSheetRef.current?.open()}
              activeOpacity={0.7}
            >
              <Text style={styles.headerTitle}>Groups</Text>
              <Text style={styles.headerSubtitle}>{tabLabels[groupType]}</Text>
            </TouchableOpacity>

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
                onLongPress={startTutorial}
              />
            </View>

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
              tolerance={tolerance || 0}
              groupType={groupType}
              distanceUnit={distanceUnit}
              setSelectedOption={setSelectedOption}
              groups={groups}
            />

            {/* <Background /> */}
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
