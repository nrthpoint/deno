import { TextStyle } from 'react-native';

import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';

export const uppercase: TextStyle = {
  ...getLatoFont('bold'),
  color: colors.neutral,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  fontSize: 12,
};

export const subheading: TextStyle = {
  ...getLatoFont('bold'),
  ...uppercase,
  marginTop: 15,
  marginBottom: 8,
};
