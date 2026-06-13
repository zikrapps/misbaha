import { duas, duasById } from '@/src/data/duas';
import { GoalDay, GoalLibraryCategoryId, GoalPlan } from '@/src/types/misbaha';

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || 1;
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const pool = [...items];
  let state = seed >>> 0;
  for (let i = pool.length - 1; i > 0; i -= 1) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/** Deterministic per-goal shuffle of duas/tasbeehs from the full catalog. */
export function buildSeededGoalDays(duration: number, seedKey: string): GoalDay[] {
  const shuffled = seededShuffle(
    duas.map((dua) => dua.id),
    hashSeed(seedKey),
  );
  return Array.from({ length: duration }, (_, index) => {
    const duaId = shuffled[index];
    const dua = duasById[duaId];
    return { day: index + 1, duaId, target: dua?.target ?? 33 };
  });
}

type GoalTemplate = {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: string;
  category: GoalLibraryCategoryId;
};

function buildTemplate(template: GoalTemplate): GoalPlan {
  return {
    id: template.id,
    title: template.title,
    description: template.description,
    duration: template.duration,
    icon: template.icon,
    libraryCategory: template.category,
    days: buildSeededGoalDays(template.duration, template.id),
    createdAt: 0,
    preset: true,
  };
}

const oneDayTemplates: GoalTemplate[] = [
  { id: 'lib-1d-fajr-dhikr', title: 'Fajr Dhikr Day', description: 'One day of morning tasbeeh and opening duas.', duration: 1, icon: 'gl-sunrise', category: 'oneDay' },
  { id: 'lib-1d-evening-wrap', title: 'Evening Wrap', description: 'One day of night adhkar before sleep.', duration: 1, icon: 'gl-moon', category: 'oneDay' },
  { id: 'lib-1d-salawat', title: 'Salawat Day', description: 'One day focused on blessings upon the Prophet.', duration: 1, icon: 'gl-beads', category: 'oneDay' },
  { id: 'lib-1d-subhanallah', title: 'SubhanAllah Century', description: 'One day of glorification dhikr.', duration: 1, icon: 'gl-tasbih', category: 'oneDay' },
  { id: 'lib-1d-rabbana', title: 'Rabbana Day', description: 'One day centered on a Quranic supplication.', duration: 1, icon: 'gl-scroll', category: 'oneDay' },
  { id: 'lib-1d-morning-adhkar', title: 'Morning Adhkar', description: 'One day of morning remembrances.', duration: 1, icon: 'gl-dawn', category: 'oneDay' },
  { id: 'lib-1d-istighfar', title: 'Istighfar Intensive', description: 'One day of seeking forgiveness.', duration: 1, icon: 'gl-drop', category: 'oneDay' },
  { id: 'lib-1d-heart', title: 'Heart Renewal', description: 'One day of heart-softening duas.', duration: 1, icon: 'gl-heart', category: 'oneDay' },
  { id: 'lib-1d-relief', title: 'Relief & Patience', description: 'One day of duas for ease and steadfastness.', duration: 1, icon: 'gl-shield', category: 'oneDay' },
  { id: 'lib-1d-complete', title: 'Complete Dhikr Day', description: 'One day weaving tasbeeh, salawat, and duas.', duration: 1, icon: 'gl-star', category: 'oneDay' },
];

