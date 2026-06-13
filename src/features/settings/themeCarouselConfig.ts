import { ThemeId } from '@/src/types/misbaha';

export const THEME_CAROUSEL_ORDER: ThemeId[] = ['garden', 'chromatic', 'rose', 'parchment', 'fadedGold'];

export type ThemePreviewPage = 'today' | 'tasbeeh' | 'goals' | 'visualize' | 'settings';

export const THEME_PREVIEW_PAGE: Record<ThemeId, ThemePreviewPage> = {
  garden: 'today',
  chromatic: 'tasbeeh',
  rose: 'goals',
  parchment: 'visualize',
  fadedGold: 'settings',
};

export const PREVIEW_WIDTH = 112;
export const PREVIEW_HEIGHT = 188;
export const ITEM_SLOT_WIDTH = 128;
