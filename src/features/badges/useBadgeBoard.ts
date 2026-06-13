import { useMemo } from 'react';

import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { BadgeBoard, buildBadgeBoard, computeBadgeMetrics } from './badgeProgress';

export function useBadgeBoard(): BadgeBoard {
  const counts = useMisbahaStore((state) => state.counts);
  const dailyCounts = useMisbahaStore((state) => state.dailyCounts);
  const goals = useMisbahaStore((state) => state.goals);
  const goalProgress = useMisbahaStore((state) => state.goalProgress);

  return useMemo(
    () => buildBadgeBoard(computeBadgeMetrics({ counts, dailyCounts, goals, goalProgress })),
    [counts, dailyCounts, goals, goalProgress],
  );
}
