import { duasLocaleUr } from '@/src/data/duasLocale.ur';
import { prayerLabels } from '@/src/data/duas';
import { DuaRecord, Language, PrayerDirection } from '@/src/types/misbaha';

export type DuaLocaleFields = {
  title: string;
  translation: string;
  speaker?: string;
};

const prayerLabelsUr: Record<PrayerDirection, string> = {
  fajr: 'فجر',
  dhuhr: 'ظہر',
  asr: 'عصر',
  maghrib: 'مغرب',
  isha: 'عشاء',
};

function urduLocale(dua: DuaRecord): DuaLocaleFields | undefined {
  return duasLocaleUr[dua.id];
}

export function duaTitle(dua: DuaRecord, language: Language): string {
  if (language === 'ur') return urduLocale(dua)?.title ?? dua.title;
  return dua.title;
}

export function duaTranslation(dua: DuaRecord, language: Language): string {
  if (language === 'ur') return urduLocale(dua)?.translation ?? dua.translation;
  return dua.translation;
}

export function duaSpeaker(dua: DuaRecord, language: Language): string | undefined {
  if (language === 'ur') return urduLocale(dua)?.speaker ?? dua.speaker;
  return dua.speaker;
}

/** Collapsed row subtitle: transliteration in English, translation in Urdu. */
export function duaPreview(dua: DuaRecord, language: Language): string {
  if (language === 'ur') return duaTranslation(dua, language);
  return dua.transliteration;
}

export function prayerLabel(prayer: PrayerDirection, language: Language): string {
  if (language === 'ur') return prayerLabelsUr[prayer];
  return prayerLabels[prayer];
}
