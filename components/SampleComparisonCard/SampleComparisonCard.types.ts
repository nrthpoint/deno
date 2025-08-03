import { ExtendedWorkout } from '@/types/workout';

export type ComparisonProperty = 'duration' | 'averagePace' | 'elevation' | 'distance' | 'humidity';

export interface SampleComparisonCardProps {
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  propertiesToCompare: ComparisonProperty[];
}

export interface ComparisonRowProps {
  property: ComparisonProperty;
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
}
