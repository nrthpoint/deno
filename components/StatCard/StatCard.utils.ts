import { formatPace, formatDuration } from '@/utils/time';
import { Quantity } from '@kingstinct/react-native-healthkit';

export const formatQuantityValue = (
  value: Quantity,
  type?: string,
): { displayValue: string; unit?: string } => {
  if (!value || value.quantity === undefined || value.quantity === null) {
    return { displayValue: '0', unit: value?.unit };
  }

  switch (type) {
    case 'pace':
      console.log('Formatting pace:', value);
      const paceFormatted = formatPace(value);
      const paceMatch = paceFormatted.match(/^(\d+:\d+)\s*(.*)$/);
      console.log('Formatted pace:', paceFormatted, 'Match:', paceMatch);

      if (paceMatch) {
        return { displayValue: paceMatch[1], unit: paceMatch[2] || value.unit };
      }

      return { displayValue: paceFormatted };

    case 'duration':
      return { displayValue: formatDuration(value) };

    case 'distance':
      return {
        displayValue: value.quantity.toFixed(2),
        unit: value.unit,
      };

    default:
      return {
        displayValue: value.quantity.toString(),
        unit: value.unit,
      };
  }
};
