import { duas } from '@/src/data/duas';
import { duaArabic, duaTranslation } from '@/src/i18n/duaText';
import { DuaRecord, Language } from '@/src/types/misbaha';

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ARABIC_TATWEEL = /\u0640/g;

export type DuaSearchSnippetParts = {
  before: string;
  match: string;
  after: string;
};

export type DuaSearchMatch = {
  dua: DuaRecord;
  snippet: string;
  snippetParts: DuaSearchSnippetParts;
  field: 'arabic' | 'transliteration';
};

function normalizeArabicChar(char: string): string {
  return char
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
}

function normalizeLatinChar(char: string): string {
  return char
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[`'’]/g, '')
    .replace(/[-\u2013\u2014]/g, ' ');
}

type NormalizedText = {
  text: string;
  /** Maps each normalized character index to its index in the original string. */
  indexMap: number[];
};

function normalizeWithIndexMap(text: string, normalizeChar: (char: string) => string, skip?: RegExp): NormalizedText {
  let normalized = '';
  const indexMap: number[] = [];

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (skip?.test(char)) continue;
    const next = normalizeChar(char);
    if (!next) continue;
    normalized += next;
    indexMap.push(index);
  }

  return { text: normalized, indexMap };
}

export function normalizeArabicForSearch(text: string): string {
  return normalizeWithIndexMap(text, normalizeArabicChar, /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/).text;
}

function normalizeLatinForSearch(text: string): string {
  return normalizeWithIndexMap(text, normalizeLatinChar).text.replace(/\s+/g, ' ').trim();
}

function findMatchIndex(haystack: string, needle: string): number {
  if (!needle) return -1;
  return haystack.indexOf(needle);
}

const START_CHARS = 28;
const MATCH_CHARS = 16;

export function buildDuaSearchSnippetParts(
  text: string,
  matchIndex: number,
  queryLength: number,
): DuaSearchSnippetParts {
  if (matchIndex < 0) {
    const slice = text.slice(0, START_CHARS).trim();
    return { before: slice, match: '', after: '' };
  }

  const matchEnd = matchIndex + queryLength;

  if (matchIndex <= 8) {
    const end = Math.min(text.length, matchIndex + Math.max(queryLength, MATCH_CHARS));
    return {
      before: text.slice(0, matchIndex),
      match: text.slice(matchIndex, matchEnd),
      after: text.slice(matchEnd, end).trimEnd(),
    };
  }

  const startPart = text.slice(0, START_CHARS).trim();
  const contextEnd = Math.min(text.length, matchIndex + Math.max(queryLength, MATCH_CHARS));
  return {
    before: `${startPart} ...`,
    match: text.slice(matchIndex, matchEnd),
    after: text.slice(matchEnd, contextEnd).trim(),
  };
}

export function buildDuaSearchSnippet(text: string, matchIndex: number, queryLength: number): string {
  const { before, match, after } = buildDuaSearchSnippetParts(text, matchIndex, queryLength);
  return `${before}${match}${after}`.trim();
}

function matchInField(
  original: string,
  query: string,
  normalize: (value: string) => NormalizedText,
): { matchIndex: number; queryLength: number } | null {
  const normalizedQuery = normalize(query).text;
  if (!normalizedQuery) return null;

  const { text: normalizedOriginal, indexMap } = normalize(original);
  const normalizedIndex = findMatchIndex(normalizedOriginal, normalizedQuery);
  if (normalizedIndex < 0) return null;

  const matchIndex = indexMap[normalizedIndex] ?? 0;
  const matchEndIndex = indexMap[normalizedIndex + normalizedQuery.length - 1] ?? matchIndex;
  const queryLength = Math.max(1, matchEndIndex - matchIndex + 1);

  return { matchIndex, queryLength };
}

function matchDua(dua: DuaRecord, query: string, language: Language): DuaSearchMatch | null {
  const arabicText = duaArabic(dua, language);
  const arabicMatch = matchInField(arabicText, query, (value) =>
    normalizeWithIndexMap(value, normalizeArabicChar, /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/),
  );

  if (arabicMatch) {
    const snippetParts = buildDuaSearchSnippetParts(arabicText, arabicMatch.matchIndex, arabicMatch.queryLength);
    return {
      dua,
      field: 'arabic',
      snippetParts,
      snippet: buildDuaSearchSnippet(arabicText, arabicMatch.matchIndex, arabicMatch.queryLength),
    };
  }

  const transliterationMatch = matchInField(dua.transliteration, query, (value) =>
    normalizeWithIndexMap(value, normalizeLatinChar),
  );

  if (transliterationMatch) {
    const snippetParts = buildDuaSearchSnippetParts(
      dua.transliteration,
      transliterationMatch.matchIndex,
      transliterationMatch.queryLength,
    );
    return {
      dua,
      field: 'transliteration',
      snippetParts,
      snippet: buildDuaSearchSnippet(
        dua.transliteration,
        transliterationMatch.matchIndex,
        transliterationMatch.queryLength,
      ),
    };
  }

  return null;
}

function matchesTranslation(query: string, language: Language, catalog: DuaRecord[]): boolean {
  for (const dua of catalog) {
    const translation = duaTranslation(dua, language);
    const match =
      language === 'ur'
        ? matchInField(translation, query, (value) =>
            normalizeWithIndexMap(value, normalizeArabicChar, /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/),
          )
        : matchInField(translation, query, (value) => normalizeWithIndexMap(value, normalizeLatinChar));
    if (match) return true;
  }
  return false;
}

/** True when the query only matches translation text, not transliteration or Arabic. */
export function isTranslationOnlyQuery(
  query: string,
  language: Language,
  catalog: DuaRecord[] = duas,
): boolean {
  const trimmed = query.trim();
  if (trimmed.length < 2) return false;
  if (searchDuas(trimmed, language, catalog).length > 0) return false;
  return matchesTranslation(trimmed, language, catalog);
}

export function searchDuas(query: string, language: Language, catalog: DuaRecord[] = duas): DuaSearchMatch[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const matches: DuaSearchMatch[] = [];
  for (const dua of catalog) {
    const match = matchDua(dua, trimmed, language);
    if (match) matches.push(match);
  }

  return matches.slice(0, 8);
}
