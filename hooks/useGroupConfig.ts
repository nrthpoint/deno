import { useCallback, useState } from 'react';

import { getTabOptionConfig } from '@/config/ui';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

/**
 * Hook to manage grouping configurations for different group types.
 * Provides state management and update methods for tolerance and groupSize settings.
 */
export function useGroupConfig() {
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

  /**
   * Update configuration for a specific group type
   */
  const updateConfig = useCallback((groupType: GroupType, config: GroupingConfig) => {
    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: config,
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
    setGroupingConfigs({
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
  }, []);

  return {
    groupingConfigs,
    updateConfig,
    getConfig,
    resetConfig,
    resetAllConfigs,
  };
}
