import { renderHook } from '@testing-library/react-native';

import { resetStore } from '@/__tests__/helpers/store';
import { useMisbahaStore } from '@/src/store/useMisbahaStore';
import { useTheme } from '@/src/theme/useTheme';

describe('useTheme', () => {
  beforeEach(() => resetStore());

  it('reflects store theme and language', () => {
    useMisbahaStore.getState().setThemeId('rose');
    useMisbahaStore.getState().setLanguage('ur');

    const { result } = renderHook(() => useTheme());

    expect(result.current.id).toBe('rose');
    expect(result.current.language).toBe('ur');
    expect(result.current.typo.body).toBeGreaterThan(16);
    expect(result.current.labelFont).toBe(result.current.fonts.body);
    expect(result.current.proseFontStyle).toBe('normal');
  });
});
