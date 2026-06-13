import { BadgeDef } from '@/src/data/badges';
import { badgeEmblemName } from '@/src/features/badges/badgeArt';
import { getStrings } from '@/src/i18n/strings';
import { Language } from '@/src/types/misbaha';

/**
 * Each badge's display name is its unique emblem name (e.g. "Three beads",
 * "Bead heart"). The requirement line below it is localised.
 */
export function badgeName(badge: BadgeDef): string {
  return badgeEmblemName(badge);
}

export function badgeDescription(badge: BadgeDef, language: Language): string {
  return getStrings(language).badges.descriptions[badge.metric](badge.threshold);
}
