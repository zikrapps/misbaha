import { act, renderHook } from '@testing-library/react-native';

import { getGestureCallback, resetGestureCallbacks } from '@/__tests__/helpers/gestureCallbacks';
import {
  DUA_COUNT_DOUBLE_TAP_DELAY_MS,
  DUA_COUNT_GHOST_PRESS_GUARD_MS,
  useDuaCountGestures,
} from '@/src/features/duas/useDuaCountGestures';

describe('useDuaCountGestures', () => {
  beforeEach(() => {
    resetGestureCallbacks();
    jest.useRealTimers();
  });

  describe('full mode (detail screen)', () => {
    it('handles single tap after the double-tap window', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      expect(onBump).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledWith(1, 2, 1);
    });

    it('handles double tap within the delay window', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 2);
      expect(onBump).toHaveBeenCalledTimes(1);

      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledTimes(1);
    });

    it('handles long press bumps', () => {
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('long-2', 'onStart')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 1);
    });

    it('ignores ghost tap after long press', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('long-2', 'onStart')?.({ x: 0, y: 0 }));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 9, y: 9 }));
      expect(onBump).toHaveBeenCalledTimes(1);

      act(() => jest.advanceTimersByTime(DUA_COUNT_GHOST_PRESS_GUARD_MS + 1));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 1 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledTimes(2);
    });
  });

  describe('doubleTapOnly mode (Tasbeeh list)', () => {
    it('ignores a lone single tap', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump, doubleTapOnly: true }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).not.toHaveBeenCalled();
    });

    it('counts once on double tap', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump, doubleTapOnly: true }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 1);
      expect(onBump).toHaveBeenCalledTimes(1);
    });
  });

  it('defaults to enabled', () => {
    jest.useFakeTimers();
    const onBump = jest.fn();
    renderHook(() => useDuaCountGestures({ onBump }));
    act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 0, y: 0 }));
    act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
    expect(onBump).toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    jest.useFakeTimers();
    const onBump = jest.fn();
    renderHook(() => useDuaCountGestures({ onBump, enabled: false }));
    act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 0, y: 0 }));
    act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
    expect(onBump).not.toHaveBeenCalled();
  });
});
