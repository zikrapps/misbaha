import { DayTimelineSlotId, DayTimelineSupplication } from '@/src/types/misbaha';

export const dayTimelineSlotOrder: DayTimelineSlotId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'night'];

/** Timeline supplications — Arabic may come from `duaId` (see dayTimelineText). */
export const dayTimelineSupplications: DayTimelineSupplication[] = [
  {
    id: 'morning-remembrance',
    slot: 'fajr',
    duaId: 'timeline-morning-remembrance',
    arabicSnippet: 'morning-remembrance',
    hadithReference: 'Sahih Muslim 2723b',
    hadithUrl: 'https://sunnah.com/muslim:2723b',
  },
  {
    id: 'master-istighfar',
    slot: 'dhuhr',
    duaId: 'morning-sayyidul-istighfar',
    arabicSnippet: 'master-istighfar',
    transliteration: 'Allahumma anta rabbi',
    hadithReference: 'Sahih al-Bukhari 6306',
    hadithUrl: 'https://sunnah.com/bukhari:6306',
  },
  {
    id: 'glory-and-praise',
    slot: 'dhuhr',
    duaId: 'timeline-glory-praise',
    arabicSnippet: 'glory-and-praise',
    transliteration: 'Subhan Allahi wa bihamdih',
    hadithReference: 'Sahih al-Bukhari 6405',
    hadithUrl: 'https://sunnah.com/bukhari:6405',
  },
  {
    id: 'comprehensive-tasbih',
    slot: 'dhuhr',
    duaId: 'timeline-comprehensive-tasbih',
    arabicSnippet: 'comprehensive-tasbih',
    hadithReference: 'Sahih Muslim 2726a',
    hadithUrl: 'https://sunnah.com/muslim:2726a',
  },
  {
    id: 'evening-remembrance',
    slot: 'asr',
    duaId: 'timeline-evening-remembrance',
    arabicSnippet: 'evening-remembrance',
    hadithReference: 'Sahih Muslim 2723a',
    hadithUrl: 'https://sunnah.com/muslim:2723a',
  },
  {
    id: 'victory-tahlil',
    slot: 'maghrib',
    duaId: 'timeline-victory-tahlil',
    arabicSnippet: 'victory-tahlil',
    transliteration: 'La ilaha illallahu wahdahu',
    hadithReference: 'Sahih Muslim 2724',
    hadithUrl: 'https://sunnah.com/muslim:2724',
  },
  {
    id: 'after-prayer-praise',
    slot: 'isha',
    duaId: 'timeline-after-prayer',
    arabicSnippet: 'after-prayer-praise',
    hadithReference: 'Sahih Muslim 591',
    hadithUrl: 'https://sunnah.com/muslim:591',
  },
  {
    id: 'before-sleep',
    slot: 'isha',
    duaId: 'night-bismika',
    arabicSnippet: 'before-sleep',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    hadithReference: 'Sahih al-Bukhari 6314',
    hadithUrl: 'https://sunnah.com/bukhari:6314',
  },
  {
    id: 'last-two-ayahs',
    slot: 'night',
    duaId: 'timeline-baqarah-closing',
    arabicSnippet: 'last-two-ayahs',
    hadithReference: 'Sahih al-Bukhari 5009',
    hadithUrl: 'https://sunnah.com/bukhari:5009',
    quranReference: 'Quran 2:285–286',
    quranUrl: 'https://quran.com/2/285-286',
  },
  {
    id: 'tahajjud-opening',
    slot: 'night',
    duaId: 'timeline-tahajjud-opening',
    arabicSnippet: 'tahajjud-opening',
    hadithReference: 'Sahih al-Bukhari 1120',
    hadithUrl: 'https://sunnah.com/bukhari:1120',
  },
];

const supplicationsById = Object.fromEntries(dayTimelineSupplications.map((item) => [item.id, item])) as Record<
  string,
  DayTimelineSupplication
>;

export function dayTimelineSupplicationById(id: string): DayTimelineSupplication | undefined {
  return supplicationsById[id];
}

export const dayTimelinePrimaryBySlot: Record<DayTimelineSlotId, string> = {
  fajr: 'morning-remembrance',
  dhuhr: 'master-istighfar',
  asr: 'evening-remembrance',
  maghrib: 'victory-tahlil',
  isha: 'before-sleep',
  night: 'tahajjud-opening',
};

/** Auto-selected supplication id from clock time (follows the day). */
export function dayTimelineAutoSupplicationId(now: Date): string {
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (minutes >= 22 * 60 || minutes < 4 * 60) {
    return minutes >= 2 * 60 && minutes < 4 * 60 ? 'tahajjud-opening' : 'last-two-ayahs';
  }
  if (minutes < 6 * 60) return 'morning-remembrance';
  if (minutes < 9 * 60) return 'master-istighfar';
  if (minutes < 12 * 60) return 'comprehensive-tasbih';
  if (minutes < 15 * 60) return 'glory-and-praise';
  if (minutes < 18 * 60) return 'evening-remembrance';
  if (minutes < 20 * 60) return 'victory-tahlil';
  if (minutes < 21 * 60) return 'after-prayer-praise';
  return 'before-sleep';
}

export function dayTimelineActiveSlot(now: Date): DayTimelineSlotId {
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (minutes >= 22 * 60 || minutes < 4 * 60) return 'night';
  if (minutes < 6 * 60) return 'fajr';
  if (minutes < 15 * 60) return 'dhuhr';
  if (minutes < 18 * 60) return 'asr';
  if (minutes < 20 * 60) return 'maghrib';
  return 'isha';
}

/** 0 at 4:00, 1 at 22:00 — for the day progress bar. */
export function dayTimelineProgress(now: Date): number {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const start = 4 * 60;
  const end = 22 * 60;
  const adjusted = minutes < start ? minutes + 24 * 60 : minutes;
  return Math.min(1, Math.max(0, (adjusted - start) / (end - start)));
}

export function dayTimelineReferenceShort(reference?: string): string {
  if (!reference) return '';
  const match = reference.match(/(\d+[a-z]?)$/i);
  return match?.[1] ?? reference;
}

export function dayTimelineSkyPhase(slot: DayTimelineSlotId): 'dawn' | 'day' | 'afternoon' | 'sunset' | 'night' {
  if (slot === 'fajr') return 'dawn';
  if (slot === 'dhuhr') return 'day';
  if (slot === 'asr') return 'afternoon';
  if (slot === 'maghrib') return 'sunset';
  return 'night';
}
