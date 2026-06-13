import { dailyGoal } from '@/src/data/dailyGoal';
import {
  BADGE_SET_SIZE,
  BADGE_TIERS,
  BadgeDef,
  BadgeMetric,
  badges,
  badgeSet,
  TASBEEH_CYCLE,
} from '@/src/data/badges';
import { duas } from '@/src/data/duas';
import { GoalPlan, GoalProgress } from '@/src/types/misbaha';
import { sumRecordValues } from '@/src/utils/sumRecord';

export type BadgeMetrics = Record<BadgeMetric, number>;

export type BadgeProgressInput = {
  counts: Record<string, number>;
  dailyCounts: Record<string, Record<string, number>>;
  goals: GoalPlan[];
  goalProgress: GoalProgress;
};

const morningDuaIds = new Set(duas.filter((dua) => dua.category === 'morning').map((dua) => dua.id));
const nightDuaIds = new Set(duas.filter((dua) => dua.category === 'night').map((dua) => dua.id));

const DAY_MS = 86_400_000;

function activeDayKeys(dailyCounts: BadgeProgressInput['dailyCounts']): string[] {
  return Object.keys(dailyCounts).filter((day) => Object.values(dailyCounts[day]).some((value) => value > 0));
}

export function bestStreak(days: string[]): number {
  const stamps = days
    .map((day) => Date.parse(`${day}T00:00:00Z`))
    .filter((stamp) => Number.isFinite(stamp))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let previous: number | undefined;
  for (const stamp of stamps) {
    run = previous !== undefined && stamp - previous === DAY_MS ? run + 1 : 1;
    previous = stamp;
    best = Math.max(best, run);
  }
  return best;
}

function goalById(goalId: string, goals: GoalPlan[]): GoalPlan | undefined {
  if (goalId === dailyGoal.id) return dailyGoal;
  return goals.find((goal) => goal.id === goalId);
}

function daysWithCategory(dailyCounts: BadgeProgressInput['dailyCounts'], duaIds: Set<string>): number {
  return Object.values(dailyCounts).filter((day) =>
    Object.entries(day).some(([duaId, count]) => count > 0 && duaIds.has(duaId)),
  ).length;
}

export function computeBadgeMetrics(input: BadgeProgressInput): BadgeMetrics {
  const lifetime = sumRecordValues(input.counts);
  const activeDays = activeDayKeys(input.dailyCounts);
  const dayTotals = activeDays.map((day) => sumRecordValues(input.dailyCounts[day]));

  let goalsCompleted = 0;
  let goalDays = 0;
  for (const [goalId, progress] of Object.entries(input.goalProgress)) {
    const goal = goalById(goalId, input.goals);
    if (!goal || goal.days.length === 0) continue;
    const doneDays = goal.days.filter((day) => (progress[day.day] ?? 0) >= day.target).length;
    goalDays += doneDays;
    if (doneDays === goal.days.length) goalsCompleted += 1;
  }

  return {
    lifetime,
    tasbeehs: Math.floor(lifetime / TASBEEH_CYCLE),
    bestDay: dayTotals.reduce((max, total) => Math.max(max, total), 0),
    activeDays: activeDays.length,
    bestStreak: bestStreak(activeDays),
    goalsCompleted,
    goalDays,
    morningDays: daysWithCategory(input.dailyCounts, morningDuaIds),
    eveningDays: daysWithCategory(input.dailyCounts, nightDuaIds),
    distinctDuas: Object.values(input.counts).filter((count) => count > 0).length,
  };
}

export function isBadgeEarned(badge: BadgeDef, metrics: BadgeMetrics): boolean {
  return metrics[badge.metric] >= badge.threshold;
}

export type BadgeBoard = {
  /** Earned flags in badge reveal order (difficulty-sorted). */
  earned: boolean[];
  earnedCount: number;
  /** Ids of earned badges, in reveal order. */
  earnedIds: string[];
  /** Index of the set currently on display (first set with an unearned badge). */
  visibleSetIndex: number;
  visibleBadges: BadgeDef[];
  /** Most recently reached badges (hardest earned first). */
  latestEarned: BadgeDef[];
};

export function buildBadgeBoard(metrics: BadgeMetrics, latestCount = 3): BadgeBoard {
  const earned = badges.map((badge) => isBadgeEarned(badge, metrics));
  const earnedBadges = badges.filter((_, index) => earned[index]);
  const firstUnearned = earned.indexOf(false);
  const visibleSetIndex =
    firstUnearned === -1 ? BADGE_TIERS - 1 : Math.floor(firstUnearned / BADGE_SET_SIZE);

  return {
    earned,
    earnedCount: earnedBadges.length,
    earnedIds: earnedBadges.map((badge) => badge.id),
    visibleSetIndex,
    visibleBadges: badgeSet(visibleSetIndex),
    latestEarned: earnedBadges.slice(-latestCount).reverse(),
  };
}
