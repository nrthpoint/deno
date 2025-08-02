import { Quantity } from '@kingstinct/react-native-healthkit';

export interface Stat {
  type: 'pace' | 'distance' | 'duration' | 'default';
  label: string;
  value: Quantity;
  icon?: React.ReactNode;
  backgroundColor?: string;
  accentColor?: string;
  detailTitle?: string;
  detailDescription?: string;
  additionalInfo?: { label: string; value: string }[];
  hasTooltip?: boolean;
}

export interface StatCardProps {
  stat: Stat;
}
