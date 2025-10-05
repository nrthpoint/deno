import { useCallback, useState } from 'react';

import { getTabOptionConfig, UIConfig } from '@/config/ui';
import { GroupingConfig } from '@/grouping-engine/types/Grouping';
import { GroupType } from '@/types/Groups';

/**
 * Hook to manage grouping configurations for different group types.
 * Provides state management and update methods for tolerance and groupSize settings.
 */
export function useGroupConfig() {
  const [groupingConfigs, setGroupingConfigs] = useState<Record<GroupType, GroupingConfig>>(() => {
    const configs: Record<GroupType, GroupingConfig> = {} as Record<GroupType, GroupingConfig>;

    for (const option of Object.values(UIConfig.tabOptions)) {
      configs[option.key] = {
        ...option,
        enabled: false,
      };
    }

    return configs;
  });

  /**
   * Update configuration for a specific group type
   */
  const updateConfig = useCallback((groupType: GroupType, config: GroupingConfig) => {
    let validatedConfig = { ...config };

    // Only validate tolerance/groupSize if grouping is enabled
    if (config.enabled && config.tolerance !== undefined && config.groupSize !== undefined) {
      const maxTolerance = config.groupSize / 2;

      validatedConfig = {
        ...validatedConfig,
        tolerance: Math.min(config.tolerance, maxTolerance),
      };
    }

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
        enabled: false,
        tolerance: defaultConfig.tolerance,
        groupSize: defaultConfig.groupSize,
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
