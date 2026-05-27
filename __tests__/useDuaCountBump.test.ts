import { act, renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

import { useDuaCountBump } from '@/src/features/duas/useDuaCountBump';

describe('useDuaCountBump', () => {
  it('increments once per bump and shows feedback', () => {
    const onIncrement = jest.fn();
    const { result } = renderHook(() => useDuaCountBump({ hapticsEnabled: true, onIncrement }));

    act(() => result.current.bumpAt(10, 20));
    expect(onIncrement).toHaveBeenCalledTimes(1);
    expect(result.current.showFeedback).toBe(true);
    expect(Haptics.impactAsync).toHaveBeenCalled();

    act(() => result.current.onFeedbackFinish());
    expect(result.current.showFeedback).toBe(false);
  });

  it('applies multi-count bumps and medium haptics', () => {
    const onIncrement = jest.fn();
    const { result } = renderHook(() => useDuaCountBump({ hapticsEnabled: true, onIncrement }));

    act(() => result.current.bumpAt(1, 2, 3));
    expect(onIncrement).toHaveBeenCalledTimes(3);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it('skips haptics when disabled', () => {
    jest.clearAllMocks();
    const { result } = renderHook(() => useDuaCountBump({ hapticsEnabled: false, onIncrement: jest.fn() }));
    act(() => result.current.bumpAt(0, 0));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });
});
