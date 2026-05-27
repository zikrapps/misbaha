import { NightDetailPalette } from '@/src/features/duas/nightDetail';
import { ThemeColors } from '@/src/theme/palette';

export function countStateColor(
  count: number,
  target: number,
  colors: ThemeColors,
  night?: NightDetailPalette | null,
): string {
  if (night) {
    return count > 0 ? night.count : night.countBorder;
  }
  if (count <= 0) return colors.line;
  if (count < target) return colors.olive;
  return colors.oliveDeep;
}
