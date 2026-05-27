import { normalizeLanguage } from '@/src/types/misbaha';

describe('normalizeLanguage', () => {
  it('keeps Urdu', () => {
    expect(normalizeLanguage('ur')).toBe('ur');
  });

  it('defaults unknown values to English', () => {
    expect(normalizeLanguage(undefined)).toBe('en');
    expect(normalizeLanguage('fr')).toBe('en');
  });
});
