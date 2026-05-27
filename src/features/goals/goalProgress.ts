import { duasById } from '@/src/data/duas';
import { DuaRecord, GoalDay, GoalPlan } from '@/src/types/misbaha';

export type GoalTodayState = {
  completed: number;
  today: GoalDay | null;
  todayDua: DuaRecord | undefined;
  todayProgress: number;
};

export function getGoalTodayState(goal: GoalPlan, progress: Record<number, number>): GoalTodayState {
  if (goal.days.length === 0) {
    return { completed: 0, today: null, todayDua: undefined, todayProgress: 0 };
  }

  const completed = goal.days.filter((day) => (progress[day.day] ?? 0) >= day.target).length;
  const today = goal.days[Math.min(goal.days.length - 1, completed)];
  return {
    completed,
    today,
    todayDua: duasById[today.duaId],
    todayProgress: progress[today.day] ?? 0,
  };
}
