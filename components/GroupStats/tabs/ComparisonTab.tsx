import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ComparisonCard } from '@/components/ComparisonCard/ComparisonCard';
import { SampleOption, SampleType } from '@/components/ComparisonCard/ComparisonCard.types';
import { SampleDropdown } from '@/components/ComparisonCard/SampleDropdown';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { SplitComparison } from '@/components/SplitComparison/SplitComparison';
import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { Warning } from '@/components/Warning';
import { WeatherComparison } from '@/components/WeatherComparison/WeatherComparison';
import { colors, SAMPLE1_COLOR, SAMPLE2_COLOR } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useGroupStats } from '@/context/GroupStatsContext';
import { useSettings } from '@/context/SettingsContext';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';

type ComparisonMode = 'general' | 'splits' | 'weather';

// Tab options for the custom TabBar
const comparisonTabs: TabOption[] = [
  { id: 'general', label: 'Overall' },
  { id: 'splits', label: 'Splits' },
  { id: 'weather', label: 'Weather' },
];

export const ComparisonTab = () => {
  const posthog = usePostHog();
  const {
    group: { highlight, worst, mostRecent, type },
  } = useGroupStats();

  const { distanceUnit } = useSettings();

  const activeTabColor = GROUPING_CONFIGS[type]?.colorProfile?.gradientStart || colors.primary;

  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('general');
  const [selectedSample1Type, setSelectedSample1Type] = useState<SampleType>('highlight');
  const [selectedSample2Type, setSelectedSample2Type] = useState<SampleType>('mostRecent');
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  const mostRecentLabel = useMemo(() => {
    const today = new Date();
    const mostRecentData = mostRecent?.startDate;

    const diffTime = Math.floor(
      (today.getTime() - mostRecentData.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffTime === 0) return 'Most Recent (Today)';
    if (diffTime === 1) return 'Most Recent (Yesterday)';

    return `Most Recent (${diffTime} days ago)`;
  }, [mostRecent]);

  const sampleOptions: SampleOption[] = [
    {
      type: 'highlight',
      label: 'Best Performance',
      workout: highlight,
    },
    {
      type: 'worst',
      label: 'Worst Performance',
      workout: worst,
    },
    {
      type: 'mostRecent',
      label: mostRecentLabel,
      workout: mostRecent,
    },
  ];

  // Get the selected samples based on the current selection
  const getSelectedSample = (type: SampleType) => {
    switch (type) {
      case 'highlight':
        return highlight;
      case 'worst':
        return worst;
      case 'mostRecent':
        return mostRecent;
      default:
        return highlight;
    }
  };

  const selectedSample1 = getSelectedSample(selectedSample1Type);
  const selectedSample2 = getSelectedSample(selectedSample2Type);

  const handleMapPress = () => {
    setIsMapModalVisible(true);

    posthog?.capture(ANALYTICS_EVENTS.MAP_OPENED, {
      $screen_name: 'comparison_tab',
      context: 'comparison_tab',
      sample1_type: selectedSample1Type,
      sample2_type: selectedSample2Type,
    });
  };

  const isSameWorkout =
    selectedSample1?.uuid && selectedSample2?.uuid && selectedSample1.uuid === selectedSample2.uuid;

  const WorkoutSelectors = () => (
    <View style={styles.workoutSelectors}>
      <View style={styles.dropdownRow}>
        <View
          style={[
            styles.dropdownLabelContainer,
            {
              backgroundColor: SAMPLE1_COLOR,
            },
          ]}
        >
          <Text style={styles.dropdownLabel}>1</Text>
        </View>

        <View style={styles.dropdownContainer}>
          <SampleDropdown
            options={sampleOptions}
            selectedType={selectedSample1Type}
            onSelect={(type) => {
              setSelectedSample1Type(type);
              posthog?.capture(ANALYTICS_EVENTS.COMPARISON_SAMPLE_CHANGED, {
                $screen_name: 'comparison_tab',
                sample_number: 1,
                new_type: type,
                comparison_mode: comparisonMode,
              });
            }}
            placeholder="Select Sample 1"
            showShortLabel={true}
            shortLabel="1"
            style={styles.dropdownButtonStyle}
          />
        </View>
      </View>

      <View style={styles.dropdownRow}>
        <View style={[styles.dropdownLabelContainer, { backgroundColor: SAMPLE2_COLOR }]}>
          <Text style={styles.dropdownLabel}>2</Text>
        </View>

        <View style={styles.dropdownContainer}>
          <SampleDropdown
            options={sampleOptions}
            selectedType={selectedSample2Type}
            onSelect={(type) => {
              setSelectedSample2Type(type);
              posthog?.capture(ANALYTICS_EVENTS.COMPARISON_SAMPLE_CHANGED, {
                $screen_name: 'comparison_tab',
                sample_number: 2,
                new_type: type,
                comparison_mode: comparisonMode,
              });
            }}
            placeholder="Select Sample 2"
            showShortLabel={true}
            shortLabel="2"
            style={styles.dropdownButtonStyle}
          />
        </View>
      </View>
    </View>
  );

  const Comparison = () => {
    switch (comparisonMode) {
      case 'general':
        return (
          <ComparisonCard
            sample1={selectedSample1}
            sample2={selectedSample2}
            sample1Label="1"
            sample2Label="2"
            propertiesToCompare={[
              'distance',
              'duration',
              'averagePace',
              'elevation',
              'humidity',
              'temperature',
            ]}
          />
        );
      case 'splits':
        return (
          <View style={styles.splitContainer}>
            <SplitComparison
              sample1={selectedSample1}
              sample2={selectedSample2}
              sample1Label="1"
              sample2Label="2"
              distanceUnit={distanceUnit}
            />
          </View>
        );
      case 'weather':
        return (
          <View style={styles.splitContainer}>
            <WeatherComparison
              workout1={selectedSample1}
              workout2={selectedSample2}
              workout1Label="1"
              workout2Label="2"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <WorkoutSelectors />

        {isSameWorkout && (
          <Warning
            title="Same Workout Selected"
            iconColor={colors.background}
            style={{ marginTop: 20, marginBottom: 20 }}
            labelStyle={{ color: colors.background }}
            message="You're comparing the same workout to itself. Select different workouts to see meaningful comparisons."
          />
        )}

        {!isSameWorkout && (
          <View style={styles.mapContainer}>
            <RouteMap
              samples={[selectedSample1, selectedSample2]}
              previewMode={true}
              onPress={handleMapPress}
              maxPoints={30}
              style={{ borderRadius: 8 }}
              sampleLabels={['Run 1', 'Run 2']}
            />
          </View>
        )}

        <TabBar
          tabs={comparisonTabs}
          activeTabId={comparisonMode}
          onTabPress={(tabId) => {
            const newMode = tabId as ComparisonMode;
            setComparisonMode(newMode);
            posthog?.capture(ANALYTICS_EVENTS.COMPARISON_MODE_CHANGED, {
              $screen_name: 'comparison_tab',
              new_mode: newMode,
              sample1_type: selectedSample1Type,
              sample2_type: selectedSample2Type,
            });
          }}
          style={styles.tabBar}
          activeTabColor={activeTabColor}
        />
      </View>

      <Comparison />

      <Modal
        visible={isMapModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsMapModalVisible(false);
          posthog?.capture(ANALYTICS_EVENTS.MAP_CLOSED, {
            $screen_name: 'route_map_modal',
            context: 'comparison_tab',
          });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Route Comparison</Text>
            <TouchableOpacity
              onPress={() => {
                setIsMapModalVisible(false);
                posthog?.capture(ANALYTICS_EVENTS.MAP_CLOSED, {
                  $screen_name: 'route_map_modal',
                  context: 'comparison_tab',
                });
              }}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={28}
                color={colors.neutral}
              />
            </TouchableOpacity>
          </View>
          <RouteMap
            samples={[selectedSample1, selectedSample2]}
            previewMode={false}
            maxPoints={100}
            sampleLabels={['1', '2']}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  workoutSelectors: {
    flexDirection: 'column',
    gap: 12,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownLabelContainer: {
    backgroundColor: colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 48,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  dropdownLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownButtonStyle: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
  tabBar: {
    marginTop: 0,
    marginVertical: 10,
  },
  splitContainer: {
    flex: 1,
    marginHorizontal: -10,
  },
  mapContainer: {
    paddingVertical: 20,
    borderColor: colors.surface,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  closeButton: {
    padding: 8,
  },
});
