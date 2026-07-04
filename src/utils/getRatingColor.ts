import Colors from '@/constants/colors';

export const getRatingColor = (val: number): string => {
  if (val >= 7.5) return Colors.ratingGreen;
  if (val >= 5.5) return Colors.ratingAmber;
  return Colors.ratingRed;
};

