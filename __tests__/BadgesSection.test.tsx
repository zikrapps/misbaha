import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { badges, badgesById, TOTAL_BADGES } from '@/src/data/badges';
import { duas } from '@/src/data/duas';
import { BadgeBrowserModal } from '@/src/features/badges/BadgeBrowserModal';
import { BadgeMedal } from '@/src/features/badges/BadgeMedal';
import { BadgesSection } from '@/src/features/badges/BadgesSection';
import { BadgeSummaryCard } from '@/src/features/badges/BadgeSummaryCard';
import { BadgeUnlockHost } from '@/src/features/badges/BadgeUnlockHost';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { badgeName } from '@/src/i18n/badgeText';
import { resetStore } from './helpers/store';

describe('BadgesSection', () => {
  beforeEach(() => resetStore());

  it('shows the first set greyed out with the progress note and action buttons', () => {
    render(<BadgesSection />);
    expect(screen.getByText('0 of 200 badges earned')).toBeTruthy();
    expect(screen.getByText('Earn all ten badges to reveal the next ten.')).toBeTruthy();
    expect(screen.getByText('Badges earned')).toBeTruthy();
    expect(screen.getByText('All badges')).toBeTruthy();
    // The current set's first badge name is rendered as a caption.
    expect(screen.getByText(badgeName(badges[0]))).toBeTruthy();
  });

  it('counts earned badges as activity accrues', () => {
    useMisbahaStore.setState({
      counts: { [duas[0].id]: 33 },
      dailyCounts: { '2026-06-01': { [duas[0].id]: 33 } },
    });
    render(<BadgesSection />);
    expect(screen.getByText('1 of 200 badges earned')).toBeTruthy();
  });

  it('opens the all-badges browser from its button', () => {
    render(<BadgesSection />);
    fireEvent.press(screen.getByText('All badges'));
    expect(screen.getByText('Set 1 of 20')).toBeTruthy();
  });

  it('opens and closes the earned-badges browser', () => {
    render(<BadgesSection />);
    fireEvent.press(screen.getByText('Badges earned'));
    expect(screen.getByText('No badges earned yet — start counting to unlock your first.')).toBeTruthy();
    fireEvent.press(screen.getByText('Done'));
    expect(screen.queryByText('No badges earned yet — start counting to unlock your first.')).toBeNull();
  });
});

describe('BadgeSummaryCard', () => {
  beforeEach(() => resetStore());

  it('prompts for the first badge when none are earned', () => {
    render(<BadgeSummaryCard />);
    expect(screen.getByText('0 badges earned')).toBeTruthy();
    expect(screen.getByText('Count a tasbeeh or finish a goal to earn your first badge.')).toBeTruthy();
  });

  it('shows the earned count and latest medals once badges accrue', () => {
    useMisbahaStore.setState({ counts: { [duas[0].id]: 66 } });
    render(<BadgeSummaryCard />);
    expect(screen.queryByText('0 badges earned')).toBeNull();
    expect(screen.getByText(/of 200 badges earned/)).toBeTruthy();
  });
});

describe('BadgeBrowserModal', () => {
  beforeEach(() => resetStore());

  it('renders an empty state for earned mode with nothing unlocked', () => {
    render(<BadgeBrowserModal visible mode="earned" onClose={() => undefined} />);
    expect(screen.getByText('No badges earned yet — start counting to unlock your first.')).toBeTruthy();
  });

  it('lists all badges with set dividers and a working close button', () => {
    const onClose = jest.fn();
    render(<BadgeBrowserModal visible mode="all" onClose={onClose} />);
    expect(screen.getByText('Set 1 of 20')).toBeTruthy();
    expect(screen.getByText(`0 of ${TOTAL_BADGES} badges earned`)).toBeTruthy();
    fireEvent.press(screen.getByText('Done'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when not visible', () => {
    render(<BadgeBrowserModal visible={false} mode="all" onClose={() => undefined} />);
    expect(screen.queryByText('Set 1 of 20')).toBeNull();
  });

  it('marks earned badges in the all-badges list', () => {
    useMisbahaStore.setState({ counts: { [duas[0].id]: 33 } });
    render(<BadgeBrowserModal visible mode="all" onClose={() => undefined} />);
    expect(screen.getByText('1 of 200 badges earned')).toBeTruthy();
    expect(screen.getAllByText('Earned').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Locked').length).toBeGreaterThanOrEqual(1);
  });
});

describe('BadgeMedal', () => {
  it('renders at a fixed size and as a fill', () => {
    render(<BadgeMedal badge={badgesById['bead-1']} earned size={56} />);
    render(<BadgeMedal badge={badgesById['moon-1']} earned={false} />);
  });
});

describe('BadgeUnlockHost', () => {
  beforeEach(() => resetStore());

  it('stays silent for badges already earned at mount', () => {
    useMisbahaStore.setState({ counts: { [duas[0].id]: 33 } });
    render(<BadgeUnlockHost />);
    expect(screen.queryByText('New badge earned!')).toBeNull();
  });

  it('pops a celebration when a new badge is earned and dismisses on continue', () => {
    render(<BadgeUnlockHost />);
    expect(screen.queryByText('New badge earned!')).toBeNull();

    act(() => {
      useMisbahaStore.setState({
        counts: { [duas[0].id]: 33 },
        dailyCounts: { '2026-06-01': { [duas[0].id]: 33 } },
      });
    });

    expect(screen.getByText('New badge earned!')).toBeTruthy();
    expect(screen.getByText('First bead')).toBeTruthy();

    fireEvent.press(screen.getByText('Continue'));
    expect(screen.queryByText('New badge earned!')).toBeNull();
  });

  it('ignores store updates that earn nothing new', () => {
    render(<BadgeUnlockHost />);
    act(() => {
      useMisbahaStore.setState({ counts: { [duas[0].id]: 33 } });
    });
    expect(screen.getByText('New badge earned!')).toBeTruthy();
    // A further update that unlocks no new badge leaves the single popup as-is.
    act(() => {
      useMisbahaStore.setState({ counts: { [duas[0].id]: 40 } });
    });
    expect(screen.getAllByText('New badge earned!')).toHaveLength(1);
  });
});
