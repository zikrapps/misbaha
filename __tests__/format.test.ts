import { formatDashboardDate, formatNumber } from '@/src/i18n/format';

describe('format helpers', () => {
  it('formats numbers with Western digits', () => {
    expect(formatNumber(1234)).toBe('1,234');
  });

  it('defaults to English for dashboard dates', () => {
    const text = formatDashboardDate(new Date('2026-05-18T12:00:00'));
    expect(text).toContain('2026');
  });

  it('formats dashboard dates in English', () => {
    const text = formatDashboardDate(new Date('2026-05-18T12:00:00'), 'en');
    expect(text).toContain('2026');
    expect(text).toContain('•');
  });

  it('formats dashboard dates in Urdu locale', () => {
    const text = formatDashboardDate(new Date('2026-05-18T12:00:00'), 'ur');
    expect(text.length).toBeGreaterThan(10);
  });

  it('falls back to Gregorian-only when Islamic calendar formatting fails', () => {
    const original = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function MockDateTimeFormat(
      locale: string,
      options?: Intl.DateTimeFormatOptions,
    ) {
      if (options?.calendar === 'islamic') {
        throw new Error('unsupported');
      }
      return new original(locale, options);
    } as typeof Intl.DateTimeFormat;

    const text = formatDashboardDate(new Date('2026-05-18T12:00:00'), 'en');
    expect(text).not.toContain('•');

    Intl.DateTimeFormat = original;
  });
});
