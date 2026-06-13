import { formatNumber } from '@/src/i18n/format';
import { getStrings } from '@/src/i18n/strings';
import type { JourneyProgress, Milestone, MilestoneKind } from '@/src/features/insights/dhikrDistance';
import { Language } from '@/src/types/misbaha';

export function milestoneLabel(kind: MilestoneKind, id: string, language: Language): string {
  const j = getStrings(language).journey;
  const map = kind === 'space' ? j.spaceMilestones : j.earthMilestones;
  return map[id] ?? id;
}

/** Human distance string: metres under 1 km, millions above a million km. */
export function formatDistanceKm(km: number, language: Language): string {
  const j = getStrings(language).journey;
  const safe = Math.max(0, km);

  if (safe < 1) {
    return `${formatNumber(Math.round(safe * 1000))} ${j.units.m}`;
  }
  if (safe < 10) {
    return `${safe.toFixed(1)} ${j.units.km}`;
  }
  if (safe >= 1_000_000) {
    const millions = safe / 1_000_000;
    const value = millions >= 100 ? Math.round(millions) : Number(millions.toFixed(1));
    return `${formatNumber(value)} ${j.units.million}`;
  }
  return `${formatNumber(Math.round(safe))} ${j.units.km}`;
}

/** Estimated dhikr time, rounded to its largest sensible unit. */
export function formatDhikrDuration(seconds: number, language: Language): string {
  const d = getStrings(language).journey.duration;
  const safe = Math.max(0, Math.round(seconds));

  if (safe >= 86_400) return d.days(Math.round(safe / 86_400));
  if (safe >= 3_600) return d.hours(Math.round(safe / 3_600));
  if (safe >= 60) return d.minutes(Math.round(safe / 60));
  return d.seconds(safe);
}

/** Caption beneath the big distance: where you are or what is next. */
export function journeyCaption(
  kind: MilestoneKind,
  milestones: Milestone[],
  progress: JourneyProgress,
  distanceKm: number,
  seconds: number,
  language: Language,
): string {
  const j = getStrings(language).journey;

  if (distanceKm <= 0) {
    return j.begin;
  }

  const time = j.inDhikr(formatDhikrDuration(seconds, language));

  if (progress.nextIndex === null) {
    const last = milestones[milestones.length - 1];
    return `${j.reached(milestoneLabel(kind, last.id, language))} · ${time}`;
  }

  const next = milestones[progress.nextIndex];
  const remaining = j.remainingTo(
    formatDistanceKm(progress.remainingKm, language),
    milestoneLabel(kind, next.id, language),
  );
  return `${remaining} · ${time}`;
}
