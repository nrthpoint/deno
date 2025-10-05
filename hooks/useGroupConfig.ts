import { useCallback, useState } from 'react';

import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

/**
 * Hook to manage grouping configurations for different group types.
 * Provides state management and update methods for groupSize settings.
 */
export function useGroupConfig() {
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>(() => {
    const configs: Record<GroupType, GroupingConfig> = {} as Record<GroupType, GroupingConfig>;

    for (const [key, config] of Object.entries(GROUPING_CONFIGS)) {
      configs[key as GroupType] = {
        enabled: false,
        groupSize: config.defaultGroupSize,
      };
    }

    return configs;
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
    const defaultConfig = GROUPING_CONFIGS[groupType];

    setGroupingConfigs((prev) => ({
      ...prev,
      [groupType]: {
        enabled: false,
        groupSize: defaultConfig.defaultGroupSize,
      },
    }));
  }, []);

  return {
    groupingConfigs,
    updateConfig,
    getConfig,
    resetConfig,
  };
}
