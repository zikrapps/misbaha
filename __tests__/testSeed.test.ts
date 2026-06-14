import {
  buildE2eTestSeed,
  E2E_SEED_BADGE_COUNT,
  E2E_SEED_GOAL_COMPLETE_ID,
  E2E_SEED_GOAL_IN_PROGRESS_ID,
  E2E_SEED_REQUIRED_BADGE_IDS,
  validateE2eTestSeed,
} from '@/src/e2e/testSeed';

describe('buildE2eTestSeed', () => {
  it('seeds at least two dhikr badges (plus goal-derived badges)', () => {
    const seed = buildE2eTestSeed('2026-06-13');
    const validation = validateE2eTestSeed(seed);

    expect(validation.earnedBadgeCount).toBeGreaterThanOrEqual(E2E_SEED_BADGE_COUNT);
    for (const badgeId of E2E_SEED_REQUIRED_BADGE_IDS) {
      expect(validation.earnedBadgeIds).toContain(badgeId);
    }
  });

  it('seeds one completed goal and one in-progress goal', () => {
    const seed = buildE2eTestSeed('2026-06-13');
    const validation = validateE2eTestSeed(seed);

    expect(validation.goalsCompleted).toBe(1);
    expect(validation.completeGoalDaysDone).toBe(7);
    expect(validation.inProgressGoalDaysDone).toBe(3);
    expect(validation.inProgressGoalComplete).toBe(false);
    expect(seed.goals.some((goal) => goal.id === E2E_SEED_GOAL_COMPLETE_ID)).toBe(true);
    expect(seed.goals.some((goal) => goal.id === E2E_SEED_GOAL_IN_PROGRESS_ID)).toBe(true);
  });
});
