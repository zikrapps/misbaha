import { VisualizationMode } from '@/src/types/misbaha';

export const MODE_ICON_ASSETS: Record<VisualizationMode, { active: number; inactive: number }> = {
  garden: {
    active: require('@/assets/insights/icon-mode-garden-active.png'),
    inactive: require('@/assets/insights/icon-mode-garden-inactive.png'),
  },
  earth: {
    active: require('@/assets/insights/icon-mode-earth-active.png'),
    inactive: require('@/assets/insights/icon-mode-earth-inactive.png'),
  },
  space: {
    active: require('@/assets/insights/icon-mode-cosmos-active.png'),
    inactive: require('@/assets/insights/icon-mode-cosmos-inactive.png'),
  },
};

export const GROWTH_SPROUT_ASSET = require('@/assets/insights/growth-sprout.png');
