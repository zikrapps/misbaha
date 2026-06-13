import { DevSettings, I18nManager } from 'react-native';

import { Language } from '@/src/types/misbaha';

/** Urdu is the only right-to-left language we ship today. */
export function isRtlLanguage(language: Language): boolean {
  return language === 'ur';
}

/**
 * Urdu layout is handled in JS via `proseLayout`, `mirrorRow`, and
 * `alignStart` — not via `I18nManager.forceRTL`, which flips `textAlign`
 * semantics and double-fights our row mirroring.
 *
 * If a previous build persisted native RTL, clear it once so physical
 * `textAlign: 'right'` lands on the right edge again.
 */
export function syncLayoutDirection(_language: Language): boolean {
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL) {
    I18nManager.forceRTL(false);
    return true;
  }
  return false;
}

/**
 * Reload the JS bundle. Useful after clearing a stale native RTL flag; a full
 * process restart is still required for `I18nManager.isRTL` to update.
 */
export function reloadApp(): void {
  const dev = DevSettings as unknown as { reload?: () => void };
  if (typeof dev.reload === 'function') {
    dev.reload();
  }
}
