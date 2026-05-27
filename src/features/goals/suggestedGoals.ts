import { buildGoalDays, buildDhulHijjahDays, presetGoals } from '@/src/data/presetGoals';
import { GoalPlan } from '@/src/types/misbaha';

/** Presets plus extra plans surfaced in Suggested goals. */
export const suggestableGoals: GoalPlan[] = [
  ...presetGoals,
  {
    id: 'suggest-rabbana-week',
    title: 'Rabbana Week',
    description: 'Seven days weaving Quranic Rabbana duas into your dhikr.',
    duration: 7,
    days: buildGoalDays(7, 6),
    createdAt: 0,
  },
  {
    id: 'suggest-morning-adhkar',
    title: 'Morning Adhkar',
    description: 'Ten days of morning and evening remembrances.',
    duration: 10,
    days: buildGoalDays(10, 8),
    createdAt: 0,
  },
  {
    id: 'suggest-salawat-sprint',
    title: 'Salawat Sprint',
    description: 'A focused week with salawat and tahleel.',
    duration: 7,
    days: buildGoalDays(7, 5),
    createdAt: 0,
  },
];

export function hasStartedTemplate(templateId: string, goals: GoalPlan[]): boolean {
  return goals.some(
    (goal) =>
      Boolean(goal.startedAt) &&
      (goal.id === templateId || goal.id.startsWith(`${templateId}-`)),
  );
}

/** Up to `limit` templates the user has never started. */
export function pickSuggestedGoals(goals: GoalPlan[], limit = 4): GoalPlan[] {
  return suggestableGoals
    .filter((template) => !hasStartedTemplate(template.id, goals))
    .slice(0, limit);
}

/** Started plans and custom goals — not idle preset templates. */
export function isActiveGoal(goal: GoalPlan, progress: Record<number, number> = {}): boolean {
  if (goal.preset && !goal.startedAt) {
    return Object.keys(progress).length > 0;
  }
  return true;
}
