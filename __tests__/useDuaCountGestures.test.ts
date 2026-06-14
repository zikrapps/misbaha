import { act, renderHook } from '@testing-library/react-native';

import { getGestureCallback, findGestureCallback, findGestureCallbacks, resetGestureCallbacks } from '@/__tests__/helpers/gestureCallbacks';
import {
  DUA_COUNT_DOUBLE_TAP_DELAY_MS,
  DUA_COUNT_GHOST_PRESS_GUARD_MS,
  DUA_COUNT_GHOST_REFIRE_MS,
  DUA_COUNT_MIN_DOUBLE_TAP_MS,
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

    it('handles intentional double tap without multiplying the increment', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_MIN_DOUBLE_TAP_MS));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 1);
      expect(onBump).toHaveBeenCalledTimes(1);

      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledTimes(1);
    });

    it('ignores ghost re-fires near the same spot', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 10, y: 20 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_GHOST_REFIRE_MS - 10));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 12, y: 22 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledTimes(1);
      expect(onBump).toHaveBeenCalledWith(10, 20, 1);
    });

    it('handles long press bumps', () => {
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => findGestureCallback('long', 'onStart')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 1);
    });

    it('ignores ghost tap after long press', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump }));

      act(() => findGestureCallback('long', 'onStart')?.({ x: 0, y: 0 }));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 9, y: 9 }));
      expect(onBump).toHaveBeenCalledTimes(1);

      act(() => jest.advanceTimersByTime(DUA_COUNT_GHOST_PRESS_GUARD_MS + 1));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 1 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).toHaveBeenCalledTimes(2);
    });

    it('calls onHoldComplete after a 3s hold without bumping', () => {
      const onBump = jest.fn();
      const onHoldComplete = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump, onHoldComplete }));

      act(() => findGestureCallback('long', 'onStart')?.({ x: 8, y: 9 }));
      expect(onHoldComplete).toHaveBeenCalledWith(8, 9);
      expect(onBump).not.toHaveBeenCalled();
    });

    it('still bumps on a quick long press when hold-to-complete is enabled', () => {
      const onBump = jest.fn();
      const onHoldComplete = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump, onHoldComplete }));

      const longPressHandlers = findGestureCallbacks('long', 'onStart');
      act(() => longPressHandlers[1]?.({ x: 1, y: 2 }));
      expect(onBump).toHaveBeenCalledWith(1, 2, 1);
      expect(onHoldComplete).not.toHaveBeenCalled();
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
      act(() => jest.advanceTimersByTime(DUA_COUNT_MIN_DOUBLE_TAP_MS));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 3, y: 4 }));
      expect(onBump).toHaveBeenCalledWith(3, 4, 1);
      expect(onBump).toHaveBeenCalledTimes(1);
    });

    it('drops a stale single-tap timeout when another tap arrives', () => {
      jest.useFakeTimers();
      const onBump = jest.fn();
      renderHook(() => useDuaCountGestures({ onBump, doubleTapOnly: true }));

      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_MIN_DOUBLE_TAP_MS));
      act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 50, y: 60 }));
      act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
      expect(onBump).not.toHaveBeenCalled();
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

  it('clears the pending tap window', () => {
    jest.useFakeTimers();
    const onBump = jest.fn();
    const { result } = renderHook(() => useDuaCountGestures({ onBump }));

    act(() => getGestureCallback('tap-1', 'onEnd')?.({ x: 1, y: 2 }));
    act(() => result.current.resetTapWindow());
    act(() => jest.advanceTimersByTime(DUA_COUNT_DOUBLE_TAP_DELAY_MS));
    expect(onBump).not.toHaveBeenCalled();
  });
});
