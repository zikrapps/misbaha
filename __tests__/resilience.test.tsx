import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react-native';
import { Alert, Linking, Text } from 'react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { countStateColor } from '@/src/features/duas/countStateColor';
import { DuaContentBody } from '@/src/features/duas/DuaContentBody';
import { nightDetailPalette } from '@/src/features/duas/nightDetail';
import { duas } from '@/src/data/duas';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { useStoreHydrated } from '@/src/store/hydration';
import { getTheme } from '@/src/theme/palette';
import { openExternalUrl } from '@/src/utils/openExternalUrl';

function ThrowingChild() {
  throw new Error('render failed');
}

describe('resilience helpers', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  it('rejects empty urls', async () => {
    await expect(openExternalUrl('   ')).resolves.toBe(false);
  });

  it('opens external urls when the platform allows it', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);

    await expect(openExternalUrl('https://example.com')).resolves.toBe(true);
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('alerts when a url cannot be opened', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    await expect(openExternalUrl('bad://link', 'Unavailable')).resolves.toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Unavailable');
  });

  it('fails quietly when no failure message is provided', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    await expect(openExternalUrl('bad://link')).resolves.toBe(false);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('handles openURL failures without throwing', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('fail'));

    await expect(openExternalUrl('https://example.com', 'Nope')).resolves.toBe(false);
  });

  it('handles canOpenURL failures without throwing', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockRejectedValue(new Error('no scheme'));
    await expect(openExternalUrl('https://example.com')).resolves.toBe(false);
  });

  it('reports store hydration completion', async () => {
    const { result } = renderHook(() => useStoreHydrated());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('recovers from render errors via ErrorBoundary', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const onReset = jest.fn();
    let shouldThrow = true;
    function MaybeThrow() {
      if (shouldThrow) throw new Error('render failed');
      return <Text>Recovered</Text>;
    }

    render(
      <ErrorBoundary onReset={onReset}>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    shouldThrow = false;
    fireEvent.press(screen.getByText('Try again'));
    expect(onReset).toHaveBeenCalled();
    expect(screen.getByText('Recovered')).toBeTruthy();
    consoleError.mockRestore();
  });

  it('waits for persist hydration when storage is still loading', async () => {
    const persist = useMisbahaStore.persist;
    const hasHydratedSpy = jest.spyOn(persist, 'hasHydrated').mockReturnValue(false);
    let finish: (() => void) | undefined;
    const onFinishSpy = jest.spyOn(persist, 'onFinishHydration').mockImplementation((listener) => {
      finish = listener;
      return () => undefined;
    });

    const { result, unmount } = renderHook(() => useStoreHydrated());
    expect(result.current).toBe(false);
    finish?.();
    await waitFor(() => expect(result.current).toBe(true));

    unmount();
    hasHydratedSpy.mockRestore();
    onFinishSpy.mockRestore();
  });

  it('renders dua content links in auto and split modes', () => {
    const colors = getTheme('garden').colors;
    const dua = duas.find((item) => item.quranUrl)!;
    const { rerender } = render(
      <DuaContentBody
        dua={dua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        linkMode="auto"
        textStyles={{
          arabic: {},
          translation: {},
          link: {},
        }}
      />,
    );
    expect(screen.getByText(new RegExp(dua.quranReference!))).toBeTruthy();

    const quranDua = duas.find((item) => item.quranUrl)!;
    rerender(
      <DuaContentBody
        dua={quranDua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        linkMode="split"
        textStyles={{
          arabic: {},
          translation: {},
          link: {},
        }}
      />,
    );
    fireEvent.press(screen.getByText(new RegExp(quranDua.quranReference!)));

    const hadithDua = duas.find((item) => item.hadithUrl && !item.quranUrl)!;
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    rerender(
      <DuaContentBody
        dua={hadithDua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        linkMode="split"
        textStyles={{
          arabic: {},
          translation: {},
          meta: {},
          link: {},
        }}
      />,
    );
    const link = screen.getByText(new RegExp(hadithDua.hadithReference!));
    expect(link).toBeTruthy();
    fireEvent.press(link.parent!);
  });

  it('covers night counter colors', () => {
    const colors = getTheme('garden').colors;
    const night = nightDetailPalette;
    expect(countStateColor(0, 33, colors, night)).toBe(night.countBorder);
    expect(countStateColor(2, 33, colors, night)).toBe(night.count);
  });

  it('uses hadith reference in auto link mode', () => {
    const colors = getTheme('garden').colors;
    const dua = { ...duas[0], category: 'prayer' as const, quranUrl: undefined, hadithUrl: 'https://sunnah.com/x' };
    render(
      <DuaContentBody
        dua={dua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        linkMode="auto"
        textStyles={{ arabic: {}, translation: {}, link: {} }}
      />,
    );
    expect(screen.getByText(/on Sunnah/i)).toBeTruthy();
  });

  it('omits links when a dua has no reference urls', () => {
    const colors = getTheme('garden').colors;
    const dua = { ...duas[0], quranUrl: undefined, hadithUrl: undefined, category: 'prayer' as const };
    render(
      <DuaContentBody
        dua={dua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        linkMode="auto"
        textStyles={{ arabic: {}, translation: {}, link: {} }}
      />,
    );
    expect(screen.queryByText(/on Quran|on Sunnah/i)).toBeNull();
  });

  it('renders speaker line and night palette links', () => {
    const colors = getTheme('garden').colors;
    const dua = duas.find((item) => item.speaker)!;
    render(
      <DuaContentBody
        dua={dua}
        language="en"
        labelFont="Georgia"
        colors={colors}
        night={{ count: '#fff', countBorder: '#ccc', muted: '#aaa', motif: '#111', controlBg: '#222', controlInk: '#eee', line: '#333' }}
        textStyles={{ arabic: {}, translation: {}, meta: {}, link: {} }}
      />,
    );
    expect(screen.getByText(/Speaker:/)).toBeTruthy();
  });
});
