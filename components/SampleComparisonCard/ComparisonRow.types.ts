import { ColorProfile } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { ComparisonProperty } from './SampleComparisonCard.types';

export interface ComparisonRowProps {
  property: ComparisonProperty;
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  colorProfile: ColorProfile;
}
