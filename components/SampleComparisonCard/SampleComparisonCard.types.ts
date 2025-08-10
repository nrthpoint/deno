import { ColorProfile } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export type ComparisonProperty = 'duration' | 'averagePace' | 'elevation' | 'distance' | 'humidity';

export type SampleType = 'highlight' | 'worst' | 'mostRecent';

export interface SampleOption {
  type: SampleType;
  label: string;
  workout: ExtendedWorkout;
}

export interface SampleComparisonCardProps {
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  propertiesToCompare: ComparisonProperty[];
  colorProfile: ColorProfile;
  sampleOptions?: SampleOption[];
  onSample1Change?: (sampleType: SampleType) => void;
  onSample2Change?: (sampleType: SampleType) => void;
  selectedSample1Type?: SampleType;
  selectedSample2Type?: SampleType;
}
