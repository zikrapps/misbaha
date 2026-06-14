import { DayTimelineSlotId, Language } from '@/src/types/misbaha';

const slotLabels: Record<DayTimelineSlotId, Record<Language, string>> = {
  fajr: { en: 'Fajr', ur: 'فجر' },
  dhuhr: { en: 'Dhuhr', ur: 'ظہر' },
  asr: { en: 'Asr', ur: 'عصر' },
  maghrib: { en: 'Maghrib', ur: 'مغرب' },
  isha: { en: 'Isha', ur: 'عشاء' },
  night: { en: 'Night', ur: 'شب' },
};

const supplicationTitles: Record<string, Record<Language, string>> = {
  'morning-remembrance': { en: 'Morning Remembrance', ur: 'صبح کا ذکر' },
  'master-istighfar': { en: 'Master Istighfar', ur: 'سید الاستغفار' },
  'glory-and-praise': { en: 'Glory and Praise', ur: 'سبحان اللہ وبحمدہ' },
  'comprehensive-tasbih': { en: 'Tasbih of Creation', ur: 'کائنات کا تسبیح' },
  'evening-remembrance': { en: 'Evening Remembrance', ur: 'شام کا ذکر' },
  'victory-tahlil': { en: 'Tahlil of Victory', ur: 'فتح کا تهلیل' },
  'after-prayer-praise': { en: 'Praise After Prayer', ur: 'نماز کے بعد' },
  'before-sleep': { en: 'Before Sleep', ur: 'سونے سے پہلے' },
  'last-two-ayahs': { en: 'Last Two Ayahs', ur: 'آخری دو آیتیں' },
  'tahajjud-opening': { en: 'Opening of Tahajjud', ur: 'تہجد کا آغاز' },
};

export function dayTimelineSlotLabel(slot: DayTimelineSlotId, language: Language): string {
  return slotLabels[slot][language];
}

export function dayTimelineSupplicationTitle(id: string, language: Language): string {
  return supplicationTitles[id]?.[language] ?? id;
}
