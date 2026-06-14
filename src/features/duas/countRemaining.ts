/** Units still needed to reach a counting target. */
export function remainingCount(progress: number, target: number): number {
  return Math.max(0, target - progress);
}

export function progressPercent(progress: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, (progress / target) * 100);
}
