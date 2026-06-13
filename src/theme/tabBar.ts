import { Language } from '@/src/types/misbaha';

import { spacing } from '@/src/theme/palette';

/** Matches `tabBarStyle.height` in app/(tabs)/_layout.tsx */
export const TAB_BAR_HEIGHT_EN = 76;
export const TAB_BAR_HEIGHT_UR = 88;

export function tabBarHeight(language: Language): number {
  return language === 'ur' ? TAB_BAR_HEIGHT_UR : TAB_BAR_HEIGHT_EN;
}

/** Scroll padding when the tab bar is `position: 'absolute'`. */
export function scrollPastTabBar(language: Language, safeAreaBottom = 0): number {
  return tabBarHeight(language) + safeAreaBottom + spacing.xl;
}
