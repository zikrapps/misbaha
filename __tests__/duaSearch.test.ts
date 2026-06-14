import { duas } from '@/src/data/duas';
import {
  buildDuaSearchSnippet,
  buildDuaSearchSnippetParts,
  isTranslationOnlyQuery,
  normalizeArabicForSearch,
  searchDuas,
} from '@/src/features/duas/duaSearch';

describe('duaSearch', () => {
  it('matches transliteration by a middle word', () => {
    const results = searchDuas('dunya', 'en');
    const match = results.find((result) => result.dua.id === 'rabbana-atina');
    expect(match).toBeTruthy();
    expect(match?.field).toBe('transliteration');
    expect(match?.snippet.toLowerCase()).toContain('dunya');
    expect(match?.snippet).toMatch(/Rabbana atina/i);
  });

  it('matches arabic text without diacritics', () => {
    const results = searchDuas('دنيا', 'en');
    const match = results.find((result) => result.dua.id === 'rabbana-atina');
    expect(match).toBeTruthy();
    expect(match?.field).toBe('arabic');
    expect(match?.snippet).toContain('...');
    expect(match?.snippet).toMatch(/رَبَّ|رَبَّ/);
  });

  it('shows the start of the dua and the matching segment for later matches', () => {
    const snippet = buildDuaSearchSnippet('Rabbana atina fid-dunya hasanah', 18, 5);
    expect(snippet.startsWith('Rabbana atina')).toBe(true);
    expect(snippet).toContain('...');
    expect(snippet).toContain('dunya');

    const parts = buildDuaSearchSnippetParts('Rabbana atina fid-dunya hasanah', 18, 5);
    expect(parts.match.toLowerCase()).toContain('uny');
  });

  it('exposes snippet parts for highlighting the matched keyword', () => {
    const match = searchDuas('dunya', 'en').find((result) => result.dua.id === 'rabbana-atina');
    expect(match?.snippetParts.match.toLowerCase()).toBe('dunya');
    expect(match?.snippet).toContain(match?.snippetParts.match ?? '');
  });

  it('detects when a query only matches translation text', () => {
    expect(isTranslationOnlyQuery('Glory', 'en')).toBe(true);
    expect(isTranslationOnlyQuery('dunya', 'en')).toBe(false);
    expect(isTranslationOnlyQuery('zzznomatch', 'en')).toBe(false);
  });

  it('returns no results for very short queries', () => {
    expect(searchDuas('a', 'en')).toEqual([]);
    expect(searchDuas('  ', 'en')).toEqual([]);
  });

  it('normalizes arabic alef variants for matching', () => {
    expect(normalizeArabicForSearch('أإآٱ')).toBe('اااا');
  });
});
