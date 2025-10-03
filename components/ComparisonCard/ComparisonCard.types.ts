import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export type ComparisonProperty =
  | 'duration'
  | 'averagePace'
  | 'elevation'
  | 'distance'
  | 'humidity'
  | 'temperature';

export type SampleType = 'highlight' | 'worst' | 'mostRecent' | 'previousPersonalBest';

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
}
