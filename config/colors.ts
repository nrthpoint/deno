import { GroupType } from '@/types/Groups';

export const colors = {
  neutral: '#FFFFFF',
  lightGray: '#c2c2c2ff',
  background: '#0A0A0A',
  surfaceHighlight: '#252525ff',
  surface: '#161616ff',
  accent: '#1e1e1eff',
  gray: '#333333',

  // UI Component Colors
  primary: '#282E9A',
  secondary: '#151748',
  tertiary: '#26c25dff',
  other: '#1e3c72',
};

export type ColorProfile = { primary: string; secondary: string };

export const tabColors: Record<GroupType, ColorProfile> = {
  pace: {
    primary: '#0066B4',
    secondary: '#004C86',
  },
  distance: {
    primary: '#be31b7ff',
    secondary: '#A0299A',
  },
  altitude: {
    primary: '#6cea12ff',
    secondary: '#184c16ff',
  },
};

export const SAMPLE1_COLOR = '#2196f3';
export const SAMPLE2_COLOR = '#e91e63';

export const PACING = {
  slow: '#ff1744',
  medium: '#ffeb3b',
  fast: '#00e676',
  veryFast: '#00c853',
  undefined: '#888888',
};
