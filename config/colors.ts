import { GroupType } from '@/types/Groups';

export const colors = {
  neutral: '#FFFFFF',
  lightGray: '#c2c2c2ff',
  background: '#0A0A0A',
  surfaceHighlight: '#252525ff',
  surface: '#161616ff',
  surfaceLow: '#161616ff',
  accent: '#1e1e1eff',
  gray: '#333333',

  // UI Component Colors
  primary: '#282E9A',
  secondary: '#151748',
  tertiary: '#26c25dff',
  other: '#1e3c72',

  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#c2c2c2ff',
};

export type ColorProfile = {
  primary: string;
  secondary: string;
  gradientStart: string;
  gradientEnd: string;
};

export const tabColors: Record<GroupType, ColorProfile> = {
  distance: {
    primary: '#1e3c72',
    secondary: '#152a50ff',
    gradientStart: '#1e3c72',
    gradientEnd: '#2a5298',
  },
  pace: {
    primary: '#be31b7ff',
    secondary: '#A0299A',
    gradientStart: '#8e0a85',
    gradientEnd: '#be31b7ff',
  },
  elevation: {
    primary: '#6cea12ff',
    secondary: '#184c16ff',
    gradientStart: '#4ca50c',
    gradientEnd: '#6cea12ff',
  },
  duration: {
    primary: '#ff9800',
    secondary: '#e65100',
    gradientStart: '#f57c00',
    gradientEnd: '#ff9800',
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
