import { useCallback, useState } from 'react';

import { getTabOptionConfig } from '@/config/ui';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

/**
 * Hook to manage grouping configurations for different group types.
 * Provides state management and update methods for tolerance and groupSize settings.
 */
export function useGroupConfig() {
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>(() => {
    const groupTypes: GroupType[] = ['distance', 'pace', 'elevation', 'duration'];

    return groupTypes.reduce(
      (acc, groupType) => {
        const config = getTabOptionConfig(groupType);
        acc[groupType] = {
          tolerance: config.tolerance,
          groupSize: config.groupSize,
        };
        return acc;
      },
      {} as Record<GroupType, GroupingConfig>,
    );
  });

  /**
   * Update configuration for a specific group type
   */
  const updateConfig = useCallback((groupType: GroupType, config: GroupingConfig) => {
    // Ensure tolerance doesn't exceed half the group size
    const maxTolerance = config.groupSize / 2;
    const validatedConfig = {
      ...config,
      tolerance: Math.min(config.tolerance, maxTolerance),
    };

    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: validatedConfig,
    }));
  }, []);

  /**
   * Get configuration for a specific group type
   */
  const getConfig = useCallback(
    (groupType: GroupType): GroupingConfig => {
      return groupingConfigs[groupType];
    },
    [groupingConfigs],
  );

  /**
   * Reset configuration for a specific group type to defaults
   */
  const resetConfig = useCallback((groupType: GroupType) => {
    const defaultConfig = getTabOptionConfig(groupType);
    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: {
        tolerance: defaultConfig.tolerance,
        groupSize: defaultConfig.groupSize,
      },
    }));
  }, []);

  /**
   * Reset all configurations to defaults
   */
  const resetAllConfigs = useCallback(() => {
    const groupTypes: GroupType[] = ['distance', 'pace', 'elevation', 'duration'];
    const resetConfigs = groupTypes.reduce(
      (acc, groupType) => {
        const config = getTabOptionConfig(groupType);
        acc[groupType] = {
          tolerance: config.tolerance,
          groupSize: config.groupSize,
        };
        return acc;
      },
      {} as Record<GroupType, GroupingConfig>,
    );

    setGroupingConfigs(resetConfigs);
  }, []);

  return {
    groupingConfigs,
    updateConfig,
    getConfig,
    resetConfig,
    resetAllConfigs,
  };
}
