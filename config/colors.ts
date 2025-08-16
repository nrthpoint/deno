import { GroupType } from '@/types/Groups';

export const colors = {
  neutral: '#FFFFFF',
  lightGray: '#F0F0F0',
  background: '#0A0A0A',
  surfaceHighlight: '#242424ff',
  surface: '#121212',
  accent: '#1e1e1eff',
  gray: '#333333',

  // UI Component Colors
  primary: '#282E9A',
  secondary: '#151748',
};

export type ColorProfile = { primary: string; secondary: string };

export const tabColors: Record<GroupType, ColorProfile> = {
  pace: {
    primary: '#0066B4',
    secondary: '#004C86',
  },
  distance: {
    primary: '#D332CB',
    secondary: '#A0299A',
  },
  altitude: {
    primary: '#6cea12ff',
    secondary: '#15b10dff',
  },
};
