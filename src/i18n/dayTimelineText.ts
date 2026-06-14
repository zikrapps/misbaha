import { DayTimelineSlotId, Language } from '@/src/types/misbaha';

/** Screen-reader labels — time of day, not salah names. */
const slotLabels: Record<DayTimelineSlotId, Record<Language, string>> = {
  fajr: { en: 'Dawn', ur: 'صبح' },
  dhuhr: { en: 'Midday', ur: 'دوپہر' },
  asr: { en: 'Afternoon', ur: 'سہ پہر' },
  maghrib: { en: 'Sunset', ur: 'غروب' },
  isha: { en: 'Evening', ur: 'شام' },
  night: { en: 'Night', ur: 'شب' },
};

const supplicationTitles: Record<string, Record<Language, string>> = {
  'morning-remembrance': { en: 'Morning Remembrance', ur: 'صبح کا ذکر' },
  'morning-wake-praise': { en: 'Upon Waking', ur: 'جاگنے پر' },
  'comprehensive-tasbih': { en: 'Tasbih After Fajr', ur: 'فجر کے بعد تسبیح' },
  'master-istighfar': { en: 'Master Istighfar', ur: 'سید الاستغفار' },
  'evening-remembrance': { en: 'Evening Remembrance', ur: 'شام کا ذکر' },
  'after-prayer-praise': { en: 'After Salah', ur: 'نماز کے بعد' },
  'before-sleep': { en: 'Before Sleep', ur: 'سونے سے پہلے' },
  'bedtime-surrender': { en: 'At Bedtime', ur: 'سونے کے وقت' },
  'last-two-ayahs': { en: 'Last Two Ayahs', ur: 'آخری دو آیتیں' },
  'tahajjud-opening': { en: 'Opening of Tahajjud', ur: 'تہجد کا آغاز' },
};

export function dayTimelineSlotLabel(slot: DayTimelineSlotId, language: Language): string {
  return slotLabels[slot][language];
}

export function dayTimelineSupplicationTitle(id: string, language: Language): string {
  return supplicationTitles[id]?.[language] ?? id;
}
