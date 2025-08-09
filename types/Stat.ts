import { Quantity } from '@kingstinct/react-native-healthkit';
import { ExtendedWorkout } from './ExtendedWorkout';

export interface Stat {
  type: 'pace' | 'distance' | 'duration' | 'default' | 'altitude' | 'humidity';
  label: string;
  value: Quantity;
  icon: React.ReactNode;
  workout: ExtendedWorkout;
  backgroundColor?: string;
  accentColor?: string;
  detailTitle?: string;
  detailDescription?: string;
  additionalInfo?: { label: string; value: string }[];
  hasTooltip?: boolean;
}
