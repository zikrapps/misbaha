import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';

export const DUA_COUNT_DOUBLE_TAP_DELAY_MS = 380;
export const DUA_COUNT_LONG_PRESS_MS = 450;
export const DUA_COUNT_GHOST_PRESS_GUARD_MS = 450;
export const DUA_COUNT_DOUBLE_TAP_SLOP_PX = 48;
/** Ignore rapid re-fires from one physical touch (iOS / New Architecture ghost taps). */
export const DUA_COUNT_GHOST_REFIRE_MS = 80;
/** Real double-taps are farther apart than ghost re-fires. */
export const DUA_COUNT_MIN_DOUBLE_TAP_MS = 120;

import { TAB_BAR_HEIGHT_UR } from '@/src/theme/tabBar';

/** Worst-case tab bar height — keep tap layer above the Urdu menu. */
export const TAB_BAR_HEIGHT = TAB_BAR_HEIGHT_UR;

type UseDuaCountGesturesOptions = {
  onBump: (x: number, y: number, times?: number) => void;
  enabled?: boolean;
  /** Tasbeeh list: only a completed double tap counts; single taps are ignored. */
  doubleTapOnly?: boolean;
};

function isGhostRefire(
  now: number,
  x: number,
  y: number,
  handled: { t: number; x: number; y: number } | null,
): boolean {
  if (!handled) return false;
  if (now - handled.t >= DUA_COUNT_GHOST_REFIRE_MS) return false;
  return Math.hypot(x - handled.x, y - handled.y) <= DUA_COUNT_DOUBLE_TAP_SLOP_PX;
}

/**
 * Tap gestures for counting. Double tap is detected in JS from consecutive taps — more reliable
 * over ScrollView than composing two RNGH Tap gestures.
 */
export function useDuaCountGestures({
  onBump,
  enabled = true,
  doubleTapOnly = false,
}: UseDuaCountGesturesOptions) {
  const skipNextPressAfterLong = useRef<number | null>(null);
  const pendingSingle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);
  const lastHandledTap = useRef<{ t: number; x: number; y: number } | null>(null);

  const clearPendingSingle = useCallback(() => {
    if (pendingSingle.current != null) {
      clearTimeout(pendingSingle.current);
      pendingSingle.current = null;
    }
  }, []);

  useEffect(() => clearPendingSingle, [clearPendingSingle]);

  const bump = useCallback(
    (x: number, y: number, times = 1) => {
      if (!enabled) {
        return;
      }
      onBump(x, y, times);
    },
    [enabled, onBump],
  );

  const handleTapEnd = useCallback(
    (x: number, y: number) => {
      if (!enabled) {
        return;
      }

      const skippedAt = skipNextPressAfterLong.current;
      if (skippedAt != null && Date.now() - skippedAt < DUA_COUNT_GHOST_PRESS_GUARD_MS) {
        skipNextPressAfterLong.current = null;
        return;
      }

      const now = Date.now();
      if (isGhostRefire(now, x, y, lastHandledTap.current)) {
        return;
      }
      lastHandledTap.current = { t: now, x, y };

      const previous = lastTap.current;
      if (
        previous &&
        now - previous.t >= DUA_COUNT_MIN_DOUBLE_TAP_MS &&
        now - previous.t <= DUA_COUNT_DOUBLE_TAP_DELAY_MS &&
        Math.hypot(x - previous.x, y - previous.y) <= DUA_COUNT_DOUBLE_TAP_SLOP_PX
      ) {
        clearPendingSingle();
        lastTap.current = null;
        bump(x, y, 1);
        return;
      }

      lastTap.current = { t: now, x, y };
      clearPendingSingle();
      pendingSingle.current = setTimeout(() => {
        pendingSingle.current = null;
        if (lastTap.current?.t !== now) {
          return;
        }
        lastTap.current = null;
        if (!doubleTapOnly) {
          bump(x, y, 1);
        }
      }, DUA_COUNT_DOUBLE_TAP_DELAY_MS);
    },
    [bump, clearPendingSingle, doubleTapOnly, enabled],
  );

  const gesture = useMemo(() => {
    const tap = Gesture.Tap()
      .enabled(enabled)
      .numberOfTaps(1)
      .runOnJS(true)
      .onEnd((event) => handleTapEnd(event.x, event.y));

    if (doubleTapOnly) {
      return tap;
    }

    const longPress = Gesture.LongPress()
      .enabled(enabled)
      .minDuration(DUA_COUNT_LONG_PRESS_MS)
      .runOnJS(true)
      .onStart((event) => {
        clearPendingSingle();
        lastTap.current = null;
        skipNextPressAfterLong.current = Date.now();
        bump(event.x, event.y, 1);
      });

    return Gesture.Exclusive(longPress, tap);
  }, [bump, clearPendingSingle, doubleTapOnly, enabled, handleTapEnd]);

  const resetTapWindow = useCallback(() => {
    clearPendingSingle();
    lastTap.current = null;
  }, [clearPendingSingle]);

  return { gesture, resetTapWindow };
}
