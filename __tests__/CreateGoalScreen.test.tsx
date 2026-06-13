import { render, screen } from '@testing-library/react-native';

import CreateGoalScreen from '@/app/(tabs)/goals/create';
import { resetStore } from './helpers/store';

describe('CreateGoalScreen', () => {
  beforeEach(resetStore);

  it('shows dua labels in the plan preview', () => {
    render(<CreateGoalScreen />);
    expect(screen.getAllByText(/×/).length).toBe(7);
    expect(screen.getAllByText(/Allah|Subhan|Bismika/i).length).toBeGreaterThan(0);
  });
});
