import { GoalPlan } from '@/src/types/misbaha';

/** Built-in single-day focus goal (not stored in presetGoals). */
export const dailyGoal: GoalPlan = {
  id: 'daily-goal',
  title: 'Daily Tasbeeh',
  description: 'A daily focus goal for completing Subhan Allah today.',
  duration: 7,
  days: [{ day: 1, duaId: 'fajr-subhanallah', target: 33 }],
  createdAt: 0,
};
