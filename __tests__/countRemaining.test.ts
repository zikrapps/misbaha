import { progressPercent, remainingCount } from '@/src/features/duas/countRemaining';

describe('countRemaining', () => {
  it('returns units still needed to reach the target', () => {
    expect(remainingCount(5, 10)).toBe(5);
    expect(remainingCount(10, 10)).toBe(0);
    expect(remainingCount(12, 10)).toBe(0);
  });

  it('computes progress percent capped at 100', () => {
    expect(progressPercent(5, 10)).toBe(50);
    expect(progressPercent(10, 10)).toBe(100);
    expect(progressPercent(15, 10)).toBe(100);
    expect(progressPercent(0, 0)).toBe(0);
  });
});
