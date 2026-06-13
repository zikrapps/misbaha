import { renderHook } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { useTheme } from '@/src/theme/useTheme';

const mockUseUrduFontsReady = jest.fn(() => true);
jest.mock('@/src/theme/UrduFontProvider', () => ({
  UrduFontProvider: ({ children }: { children: React.ReactNode }) => children,
  useUrduFontsReady: () => mockUseUrduFontsReady(),
}));

describe('useTheme', () => {
  beforeEach(() => resetStore());

  it('reflects store theme and language', () => {
    useMisbahaStore.getState().setThemeId('rose');
    useMisbahaStore.getState().setLanguage('ur');

    const { result } = renderHook(() => useTheme());

    expect(result.current.id).toBe('rose');
    expect(result.current.language).toBe('ur');
    expect(result.current.typo.body).toBeGreaterThan(16);
    expect(result.current.labelFont).toBe('NotoNaskhArabic_400Regular');
    expect(result.current.arabicFont).toBe('NotoNaskhArabic_400Regular');
    expect(result.current.proseFontStyle).toBe('normal');
  });

  it('uses theme arabic font in English', () => {
    useMisbahaStore.getState().setLanguage('en');

    const { result } = renderHook(() => useTheme());

    expect(result.current.labelFont).toBe(result.current.fonts.display);
    expect(result.current.arabicFont).toBe(result.current.fonts.arabic);
  });

  it('falls back to system fonts while Urdu fonts are loading', () => {
    mockUseUrduFontsReady.mockReturnValueOnce(false);
    useMisbahaStore.getState().setLanguage('ur');

    const { result } = renderHook(() => useTheme());

    expect(result.current.labelFont).toBe('System');
    expect(result.current.arabicFont).toBe('System');
  });
});
