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

export const convertDurationToMinutes = (duration: Quantity): number => {
  if (!duration || !duration.quantity) return 0;

  switch (duration.unit) {
    case 'm':
      return duration.quantity;
    case 's':
      return duration.quantity / 60;
    case 'h':
      return duration.quantity * 60;
    default:
      console.warn('Unsupported duration unit:', duration.unit);
      return 0;
  }
};
