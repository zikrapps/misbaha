import { Animated, type Animated as AnimatedNamespace } from 'react-native';
import { act, render } from '@testing-library/react-native';

import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';

describe('DuaTapFeedback', () => {
  beforeEach(() => {
    jest.spyOn(Animated, 'timing').mockImplementation((value, config) => ({
      start: (callback) => {
        (value as AnimatedNamespace.Value).setValue(Number(config.toValue));
        callback?.({ finished: true });
        return { stop: jest.fn() };
      },
      stop: jest.fn(),
      reset: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing when not visible', () => {
    const { toJSON } = render(<DuaTapFeedback feedbackKey={0} visible={false} x={40} y={60} />);
    expect(toJSON()).toBeNull();
  });

  it('runs animation and finishes', () => {
    const onFinish = jest.fn();
    render(<DuaTapFeedback feedbackKey={1} visible x={40} y={60} onFinish={onFinish} />);
    act(() => undefined);
    expect(onFinish).toHaveBeenCalled();
  });

  it('supports night mode palette', () => {
    const { toJSON } = render(<DuaTapFeedback feedbackKey={2} visible nightMode x={10} y={10} />);
    expect(toJSON()).toBeTruthy();
  });
});
