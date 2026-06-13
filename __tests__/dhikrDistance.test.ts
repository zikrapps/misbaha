import {
  countWords,
  dhikrDistanceKm,
  dhikrDistanceMeters,
  dhikrSeconds,
  duaWordCount,
  EARTH_MILESTONES,
  journeyProgress,
  milestonesFor,
  SPACE_MILESTONES,
  travelerNode,
} from '@/src/features/insights/dhikrDistance';

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('سُبْحَانَ اللَّهِ')).toBe(2);
    expect(countWords('one two three')).toBe(3);
  });

  it('treats blank text as zero', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });
});

describe('duaWordCount', () => {
  it('counts words in a known dua and caches the result', () => {
    const first = duaWordCount('fajr-subhanallah');
    const second = duaWordCount('fajr-subhanallah');
    expect(first).toBe(2);
    expect(second).toBe(2);
  });

  it('returns zero for an unknown dua', () => {
    expect(duaWordCount('does-not-exist')).toBe(0);
  });
});

describe('dhikr distance model', () => {
  it('turns counts into seconds, ignoring non-positive or invalid values', () => {
    const seconds = dhikrSeconds({
      'fajr-subhanallah': 10,
      unknown: 0,
      negative: -5,
      broken: Number.NaN,
    });
    // 10 counts × (2 words / 2 per second) = 10 seconds
    expect(seconds).toBe(10);
  });

  it('derives metres and kilometres from the walking pace', () => {
    const counts = { 'fajr-subhanallah': 1000 };
    expect(dhikrDistanceMeters(counts)).toBeCloseTo(1400, 5);
    expect(dhikrDistanceKm(counts)).toBeCloseTo(1.4, 5);
  });
});

describe('milestonesFor', () => {
  it('returns the right table per kind', () => {
    expect(milestonesFor('earth')).toBe(EARTH_MILESTONES);
    expect(milestonesFor('space')).toBe(SPACE_MILESTONES);
  });
});

describe('journeyProgress', () => {
  const milestones = [
    { id: 'a', km: 10 },
    { id: 'b', km: 20 },
  ];

  it('handles setting out from the origin', () => {
    const p = journeyProgress(milestones, 0);
    expect(p).toEqual({ reachedIndex: -1, nextIndex: 0, fractionToNext: 0, remainingKm: 10 });
  });

  it('reports partial progress before the first milestone', () => {
    const p = journeyProgress(milestones, 5);
    expect(p.reachedIndex).toBe(-1);
    expect(p.fractionToNext).toBeCloseTo(0.5, 5);
    expect(p.remainingKm).toBe(5);
  });

  it('reports progress between milestones', () => {
    const p = journeyProgress(milestones, 15);
    expect(p.reachedIndex).toBe(0);
    expect(p.nextIndex).toBe(1);
    expect(p.fractionToNext).toBeCloseTo(0.5, 5);
  });

  it('marks the journey complete once the last milestone is passed', () => {
    const p = journeyProgress(milestones, 25);
    expect(p.reachedIndex).toBe(1);
    expect(p.nextIndex).toBeNull();
    expect(p.fractionToNext).toBe(1);
    expect(p.remainingKm).toBe(0);
  });

  it('clamps negative distances to the start', () => {
    const p = journeyProgress(milestones, -100);
    expect(p.reachedIndex).toBe(-1);
  });
});

describe('travelerNode', () => {
  const milestones = [
    { id: 'a', km: 10 },
    { id: 'b', km: 20 },
  ];

  it('returns the origin for a degenerate trail', () => {
    expect(travelerNode(journeyProgress(milestones, 0), 1)).toBe(0);
  });

  it('parks at the final node when the journey is done', () => {
    expect(travelerNode(journeyProgress(milestones, 25), 3)).toBe(2);
  });

  it('interpolates between nodes mid-journey', () => {
    const node = travelerNode(journeyProgress(milestones, 15), 3);
    expect(node).toBeCloseTo(1.5, 5);
  });
});
