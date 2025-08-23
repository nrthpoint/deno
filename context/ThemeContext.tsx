import React, { createContext, useContext, ReactNode } from 'react';

import { tabColors, ColorProfile } from '@/config/colors';
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
  const colorProfile = tabColors[groupType];
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
