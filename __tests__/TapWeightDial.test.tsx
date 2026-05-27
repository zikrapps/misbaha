import { fireEvent, render, screen } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { TapWeightDial } from '@/src/features/settings/TapWeightDial';

describe('TapWeightDial', () => {
  beforeEach(() => resetStore());

  it('changes tap weight and plays click when enabled', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={3} clickSoundEnabled onChange={onChange} />);

    fireEvent.press(screen.getByText('5'));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('updates without sound when disabled', () => {
    const onChange = jest.fn();
    render(<TapWeightDial value={1} clickSoundEnabled={false} onChange={onChange} />);
    fireEvent.press(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
