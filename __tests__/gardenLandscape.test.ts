import { buildGardenLandscape } from '@/src/features/insights/gardenLandscape';

describe('buildGardenLandscape', () => {
  it('builds ridges for any zoom level', () => {
    const barren = buildGardenLandscape(360, 228, 2, 0.2);
    expect(barren.ridges.length).toBeGreaterThan(0);
    expect(barren.valleys).toHaveLength(0);
    expect(barren.lakes).toHaveLength(0);
  });

  it('adds valleys and lakes when fill increases', () => {
    const lush = buildGardenLandscape(720, 300, 4, 0.8);
    expect(lush.valleys.length).toBeGreaterThan(0);
    expect(lush.lakes.length).toBeGreaterThan(0);
    expect(lush.ridges.some((r) => r.capPath)).toBe(true);
  });
});
