import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { PanResponder } from 'react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { TapWeightDial } from '@/src/features/settings/TapWeightDial';

type PanConfig = Parameters<typeof PanResponder.create>[0];

const panConfigs: PanConfig[] = [];

beforeAll(() => {
  jest.spyOn(PanResponder, 'create').mockImplementation((config) => {
    panConfigs.push(config);
    return {
      panHandlers: {},
    } as ReturnType<typeof PanResponder.create>;
  });
});

describe('TapWeightDial', () => {
  beforeEach(() => {
    resetStore();
    panConfigs.length = 0;
  });

  it('increments the tap weight via the adjustable control', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={3} clickSoundEnabled onChange={onChange} />);

    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('decrements the tap weight', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={2} clickSoundEnabled={false} onChange={onChange} />);

    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('clamps at the minimum', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={1} clickSoundEnabled={false} onChange={onChange} />);

    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('clamps at the maximum', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={10} clickSoundEnabled onChange={onChange} />);

    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates via the arc pan gesture', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={5} clickSoundEnabled onChange={onChange} />);

    act(() => {
      screen.getByRole('adjustable').props.onLayout?.({
        nativeEvent: { layout: { width: 276, height: 220 } },
      });
    });

    const arcPan = panConfigs[0]!;
    arcPan.onPanResponderGrant?.({ nativeEvent: { locationX: 200, locationY: 120 } } as never, undefined as never);
    arcPan.onPanResponderMove?.({ nativeEvent: { locationX: 210, locationY: 125 } } as never, undefined as never);
    expect(onChange).toHaveBeenCalled();
  });

  it('normalizes negative arc angles before mapping to values', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={5} clickSoundEnabled={false} onChange={onChange} />);

    act(() => {
      screen.getByRole('adjustable').props.onLayout?.({
        nativeEvent: { layout: { width: 276, height: 220 } },
      });
    });

    const arcPan = panConfigs[0]!;
    arcPan.onPanResponderGrant?.({ nativeEvent: { locationX: 40, locationY: 150 } } as never, undefined as never);
    expect(onChange).toHaveBeenCalled();
  });

  it('updates via the track pan gesture', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={1} clickSoundEnabled={false} onChange={onChange} />);

    act(() => {
      screen.getByRole('adjustable').props.onLayout?.({
        nativeEvent: { layout: { width: 276, height: 220 } },
      });
    });

    const trackPan = panConfigs[1]!;
    trackPan.onPanResponderGrant?.({ nativeEvent: { locationX: 250, locationY: 10 } } as never, undefined as never);
    trackPan.onPanResponderMove?.({ nativeEvent: { locationX: 255, locationY: 10 } } as never, undefined as never);
    expect(onChange).toHaveBeenCalled();
  });

  it('snaps to min or max in the shallow angle zone', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={5} clickSoundEnabled={false} onChange={onChange} />);

    act(() => {
      screen.getByRole('adjustable').props.onLayout?.({
        nativeEvent: { layout: { width: 276, height: 220 } },
      });
    });

    const arcPan = panConfigs[0]!;
    arcPan.onPanResponderGrant?.({ nativeEvent: { locationX: 250, locationY: 180 } } as never, undefined as never);
    expect(onChange).toHaveBeenCalledWith(10);

    onChange.mockClear();
    arcPan.onPanResponderGrant?.({ nativeEvent: { locationX: 100, locationY: 180 } } as never, undefined as never);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ignores no-op value changes and plays click sound when enabled', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={5} clickSoundEnabled onChange={onChange} />);

    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    fireEvent(screen.getByRole('adjustable'), 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
