import { buildGardenTrees, countGardenTrees } from '@/src/features/insights/gardenTrees';
import { getGardenZoom } from '@/src/features/insights/gardenZoom';

describe('gardenTrees', () => {
  const valleyZoom = getGardenZoom(500);

  it('plants no trees below 100 counts', () => {
    expect(buildGardenTrees({ a: 0, b: 99 }, ['a', 'b'], valleyZoom)).toHaveLength(0);
    expect(countGardenTrees({ a: 50, b: 99 })).toBe(0);
  });

  it('plants one tree per 100 counts on a dua', () => {
    const trees = buildGardenTrees({ a: 100, b: 250 }, ['a', 'b'], valleyZoom);
    expect(trees).toHaveLength(3);
    expect(trees[0]).toMatchObject({ duaId: 'a', milestone: 100 });
    expect(trees[1]).toMatchObject({ duaId: 'b', milestone: 100 });
    expect(trees[2]).toMatchObject({ duaId: 'b', milestone: 200 });
    expect(countGardenTrees({ a: 100, b: 250 })).toBe(3);
  });

  it('generates panorama slots when zoomed out', () => {
    const zoom = getGardenZoom(24);
    const trees = buildGardenTrees({ a: 5000 }, ['a'], zoom);
    expect(trees.length).toBeGreaterThan(10);
    expect(trees[0].x).toBeGreaterThan(0);
  });

  it('stops when slots are exhausted', () => {
    const zoom = getGardenZoom(0);
    const trees = buildGardenTrees({ a: 5000 }, ['a'], zoom);
    expect(trees.length).toBeLessThan(60);
  });
});

describe('gardenZoom', () => {
  it('stays in valley view until enough trees are planted', () => {
    expect(getGardenZoom(5).t).toBe(0);
    expect(getGardenZoom(5).worldWidth).toBe(360);
  });

  it('zooms out as more trees are planted, not from lifetime alone', () => {
    expect(getGardenZoom(0).t).toBe(0);
    const zoom = getGardenZoom(24);
    expect(zoom.t).toBeGreaterThan(0.35);
    expect(zoom.worldWidth).toBeGreaterThan(720);
    expect(zoom.rangeLayers).toBeGreaterThan(3);
  });

  it('keeps panorama barren (low fill) with few trees in a wide vista', () => {
    const zoom = getGardenZoom(8);
    expect(zoom.t).toBeGreaterThan(0);
    expect(zoom.fill).toBeLessThan(0.45);
  });
});
