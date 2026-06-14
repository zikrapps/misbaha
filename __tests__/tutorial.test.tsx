import { fireEvent, render, screen } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { GestureTutorial } from '@/src/features/tutorial/GestureTutorial';
import { TutorialHost } from '@/src/features/tutorial/TutorialHost';
import { TutorialStepAnimation } from '@/src/features/tutorial/TutorialStepAnimation';
import { getTutorialSteps } from '@/src/features/tutorial/tutorialSteps';
import { getStrings } from '@/src/i18n/strings';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('tutorial', () => {
  beforeEach(() => resetStore());

  it('builds localized tutorial steps', () => {
    const steps = getTutorialSteps(getStrings('en'));
    expect(steps).toHaveLength(11);
    expect(steps[0]?.id).toBe('welcome');
    expect(steps[10]?.id).toBe('settings');
  });

  it('renders each tutorial animation step', () => {
    const stepIds = [
      'welcome',
      'categories',
      'expand',
      'count',
      'search',
      'duaDetail',
      'goals',
      'goalDetail',
      'today',
      'visualize',
      'settings',
      'unknown-step',
    ];
    stepIds.forEach((stepId) => {
      render(<TutorialStepAnimation stepId={stepId} />);
    });
  });

  it('hides the tutorial when not visible', () => {
    render(<GestureTutorial />);
    expect(screen.queryByText(/Step/i)).toBeNull();
  });

  it('walks through the tutorial and finishes', () => {
    useMisbahaStore.getState().openTutorial();
    render(<GestureTutorial />);

    expect(screen.getByText(/Step 1/i)).toBeTruthy();
    expect(screen.getByText(getStrings('en').tutorial.steps.welcome.title)).toBeTruthy();

    for (let step = 0; step < 10; step += 1) {
      fireEvent.press(screen.getByText(getStrings('en').tutorial.next));
    }

    fireEvent.press(screen.getByText(getStrings('en').tutorial.finish));
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
    expect(useMisbahaStore.getState().tutorialCompleted).toBe(true);
  });

  it('skips the tutorial from the first step', () => {
    useMisbahaStore.getState().openTutorial();
    render(<GestureTutorial />);

    const skip = screen.getByText(getStrings('en').tutorial.skip);
    fireEvent(skip, 'pressIn');
    fireEvent.press(skip);
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
    expect(useMisbahaStore.getState().tutorialCompleted).toBe(true);
  });

  it('auto-opens the tutorial when the host becomes ready', () => {
    render(<TutorialHost ready />);
    expect(useMisbahaStore.getState().tutorialVisible).toBe(true);
  });

  it('does not auto-open when the tutorial was already completed', () => {
    useMisbahaStore.setState({ tutorialCompleted: true });
    render(<TutorialHost ready />);
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
  });

  it('does not auto-open before the host is ready', () => {
    render(<TutorialHost ready={false} />);
    expect(useMisbahaStore.getState().tutorialVisible).toBe(false);
  });
});
