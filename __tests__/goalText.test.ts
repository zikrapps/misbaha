import { presetGoals, suggestGoal } from '@/src/data/presetGoals';
import { goalDescription, goalDurationLabel, goalTitle } from '@/src/i18n/goalText';

describe('goalText', () => {
  it('localizes preset goal titles in Urdu', () => {
    const fatimah = presetGoals.find((g) => g.id === 'preset-tasbih-fatimah')!;
    expect(goalTitle(fatimah, 'ur')).not.toBe(fatimah.title);
    expect(goalDescription(fatimah, 'ur')).not.toBe(fatimah.description);
  });

  it('localizes generated goal title patterns', () => {
    const surprise = suggestGoal(7);
    surprise.title = '7-Day Surprise';
    surprise.description = 'x';

    expect(goalTitle(surprise, 'ur')).toContain('7');
    expect(goalDescription(surprise, 'ur').length).toBeGreaterThan(0);

    const custom = { ...surprise, title: '10-Day Custom Path' };
    expect(goalTitle(custom, 'ur')).toContain('10');

    const garden = { ...surprise, title: '30-Day Garden' };
    expect(goalTitle(garden, 'ur')).toContain('30');
  });

  it('formats duration labels', () => {
    expect(goalDurationLabel(7, 'en')).toContain('7');
    expect(goalDurationLabel(10, 'ur')).toContain('10');
  });

  it('uses generated Urdu descriptions for English-only goal titles', () => {
    const goal = {
      ...presetGoals[0],
      title: '7-Day Surprise',
      description: 'x',
    };
    expect(goalDescription(goal, 'ur').length).toBeGreaterThan(0);
    expect(goalDescription({ ...goal, title: '10-Day Custom Path' }, 'ur')).toBeTruthy();
    expect(goalDescription({ ...goal, title: '30-Day Garden' }, 'ur')).toBeTruthy();
  });

  it('falls back to English fields for unrecognized Urdu patterns', () => {
    const goal = {
      ...presetGoals[0],
      id: 'custom-weekly',
      title: 'Weekly Focus',
      description: 'Stay steady.',
    };
    expect(goalTitle(goal, 'ur')).toBe('Weekly Focus');
    expect(goalDescription(goal, 'ur')).toBe('Stay steady.');
  });

  it('returns English copy when not Urdu', () => {
    const goal = presetGoals[0];
    expect(goalTitle(goal, 'en')).toBe(goal.title);
    expect(goalDescription(goal, 'en')).toBe(goal.description);
  });
});
