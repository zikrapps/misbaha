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
    expect(normalizeThemeId('creased')).toBe('parchment');
  });

  it('returns faded gold palette from mock 9', () => {
    const theme = getTheme('fadedGold');
    expect(theme.id).toBe('fadedGold');
    expect(theme.colors.ink).toBe('#5c4a32');
    expect(theme.colors.cream).toBe('#f5efe0');
    expect(theme.colors.oliveDark).toBe('#8b7355');
  });

  it('scales typography for Urdu', () => {
    const ur = typographyForLanguage('ur');
    const en = typographyForLanguage('en');
    expect(ur.body).toBeGreaterThan(en.body);
    expect(ur.arabic).toBe(en.arabic);
  });
});
