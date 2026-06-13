export type BadgeFamilyId =
  | 'bead'
  | 'praise'
  | 'rays'
  | 'moon'
  | 'fruit'
  | 'plant'
  | 'dawn'
  | 'lantern'
  | 'burst'
  | 'compass';

export type BadgePaletteId = 'olive' | 'gold' | 'night' | 'rose' | 'teal';

export type BadgeMetric =
  | 'tasbeehs'
  | 'bestDay'
  | 'activeDays'
  | 'bestStreak'
  | 'goalsCompleted'
  | 'goalDays'
  | 'morningDays'
  | 'eveningDays'
  | 'lifetime'
  | 'distinctDuas';

export type BadgeFamily = {
  id: BadgeFamilyId;
  palette: BadgePaletteId;
  metric: BadgeMetric;
  thresholds: number[];
};

export type BadgeDef = {
  id: string;
  family: BadgeFamilyId;
  palette: BadgePaletteId;
  metric: BadgeMetric;
  tier: number;
  threshold: number;
  /** Estimated effort, used to order the reveal sequence by difficulty. */
  effort: number;
};

export const BADGE_SET_SIZE = 10;
export const BADGE_TIERS = 20;
export const TOTAL_BADGES = BADGE_SET_SIZE * BADGE_TIERS;

// One tasbeeh = a full 33-count cycle.
export const TASBEEH_CYCLE = 33;

export const badgeFamilies: BadgeFamily[] = [
  {
    id: 'bead',
    palette: 'olive',
    metric: 'tasbeehs',
    thresholds: [1, 3, 7, 15, 30, 50, 75, 110, 150, 200, 260, 330, 410, 500, 640, 800, 1000, 1300, 1700, 2200],
  },
  {
    id: 'praise',
    palette: 'gold',
    metric: 'bestDay',
    thresholds: [100, 150, 200, 275, 375, 500, 650, 825, 1000, 1200, 1450, 1750, 2100, 2500, 3000, 3600, 4300, 5100, 6000, 7000],
  },
  {
    id: 'rays',
    palette: 'olive',
    metric: 'activeDays',
    thresholds: [7, 14, 21, 30, 45, 60, 80, 100, 125, 150, 180, 210, 240, 270, 300, 330, 365, 420, 480, 550],
  },
  {
    id: 'moon',
    palette: 'night',
    metric: 'bestStreak',
    thresholds: [3, 5, 7, 10, 14, 18, 22, 26, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 115, 130],
  },
  {
    id: 'fruit',
    palette: 'rose',
    metric: 'goalsCompleted',
    thresholds: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 22, 26, 30, 35, 40, 46, 52, 60, 70],
  },
  {
    id: 'plant',
    palette: 'olive',
    metric: 'goalDays',
    thresholds: [3, 7, 14, 21, 30, 45, 60, 80, 100, 125, 150, 180, 215, 255, 300, 350, 410, 480, 560, 650],
  },
  {
    id: 'dawn',
    palette: 'rose',
    metric: 'morningDays',
    thresholds: [5, 10, 15, 25, 40, 55, 70, 90, 110, 135, 160, 190, 220, 255, 290, 330, 370, 415, 465, 520],
  },
  {
    id: 'lantern',
    palette: 'night',
    metric: 'eveningDays',
    thresholds: [5, 10, 15, 25, 40, 55, 70, 90, 110, 135, 160, 190, 220, 255, 290, 330, 370, 415, 465, 520],
  },
  {
    id: 'burst',
    palette: 'gold',
    metric: 'lifetime',
    thresholds: [1000, 2500, 5000, 10000, 20000, 33000, 50000, 75000, 100000, 150000, 200000, 275000, 366000, 500000, 650000, 800000, 1000000, 1250000, 1500000, 2000000],
  },
  {
    id: 'compass',
    palette: 'teal',
    metric: 'distinctDuas',
    thresholds: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110],
  },
];

/**
 * Rough effort each metric unit costs, expressed in "counts-equivalent" so the
 * ten very different goals can be ranked on one difficulty scale. A tasbeeh is
 * 33 counts; a goal spans several days; a streak day is harder than a loose
 * active day; exploring a new dua is a breadth effort.
 */
const METRIC_EFFORT: Record<BadgeMetric, number> = {
  lifetime: 1,
  bestDay: 2,
  tasbeehs: 33,
  activeDays: 130,
  goalDays: 160,
  morningDays: 150,
  eveningDays: 150,
  distinctDuas: 220,
  bestStreak: 240,
  goalsCompleted: 650,
};

export function badgeEffort(metric: BadgeMetric, threshold: number): number {
  return threshold * METRIC_EFFORT[metric];
}

/**
 * All 200 badges sorted into reveal order by difficulty: set 1 holds the ten
 * easiest goals overall, set 2 the next ten, and so on. Thresholds rise within
 * each family, so a family's higher tiers always reveal after its lower ones.
 */
export const badges: BadgeDef[] = badgeFamilies
  .flatMap((family) =>
    family.thresholds.map((threshold, index) => ({
      id: `${family.id}-${index + 1}`,
      family: family.id,
      palette: family.palette,
      metric: family.metric,
      tier: index + 1,
      threshold,
      effort: badgeEffort(family.metric, threshold),
    })),
  )
  .sort((a, b) => a.effort - b.effort || a.family.localeCompare(b.family) || a.tier - b.tier);

export const badgesById: Record<string, BadgeDef> = Object.fromEntries(
  badges.map((badge) => [badge.id, badge]),
);

export function badgeSet(setIndex: number): BadgeDef[] {
  const safe = Math.min(BADGE_TIERS - 1, Math.max(0, setIndex));
  return badges.slice(safe * BADGE_SET_SIZE, (safe + 1) * BADGE_SET_SIZE);
}
