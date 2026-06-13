/** Daily dhikr target shown on the garden growth card (matches tree-plant threshold). */
export const DAILY_DHIKR_GOAL = 100;

export function dailyGoalProgress(todayTotal: number): number {
  return Math.min(100, Math.round((todayTotal / DAILY_DHIKR_GOAL) * 100));
}
