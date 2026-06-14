import { badges, TASBEEH_CYCLE } from '@/src/data/badges';
import { buildGoalDays, presetGoals } from '@/src/data/presetGoals';
import {
  BadgeMetrics,
  buildBadgeBoard,
  computeBadgeMetrics,
} from '@/src/features/badges/badgeProgress';
import { getGoalTodayState } from '@/src/features/goals/goalProgress';
import { todayKey } from '@/src/store/date';
import { CountEvent, GoalPlan, GoalProgress } from '@/src/types/misbaha';

export const E2E_SEED_BADGE_COUNT = 2;
/** Minimum dhikr-derived badges the seed must include (reveal order). */
export const E2E_SEED_REQUIRED_BADGE_IDS = ['bead-1', 'bead-2'] as const;
export const E2E_SEED_GOAL_COMPLETE_ID = 'e2e-seed-goal-complete';
export const E2E_SEED_GOAL_IN_PROGRESS_ID = 'e2e-seed-goal-in-progress';
export const E2E_SEED_COUNT_DUA_ID = 'fajr-subhanallah';

/** Fixed start date so seeded goal timelines stay reproducible across runs. */
export const E2E_SEED_GOAL_STARTED_AT = '2026-06-01';

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

/** Metrics tuned to earn the first `count` badges in reveal order. */
export function metricsForEarnedBadgeCount(count: number): BadgeMetrics {
  const metrics = { ...emptyMetrics };
  badges.slice(0, count).forEach((badge) => {
    metrics[badge.metric] = Math.max(metrics[badge.metric], badge.threshold);
  });
  return metrics;
}

/** Minimum lifetime count on one dua to satisfy the first N earned badges. */
export function lifetimeCountForEarnedBadgeCount(count: number): number {
  const required = metricsForEarnedBadgeCount(count);
  return Math.max(required.lifetime, required.tasbeehs * TASBEEH_CYCLE);
}

function buildCompleteGoal(): GoalPlan {
  return {
    id: E2E_SEED_GOAL_COMPLETE_ID,
    title: 'Tasbih Fatimah',
    description: 'E2E seed — fully completed seven-day plan.',
    duration: 7,
    days: buildGoalDays(7),
    createdAt: Date.parse(`${E2E_SEED_GOAL_STARTED_AT}T12:00:00Z`),
    startedAt: E2E_SEED_GOAL_STARTED_AT,
    preset: false,
  };
}

function buildInProgressGoal(): GoalPlan {
  return {
    id: E2E_SEED_GOAL_IN_PROGRESS_ID,
    title: 'Path of Repentance',
    description: 'E2E seed — three days complete, fourth day in progress.',
    duration: 10,
    days: buildGoalDays(10, 4),
    createdAt: Date.parse(`${E2E_SEED_GOAL_STARTED_AT}T12:00:00Z`),
    startedAt: E2E_SEED_GOAL_STARTED_AT,
    preset: false,
  };
}

function buildGoalProgress(completeGoal: GoalPlan, inProgressGoal: GoalPlan): GoalProgress {
  const completeProgress = Object.fromEntries(
    completeGoal.days.map((day) => [day.day, day.target]),
  ) as Record<number, number>;

  const inProgressProgress: Record<number, number> = {};
  inProgressGoal.days.forEach((day, index) => {
    if (index < 3) {
      inProgressProgress[day.day] = day.target;
      return;
    }
    if (index === 3) {
      inProgressProgress[day.day] = Math.max(1, Math.floor(day.target / 3));
    }
  });

  return {
    [completeGoal.id]: completeProgress,
    [inProgressGoal.id]: inProgressProgress,
  };
}

export type E2eTestSeedState = {
  counts: Record<string, number>;
  dailyCounts: Record<string, Record<string, number>>;
  events: CountEvent[];
  goals: GoalPlan[];
  goalProgress: GoalProgress;
};

/** Deterministic store slice: 2 badges, 1 completed goal, 1 in-progress goal. */
export function buildE2eTestSeed(date = todayKey()): E2eTestSeedState {
  const completeGoal = buildCompleteGoal();
  const inProgressGoal = buildInProgressGoal();
  const goalProgress = buildGoalProgress(completeGoal, inProgressGoal);
  const lifetime = lifetimeCountForEarnedBadgeCount(E2E_SEED_BADGE_COUNT);

  return {
    counts: { [E2E_SEED_COUNT_DUA_ID]: lifetime },
    dailyCounts: {
      [date]: { [E2E_SEED_COUNT_DUA_ID]: lifetime },
      [E2E_SEED_GOAL_STARTED_AT]: { [E2E_SEED_COUNT_DUA_ID]: lifetime },
    },
    events: [
      {
        id: 'e2e-seed-event',
        duaId: E2E_SEED_COUNT_DUA_ID,
        amount: lifetime,
        date,
        createdAt: Date.parse(`${date}T12:00:00Z`),
      },
    ],
    goals: [...presetGoals, completeGoal, inProgressGoal],
    goalProgress,
  };
}

export type E2eSeedValidation = {
  earnedBadgeCount: number;
  earnedBadgeIds: string[];
  goalsCompleted: number;
  completeGoalDaysDone: number;
  inProgressGoalDaysDone: number;
  inProgressGoalComplete: boolean;
};

/** Validates the seeded slice matches the DevLoop contract. */
export function validateE2eTestSeed(seed: E2eTestSeedState): E2eSeedValidation {
  const metrics = computeBadgeMetrics(seed);
  const board = buildBadgeBoard(metrics);
  const completeGoal = seed.goals.find((goal) => goal.id === E2E_SEED_GOAL_COMPLETE_ID)!;
  const inProgressGoal = seed.goals.find((goal) => goal.id === E2E_SEED_GOAL_IN_PROGRESS_ID)!;
  const completeState = getGoalTodayState(completeGoal, seed.goalProgress[completeGoal.id] ?? {});
  const inProgressState = getGoalTodayState(inProgressGoal, seed.goalProgress[inProgressGoal.id] ?? {});

  return {
    earnedBadgeCount: board.earnedCount,
    earnedBadgeIds: board.earnedIds,
    goalsCompleted: metrics.goalsCompleted,
    completeGoalDaysDone: completeState.completed,
    inProgressGoalDaysDone: inProgressState.completed,
    inProgressGoalComplete: inProgressState.completed === inProgressGoal.days.length,
  };
}
