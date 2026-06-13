import { badges } from '@/src/data/badges';
import { badgeEmblemName, badgeSvgXml } from '@/src/features/badges/badgeArt';

describe('badgeArt', () => {
  it('builds a valid SVG for every badge, earned and locked', () => {
    for (const badge of badges) {
      const earned = badgeSvgXml(badge, true);
      const locked = badgeSvgXml(badge, false);
      expect(earned.startsWith('<svg')).toBe(true);
      expect(earned.endsWith('</svg>')).toBe(true);
      expect(earned).toContain('viewBox="0 0 200 200"');
      expect(locked).toContain('opacity="0.5"');
      expect(locked).not.toEqual(earned);
      expect(badgeEmblemName(badge)).toBeTruthy();
    }
  });

  it('recolours locked badges to the grey ramp', () => {
    const locked = badgeSvgXml(badges.find((b) => b.id === 'bead-1')!, false);
    // Olive ink (#2d4a22) becomes the grey-dark stop; no family colour remains.
    expect(locked).not.toContain('#2d4a22');
    expect(locked).toContain('#45423e');
  });

  it('caches repeated builds', () => {
    const badge = badges[0];
    expect(badgeSvgXml(badge, true)).toBe(badgeSvgXml(badge, true));
  });
});
