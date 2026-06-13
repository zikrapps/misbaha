import {
  BADGE_SET_SIZE,
  BADGE_TIERS,
  badgeEffort,
  badgeFamilies,
  badges,
  badgesById,
  badgeSet,
  TASBEEH_CYCLE,
  TOTAL_BADGES,
} from '@/src/data/badges';
import { duas } from '@/src/data/duas';
import {
  BadgeMetrics,
  bestStreak,
  buildBadgeBoard,
  computeBadgeMetrics,
  isBadgeEarned,
} from '@/src/features/badges/badgeProgress';
import { badgeDescription, badgeName } from '@/src/i18n/badgeText';
import { GoalPlan } from '@/src/types/misbaha';

const emptyMetrics: BadgeMetrics = {
  tasbeehs: 0,
  bestDay: 0,
  activeDays: 0,
  bestStreak: 0,
  goalsCompleted: 0,
  goalDays: 0,
  morningDays: 0,
  eveningDays: 0,
  lifetime: 0,
  distinctDuas: 0,
};

const maxedMetrics: BadgeMetrics = Object.fromEntries(
  Object.keys(emptyMetrics).map((metric) => [metric, Number.MAX_SAFE_INTEGER]),
) as BadgeMetrics;

const emptyInput = { counts: {}, dailyCounts: {}, goals: [], goalProgress: {} };

/** Metrics tuned to just earn the first `count` badges in reveal order. */
function metricsForPrefix(count: number): BadgeMetrics {
  const metrics = { ...emptyMetrics };
  badges.slice(0, count).forEach((badge) => {
    metrics[badge.metric] = Math.max(metrics[badge.metric], badge.threshold);
  });
  return metrics;
}

describe('badge definitions', () => {
  it('defines 200 unique badges across 10 families and 20 tiers', () => {
    expect(badges).toHaveLength(TOTAL_BADGES);
    expect(TOTAL_BADGES).toBe(200);
    expect(new Set(badges.map((badge) => badge.id)).size).toBe(TOTAL_BADGES);
    expect(badgeFamilies).toHaveLength(BADGE_SET_SIZE);
    expect(Object.keys(badgesById)).toHaveLength(TOTAL_BADGES);
  });

  it('orders badges by non-decreasing difficulty', () => {
    for (let i = 1; i < badges.length; i += 1) {
      expect(badges[i].effort).toBeGreaterThanOrEqual(badges[i - 1].effort);
    }
  });

  it('keeps each family tiers in ascending reveal order', () => {
    for (const family of badgeFamilies) {
      const tiers = badges.filter((badge) => badge.family === family.id).map((badge) => badge.tier);
      expect(tiers).toEqual([...tiers].sort((a, b) => a - b));
    }
  });

  it('uses strictly increasing thresholds within every family', () => {
    for (const family of badgeFamilies) {
      expect(family.thresholds).toHaveLength(BADGE_TIERS);
      for (let i = 1; i < family.thresholds.length; i += 1) {
        expect(family.thresholds[i]).toBeGreaterThan(family.thresholds[i - 1]);
      }
    }
  });

  it('keeps the explorer thresholds within the dua library size', () => {
    const compass = badgeFamilies.find((family) => family.id === 'compass')!;
    expect(Math.max(...compass.thresholds)).toBeLessThanOrEqual(duas.length);
  });

  it('scales effort by metric weight', () => {
    expect(badgeEffort('lifetime', 1000)).toBe(1000);
    expect(badgeEffort('tasbeehs', 3)).toBe(99);
    expect(badgeEffort('goalsCompleted', 2)).toBeGreaterThan(badgeEffort('lifetime', 2));
  });

  it('clamps badgeSet to the valid range', () => {
    expect(badgeSet(-3)).toEqual(badges.slice(0, BADGE_SET_SIZE));
    expect(badgeSet(99)).toEqual(badges.slice((BADGE_TIERS - 1) * BADGE_SET_SIZE));
  });
});

describe('bestStreak', () => {
  it('counts consecutive days across month boundaries and ignores gaps', () => {
    expect(bestStreak([])).toBe(0);
    expect(bestStreak(['2026-06-10'])).toBe(1);
    expect(bestStreak(['2026-05-30', '2026-05-31', '2026-06-01', '2026-06-05', '2026-06-06'])).toBe(3);
    expect(bestStreak(['bad-date', '2026-06-01'])).toBe(1);
  });
});

