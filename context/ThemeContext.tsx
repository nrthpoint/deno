import React, { createContext, ReactNode, useContext } from 'react';

import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { ColorProfile } from '@/grouping-engine/types/GroupConfig';
import { GroupType } from '@/types/Groups';

interface ThemeContextType {
  groupType: GroupType;
  colorProfile: ColorProfile;
  gradientColors: [string, string];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  groupType: GroupType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, groupType }) => {
  const colorProfile = GROUPING_CONFIGS[groupType].colorProfile;
  const gradientColors: [string, string] = [colorProfile.gradientStart, colorProfile.gradientEnd];

  return (
    <ThemeContext.Provider value={{ groupType, colorProfile, gradientColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
