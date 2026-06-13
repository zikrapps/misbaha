import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { findGestureCallback, resetGestureCallbacks } from '@/__tests__/helpers/gestureCallbacks';
import { SwipeBack } from '@/src/features/goals/SwipeBack';

jest.mock('react-native-reanimated', () => ({
  runOnJS: (fn: () => void) => fn,
}));

describe('SwipeBack', () => {
  beforeEach(() => resetGestureCallbacks());

  it('calls onBack when the pan gesture completes a swipe', () => {
    const onBack = jest.fn();
    render(
      <SwipeBack onBack={onBack}>
        <Text>Goal detail</Text>
      </SwipeBack>,
    );

    expect(screen.getByText('Goal detail')).toBeTruthy();

    const onEnd = findGestureCallback('pan', 'onEnd');
    onEnd?.({ x: 0, y: 0, translationX: 100, velocityX: 0 });
    expect(onBack).toHaveBeenCalledTimes(1);

    onBack.mockClear();
    onEnd?.({ x: 0, y: 0, translationX: 0, velocityX: 700 });
    expect(onBack).toHaveBeenCalledTimes(1);

    onBack.mockClear();
    onEnd?.({ x: 0, y: 0, translationX: 10, velocityX: 0 });
    expect(onBack).not.toHaveBeenCalled();
  });
});
