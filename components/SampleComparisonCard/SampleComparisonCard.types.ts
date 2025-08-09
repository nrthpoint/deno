import { ColorProfile } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export type ComparisonProperty = 'duration' | 'averagePace' | 'elevation' | 'distance' | 'humidity';
export interface SampleComparisonCardProps {
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  propertiesToCompare: ComparisonProperty[];
  colorProfile: ColorProfile;
}
