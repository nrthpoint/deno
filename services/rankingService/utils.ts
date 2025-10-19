import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';

export const getLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'wr':
      return '#FF0080'; // Bright Magenta/Pink - Ultimate achievement
    case 'elite':
      return '#FF4500'; // Bright Red-Orange - Elite performance
    case 'advanced':
      return '#FFD700'; // Bright Gold - Advanced skill
    case 'intermediate':
      return '#00FF00'; // Bright Lime Green - Solid intermediate
    case 'novice':
      return '#00BFFF'; // Bright Sky Blue - Learning stage
    case 'beginner':
      return '#9966FF'; // Bright Purple - Starting point
    default:
      return '#808080'; // Gray
  }
};

export const getLevelIntensity = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'wr':
      return 0.9; // Maximum intensity for world record
    case 'elite':
      return 0.85; // Very high intensity for elite
    case 'advanced':
      return 0.8; // High intensity for advanced
    case 'intermediate':
      return 0.75; // Good intensity for intermediate
    case 'novice':
      return 0.7; // Moderate intensity for novice
    case 'beginner':
      return 0.65; // Lower intensity for beginner
    default:
      return 0.1;
  }
};

export const getRankingIcon = (level: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (level) {
    case 'WR':
      return 'crown';
    case 'Elite':
      return 'crown';
    case 'Advanced':
      return 'medal';
    case 'Intermediate':
      return 'trophy-variant';
    case 'Novice':
      return 'trophy';
    case 'Beginner':
      return 'star';
    default:
      return 'run';
  }
};
