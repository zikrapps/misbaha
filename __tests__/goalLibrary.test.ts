import { buildSeededGoalDays, goalLibraryCategories, goalLibraryGoals } from '@/src/data/goalLibrary';
import { duasById } from '@/src/data/duas';
import { goalLibraryIconNames } from '@/src/features/goals/goalLibraryIcons';

describe('goalLibrary', () => {
  it('contains the requested library sizes', () => {
    const byCategory = Object.fromEntries(goalLibraryCategories.map((section) => [section.id, section.goals.length]));
    expect(byCategory.oneDay).toBe(10);
    expect(byCategory.weekly).toBe(10);
    expect(byCategory.thirtyDay).toBe(10);
    expect(byCategory.ayyamBeed).toBe(5);
    expect(byCategory.newMoon).toBe(12);
    expect(goalLibraryGoals).toHaveLength(47);
  });

  it('assigns a unique library icon to every goal', () => {
    const icons = goalLibraryGoals.map((goal) => goal.icon);
    expect(new Set(icons).size).toBe(goalLibraryGoals.length);
    icons.forEach((icon) => expect(goalLibraryIconNames).toContain(icon));
  });

  it('builds deterministic seeded days with valid duas', () => {
    const first = buildSeededGoalDays(7, 'lib-7d-rabbana');
    const second = buildSeededGoalDays(7, 'lib-7d-rabbana');
    expect(first).toEqual(second);
    first.forEach((day) => {
      expect(duasById[day.duaId]).toBeDefined();
      expect(day.target).toBeGreaterThan(0);
    });
  });

  it('randomizes days differently across goals', () => {
    const a = buildSeededGoalDays(10, 'lib-7d-rabbana').map((day) => day.duaId);
    const b = buildSeededGoalDays(10, 'lib-7d-morning').map((day) => day.duaId);
    expect(a).not.toEqual(b);
  });

  it('handles empty seed keys and falls back to default targets', () => {
    const days = buildSeededGoalDays(1, '');
    expect(days).toHaveLength(1);
    expect(days[0]?.target).toBeGreaterThan(0);
  });
});
