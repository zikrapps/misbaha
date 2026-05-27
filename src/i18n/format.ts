import { Language } from '@/src/types/misbaha';

const englishNumber = new Intl.NumberFormat('en-US');

/** Western digits (0–9) regardless of app language. */
export function formatNumber(value: number): string {
  return englishNumber.format(value);
}

const dateLocale: Record<Language, string> = {
  en: 'en',
  ur: 'ur-PK-u-nu-latn',
};

export function formatDashboardDate(date = new Date(), language: Language = 'en'): string {
  const locale = dateLocale[language];
  const gregorian = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  try {
    const hijri = new Intl.DateTimeFormat(locale, {
      calendar: 'islamic',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
    return `${hijri} • ${gregorian}`;
  } catch {
    return gregorian;
  }
}
