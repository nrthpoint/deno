import { Ionicons } from '@expo/vector-icons';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export interface ModalProps {
  modalIcon?: keyof typeof Ionicons.glyphMap;
  modalTitle?: string;
  modalDescription?: string;
  modalInfo?: { label: string; value: string }[];
  modalChildren?: React.ReactNode;
  color?: string;
  hasModal?: boolean;
  workout?: ExtendedWorkout;
}
