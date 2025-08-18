import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { SAMPLE1_COLOR, SAMPLE2_COLOR } from '@/config/colors';

export const BarChart = ({ width1, width2 }: { width1: number; width2: number }) => (
  <View>
    <Svg width="100%" height="20">
      <Rect x={0} y={0} width={`${width1}%`} height="7" fill={SAMPLE1_COLOR} rx={3} />
      <Rect x={0} y={10} width={`${width2}%`} height="7" fill={SAMPLE2_COLOR} rx={3} />
    </Svg>
  </View>
);
