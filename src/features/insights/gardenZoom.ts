/** Panorama unlocks as trees are planted (100 counts each), not raw lifetime total. */
const ZOOM_START_TREES = 6;
const ZOOM_FULL_TREES = 48;

export type GardenZoom = {
  /** 0 = intimate valley, 1 = full panorama */
  t: number;
  worldWidth: number;
  worldHeight: number;
  rangeLayers: number;
  treeScale: number;
  /** 0–1 how much the vista has filled in (trees vs empty range) */
  fill: number;
  label: string;
};

export function getGardenZoom(treeCount: number): GardenZoom {
  if (treeCount < ZOOM_START_TREES) {
    return {
      t: 0,
      worldWidth: 360,
      worldHeight: 228,
      rangeLayers: 2,
      treeScale: 1,
      fill: treeCount === 0 ? 0 : treeCount / ZOOM_START_TREES,
      label: 'valley',
    };
  }

  const t = Math.min(
    1,
    (Math.log10(treeCount) - Math.log10(ZOOM_START_TREES)) /
      (Math.log10(ZOOM_FULL_TREES) - Math.log10(ZOOM_START_TREES)),
  );

  return {
    t,
    worldWidth: Math.round(360 + t * 1_260),
    worldHeight: Math.round(228 + t * 92),
    rangeLayers: 2 + Math.round(t * 5),
    treeScale: 1 - t * 0.58,
    fill: Math.min(1, treeCount / ZOOM_FULL_TREES),
    label: t < 0.35 ? 'highlands' : t < 0.7 ? 'ranges' : 'panorama',
  };
}

