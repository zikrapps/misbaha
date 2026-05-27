import { buildDhulHijjahDays, buildGoalDays, buildRandomSurpriseGoal, presetGoals, suggestGoal } from '@/src/data/presetGoals';
import { hasStartedTemplate, pickSuggestedGoals } from '@/src/features/goals/suggestedGoals';
import { GoalPlan } from '@/src/types/misbaha';

describe('goal generation', () => {
  it('builds a different tasbeeh assignment for each goal day', () => {
    const days = buildGoalDays(7);

    expect(days).toHaveLength(7);
    expect(days[0]).toMatchObject({ day: 1, target: 33 });
    expect(new Set(days.map((day) => day.duaId)).size).toBeGreaterThan(1);
  });

  it('creates suggested plans with the requested duration', () => {
    const goal = suggestGoal(10);

    expect(goal.duration).toBe(10);
    expect(goal.days).toHaveLength(10);
    expect(goal.preset).toBeUndefined();
  });

  it('creates random surprise plans between 1 and 30 days', () => {
    const seen = new Set<number>();
    for (let index = 0; index < 40; index += 1) {
      const goal = buildRandomSurpriseGoal();
      expect(goal.duration).toBeGreaterThanOrEqual(1);
      expect(goal.duration).toBeLessThanOrEqual(30);
      expect(goal.days).toHaveLength(goal.duration);
      expect(goal.title).toMatch(/^\d+-Day Surprise$/);
      seen.add(goal.duration);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('includes a ten-day Dhul Hijjah preset', () => {
    const preset = presetGoals.find((goal) => goal.id === 'preset-dhul-hijjah');
    const days = buildDhulHijjahDays();

    expect(preset).toBeDefined();
    expect(preset?.duration).toBe(10);
    expect(days).toHaveLength(10);
    expect(days[0]).toMatchObject({ day: 1, duaId: 'fajr-subhanallah', target: 100 });
    expect(days[8]).toMatchObject({ day: 9, duaId: 'asr-la-ilaha', target: 100 });
    expect(days[9]).toMatchObject({ day: 10, duaId: 'rabbana-taqabbal-minna', target: 1 });
  });

  it('suggests up to four goals the user has never started', () => {
    const goals: GoalPlan[] = [
      ...presetGoals,
      {
        id: 'preset-dhul-hijjah-1700000000000',
        title: 'First Ten Days of Dhul Hijjah',
        description: 'Started copy',
        duration: 10,
        days: buildDhulHijjahDays(),
        createdAt: 1,
        startedAt: '2026-05-18',
        preset: false,
      },
    ];

    expect(hasStartedTemplate('preset-dhul-hijjah', goals)).toBe(true);
    expect(hasStartedTemplate('preset-garden', goals)).toBe(false);

    const suggested = pickSuggestedGoals(goals, 4);
    expect(suggested).toHaveLength(4);
    expect(suggested.find((goal) => goal.id === 'preset-dhul-hijjah')).toBeUndefined();
  });
});
