import { GoalDay, GoalPlan } from '@/src/types/misbaha';

const rotations = [
  'fajr-subhanallah',
  'fajr-alhamdulillah',
  'dhuhr-allahuakbar',
  'asr-la-ilaha',
  'maghrib-astaghfirullah',
  'isha-salat-nabi',
  'rabbana-atina',
  'rabbi-zidni',
  'morning-hasbiyallah',
  'night-bismika',
];

export function buildGoalDays(duration: number, offset = 0) {
  return Array.from({ length: duration }, (_, index) => {
    const duaId = rotations[(index + offset) % rotations.length];
    const target = duaId.includes('la-ilaha') || duaId.includes('astaghfirullah') ? 100 : 33;
    return { day: index + 1, duaId, target };
  });
}

/** First ten days of Dhul Hijjah — tasbeeh, tahmeed, takbeer, tahlil, and duas. */
export function buildDhulHijjahDays(): GoalDay[] {
  return [
    { day: 1, duaId: 'fajr-subhanallah', target: 100 },
    { day: 2, duaId: 'fajr-alhamdulillah', target: 100 },
    { day: 3, duaId: 'dhuhr-allahuakbar', target: 100 },
    { day: 4, duaId: 'asr-la-ilaha', target: 100 },
    { day: 5, duaId: 'maghrib-astaghfirullah', target: 100 },
    { day: 6, duaId: 'isha-salat-nabi', target: 100 },
    { day: 7, duaId: 'morning-sayyidul-istighfar', target: 1 },
    { day: 8, duaId: 'rabbana-atina', target: 1 },
    { day: 9, duaId: 'asr-la-ilaha', target: 100 },
    { day: 10, duaId: 'rabbana-taqabbal-minna', target: 1 },
  ];
}

export const presetGoals: GoalPlan[] = [
  {
    id: 'preset-tasbih-fatimah',
    title: 'Tasbih Fatimah',
    description: 'A week of the nightly remembrance taught to Fatimah.',
    duration: 7,
    days: buildGoalDays(7),
    createdAt: 0,
    preset: true,
  },
  {
    id: 'preset-repentance',
    title: 'Path of Repentance',
    description: 'Ten days centered on istighfar, tahlil, and Quranic duas.',
    duration: 10,
    days: buildGoalDays(10, 4),
    createdAt: 0,
    preset: true,
  },
  {
    id: 'preset-dhul-hijjah',
    title: 'First Ten Days of Dhul Hijjah',
    description:
      'The blessed first ten days: tasbeeh, tahmeed, takbeer, tahlil, istighfar, salawat, and Quranic duas — culminating on the Day of Arafah.',
    duration: 10,
    days: buildDhulHijjahDays(),
    createdAt: 0,
    preset: true,
  },
  {
    id: 'preset-garden',
    title: 'The Garden',
    description: 'Thirty days of varied tasbeeh, salawat, and Rabbana duas.',
    duration: 30,
    days: buildGoalDays(30, 2),
    createdAt: 0,
    preset: true,
  },
];

export function suggestGoal(duration: number): GoalPlan {
  const offset = Math.floor(Math.random() * rotations.length);
  return {
    id: `suggested-${duration}-${Date.now()}`,
    title: `${duration}-Day Garden`,
    description: 'A randomized plan with a different remembrance every day.',
    duration,
    days: buildGoalDays(duration, offset),
    createdAt: Date.now(),
  };
}

export function buildRandomSurpriseGoal(): GoalPlan {
  const duration = Math.floor(Math.random() * 30) + 1;
  const offset = Math.floor(Math.random() * rotations.length);
  return {
    id: `custom-${Date.now()}`,
    title: `${duration}-Day Surprise`,
    description: 'A suggested plan with a different tasbeeh each day.',
    duration,
    days: buildGoalDays(duration, offset),
    createdAt: Date.now(),
  };
}
