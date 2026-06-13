import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

import { resetStore } from '@/__tests__/helpers/store';
import { goalLibraryGoals } from '@/src/data/goalLibrary';
import { presetGoals } from '@/src/data/presetGoals';
import { GoalLibrarySection } from '@/src/features/goals/GoalLibrarySection';
import { PlanNewGoalRow } from '@/src/features/goals/PlanNewGoalRow';
import { SuggestedGoalCard } from '@/src/features/goals/SuggestedGoalCard';
import {
  GoalLibraryIcon,
  goalLibraryIconNames,
  isGoalLibraryIcon,
} from '@/src/features/goals/goalLibraryIcons';
import { getStrings } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('goal UI components', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  it('renders PlanNewGoalRow and handles press in English and Urdu', () => {
    const onPress = jest.fn();
    render(<PlanNewGoalRow onPress={onPress} />);
    fireEvent.press(screen.getByLabelText(getStrings('en').goals.planNew));
    expect(onPress).toHaveBeenCalledTimes(1);

    useMisbahaStore.getState().setLanguage('ur');
    render(<PlanNewGoalRow onPress={jest.fn()} />);
    expect(screen.getByLabelText(getStrings('ur').goals.planNew)).toBeTruthy();
  });

  it('renders every goal library icon and validates icon names', () => {
    expect(isGoalLibraryIcon('gl-sunrise')).toBe(true);
    expect(isGoalLibraryIcon('sprout')).toBe(false);
    expect(isGoalLibraryIcon(undefined)).toBe(false);

    goalLibraryIconNames.forEach((name) => {
      render(<GoalLibraryIcon name={name} color="#213a18" size={20} />);
    });
  });

  it('renders SuggestedGoalCard corner icons for library, named, and default goals', () => {
    const onStart = jest.fn();
    render(<SuggestedGoalCard goal={goalLibraryGoals[0]} onStart={onStart} />);
    fireEvent.press(screen.getByText(getStrings('en').common.start));
    expect(onStart).toHaveBeenCalled();

    render(
      <SuggestedGoalCard
        goal={{ ...presetGoals[0], icon: 'sprout' }}
        onStart={jest.fn()}
      />,
    );
    render(<SuggestedGoalCard goal={{ ...presetGoals[0], icon: undefined }} onStart={jest.fn()} />);

    useMisbahaStore.getState().setLanguage('ur');
    render(<SuggestedGoalCard goal={goalLibraryGoals[1]} onStart={jest.fn()} />);
  });

  it('renders GoalLibrarySection and starts a library goal', () => {
    const { router } = require('expo-router');
    render(<GoalLibrarySection />);

    expect(screen.getByText(getStrings('en').goals.goalLibrary.title)).toBeTruthy();
    expect(screen.getByText(getStrings('en').goals.goalLibrary.oneDay)).toBeTruthy();
    expect(screen.getByText(getStrings('en').goals.goalLibrary.newMoon)).toBeTruthy();

    fireEvent.press(screen.getAllByText(getStrings('en').common.start)[0]!);
    expect(router.push).toHaveBeenCalled();
    expect(useMisbahaStore.getState().goals.some((goal) => goal.id.startsWith('lib-'))).toBe(true);
  });
});
