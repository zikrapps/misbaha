import { EARTH_MILESTONES, journeyProgress } from '@/src/features/insights/dhikrDistance';
import {
  formatDhikrDuration,
  formatDistanceKm,
  journeyCaption,
  milestoneLabel,
} from '@/src/i18n/journeyText';

describe('milestoneLabel', () => {
  it('localizes known milestones', () => {
    expect(milestoneLabel('earth', 'quds', 'en')).toBe('Al-Quds');
    expect(milestoneLabel('space', 'moon', 'en')).toBe('The Moon');
    expect(milestoneLabel('space', 'moon', 'ur')).toBe('چاند');
  });

  it('falls back to the id when unknown', () => {
    expect(milestoneLabel('earth', 'atlantis', 'en')).toBe('atlantis');
  });
});

describe('formatDistanceKm', () => {
  it('shows metres below a kilometre', () => {
    expect(formatDistanceKm(0.5, 'en')).toBe('500 m');
  });

  it('shows one decimal below ten kilometres', () => {
    expect(formatDistanceKm(5, 'en')).toBe('5.0 km');
  });

  it('shows whole kilometres in the mid range', () => {
    expect(formatDistanceKm(500, 'en')).toBe('500 km');
  });

  it('compresses to millions for cosmic distances', () => {
    expect(formatDistanceKm(5_000_000, 'en')).toBe('5 million km');
    expect(formatDistanceKm(150_000_000, 'en')).toBe('150 million km');
  });
});

describe('formatDhikrDuration', () => {
  it('rounds to the largest sensible unit', () => {
    expect(formatDhikrDuration(200_000, 'en')).toMatch(/day/);
    expect(formatDhikrDuration(7_200, 'en')).toMatch(/hour/);
    expect(formatDhikrDuration(120, 'en')).toMatch(/minute/);
    expect(formatDhikrDuration(30, 'en')).toMatch(/second/);
  });
});

describe('journeyCaption', () => {
  it('invites the traveller to begin when no distance yet', () => {
    const caption = journeyCaption('earth', EARTH_MILESTONES, journeyProgress(EARTH_MILESTONES, 0), 0, 0, 'en');
    expect(caption).toMatch(/begin/i);
  });

  it('describes the next milestone mid-journey', () => {
    const distance = 1500;
    const caption = journeyCaption(
      'earth',
      EARTH_MILESTONES,
      journeyProgress(EARTH_MILESTONES, distance),
      distance,
      90_000,
      'en',
    );
    expect(caption).toMatch(/to reach/i);
    expect(caption).toMatch(/in dhikr/i);
  });

  it('celebrates reaching the final milestone', () => {
    const distance = 1_000_000;
    const caption = journeyCaption(
      'earth',
      EARTH_MILESTONES,
      journeyProgress(EARTH_MILESTONES, distance),
      distance,
      90_000,
      'en',
    );
    expect(caption).toMatch(/reached/i);
  });
});
