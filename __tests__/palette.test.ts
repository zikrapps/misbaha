import { getTheme, normalizeThemeId, typographyForLanguage } from '@/src/theme/palette';

describe('theme palette', () => {
  it('normalizes legacy theme ids', () => {
    expect(normalizeThemeId('midnight')).toBe('chromatic');
    expect(normalizeThemeId('unknown')).toBe('garden');
    expect(normalizeThemeId('rose')).toBe('rose');
  });

  it('returns theme metadata', () => {
    const theme = getTheme('parchment');
    expect(theme.id).toBe('parchment');
    expect(theme.colors.ink).toBe('#353330');
  });

  it('scales typography for Urdu', () => {
    const ur = typographyForLanguage('ur');
    const en = typographyForLanguage('en');
    expect(ur.body).toBeGreaterThan(en.body);
    expect(ur.arabic).toBe(en.arabic);
  });
});
