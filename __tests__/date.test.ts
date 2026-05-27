import { addDays, lastThirtyDays, todayKey } from '@/src/store/date';

describe('date helpers', () => {
  it('formats today as YYYY-MM-DD', () => {
    expect(todayKey(new Date('2026-05-18T15:30:00Z'))).toBe('2026-05-18');
  });

  it('adds calendar days', () => {
    expect(addDays('2026-05-18', 2)).toBe('2026-05-20');
    expect(addDays('2026-05-18', -1)).toBe('2026-05-17');
  });

  it('returns thirty consecutive days ending today', () => {
    const days = lastThirtyDays('2026-05-18');
    expect(days).toHaveLength(30);
    expect(days[0]).toBe('2026-04-19');
    expect(days[29]).toBe('2026-05-18');
  });
});
