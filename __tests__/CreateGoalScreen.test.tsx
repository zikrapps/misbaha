import { fireEvent, render, screen } from '@testing-library/react-native';

import CreateGoalScreen from '@/app/(tabs)/goals/create';
import { resetStore } from './helpers/store';

describe('CreateGoalScreen', () => {
  beforeEach(resetStore);

  it('shows dua labels in the surprise plan preview', () => {
    render(<CreateGoalScreen />);
    expect(screen.getAllByText(/×/).length).toBe(7);
    expect(screen.getAllByText(/Allah|Subhan|Bismika/i).length).toBeGreaterThan(0);
  });

  it('lets custom goals remove a dua and name the plan', () => {
    render(<CreateGoalScreen />);
    fireEvent.press(screen.getByText('Custom'));
    fireEvent.changeText(screen.getByLabelText('Goal name'), 'My Plan');
    fireEvent.press(screen.getAllByLabelText('Remove dua')[0]!);
    expect(screen.getByText('Empty day — search to add a dua')).toBeTruthy();
    expect(screen.getByText('Save goal')).toBeTruthy();
  });
});
