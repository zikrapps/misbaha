import { dailyGoalProgress, DAILY_DHIKR_GOAL } from '@/src/features/insights/dailyDhikrGoal';

describe('dailyGoalProgress', () => {
  it('uses the tree-plant threshold as the daily goal', () => {
    expect(DAILY_DHIKR_GOAL).toBe(100);
  });

  it('returns zero progress with no counts', () => {
    expect(dailyGoalProgress(0)).toBe(0);
  });

  it('returns partial progress toward the daily goal', () => {
    expect(dailyGoalProgress(80)).toBe(80);
  });

  it('caps progress at 100%', () => {
    expect(dailyGoalProgress(128)).toBe(100);
  });
});
