import { ComparisonProperty } from '@/components/SampleComparisonCard/SampleComparisonCard.types';
import { ColorProfile } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface ComparisonRowProps {
  property: ComparisonProperty;
  sample1: ExtendedWorkout;
  sample2?: ExtendedWorkout; // Now optional
  sample1Label?: string;
  sample2Label?: string;
  colorProfile?: ColorProfile;
}
