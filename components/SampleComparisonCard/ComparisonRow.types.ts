import { ColorProfile } from '@/config/colors';
import { ComparisonProperty } from './SampleComparisonCard.types';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface ComparisonRowProps {
  property: ComparisonProperty;
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  colorProfile: ColorProfile;
}