const weeklyTemplates: GoalTemplate[] = [
  { id: 'lib-7d-fatimah', title: 'Tasbih Fatimah Week', description: 'Seven nights of the remembrance taught to Fatimah.', duration: 7, icon: 'gl-seed', category: 'weekly' },
  { id: 'lib-7d-rabbana', title: 'Rabbana Week', description: 'Seven days weaving Quranic Rabbana duas.', duration: 7, icon: 'gl-book', category: 'weekly' },
  { id: 'lib-7d-morning', title: 'Morning & Evening Week', description: 'Seven days of morning and night adhkar.', duration: 7, icon: 'gl-lantern', category: 'weekly' },
  { id: 'lib-7d-salawat', title: 'Salawat Sprint', description: 'Seven days of salawat and tahleel.', duration: 7, icon: 'gl-dove', category: 'weekly' },
  { id: 'lib-7d-repentance', title: 'Path of Repentance', description: 'Seven days of istighfar and tahlil.', duration: 7, icon: 'gl-flame', category: 'weekly' },
  { id: 'lib-7d-prayer', title: 'Prayer Adhkar Week', description: 'Seven days of salah-related remembrances.', duration: 7, icon: 'gl-prayer', category: 'weekly' },
  { id: 'lib-7d-relief', title: 'Relief Week', description: 'Seven days of duas for hardship and worry.', duration: 7, icon: 'gl-cloud', category: 'weekly' },
  { id: 'lib-7d-heart', title: 'Heart Week', description: 'Seven days of heart-purifying supplications.', duration: 7, icon: 'gl-hand', category: 'weekly' },
  { id: 'lib-7d-names', title: 'Names & Qualities', description: 'Seven days of tasbeeh celebrating divine names.', duration: 7, icon: 'gl-gem', category: 'weekly' },
  { id: 'lib-7d-garden', title: 'Garden Week', description: 'Seven days sampling varied dhikr across the app.', duration: 7, icon: 'gl-tree', category: 'weekly' },
];

const thirtyDayTemplates: GoalTemplate[] = [
  { id: 'lib-30d-garden', title: 'The Garden', description: 'Thirty days of varied tasbeeh, salawat, and Rabbana duas.', duration: 30, icon: 'gl-sprout', category: 'thirtyDay' },
  { id: 'lib-30d-rabbana', title: 'Rabbana Month', description: 'Thirty days rotating Quranic supplications.', duration: 30, icon: 'gl-wind', category: 'thirtyDay' },
  { id: 'lib-30d-morning', title: 'Morning Adhkar Month', description: 'Thirty days of morning and evening remembrances.', duration: 30, icon: 'gl-wave', category: 'thirtyDay' },
  { id: 'lib-30d-istighfar', title: 'Istighfar Month', description: 'Thirty days centered on seeking forgiveness.', duration: 30, icon: 'gl-mount', category: 'thirtyDay' },
  { id: 'lib-30d-salawat', title: 'Salawat Month', description: 'Thirty days of blessings upon the Prophet.', duration: 30, icon: 'gl-key', category: 'thirtyDay' },
  { id: 'lib-30d-heart', title: 'Heart Purification', description: 'Thirty days of heart-softening duas.', duration: 30, icon: 'gl-ring', category: 'thirtyDay' },
  { id: 'lib-30d-relief', title: 'Relief & Tawakkul', description: 'Thirty days of duas for ease and trust.', duration: 30, icon: 'gl-compass', category: 'thirtyDay' },
  { id: 'lib-30d-quranic', title: 'Quranic Supplications', description: 'Thirty days of Rabbana and Quranic duas.', duration: 30, icon: 'gl-crown', category: 'thirtyDay' },
  { id: 'lib-30d-prayer', title: 'Prayer Remembrance', description: 'Thirty days of salah adhkar and between-sujood duas.', duration: 30, icon: 'gl-home', category: 'thirtyDay' },
  { id: 'lib-30d-complete', title: 'Complete Adhkar Month', description: 'Thirty days across every category in the app.', duration: 30, icon: 'gl-path', category: 'thirtyDay' },
];

const ayyamBeedTemplates: GoalTemplate[] = [
  { id: 'lib-beed-tasbih', title: 'White Days Tasbih', description: 'Three days of tasbeeh, tahmeed, takbeer, and tahlil.', duration: 3, icon: 'gl-crescent', category: 'ayyamBeed' },
  { id: 'lib-beed-istighfar', title: 'White Days Istighfar', description: 'Three days of istighfar and salawat.', duration: 3, icon: 'gl-gift', category: 'ayyamBeed' },
  { id: 'lib-beed-quranic', title: 'White Days Quranic', description: 'Three days of Rabbana and Quranic duas.', duration: 3, icon: 'gl-hourglass', category: 'ayyamBeed' },
  { id: 'lib-beed-gratitude', title: 'White Days Gratitude', description: 'Three days of praise, shukr, and tahmeed.', duration: 3, icon: 'gl-arch', category: 'ayyamBeed' },
  { id: 'lib-beed-complete', title: 'White Days Complete', description: 'Three days weaving the full remembrance spectrum.', duration: 3, icon: 'gl-minaret', category: 'ayyamBeed' },
];

