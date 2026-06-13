import { fireEvent, render, screen } from '@testing-library/react-native';
import { useState, type ComponentProps } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { duas } from '@/src/data/duas';
import { DuaCounterRow } from '@/src/features/duas/DuaCounterRow';

const dua = duas[0];

type RowHarnessProps = Omit<
  ComponentProps<typeof DuaCounterRow>,
  'expanded' | 'countingActive' | 'onToggleExpanded'
>;

function RowHarness(props: RowHarnessProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <DuaCounterRow
      {...props}
      countingActive={expanded}
      expanded={expanded}
      onToggleExpanded={() => setExpanded((value) => !value)}
    />
  );
}

describe('DuaCounterRow', () => {
  beforeEach(() => {
    resetStore();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses deep count color when target is met', () => {
    render(
      <RowHarness
        dua={dua}
        count={dua.target}
        tapWeight={1}
        onIncrement={jest.fn()}
        onOpen={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    expect(screen.getByText(String(dua.target))).toBeTruthy();
  });

  it('expands to show full text and links', () => {
    const onIncrement = jest.fn();
    render(
      <RowHarness
        dua={dua}
        count={5}
        tapWeight={1}
        onIncrement={onIncrement}
        onOpen={jest.fn()}
        onReset={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByLabelText(/expand/i));
    expect(screen.getByText(dua.arabic)).toBeTruthy();
  });

  it('right-aligns expanded Arabic text', () => {
    render(
      <RowHarness
        dua={dua}
        count={1}
        tapWeight={1}
        onIncrement={jest.fn()}
        onOpen={jest.fn()}
        onReset={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByLabelText(/expand/i));
    const arabic = screen.getByText(dua.arabic);
    const flat = StyleSheet.flatten(arabic.props.style);
    expect(flat?.textAlign).toBe('right');
    expect(flat?.writingDirection).toBe('rtl');
    expect(flat?.width).toBe('100%');
  });

  it('shows hadith link for prayer duas when expanded', () => {
    render(
      <RowHarness
        dua={dua}
        count={1}
        tapWeight={1}
        onIncrement={jest.fn()}
        onOpen={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByLabelText(/expand/i));
    expect(screen.getByText(/Sunnah/i)).toBeTruthy();
  });

  it('shows reference links when expanded', () => {
    const quranic = duas.find((d) => d.quranUrl)!;
    render(
      <RowHarness
        dua={quranic}
        count={0}
        tapWeight={1}
        onIncrement={jest.fn()}
        onOpen={jest.fn()}
        onReset={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByLabelText(/expand/i));
    expect(screen.getByText(/Quran/i)).toBeTruthy();
  });

  it('confirms reset from expanded row', () => {
    const onReset = jest.fn();
    render(
      <RowHarness
        dua={dua}
        count={3}
        tapWeight={1}
        onIncrement={jest.fn()}
        onOpen={jest.fn()}
        onReset={onReset}
      />,
    );

    fireEvent.press(screen.getByLabelText(/expand/i));
    fireEvent.press(screen.getByText(/reset/i));
    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2] as Array<{ onPress?: () => void }>;
    buttons[1].onPress?.();
    expect(onReset).toHaveBeenCalled();
  });
});
