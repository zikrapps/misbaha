import { renderHook } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { getStrings, themeLabels, useLanguage, useT } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

function exerciseStrings(s: ReturnType<typeof getStrings>, language: 'en' | 'ur') {
  expect(s.duas.resetBody('Dua')).toContain('Dua');
  expect(s.duas.tapHint(2)).toContain('2');
  expect(s.goals.dayProgress(2, 7, 1)).toContain('2');
  expect(s.goals.durationDays(10)).toContain('10');
  expect(s.goalDetail.dayOf(3, 30)).toContain('3');
  expect(s.goalDetail.openCounter(1)).toContain('1');
  expect(s.goalDetail.moreRows(5)).toContain('5');
  expect(s.goalDetail.moreDuas(3)).toContain('3');
  expect(s.goalCreate.plansFor(7)).toContain('7');
  expect(s.goalCreate.moreDays(4)).toContain('4');
  expect(s.goalCreate.surpriseTitlePattern(7)).toContain('7');
  expect(s.goalCreate.customTitle(10)).toContain('10');
  expect(s.goalCreate.gardenTitle(30)).toContain('30');
  expect(s.garden.treesPlanted(1)).not.toEqual(s.garden.treesPlanted(2));
  expect(s.garden.moreToRanges(3)).toContain('3');
  expect(s.garden.mountainRanges(4)).toContain('4');
  expect(s.settings.tapStatement(5)).toContain('5');
  if (language === 'en') {
    expect(s.goals.dayProgress(2, 7, 1)).toContain('Day');
    expect(s.settings.themeAccessibility('Garden', 'Warm')).toContain('Garden');
  }
  expect(s.settings.publishedBy('Zikr Apps')).toContain('Zikr');
}

describe('strings', () => {
  beforeEach(() => resetStore());

  it('returns English and Urdu catalogs', () => {
    expect(getStrings('en').tabs.today).toBe('Today');
    expect(getStrings('ur').tabs.today).toBeTruthy();
    expect(getStrings('fr' as 'en').tabs.today).toBe('Today');
  });

  it('exercises parameterized English copy', () => {
    exerciseStrings(getStrings('en'), 'en');
  });

  it('exercises parameterized Urdu copy', () => {
    exerciseStrings(getStrings('ur'), 'ur');
  });

  it('returns theme labels per language', () => {
    expect(themeLabels('en', 'garden').name).toBe('Garden');
    expect(themeLabels('ur', 'parchment').name).toBeTruthy();
  });

  it('hooks read language from the store', () => {
    useMisbahaStore.getState().setLanguage('ur');
    const { result } = renderHook(() => ({ t: useT(), language: useLanguage() }));
    expect(result.current.language).toBe('ur');
    expect(result.current.t.tabs.tasbeeh).toBeTruthy();
  });
});
