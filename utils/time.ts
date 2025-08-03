import { Quantity } from '@kingstinct/react-native-healthkit';

export const formatDuration = (duration: number) => {
  const totalSeconds = Math.round(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const result = [
    hours > 0 ? `${hours}hr` : null,
    minutes > 0 ? `${minutes}min` : null,
    seconds > 0 ? `${seconds}s` : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (!result) {
    return '0sec';
  }

  return result;
};

export const convertDurationToMinutes = (duration: Quantity, decimalPlaces: number = 2): number => {
  if (!duration || !duration.quantity) return 0;

  let result: number;
  switch (duration.unit) {
    case 'm':
      result = duration.quantity;
      break;
    case 's':
      result = duration.quantity / 60;
      break;
    case 'h':
      result = duration.quantity * 60;
      break;
    default:
      console.warn('Unsupported duration unit:', duration.unit);
      result = 0;
  }

  return Number(result.toFixed(decimalPlaces));
};
