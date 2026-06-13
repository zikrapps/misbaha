import { fireEvent, render, screen } from '@testing-library/react-native';
import Svg from 'react-native-svg';

import { journeyProgress, travelerNode } from '@/src/features/insights/dhikrDistance';
import { EarthScene } from '@/src/features/insights/EarthScene';
import { JourneySummary } from '@/src/features/insights/JourneySummary';
import { SpaceScene } from '@/src/features/insights/SpaceScene';
import { VisualizationToggle } from '@/src/features/insights/VisualizationToggle';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { normalizeVisualization } from '@/src/types/misbaha';
import { resetStore } from './helpers/store';

describe('JourneySummary', () => {
  beforeEach(resetStore);

  it('invites the traveller to begin from Makkah when there is no dhikr', () => {
    render(<JourneySummary kind="earth" counts={{}} />);
    expect(screen.getByText(/begin/i)).toBeTruthy();
  });

  it('renders a partial earth journey toward a milestone', () => {
    render(<JourneySummary kind="earth" counts={{ 'fajr-subhanallah': 1_000_000 }} />);
    expect(screen.getByText(/to reach/i)).toBeTruthy();
  });

  it('renders a completed earth journey', () => {
    render(<JourneySummary kind="earth" counts={{ 'fajr-subhanallah': 50_000_000 }} />);
    expect(screen.getByText(/reached/i)).toBeTruthy();
  });

  it('renders a partial cosmic journey beyond the Moon', () => {
    render(<JourneySummary kind="space" counts={{ 'fajr-subhanallah': 1_000_000_000 }} />);
    expect(screen.getByText(/to reach/i)).toBeTruthy();
  });

  it('renders a cosmic journey past the Sun', () => {
    render(<JourneySummary kind="space" counts={{ 'fajr-subhanallah': 200_000_000_000 }} />);
    expect(screen.getByText(/reached/i)).toBeTruthy();
  });
});

describe('journey scenes — defensive rendering', () => {
  it('renders earth milestone labels near the Makkah edge', () => {
    const milestones = [{ id: 'quds', km: 1230 }];
    const progress = journeyProgress(milestones, 0);
    const tree = render(
      <Svg>
        <EarthScene
          milestones={milestones}
          progress={progress}
          travelerT={travelerNode(progress, milestones.length + 1)}
          language="en"
        />
      </Svg>,
    );
    expect(tree.toJSON()).toBeTruthy();
  });

  it('falls back to a generic glyph for unknown space milestones', () => {
    const milestones = [{ id: 'comet', km: 5 }];
    const progress = journeyProgress(milestones, 0);
    const tree = render(
      <Svg>
        <SpaceScene
          milestones={milestones}
          progress={progress}
          travelerT={travelerNode(progress, milestones.length + 1)}
          language="en"
        />
      </Svg>,
    );
    expect(tree.toJSON()).toBeTruthy();
  });
});

describe('VisualizationToggle', () => {
  beforeEach(resetStore);

  it('shows all three modes and reports selection', () => {
    const onChange = jest.fn();
    render(<VisualizationToggle value="garden" onChange={onChange} />);

    fireEvent.press(screen.getByText('Cosmos'));
    expect(onChange).toHaveBeenCalledWith('space');

    fireEvent.press(screen.getByText('Earth'));
    expect(onChange).toHaveBeenCalledWith('earth');
  });
});

describe('visualization mode state', () => {
  beforeEach(resetStore);

  it('normalizes stored visualization values', () => {
    expect(normalizeVisualization('earth')).toBe('earth');
    expect(normalizeVisualization('space')).toBe('space');
    expect(normalizeVisualization('garden')).toBe('garden');
    expect(normalizeVisualization('bogus')).toBe('garden');
    expect(normalizeVisualization(undefined)).toBe('garden');
  });

  it('persists the selected mode through the store, rejecting invalid input', () => {
    useMisbahaStore.getState().setVisualization('space');
    expect(useMisbahaStore.getState().visualization).toBe('space');

    useMisbahaStore.getState().setVisualization('nonsense' as never);
    expect(useMisbahaStore.getState().visualization).toBe('garden');
  });
});
