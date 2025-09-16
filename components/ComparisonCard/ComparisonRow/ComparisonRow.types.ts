import { ViewStyle } from 'react-native';

import { ComparisonProperty } from '@/components/ComparisonCard/ComparisonCard.types';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface ComparisonRowProps {
  property: ComparisonProperty;
  sample1: ExtendedWorkout;
  sample2?: ExtendedWorkout;
  sample1Label?: string;
  sample2Label?: string;
  style?: ViewStyle;
}
