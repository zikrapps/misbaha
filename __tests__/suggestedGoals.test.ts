import { buildDhulHijjahDays, presetGoals } from '@/src/data/presetGoals';
import { hasStartedTemplate, isActiveGoal, pickSuggestedGoals } from '@/src/features/goals/suggestedGoals';
import { GoalPlan } from '@/src/types/misbaha';

describe('suggestedGoals', () => {
  it('marks preset templates without startedAt as inactive unless progress exists', () => {
    const preset = presetGoals[0];
    expect(isActiveGoal(preset)).toBe(false);
    expect(isActiveGoal(preset, { 1: 1 })).toBe(true);
  });

  it('detects started preset templates by id prefix', () => {
    const started = {
      ...presetGoals[0],
      id: `${presetGoals[0].id}-1710000000`,
      startedAt: '2026-05-18',
      preset: false,
    };
    expect(hasStartedTemplate(presetGoals[0].id, [started])).toBe(true);
  });

  it('returns unstarted templates up to the limit', () => {
    const picked = pickSuggestedGoals(presetGoals, 2);
    expect(picked.length).toBeLessThanOrEqual(2);
    expect(picked.every((goal) => goal.preset)).toBe(true);
    expect(pickSuggestedGoals(presetGoals).length).toBeLessThanOrEqual(4);
  });

  it('treats started goals as active', () => {
    const started: GoalPlan = {
      ...presetGoals[0],
      startedAt: '2026-05-18',
      preset: false,
    };
    expect(isActiveGoal(started)).toBe(true);
  });
});
