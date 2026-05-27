import { isNightDetailHours, nightDetailPalette } from '@/src/features/duas/nightDetail';

describe('nightDetail', () => {
  it('treats evening and pre-fajr hours as night', () => {
    expect(isNightDetailHours(new Date('2026-05-18T20:00:00'))).toBe(true);
    expect(isNightDetailHours(new Date('2026-05-18T19:00:00'))).toBe(true);
    expect(isNightDetailHours(new Date('2026-05-18T04:59:00'))).toBe(true);
    expect(isNightDetailHours(new Date('2026-05-18T03:00:00'))).toBe(true);
    expect(isNightDetailHours(new Date('2026-05-18T12:00:00'))).toBe(false);
    expect(isNightDetailHours(new Date('2026-05-18T05:00:00'))).toBe(false);
  });

  it('exposes a dark palette', () => {
    expect(nightDetailPalette.canvas).toBe('#0b0b0d');
    expect(nightDetailPalette.arabic).toBeTruthy();
  });
});
