import { ModalProps } from '@/components/Modal/Modal.types';
import { Stat } from '@/types/Stat';

export interface StatCardProps extends ModalProps {
  stat: Stat;
  accentColor?: string;
}
