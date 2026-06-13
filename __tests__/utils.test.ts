import { countStateColor } from '@/src/features/duas/countStateColor';
import { getGoalTodayState } from '@/src/features/goals/goalProgress';
import { presetGoals } from '@/src/data/presetGoals';
import { migratePersistedState } from '@/src/store/useMisbahaStore';
import { getTheme } from '@/src/theme/palette';
import { sumRecordValues } from '@/src/utils/sumRecord';

describe('shared utilities', () => {
  it('sums only finite numeric record values', () => {
    expect(sumRecordValues({ a: 3, b: NaN, c: 2 })).toBe(5);
    expect(sumRecordValues(undefined)).toBe(0);
  });

  it('derives goal today state from progress', () => {
    const goal = presetGoals[0];
    const progress = { 1: goal.days[0].target };
    const state = getGoalTodayState(goal, progress);
    expect(state.completed).toBe(1);
    expect(state.today?.day).toBe(2);
    expect(state.todayProgress).toBe(0);
  });

  it('colors counter states consistently', () => {
    const colors = getTheme('garden').colors;
    expect(countStateColor(0, 33, colors)).toBe(colors.line);
    expect(countStateColor(10, 33, colors)).toBe(colors.olive);
    expect(countStateColor(33, 33, colors)).toBe(colors.oliveDeep);
  });

  it('returns empty goal state when a plan has no days', () => {
    const state = getGoalTodayState({ ...presetGoals[0], days: [] }, {});
    expect(state.today).toBeNull();
    expect(state.completed).toBe(0);
  });

  it('returns non-objects unchanged from migration', () => {
    expect(migratePersistedState(null)).toBeNull();
    expect(migratePersistedState('legacy')).toBe('legacy');
  });

  it('sanitizes corrupt persisted counter data', () => {
    const migrated = migratePersistedState({
      themeId: 'midnight',
      language: 'ur',
      counts: { ok: 4, bad: 'x' },
      goalProgress: { g1: { 1: 2, x: 9 } },
    }) as {
      themeId: string;
      language: string;
      counts: Record<string, number>;
      goalProgress: Record<string, Record<number, number>>;
    };

    expect(migrated.themeId).toBe('chromatic');
    expect(migrated.language).toBe('ur');
    expect(migrated.counts).toEqual({ ok: 4 });
    expect(migrated.goalProgress).toEqual({ g1: { 1: 2 } });
  });

  it('defaults missing visualization to garden during migration', () => {
    const migrated = migratePersistedState({ language: 'en' }) as { visualization: string };
    expect(migrated.visualization).toBe('garden');
  });

  it('drops invalid daily counts and events during migration', () => {
    const migrated = migratePersistedState({
      dailyCounts: { '2026-05-18': { ok: 1, bad: 'nope' }, broken: null },
      events: [{ duaId: 'x', amount: 2 }, { duaId: 1, amount: 'y' }],
    }) as {
      dailyCounts: Record<string, Record<string, number>>;
      events: unknown[];
    };

    expect(migrated.dailyCounts['2026-05-18']).toEqual({ ok: 1 });
    expect(migrated.dailyCounts.broken).toEqual({});
    expect(migrated.events).toHaveLength(1);
  });
});
