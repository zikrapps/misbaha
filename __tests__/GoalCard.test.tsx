import { fireEvent, render, screen } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { duas } from '@/src/data/duas';
import { presetGoals } from '@/src/data/presetGoals';
import { GoalCard } from '@/src/features/goals/GoalCard';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('GoalCard', () => {
  beforeEach(() => resetStore());

  it('renders full card with Arabic line and completed segments', () => {
    const goal = presetGoals[0];
    const progress = Object.fromEntries(goal.days.map((day) => [day.day, day.target]));
    render(<GoalCard goal={goal} progress={progress} onPress={jest.fn()} variant="full" />);
    const lastDay = goal.days[goal.days.length - 1];
    const lastDua = duas.find((d) => d.id === lastDay.duaId)!;
    expect(screen.getByText(lastDua.arabic)).toBeTruthy();
  });

  it('renders tile card with in-progress segments', () => {
    const goal = presetGoals[3];
    const progress = { 1: 10, 2: 0, 3: 33 };
    const onPress = jest.fn();
    render(<GoalCard goal={goal} progress={progress} onPress={onPress} variant="tile" />);
    fireEvent.press(screen.getByText(goal.title));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders when the current dua cannot be resolved', () => {
    const goal = {
      ...presetGoals[0],
      days: [{ day: 1, duaId: 'unknown-dua', target: 10 }],
    };
    render(<GoalCard goal={goal} progress={{ 1: 2 }} onPress={jest.fn()} />);
    expect(screen.getByText('2/10')).toBeTruthy();
  });

  it('renders in Urdu tile mode', () => {
    useMisbahaStore.getState().setLanguage('ur');
    render(<GoalCard goal={presetGoals[1]} progress={{ 1: 1 }} onPress={jest.fn()} variant="tile" />);
  });
});
