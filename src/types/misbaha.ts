export type PrayerDirection = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type DuaCategory = 'prayer' | 'morning' | 'night' | 'quranic';

export type GoalDuration = 7 | 10 | 30;

export type ThemeId = 'garden' | 'chromatic' | 'rose' | 'parchment';

export type Language = 'en' | 'ur';

export function normalizeLanguage(value: string | undefined): Language {
  if (value === 'ur') return 'ur';
  return 'en';
}

export type DuaRecord = {
  id: string;
  title: string;
  transliteration: string;
  arabic: string;
  translation: string;
  target: number;
  category: DuaCategory;
  prayer?: PrayerDirection;
  speaker?: string;
  hadithReference?: string;
  hadithUrl?: string;
  quranReference?: string;
  quranUrl?: string;
};

export type CountEvent = {
  id: string;
  duaId: string;
  amount: number;
  date: string;
  createdAt: number;
};

export type GoalDay = {
  day: number;
  duaId: string;
  target: number;
};

export type GoalPlan = {
  id: string;
  title: string;
  description: string;
  duration: number;
  days: GoalDay[];
  createdAt: number;
  startedAt?: string;
  preset?: boolean;
};

export type GoalProgress = Record<string, Record<number, number>>;
