import {
  dayTimelineActiveSlot,
  dayTimelineAutoSupplicationId,
  dayTimelinePrimaryBySlot,
  dayTimelineProgress,
  dayTimelineReferenceShort,
  dayTimelineSkyPhase,
} from '@/src/data/dayTimelineSupplications';
import { resolveTimelineDua, truncateArabic } from '@/src/data/dayTimelineResolve';
import { dayTimelineSupplications } from '@/src/data/dayTimelineSupplications';

describe('dayTimeline logic', () => {
  it('maps clock times to slots', () => {
    expect(dayTimelineActiveSlot(new Date('2026-06-14T05:00:00'))).toBe('fajr');
    expect(dayTimelineActiveSlot(new Date('2026-06-14T10:00:00'))).toBe('dhuhr');
    expect(dayTimelineActiveSlot(new Date('2026-06-14T16:00:00'))).toBe('asr');
    expect(dayTimelineActiveSlot(new Date('2026-06-14T19:00:00'))).toBe('maghrib');
    expect(dayTimelineActiveSlot(new Date('2026-06-14T21:00:00'))).toBe('isha');
    expect(dayTimelineActiveSlot(new Date('2026-06-14T23:00:00'))).toBe('night');
  });

  it('selects primary supplications by slot', () => {
    expect(dayTimelinePrimaryBySlot.fajr).toBe('morning-remembrance');
    expect(dayTimelinePrimaryBySlot.maghrib).toBe('victory-tahlil');
    expect(dayTimelinePrimaryBySlot.night).toBe('tahajjud-opening');
  });

  it('auto-selects supplications from the clock', () => {
    expect(dayTimelineAutoSupplicationId(new Date('2026-06-14T05:30:00'))).toBe('morning-remembrance');
    expect(dayTimelineAutoSupplicationId(new Date('2026-06-14T08:00:00'))).toBe('master-istighfar');
    expect(dayTimelineAutoSupplicationId(new Date('2026-06-14T17:00:00'))).toBe('evening-remembrance');
    expect(dayTimelineAutoSupplicationId(new Date('2026-06-14T23:30:00'))).toBe('last-two-ayahs');
    expect(dayTimelineAutoSupplicationId(new Date('2026-06-14T03:00:00'))).toBe('tahajjud-opening');
  });

  it('computes day progress between 4am and 10pm', () => {
    expect(dayTimelineProgress(new Date('2026-06-14T04:00:00'))).toBe(0);
    expect(dayTimelineProgress(new Date('2026-06-14T13:00:00'))).toBeCloseTo(0.5, 3);
    expect(dayTimelineProgress(new Date('2026-06-14T22:00:00'))).toBe(1);
  });

  it('shortens reference labels for badges', () => {
    expect(dayTimelineReferenceShort('Sahih Muslim 2723b')).toBe('2723b');
    expect(dayTimelineReferenceShort('Quran 2:285–286')).toBe('286');
  });

  it('maps slots to sky phases', () => {
    expect(dayTimelineSkyPhase('fajr')).toBe('dawn');
    expect(dayTimelineSkyPhase('maghrib')).toBe('sunset');
    expect(dayTimelineSkyPhase('night')).toBe('night');
  });

  it('resolves timeline duas with clean Arabic', () => {
    for (const sup of dayTimelineSupplications) {
      const dua = resolveTimelineDua(sup);
      expect(dua).toBeDefined();
      expect(dua!.arabic).toMatch(/^[\u0600-\u06FF\s،؛؟\.…\-]+$/u);
    }
  });

  it('truncates long Arabic previews', () => {
    const long = 'أَ'.repeat(50);
    expect(truncateArabic(long, 10)).toHaveLength(11);
    expect(truncateArabic('قصير', 10)).toBe('قصير');
  });
});
