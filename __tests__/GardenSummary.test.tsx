import { render, screen } from '@testing-library/react-native';

import { duas } from '@/src/data/duas';
import { GardenSummary } from '@/src/features/insights/GardenSummary';

describe('GardenSummary', () => {
  const duaIds = duas.map((d) => d.id);

  it('renders barren and lush gardens', () => {
    const counts: Record<string, number> = {};
    render(<GardenSummary total={0} counts={counts} />);
    expect(screen.getByText(/barren|tree|درخت/i)).toBeTruthy();

    counts[duaIds[0]] = 500;
    counts[duaIds[1]] = 1200;
    render(<GardenSummary total={1700} counts={counts} />);
  });
});
