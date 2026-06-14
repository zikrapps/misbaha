import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '@/src/components/Icon';
import {
  DuaSearchMatch,
  DuaSearchSnippetParts,
  isTranslationOnlyQuery,
  searchDuas,
} from '@/src/features/duas/duaSearch';
import { arabicLayout } from '@/src/i18n/textLayout';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DuaRecord } from '@/src/types/misbaha';

type DuaSearchBarProps = {
  onSelect: (dua: DuaRecord) => void;
  addHint?: string;
};

function DuaSearchSnippetText({
  field,
  parts,
  styles,
}: {
  field: DuaSearchMatch['field'];
  parts: DuaSearchSnippetParts;
  styles: {
    snippetArabic: object;
    snippetLatin: object;
    snippetHighlight: object;
  };
}) {
  const baseStyle = field === 'arabic' ? styles.snippetArabic : styles.snippetLatin;

  return (
    <Text numberOfLines={2} style={baseStyle}>
      {parts.before}
      {parts.match ? <Text style={[baseStyle, styles.snippetHighlight]}>{parts.match}</Text> : null}
      {parts.after}
    </Text>
  );
}

export function DuaSearchBar({ onSelect, addHint }: DuaSearchBarProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const language = useLanguage();
  const t = useT();
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim();
  const results = useMemo(() => searchDuas(query, language), [language, query]);
  const showUnsupportedLanguageWarning = useMemo(
    () => trimmedQuery.length >= 2 && results.length === 0 && isTranslationOnlyQuery(query, language),
    [language, query, results.length, trimmedQuery.length],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: spacing.sm,
        },
        field: {
          alignItems: 'center',
          backgroundColor: colors.card,
          borderColor: colors.line,
          borderRadius: radii.md,
          borderWidth: 1,
          gap: spacing.sm,
          minHeight: 48,
          paddingHorizontal: spacing.md,
          ...theme.mirrorRow,
        },
        input: {
          color: colors.ink,
          flex: 1,
          fontFamily: theme.labelFont,
          fontSize: theme.typo.body,
          minWidth: 0,
          paddingVertical: spacing.sm,
          ...theme.proseLayout,
        },
        suggestions: {
          backgroundColor: colors.card,
          borderColor: colors.line,
          borderRadius: radii.md,
          borderWidth: 1,
          gap: 1,
          overflow: 'hidden',
        },
        suggestion: {
          borderBottomColor: colors.line,
          borderBottomWidth: StyleSheet.hairlineWidth,
          gap: 2,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        },
        suggestionLast: {
          borderBottomWidth: 0,
        },
        snippetArabic: {
          color: colors.ink,
          fontFamily: theme.arabicFont,
          fontSize: theme.typo.subtitle,
          lineHeight: theme.labelLineHeight(theme.typo.subtitle, 1.45),
          ...arabicLayout,
        },
        snippetLatin: {
          color: colors.ink,
          fontFamily: theme.labelFont,
          fontSize: theme.typo.body,
          ...theme.proseLayout,
        },
        snippetHighlight: {
          color: colors.olive,
          fontWeight: '700',
        },
        hint: {
          color: colors.muted,
          fontSize: theme.typo.caption,
          ...theme.proseLayout,
        },
        empty: {
          color: colors.muted,
          fontSize: theme.typo.caption,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          ...theme.proseLayout,
        },
        emptyWarning: {
          color: colors.olive,
          fontSize: theme.typo.caption,
          paddingBottom: spacing.sm,
          paddingHorizontal: spacing.md,
          ...theme.proseLayout,
        },
      }),
    [colors, theme],
  );

  const handleSelect = (dua: DuaRecord) => {
    setQuery('');
    onSelect(dua);
  };

  const showSuggestions = trimmedQuery.length >= 2;

  return (
    <View style={styles.root}>
      <View style={styles.field}>
        <Icon color={colors.muted} name="search" size={18} strokeWidth={2} />
        <TextInput
          accessibilityLabel={t.duaSearch.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t.duaSearch.placeholder}
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {addHint ? <Text style={styles.hint}>{addHint}</Text> : null}

      {showSuggestions ? (
        <View style={styles.suggestions}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <Pressable
                key={result.dua.id}
                accessibilityRole="button"
                style={[styles.suggestion, index === results.length - 1 && styles.suggestionLast]}
                onPress={() => handleSelect(result.dua)}
              >
                <DuaSearchSnippetText
                  field={result.field}
                  parts={result.snippetParts}
                  styles={{
                    snippetArabic: styles.snippetArabic,
                    snippetLatin: styles.snippetLatin,
                    snippetHighlight: styles.snippetHighlight,
                  }}
                />
              </Pressable>
            ))
          ) : (
            <View>
              <Text style={styles.empty}>{t.duaSearch.noResults}</Text>
              {showUnsupportedLanguageWarning ? (
                <Text style={styles.emptyWarning}>{t.duaSearch.unsupportedLanguageWarning}</Text>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}
