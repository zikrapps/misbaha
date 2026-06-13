import { render, screen } from '@testing-library/react-native';

import { TodayGrowthCard } from '@/src/features/insights/TodayGrowthCard';

describe('TodayGrowthCard', () => {
  it('shows today growth copy and dhikr count', () => {
    render(<TodayGrowthCard todayTotal={128} mode="garden" />);
    expect(screen.getByText(/Today's Growth/i)).toBeTruthy();
    expect(screen.getByText('128')).toBeTruthy();
    expect(screen.getByText(/dhikr/i)).toBeTruthy();
  });

  it('shows capped goal progress for counts above the daily target', () => {
    render(<TodayGrowthCard todayTotal={128} mode="garden" />);
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText(/Of goal/i)).toBeTruthy();
  });

  it('shows partial goal progress below the daily target', () => {
    render(<TodayGrowthCard todayTotal={6} mode="earth" />);
    expect(screen.getByText('6%')).toBeTruthy();
  });

  it('labels the cosmos mode overline', () => {
    render(<TodayGrowthCard todayTotal={12} mode="space" />);
    expect(screen.getByText(/cosmos/i)).toBeTruthy();
  });
});
