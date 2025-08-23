import { Quantity } from '@kingstinct/react-native-healthkit';

import { ModalProps } from '@/components/Modal/Modal.types';

import { ExtendedWorkout } from './ExtendedWorkout';

type StatType =
  | 'pace'
  | 'distance'
  | 'duration'
  | 'default'
  | 'elevation'
  | 'humidity'
  | 'prediction'
  | 'training';

export interface Stat extends ModalProps {
  type: StatType;
  label: string;
  value: Quantity;
  icon: React.ReactNode;
  workout?: ExtendedWorkout;
  backgroundColor?: string;
  accentColor?: string;
}
