export type PrayerDirection = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type DayTimelineSlotId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'night';

export type DayTimelineSupplication = {
  id: string;
  slot: DayTimelineSlotId;
  /** Pull Arabic/translation from Tasbeeh library when set. */
  duaId?: string;
  /** Key into dayTimelineText snippet map when set. */
  arabicSnippet: string;
  transliteration?: string;
  hadithReference?: string;
  hadithUrl?: string;
  quranReference?: string;
  quranUrl?: string;
};

export type DuaCategory =
  | 'prayer'
  | 'morning'
  | 'night'
  | 'quranic'
  | 'salah'
  | 'relief'
  | 'remembrance'
  | 'heart'
  | 'daily'
  | 'ramadan';

export type GoalDuration = 7 | 10 | 30;

export type ThemeId = 'garden' | 'chromatic' | 'rose' | 'parchment' | 'fadedGold';

export type Language = 'en' | 'ur';

export type VisualizationMode = 'garden' | 'earth' | 'space';

export function normalizeLanguage(value: string | undefined): Language {
  if (value === 'ur') return 'ur';
  return 'en';
}

export function normalizeVisualization(value: string | undefined): VisualizationMode {
  if (value === 'earth' || value === 'space') return value;
  return 'garden';
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

export type GoalLibraryCategoryId = 'oneDay' | 'weekly' | 'thirtyDay' | 'ayyamBeed' | 'newMoon';

export type GoalPlan = {
  id: string;
  title: string;
  description: string;
  duration: number;
  days: GoalDay[];
  createdAt: number;
  startedAt?: string;
  preset?: boolean;
  /** Small badge icon shown on library / suggested cards. */
  icon?: string;
  libraryCategory?: GoalLibraryCategoryId;
};

export type GoalProgress = Record<string, Record<number, number>>;
