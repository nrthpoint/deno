import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface CardProps {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}
