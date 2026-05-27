import { resetStore } from '@/__tests__/helpers/store';
import { presetGoals } from '@/src/data/presetGoals';
import { getGoalDayProgress, migratePersistedState, useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('misbaha store', () => {
  beforeEach(() => resetStore());

  it('increments lifetime and daily counts', () => {
    useMisbahaStore.getState().incrementDua('fajr-subhanallah', 5, '2026-05-18');

    expect(useMisbahaStore.getState().counts['fajr-subhanallah']).toBe(5);
    expect(useMisbahaStore.getState().dailyCounts['2026-05-18']['fajr-subhanallah']).toBe(5);
  });

  it('clamps tap weight to the 1 to 10 dial range', () => {
    useMisbahaStore.getState().setTapWeight(14);
    expect(useMisbahaStore.getState().tapWeight).toBe(10);

    useMisbahaStore.getState().setTapWeight(-3);
    expect(useMisbahaStore.getState().tapWeight).toBe(1);
  });

  it('resets all counter progress without changing settings', () => {
    useMisbahaStore.getState().incrementDua('fajr-subhanallah', 5, '2026-05-18');
    useMisbahaStore.getState().incrementGoalDay('goal-1', 1, 5);
    useMisbahaStore.getState().setTapWeight(4);

    useMisbahaStore.getState().resetAllCounters();

    expect(useMisbahaStore.getState().counts).toEqual({});
    expect(useMisbahaStore.getState().dailyCounts).toEqual({});
    expect(useMisbahaStore.getState().events).toEqual([]);
    expect(useMisbahaStore.getState().goalProgress).toEqual({});
    expect(useMisbahaStore.getState().tapWeight).toBe(4);
  });

  it('persists theme selection in settings state', () => {
    useMisbahaStore.getState().setThemeId('chromatic');

    expect(useMisbahaStore.getState().themeId).toBe('chromatic');
  });

  it('normalizes legacy theme ids when setting theme', () => {
    useMisbahaStore.getState().setThemeId('midnight' as 'garden');
    expect(useMisbahaStore.getState().themeId).toBe('chromatic');
  });

  it('resets a dua when the day bucket was missing', () => {
    useMisbahaStore.setState({ counts: { 'fajr-subhanallah': 4 }, dailyCounts: {} });
    useMisbahaStore.getState().resetDua('fajr-subhanallah', '2026-06-01');
    expect(useMisbahaStore.getState().dailyCounts['2026-06-01']['fajr-subhanallah']).toBe(0);
  });

  it('resets a single dua counter', () => {
    useMisbahaStore.getState().incrementDua('fajr-subhanallah', 3, '2026-05-18');
    useMisbahaStore.getState().resetDua('fajr-subhanallah', '2026-05-18');
    expect(useMisbahaStore.getState().counts['fajr-subhanallah']).toBe(0);
    expect(useMisbahaStore.getState().dailyCounts['2026-05-18']['fajr-subhanallah']).toBe(0);
  });

  it('clamps increment amount to at least one', () => {
    useMisbahaStore.getState().incrementDua('fajr-subhanallah', 0);
    expect(useMisbahaStore.getState().counts['fajr-subhanallah']).toBe(1);
  });

  it('manages goals and progress', () => {
    const template = presetGoals[0];
    const id = useMisbahaStore.getState().startGoal(template, '2026-05-20');
    expect(id).toContain('preset-tasbih-fatimah');

    useMisbahaStore.getState().incrementGoalDay(id, 1, 2);
    expect(getGoalDayProgress(id, 1)).toBe(2);

    const custom = { ...template, id: 'custom-plan', preset: false, createdAt: 1 };
    useMisbahaStore.getState().saveGoal(custom);
    expect(useMisbahaStore.getState().goals[0].id).toBe('custom-plan');
  });

  it('migrates persisted settings', () => {
    const persisted = migratePersistedState({ themeId: 'midnight', language: 'ur' }) as {
      themeId: string;
      language: string;
      tutorialCompleted?: boolean;
    };
    expect(persisted.themeId).toBe('chromatic');
    expect(persisted.language).toBe('ur');
    expect(persisted.tutorialCompleted).toBe(false);
  });

  it('opens and closes the gesture tutorial', () => {
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
    useMisbahaStore.getState().openTutorial();
    expect(useMisbahaStore.getState().tutorialVisible).toBe(true);
    expect(useMisbahaStore.getState().tutorialSession).toBe(1);
    useMisbahaStore.getState().closeTutorial();
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
    expect(useMisbahaStore.getState().tutorialCompleted).toBe(true);
  });

  it('ignores goal day increments for unknown goals or days', () => {
    useMisbahaStore.getState().incrementGoalDay('missing-goal', 1, 3);
    expect(useMisbahaStore.getState().goalProgress['missing-goal']).toBeUndefined();

    const id = useMisbahaStore.getState().startGoal(presetGoals[0], '2026-05-20');
    useMisbahaStore.getState().incrementGoalDay(id, 99, 2);
    expect(getGoalDayProgress(id, 99)).toBe(0);
  });

  it('tracks progress for the built-in daily goal', () => {
    useMisbahaStore.getState().incrementGoalDay('daily-goal', 1, 2);
    expect(getGoalDayProgress('daily-goal', 1)).toBe(2);
  });

  it('caps stored events at two thousand entries', () => {
    for (let i = 0; i < 2005; i += 1) {
      useMisbahaStore.getState().incrementDua('fajr-subhanallah', 1, '2026-05-18');
    }
    expect(useMisbahaStore.getState().events.length).toBeLessThanOrEqual(2000);
  });

  it('updates language and toggles', () => {
    useMisbahaStore.getState().setLanguage('ur');
    useMisbahaStore.getState().setClickSoundEnabled(false);
    useMisbahaStore.getState().setHapticsEnabled(false);

    expect(useMisbahaStore.getState().language).toBe('ur');
    expect(useMisbahaStore.getState().clickSoundEnabled).toBe(false);
    expect(useMisbahaStore.getState().hapticsEnabled).toBe(false);
  });
});
