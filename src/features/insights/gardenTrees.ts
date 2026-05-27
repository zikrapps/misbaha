import type { GardenZoom } from '@/src/features/insights/gardenZoom';

type TreeSlot = { x: number; y: number; scale: number };

/** Intimate valley — fixed hillside slots. */
const VALLEY_TREE_SLOTS: TreeSlot[] = [
  { x: 118, y: 128, scale: 0.72 },
  { x: 152, y: 122, scale: 0.78 },
  { x: 188, y: 118, scale: 0.82 },
  { x: 224, y: 114, scale: 0.86 },
  { x: 258, y: 110, scale: 0.9 },
  { x: 292, y: 106, scale: 0.94 },
  { x: 326, y: 102, scale: 0.98 },
  { x: 136, y: 138, scale: 0.88 },
  { x: 172, y: 134, scale: 0.92 },
  { x: 208, y: 130, scale: 0.96 },
  { x: 244, y: 126, scale: 1 },
  { x: 280, y: 122, scale: 1.04 },
  { x: 314, y: 118, scale: 1.08 },
  { x: 154, y: 148, scale: 1.02 },
  { x: 190, y: 144, scale: 1.06 },
  { x: 226, y: 140, scale: 1.1 },
  { x: 262, y: 136, scale: 1.14 },
  { x: 298, y: 132, scale: 1.18 },
  { x: 332, y: 128, scale: 1.22 },
  { x: 168, y: 158, scale: 1.12 },
  { x: 204, y: 154, scale: 1.16 },
  { x: 240, y: 150, scale: 1.2 },
  { x: 276, y: 146, scale: 1.24 },
  { x: 312, y: 142, scale: 1.28 },
];

/** Spread tree slots across a zoomed-out world. */
export function generateTreeSlots(zoom: GardenZoom, needed: number): TreeSlot[] {
  if (zoom.t === 0) {
    return VALLEY_TREE_SLOTS.slice(0, Math.max(needed, VALLEY_TREE_SLOTS.length));
  }

  const count = Math.max(needed, Math.ceil(24 * (1 + zoom.t * 3)));
  const marginX = zoom.worldWidth * 0.08;
  const usableW = zoom.worldWidth - marginX * 2;
  const rows = Math.ceil(Math.sqrt(count * (zoom.worldHeight / 228)));
  const cols = Math.ceil(count / rows);
  const slots: TreeSlot[] = [];

  for (let i = 0; i < count; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = marginX + (col / Math.max(1, cols - 1)) * usableW;
    const y =
      zoom.worldHeight * (0.48 + (row / Math.max(1, rows - 1)) * 0.22) +
      ((i * 17) % 9) -
      4;
    const depthScale = 0.55 + (1 - row / Math.max(1, rows)) * 0.5;
    slots.push({
      x,
      y,
      scale: depthScale * zoom.treeScale,
    });
  }

  return slots;
}

export type GardenTree = {
  id: string;
  x: number;
  y: number;
  scale: number;
  duaId: string;
  milestone: number;
};

/**
 * One tree per 100 lifetime counts on a dua (100 → 1 tree, 200 → 2, …).
 * Trees fill hillside slots in stable dua order.
 */
export function buildGardenTrees(
  counts: Record<string, number>,
  duaIds: readonly string[],
  zoom: GardenZoom,
): GardenTree[] {
  const needed = countGardenTrees(counts);
  const slots = generateTreeSlots(zoom, needed);
  const trees: GardenTree[] = [];
  let slotIndex = 0;

  for (const duaId of duaIds) {
    const count = counts[duaId] ?? 0;
    const treeCount = Math.floor(count / 100);
    for (let milestone = 1; milestone <= treeCount; milestone += 1) {
      if (slotIndex >= slots.length) {
        return trees;
      }
      const slot = slots[slotIndex];
      trees.push({
        id: `${duaId}-${milestone}`,
        x: slot.x,
        y: slot.y,
        scale: slot.scale,
        duaId,
        milestone: milestone * 100,
      });
      slotIndex += 1;
    }
  }

  return trees;
}

export function countGardenTrees(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + Math.floor(count / 100), 0);
}
