import { goalsLocaleUr } from '@/src/data/goalsLocale.ur';
import { goalLibraryLocaleUr } from '@/src/data/goalLibraryLocale.ur';
import { formatNumber } from '@/src/i18n/format';
import { getStrings } from '@/src/i18n/strings';
import { GoalPlan, Language } from '@/src/types/misbaha';

function urduLocale(goal: GoalPlan) {
  return goalsLocaleUr[goal.id] ?? goalLibraryLocaleUr[goal.id];
}

export function goalTitle(goal: GoalPlan, language: Language): string {
  if (language === 'ur') {
    const localized = urduLocale(goal);
    if (localized) return localized.title;

    const t = getStrings('ur');
    const surprise = goal.title.match(/^(\d+)-Day Surprise$/);
    if (surprise) return t.goalCreate.surpriseTitlePattern(Number(surprise[1]));

    const custom = goal.title.match(/^(\d+)-Day Custom Path$/);
    if (custom) return t.goalCreate.customTitle(Number(custom[1]));

    const garden = goal.title.match(/^(\d+)-Day Garden$/);
    if (garden) return t.goalCreate.gardenTitle(Number(garden[1]));
  }

  return goal.title;
}

export function goalDescription(goal: GoalPlan, language: Language): string {
  if (language === 'ur') {
    const localized = urduLocale(goal);
    if (localized) return localized.description;

    const t = getStrings('ur');
    if (goal.title.endsWith('-Day Surprise')) return t.goalCreate.surpriseDescriptionGenerated;
    if (goal.title.endsWith('-Day Custom Path')) return t.goalCreate.customDescriptionGenerated;
    if (goal.title.endsWith('-Day Garden')) return t.goalCreate.gardenDescriptionGenerated;
  }

  return goal.description;
}

export function goalDurationLabel(duration: number, language: Language): string {
  const t = getStrings(language);
  return `${formatNumber(duration)} ${t.common.days}`;
}
