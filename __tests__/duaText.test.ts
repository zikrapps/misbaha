import { duas } from '@/src/data/duas';
import { duaArabic, duaPlanLabel, duaPreview, duaSpeaker, duaTitle, duaTranslation, prayerLabel } from '@/src/i18n/duaText';

const fajr = duas.find((d) => d.id === 'fajr-subhanallah')!;

describe('duaText', () => {
  it('uses English fields by default', () => {
    expect(duaTitle(fajr, 'en')).toBe(fajr.title);
    expect(duaTranslation(fajr, 'en')).toBe(fajr.translation);
    expect(duaPreview(fajr, 'en')).toBe(fajr.transliteration);
    expect(prayerLabel('fajr', 'en')).toBe('Fajr');
  });

  it('uses Urdu locale when available', () => {
    expect(duaTitle(fajr, 'ur')).not.toBe(fajr.title);
    expect(duaPreview(fajr, 'ur')).toBe(duaTranslation(fajr, 'ur'));
    expect(duaPlanLabel(fajr, 'ur')).toBe(duaTitle(fajr, 'ur'));
    expect(duaPlanLabel(fajr, 'en')).toBe(fajr.transliteration);
    expect(prayerLabel('maghrib', 'ur')).toBe('مغرب');
  });

  it('uses Indo-Pak Arabic when Urdu is selected', () => {
    expect(duaArabic(fajr, 'en')).toBe(fajr.arabic);
    expect(duaArabic(fajr, 'ur')).not.toBe(fajr.arabic);
    expect(duaArabic(fajr, 'ur')).toContain('الل');
  });

  it('returns speaker in both languages when present', () => {
    const withSpeaker = duas.find((d) => d.speaker)!;
    expect(duaSpeaker(withSpeaker, 'en')).toBe(withSpeaker.speaker);
    expect(duaSpeaker(withSpeaker, 'ur')).toBeTruthy();
  });

  it('returns undefined when no speaker is set', () => {
    const withoutSpeaker = duas.find((d) => !d.speaker)!;
    expect(duaSpeaker(withoutSpeaker, 'en')).toBeUndefined();
  });

  it('falls back to English fields when Urdu locale is missing', () => {
    const fallback = { ...fajr, id: 'missing-urdu-locale' };
    expect(duaArabic(fallback, 'ur')).toBe(fajr.arabic);
    expect(duaTranslation(fallback, 'ur')).toBe(fajr.translation);
  });
});
