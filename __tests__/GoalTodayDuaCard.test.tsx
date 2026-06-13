import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { findGestureCallback, resetGestureCallbacks } from '@/__tests__/helpers/gestureCallbacks';
import { resetStore } from '@/__tests__/helpers/store';
import { duas } from '@/src/data/duas';
import { DUA_COUNT_MIN_DOUBLE_TAP_MS } from '@/src/features/duas/useDuaCountGestures';
import { GoalTodayDuaCard } from '@/src/features/goals/GoalTodayDuaCard';

const subhanAllah = duas.find((dua) => dua.id === 'fajr-subhanallah')!;
const salawat = duas.find((dua) => dua.id === 'isha-salat-nabi')!;

const styles = {
  todayCard: {},
  overline: {},
  arabic: {},
  translation: {},
  meta: {},
  link: {},
  linkRow: {},
  progressLine: { flexDirection: 'row' as const },
  progressNumber: {},
  target: {},
  track: { flex: 1, height: 4 },
  progressFill: { height: 4 },
  countHint: {},
  primary: {},
  primaryText: {},
};

describe('GoalTodayDuaCard', () => {
  beforeEach(() => {
    resetStore();
    resetGestureCallbacks();
  });

  it('renders progress, reference link, and opens the counter', () => {
    const onCount = jest.fn();
    render(
      <GoalTodayDuaCard
        dua={subhanAllah}
        todayProgress={12}
        todayTarget={33}
        tapWeight={2}
        language="en"
        onCount={onCount}
        openCounterLabel="Open counter"
        styles={styles}
      />,
    );

    expect(screen.getByText(subhanAllah.arabic)).toBeTruthy();
    expect(screen.getByText(subhanAllah.translation)).toBeTruthy();
    expect(screen.getByText(/Sahih Muslim 597 on Sunnah/i)).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText(/\/ 33/)).toBeTruthy();

    fireEvent.press(screen.getByText('Open counter'));
    expect(onCount).toHaveBeenCalledTimes(1);
  });

  it('shows the hadith reference link for salawat', () => {
    render(
      <GoalTodayDuaCard
        dua={salawat}
        todayProgress={0}
        todayTarget={100}
        tapWeight={1}
        language="en"
        onCount={jest.fn()}
        openCounterLabel="Open counter"
        styles={styles}
      />,
    );

    expect(screen.getByText(/Sahih al-Bukhari 6357 on Sunnah/i)).toBeTruthy();
  });

  it('caps the progress bar at 100%', () => {
    const { UNSAFE_getAllByType } = render(
      <GoalTodayDuaCard
        dua={duas.find((dua) => dua.id === 'fajr-alhamdulillah')!}
        todayProgress={50}
        todayTarget={33}
        tapWeight={1}
        language="ur"
        onCount={jest.fn()}
        openCounterLabel="شمار کنندہ"
        styles={styles}
      />,
    );

    const fill = UNSAFE_getAllByType(require('react-native').View).find(
      (view) => StyleSheet.flatten(view.props.style)?.width === '100%',
    );
    expect(fill).toBeTruthy();
  });

  it('counts via the double-tap gesture layer', () => {
    jest.useFakeTimers();
    const onCount = jest.fn();
    render(
      <GoalTodayDuaCard
        dua={subhanAllah}
        todayProgress={0}
        todayTarget={33}
        tapWeight={1}
        language="en"
        onCount={onCount}
        openCounterLabel="Open counter"
        styles={styles}
      />,
    );

    const onEnd = findGestureCallback('tap', 'onEnd');
    act(() => onEnd?.({ x: 40, y: 40 }));
    act(() => jest.advanceTimersByTime(DUA_COUNT_MIN_DOUBLE_TAP_MS));
    act(() => onEnd?.({ x: 42, y: 42 }));
    expect(onCount).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
