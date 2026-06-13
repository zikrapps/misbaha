import { duasById } from '@/src/data/duas';

/**
 * Dhikr → walking-distance model.
 *
 * The time spent in dhikr is estimated from the words recited: every 2 words of
 * a remembrance take ~1 second to say. That time is then turned into a walking
 * distance using an average walking pace (≈ 5 km/h, i.e. an average step length
 * of ~0.75 m at a cadence of ~1.87 steps per second).
 *
 * All tunables live here so the whole journey can be recalibrated in one place.
 */
export const WORDS_PER_SECOND = 2;
export const WALKING_SPEED_MPS = 1.4;

/** Count whitespace-separated words in a string of dhikr text. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

const wordCountCache: Record<string, number> = {};

/** Words in a single recitation of a dua (cached, derived from its Arabic). */
export function duaWordCount(duaId: string): number {
  if (duaId in wordCountCache) return wordCountCache[duaId];
  const dua = duasById[duaId];
  const words = dua ? countWords(dua.arabic) : 0;
  wordCountCache[duaId] = words;
  return words;
}

/** Estimated seconds spent reciting, across every counted dua. */
export function dhikrSeconds(counts: Record<string, number>): number {
  let seconds = 0;
  for (const [duaId, raw] of Object.entries(counts)) {
    if (!Number.isFinite(raw) || raw <= 0) continue;
    seconds += (raw * duaWordCount(duaId)) / WORDS_PER_SECOND;
  }
  return seconds;
}

/** Distance (metres) that could be walked in the time spent in dhikr. */
export function dhikrDistanceMeters(counts: Record<string, number>): number {
  return dhikrSeconds(counts) * WALKING_SPEED_MPS;
}

/** Distance (kilometres) walked from Makkah. */
export function dhikrDistanceKm(counts: Record<string, number>): number {
  return dhikrDistanceMeters(counts) / 1000;
}

export type MilestoneKind = 'earth' | 'space';

export type Milestone = {
  id: string;
  /** Distance from Makkah, in kilometres. */
  km: number;
};

/** Great-circle distances from Makkah, ascending. */
export const EARTH_MILESTONES: Milestone[] = [
  { id: 'madinah', km: 340 },
  { id: 'quds', km: 1230 },
  { id: 'istanbul', km: 2420 },
  { id: 'delhi', km: 3680 },
  { id: 'cordoba', km: 5420 },
  { id: 'jakarta', km: 8400 },
  { id: 'newYork', km: 10300 },
  { id: 'aroundEarth', km: 40075 },
];

/** Altitudes above the Earth, ascending. */
export const SPACE_MILESTONES: Milestone[] = [
  { id: 'atmosphere', km: 100 },
  { id: 'lowOrbit', km: 420 },
  { id: 'geoOrbit', km: 35786 },
  { id: 'moon', km: 384400 },
  { id: 'mars', km: 54600000 },
  { id: 'sun', km: 149600000 },
];

export function milestonesFor(kind: MilestoneKind): Milestone[] {
  return kind === 'space' ? SPACE_MILESTONES : EARTH_MILESTONES;
}

export type JourneyProgress = {
  /** Index of the last milestone reached, or -1 if still setting out. */
  reachedIndex: number;
  /** Index of the milestone being travelled toward, or null once all reached. */
  nextIndex: number | null;
  /** 0–1 progress from the last reached point to the next milestone. */
  fractionToNext: number;
  /** Kilometres still to travel to reach the next milestone (0 once all reached). */
  remainingKm: number;
};

/** Where the traveller stands relative to an ascending milestone list. */
export function journeyProgress(milestones: Milestone[], distanceKm: number): JourneyProgress {
  const safeDistance = Math.max(0, distanceKm);
  let reachedIndex = -1;
  for (let i = 0; i < milestones.length; i += 1) {
    if (safeDistance >= milestones[i].km) {
      reachedIndex = i;
    } else {
      break;
    }
  }

  const nextIndex = reachedIndex + 1 < milestones.length ? reachedIndex + 1 : null;

  if (nextIndex === null) {
    return { reachedIndex, nextIndex, fractionToNext: 1, remainingKm: 0 };
  }

  const prevKm = reachedIndex >= 0 ? milestones[reachedIndex].km : 0;
  const nextKm = milestones[nextIndex].km;
  const span = nextKm - prevKm;
  const fractionToNext = span > 0 ? Math.max(0, Math.min(1, (safeDistance - prevKm) / span)) : 1;

  return {
    reachedIndex,
    nextIndex,
    fractionToNext,
    remainingKm: Math.max(0, nextKm - safeDistance),
  };
}

/**
 * Float "node coordinate" of the traveller along a trail whose nodes are
 * [Makkah, ...milestones] (so node count is milestones.length + 1).
 */
export function travelerNode(progress: JourneyProgress, nodeCount: number): number {
  if (nodeCount <= 1) return 0;
  if (progress.nextIndex === null) return nodeCount - 1;
  const baseNode = progress.reachedIndex + 1;
  return Math.min(nodeCount - 1, baseNode + progress.fractionToNext);
}
