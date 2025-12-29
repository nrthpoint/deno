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
      return '#FFFFFF'; // White
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