describe('computeBadgeMetrics', () => {
  it('returns zeroed metrics for an empty store', () => {
    expect(computeBadgeMetrics(emptyInput)).toEqual(emptyMetrics);
  });

  it('derives counting metrics from counts and dailyCounts', () => {
    const morningDua = duas.find((dua) => dua.category === 'morning')!;
    const nightDua = duas.find((dua) => dua.category === 'night')!;
    const metrics = computeBadgeMetrics({
      counts: { [morningDua.id]: 66, [nightDua.id]: 40, other: 0 },
      dailyCounts: {
        '2026-06-01': { [morningDua.id]: 66 },
        '2026-06-02': { [nightDua.id]: 40 },
        '2026-06-04': { unrelated: 0 },
      },
      goals: [],
      goalProgress: {},
    });

    expect(metrics.lifetime).toBe(106);
    expect(metrics.tasbeehs).toBe(Math.floor(106 / TASBEEH_CYCLE));
    expect(metrics.bestDay).toBe(66);
    expect(metrics.activeDays).toBe(2);
    expect(metrics.bestStreak).toBe(2);
    expect(metrics.morningDays).toBe(1);
    expect(metrics.eveningDays).toBe(1);
    expect(metrics.distinctDuas).toBe(2);
  });

  it('derives goal metrics, including the built-in daily goal, and skips unknown or empty goals', () => {
    const goal: GoalPlan = {
      id: 'custom-goal',
      title: 'Custom',
      description: '',
      duration: 3,
      days: [
        { day: 1, duaId: 'a', target: 10 },
        { day: 2, duaId: 'a', target: 10 },
        { day: 3, duaId: 'a', target: 10 },
      ],
      createdAt: 0,
    };
    const emptyGoal: GoalPlan = { id: 'empty-goal', title: 'Empty', description: '', duration: 0, days: [], createdAt: 0 };
    const metrics = computeBadgeMetrics({
      counts: {},
      dailyCounts: {},
      goals: [goal, emptyGoal],
      goalProgress: {
        // Day 3 has no entry, exercising the missing-progress fallback.
        'custom-goal': { 1: 10, 2: 12 },
        'empty-goal': { 1: 5 },
        'daily-goal': { 1: 33 },
        'deleted-goal': { 1: 99 },
      },
    });

    expect(metrics.goalDays).toBe(3);
    expect(metrics.goalsCompleted).toBe(1);
  });

  it('ignores days where a category dua was only reset to zero', () => {
    const morningDua = duas.find((dua) => dua.category === 'morning')!;
    const metrics = computeBadgeMetrics({
      counts: {},
      dailyCounts: { '2026-06-01': { [morningDua.id]: 0 } },
      goals: [],
      goalProgress: {},
    });
    expect(metrics.morningDays).toBe(0);
    expect(metrics.activeDays).toBe(0);
  });
});

describe('buildBadgeBoard', () => {
  it('shows the first set with nothing earned initially', () => {
    const board = buildBadgeBoard(emptyMetrics);
    expect(board.earnedCount).toBe(0);
    expect(board.earnedIds).toEqual([]);
    expect(board.visibleSetIndex).toBe(0);
    expect(board.visibleBadges).toEqual(badges.slice(0, BADGE_SET_SIZE));
    expect(board.latestEarned).toEqual([]);
  });

  it('counts earned badges without revealing the next set early', () => {
    const board = buildBadgeBoard(metricsForPrefix(4));
    expect(board.earnedCount).toBeGreaterThanOrEqual(4);
    expect(board.visibleSetIndex).toBe(0);
  });

  it('reveals the next set once the first ten are earned', () => {
    const board = buildBadgeBoard(metricsForPrefix(BADGE_SET_SIZE));
    expect(board.earnedCount).toBeGreaterThanOrEqual(BADGE_SET_SIZE);
    expect(board.visibleSetIndex).toBeGreaterThanOrEqual(1);
    expect(board.earned.slice(0, BADGE_SET_SIZE).every(Boolean)).toBe(true);
  });

  it('stays on the final set when everything is earned', () => {
    const board = buildBadgeBoard(maxedMetrics);
    expect(board.earnedCount).toBe(TOTAL_BADGES);
    expect(board.earnedIds).toHaveLength(TOTAL_BADGES);
    expect(board.visibleSetIndex).toBe(BADGE_TIERS - 1);
    expect(board.latestEarned).toHaveLength(3);
    expect(board.latestEarned[0].id).toBe(badges[TOTAL_BADGES - 1].id);
  });

  it('flags badges as earned only at or above their threshold', () => {
    const bead1 = badgesById['bead-1'];
    expect(isBadgeEarned(bead1, emptyMetrics)).toBe(false);
    expect(isBadgeEarned(bead1, { ...emptyMetrics, tasbeehs: 1 })).toBe(true);
  });
});

describe('badge text', () => {
  it('names each badge by its unique emblem', () => {
    expect(badgeName(badgesById['bead-1'])).toBe('First bead');
    expect(badgeName(badgesById['bead-2'])).toBe('Three beads');
    expect(badgeName(badgesById['plant-1'])).toBe('Gardener');
    expect(badgeName(badgesById['lantern-1'])).toBe('Night lantern');
  });

  it('gives every family twenty distinct emblem names', () => {
    for (const family of badgeFamilies) {
      const names = badges.filter((badge) => badge.family === family.id).map((badge) => badgeName(badge));
      expect(new Set(names).size).toBe(BADGE_TIERS);
    }
  });

  it('describes every badge in both languages', () => {
    for (const badge of badges) {
      expect(badgeDescription(badge, 'en')).toBeTruthy();
      expect(badgeDescription(badge, 'ur')).toBeTruthy();
    }
    expect(badgeDescription(badgesById['bead-1'], 'en')).toBe('Complete your first tasbeeh');
    expect(badgeDescription(badgesById['fruit-1'], 'en')).toBe('Complete your first goal');
    expect(badgeDescription(badgesById['bead-1'], 'ur')).toBe('اپنی پہلی تسبیح مکمل کریں');
  });
});
