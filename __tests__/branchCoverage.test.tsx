import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState } from 'react';

import { duaPreview, duaTitle } from '@/src/i18n/duaText';
import { goalDescription, goalTitle } from '@/src/i18n/goalText';
import { formatDashboardDate } from '@/src/i18n/format';
import { isNightDetailHours } from '@/src/features/duas/nightDetail';
import { hasStartedTemplate } from '@/src/features/goals/suggestedGoals';
import { resetStore } from '@/__tests__/helpers/store';
import { Screen } from '@/src/components/Screen';
import { duas } from '@/src/data/duas';
import { presetGoals } from '@/src/data/presetGoals';
import { DuaCountTapLayer } from '@/src/features/duas/DuaCountTapLayer';
import { duaSpeaker } from '@/src/i18n/duaText';
import { getStrings } from '@/src/i18n/strings';
import { GoalPlan } from '@/src/types/misbaha';
import { DuaCounterRow } from '@/src/features/duas/DuaCounterRow';
import { DuaTapFeedback } from '@/src/features/duas/DuaTapFeedback';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { GoalCard } from '@/src/features/goals/GoalCard';
import { SuggestedGoalCard } from '@/src/features/goals/SuggestedGoalCard';
import { pickSuggestedGoals } from '@/src/features/goals/suggestedGoals';
import { GardenSummary } from '@/src/features/insights/GardenSummary';
import { MountainTree } from '@/src/features/insights/MountainTree';
import { lastThirtyDays } from '@/src/store/date';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

describe('branch coverage gaps', () => {
  beforeEach(() => resetStore());

  it('renders GoalCard in full layout with partial progress', () => {
    const goal = presetGoals[0];
    render(<GoalCard goal={goal} progress={{ 1: 5 }} onPress={jest.fn()} variant="full" />);
    expect(screen.getByText(/Today|آج/i)).toBeTruthy();
  });

  it('renders GoalCard when today dua is missing', () => {
    const goal = {
      ...presetGoals[0],
      days: [{ day: 1, duaId: 'missing-dua-id', target: 33 }],
    };
    render(<GoalCard goal={goal} progress={{}} onPress={jest.fn()} />);
  });

  it('renders Screen without a subtitle', () => {
    render(<Screen title="Title only" />);
    expect(screen.getByText('Title only')).toBeTruthy();
  });

  it('renders suggested goal card in English and Urdu', () => {
    render(<SuggestedGoalCard goal={presetGoals[1]} onStart={jest.fn()} />);
    useMisbahaStore.setState({ language: 'ur' });
    render(<SuggestedGoalCard goal={presetGoals[1]} onStart={jest.fn()} />);
  });

  it('renders panorama garden summary', () => {
    const counts = Object.fromEntries(duas.map((d, i) => [d.id, (i + 1) * 150]));
    render(<GardenSummary total={50000} counts={counts} />);
  });

  it('renders MountainTree with default scale', () => {
    render(<MountainTree x={12} y={34} />);
  });

  it('uses default tap layer props', () => {
    function Harness() {
      const { gesture } = useDuaCountGestures({ onBump: jest.fn() });
      return (
        <DuaCountTapLayer gesture={gesture} enabled feedbackKey={2} showFeedback x={4} y={8}>
          <></>
        </DuaCountTapLayer>
      );
    }
    render(<Harness />);
  });

  it('uses tap layer options and night mode', () => {
    const onFinish = jest.fn();
    function Harness() {
      const { gesture } = useDuaCountGestures({ onBump: jest.fn() });
      return (
        <DuaCountTapLayer
          gesture={gesture}
          enabled
          feedbackKey={1}
          showFeedback={false}
          x={0}
          y={0}
          nightMode
          tabBarInset={76}
          onFeedbackFinish={onFinish}
          style={{ flex: 1 }}
        >
          <></>
        </DuaCountTapLayer>
      );
    }
    render(<Harness />);
  });

  it('skips tap feedback animation when key is zero', () => {
    render(<DuaTapFeedback feedbackKey={0} visible x={1} y={1} />);
  });

  it('shows speaker line on expanded dua row', () => {
    const withSpeaker = duas.find((d) => d.speaker)!;
    function Harness() {
      const [expanded, setExpanded] = useState(false);
      return (
        <DuaCounterRow
          dua={withSpeaker}
          count={0}
          tapWeight={1}
          countingActive={expanded}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((value) => !value)}
          onIncrement={jest.fn()}
          onOpen={jest.fn()}
          onReset={jest.fn()}
        />
      );
    }
    render(<Harness />);
    fireEvent.press(screen.getByLabelText(/expand/i));
    expect(screen.getByText(/Speaker|مقرر/i)).toBeTruthy();
  });

  it('covers i18n and utility branches', () => {
    const englishOnly = { ...duas[0], id: 'english-only-dua' };
    expect(duaTitle(englishOnly, 'ur')).toBe(englishOnly.title);
    expect(duaPreview(englishOnly, 'en')).toBe(englishOnly.transliteration);
    const surpriseGoal: GoalPlan = {
      id: 'gen-surprise',
      title: '7-Day Surprise',
      description: 'x',
      duration: 7,
      days: presetGoals[0].days,
      createdAt: 0,
    };
    expect(goalDescription(surpriseGoal, 'ur')).toBe(getStrings('ur').goalCreate.surpriseDescriptionGenerated);
    expect(goalDescription({ ...surpriseGoal, title: '10-Day Custom Path' }, 'ur')).toBe(
      getStrings('ur').goalCreate.customDescriptionGenerated,
    );
    expect(goalDescription({ ...surpriseGoal, title: '30-Day Garden' }, 'ur')).toBe(
      getStrings('ur').goalCreate.gardenDescriptionGenerated,
    );
    expect(goalTitle({ ...surpriseGoal, title: '30-Day Garden' }, 'ur')).toContain('30');
    expect(isNightDetailHours()).toBeDefined();
    expect(hasStartedTemplate('preset-garden', [{ ...presetGoals[0], id: 'preset-garden', startedAt: '2026-01-01' }])).toBe(
      true,
    );
    formatDashboardDate();
    const noSpeaker = { ...duas[0], id: 'no-speaker', speaker: undefined };
    expect(duaSpeaker(noSpeaker, 'ur')).toBeUndefined();
  });

  it('covers store and date defaults', () => {
    expect(lastThirtyDays().length).toBe(30);
    const custom = { ...presetGoals[0], id: 'custom-plan-2', preset: false, createdAt: 1 };
    const id = useMisbahaStore.getState().startGoal(custom);
    expect(id).toBe('custom-plan-2');
    useMisbahaStore.getState().incrementGoalDay(id, 1, -5);
    expect(useMisbahaStore.getState().goalProgress[id][1]).toBe(1);
    expect(pickSuggestedGoals(presetGoals, 2)).toHaveLength(2);
  });
});
