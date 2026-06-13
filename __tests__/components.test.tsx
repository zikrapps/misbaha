import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

import { resetStore } from '@/__tests__/helpers/store';
import { Card } from '@/src/components/Card';
import { Icon, IconName } from '@/src/components/Icon';
import { IconButton } from '@/src/components/IconButton';
import { ProseText } from '@/src/components/ProseText';
import { Screen, SectionTitle } from '@/src/components/Screen';
import { presetGoals } from '@/src/data/presetGoals';
import { goalTitle } from '@/src/i18n/goalText';
import { ActivityBars } from '@/src/features/insights/ActivityBars';
import { MountainTree } from '@/src/features/insights/MountainTree';
import { GoalCard } from '@/src/features/goals/GoalCard';
import { GoalGrid, GoalGridItem } from '@/src/features/goals/GoalGrid';
import { SuggestedGoalCard } from '@/src/features/goals/SuggestedGoalCard';
import { DuaCountTapLayer } from '@/src/features/duas/DuaCountTapLayer';
import { useDuaCountGestures } from '@/src/features/duas/useDuaCountGestures';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';

const iconNames: IconName[] = [
  'back',
  'beads',
  'check',
  'chevronDown',
  'export',
  'gear',
  'goal',
  'haptic',
  'leaf',
  'link',
  'open',
  'plus',
  'reset',
  'shuffle',
  'sound',
  'sprout',
  'visualize',
];

describe('UI components', () => {
  beforeEach(() => resetStore());

  it('renders Card and Screen', () => {
    render(
      <Screen title="Today" subtitle="May 18" action={<IconButton name="gear" onPress={jest.fn()} />}>
        <Card>
          <SectionTitle>Section</SectionTitle>
        </Card>
      </Screen>,
    );
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('Section')).toBeTruthy();
  });

  it('renders default settings action on Screen', () => {
    const { router } = require('expo-router');
    render(
      <Screen title="Settings shortcut" showSettingsAction>
        <Card />
      </Screen>,
    );
    fireEvent.press(screen.getAllByRole('button')[0]!);
    expect(router.push).toHaveBeenCalledWith('/settings');
  });

  it('renders all icon variants', () => {
    iconNames.forEach((name) => {
      render(<Icon name={name} />);
    });
    render(<Icon name="gear" color="#112233" size={32} strokeWidth={3} />);
  });

  it('handles IconButton press', () => {
    const onPress = jest.fn();
    render(<IconButton name="plus" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders goal grid and cards', () => {
    useMisbahaStore.getState().setLanguage('ur');
    const goal = presetGoals[0];
    const onPress = jest.fn();
    const completed = Object.fromEntries(goal.days.map((d) => [d.day, d.target]));
    render(
      <GoalGrid>
        <GoalGridItem>
          <GoalCard goal={goal} progress={completed} onPress={onPress} variant="tile" />
        </GoalGridItem>
        <GoalGridItem fullWidth>
          <SuggestedGoalCard goal={goal} onStart={onPress} />
        </GoalGridItem>
      </GoalGrid>,
    );
    fireEvent.press(screen.getAllByText(goalTitle(goal, 'ur'))[0]);
    expect(onPress).toHaveBeenCalled();
  });

  it('renders activity bars and mountain tree', () => {
    render(<ActivityBars values={[0, 5, 10, 2]} />);
    render(<MountainTree x={10} y={20} scale={0.8} />);
  });

  it('renders tap layer enabled and disabled', () => {
    function Harness({ enabled, withChildren = true }: { enabled: boolean; withChildren?: boolean }) {
      const { gesture } = useDuaCountGestures({ onBump: jest.fn() });
      return (
        <DuaCountTapLayer
          gesture={gesture}
          enabled={enabled}
          feedbackKey={1}
          showFeedback={false}
          x={10}
          y={10}
          tabBarInset={0}
        >
          {withChildren ? <Card /> : null}
        </DuaCountTapLayer>
      );
    }

    render(<Harness enabled />);
    render(<Harness enabled={false} />);
    render(<Harness enabled={false} withChildren={false} />);
    render(<Harness enabled withChildren={false} />);
  });

  it('renders Screen in Urdu', () => {
    useMisbahaStore.getState().setLanguage('ur');
    render(<Screen title="آج" subtitle="سب ٹائٹل" />);
    expect(screen.getByText('آج')).toBeTruthy();
  });

  it('renders prose text layout variants', () => {
    render(
      <>
        <ProseText>Body copy</ProseText>
        <ProseText inline>Inline copy</ProseText>
        <ProseText centered>Centered copy</ProseText>
      </>,
    );
    expect(screen.getByText('Body copy')).toBeTruthy();
    expect(screen.getByText('Inline copy')).toBeTruthy();
    expect(screen.getByText('Centered copy')).toBeTruthy();
  });

  it('renders section titles for Urdu without uppercase styling', () => {
    useMisbahaStore.getState().setLanguage('ur');
    render(<SectionTitle>عنوان</SectionTitle>);
    expect(screen.getByText('عنوان')).toBeTruthy();
  });
});
