import { TextStyle } from 'react-native';

import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';

export const subheading: TextStyle = {
  ...getLatoFont('bold'),
  color: colors.neutral,
  fontSize: 11,
  marginTop: 15,
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
};