const newMoonTemplates: GoalTemplate[] = [
  { id: 'lib-moon-muharram', title: 'Muharram Hilal', description: 'New moon of Muharram — a day of renewed intention.', duration: 1, icon: 'gl-muharram', category: 'newMoon' },
  { id: 'lib-moon-safar', title: 'Safar Hilal', description: 'New moon of Safar — fresh start in dhikr.', duration: 1, icon: 'gl-safar', category: 'newMoon' },
  { id: 'lib-moon-rabi1', title: 'Rabi al-Awwal Hilal', description: 'New moon of Rabi al-Awwal — salawat and gratitude.', duration: 1, icon: 'gl-rabi1', category: 'newMoon' },
  { id: 'lib-moon-rabi2', title: 'Rabi al-Thani Hilal', description: 'New moon of Rabi al-Thani — steady remembrance.', duration: 1, icon: 'gl-rabi2', category: 'newMoon' },
  { id: 'lib-moon-jumada1', title: 'Jumada al-Ula Hilal', description: 'New moon of Jumada al-Ula — patience and praise.', duration: 1, icon: 'gl-jumada1', category: 'newMoon' },
  { id: 'lib-moon-jumada2', title: 'Jumada al-Akhirah Hilal', description: 'New moon of Jumada al-Akhirah — heart-focused duas.', duration: 1, icon: 'gl-jumada2', category: 'newMoon' },
  { id: 'lib-moon-rajab', title: 'Rajab Hilal', description: 'New moon of Rajab — seeking forgiveness and nearness.', duration: 1, icon: 'gl-rajab', category: 'newMoon' },
  { id: 'lib-moon-shaban', title: 'Shaban Hilal', description: 'New moon of Shaban — preparation through dhikr.', duration: 1, icon: 'gl-shaban', category: 'newMoon' },
  { id: 'lib-moon-ramadan', title: 'Ramadan Hilal', description: 'New moon of Ramadan — opening the blessed month.', duration: 1, icon: 'gl-ramadan', category: 'newMoon' },
  { id: 'lib-moon-shawwal', title: 'Shawwal Hilal', description: 'New moon of Shawwal — gratitude and continuity.', duration: 1, icon: 'gl-shawwal', category: 'newMoon' },
  { id: 'lib-moon-dhul-qadah', title: 'Dhul Qadah Hilal', description: 'New moon of Dhul Qadah — calm, consistent dhikr.', duration: 1, icon: 'gl-dhul-qadah', category: 'newMoon' },
  { id: 'lib-moon-dhul-hijjah', title: 'Dhul Hijjah Hilal', description: 'New moon of Dhul Hijjah — sacred days begin.', duration: 1, icon: 'gl-dhul-hijjah', category: 'newMoon' },
];

export const goalLibraryCategories: {
  id: GoalLibraryCategoryId;
  goals: GoalPlan[];
}[] = [
  { id: 'oneDay', goals: oneDayTemplates.map(buildTemplate) },
  { id: 'weekly', goals: weeklyTemplates.map(buildTemplate) },
  { id: 'thirtyDay', goals: thirtyDayTemplates.map(buildTemplate) },
  { id: 'ayyamBeed', goals: ayyamBeedTemplates.map(buildTemplate) },
  { id: 'newMoon', goals: newMoonTemplates.map(buildTemplate) },
];

export const goalLibraryGoals: GoalPlan[] = goalLibraryCategories.flatMap((section) => section.goals);
