import { getStrings } from '@/src/i18n/strings';
import { GardenZoom } from '@/src/features/insights/gardenZoom';
import { Language } from '@/src/types/misbaha';

const ZOOM_START_TREES = 6;

export function gardenZoomCaption(zoom: GardenZoom, treeCount: number, language: Language): string {
  const t = getStrings(language).garden;

  if (treeCount === 0) {
    return t.barren;
  }

  const trees = t.treesPlanted(treeCount);

  if (zoom.t === 0) {
    if (treeCount < ZOOM_START_TREES) {
      return `${trees} · ${t.moreToRanges(ZOOM_START_TREES - treeCount)}`;
    }
    return trees;
  }

  if (zoom.fill < 0.45) {
    return `${trees} · ${t.barrenRanges}`;
  }

  const ranges = zoom.rangeLayers === 1 ? t.oneRange : t.mountainRanges(zoom.rangeLayers);
  return `${trees} · ${ranges}`;
}
