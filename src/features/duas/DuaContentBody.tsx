import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Icon } from '@/src/components/Icon';
import { NightDetailPalette } from '@/src/features/duas/nightDetail';
import { duaArabic, duaSpeaker, duaTranslation } from '@/src/i18n/duaText';
import { arabicBlockLayout, arabicLayout, proseInlineLayout, proseLayout } from '@/src/i18n/textLayout';
import { useT } from '@/src/i18n/strings';
import { ThemeColors } from '@/src/theme/palette';
import { DuaRecord, Language } from '@/src/types/misbaha';
import { openExternalUrl } from '@/src/utils/openExternalUrl';
import type { StyleProp } from 'react-native';

type DuaContentBodyProps = {
  dua: DuaRecord;
  language: Language;
  labelFont: string;
  colors: ThemeColors;
  textStyles: {
    arabic: StyleProp<TextStyle>;
    translation: StyleProp<TextStyle>;
    meta?: StyleProp<TextStyle>;
    link?: StyleProp<TextStyle>;
    linkRow?: ViewStyle;
  };
  night?: NightDetailPalette | null;
  /** Detail screen: one primary reference link. List row: separate Quran and Hadith links. */
  linkMode?: 'auto' | 'split';
};

export function getDuaReference(dua: DuaRecord, quranSuffix: string, hadithSuffix: string) {
  if (dua.category === 'quranic' && dua.quranUrl) {
    return { label: `${dua.quranReference} ${quranSuffix}`, url: dua.quranUrl };
  }
  if (dua.hadithUrl) {
    return { label: `${dua.hadithReference} ${hadithSuffix}`, url: dua.hadithUrl };
  }
  return { label: '', url: undefined as string | undefined };
}

export function DuaContentBody({
  dua,
  language,
  labelFont,
  colors,
  textStyles,
  night,
  linkMode = 'split',
}: DuaContentBodyProps) {
  const t = useT();
  const speaker = duaSpeaker(dua, language);
  const linkColor = night?.muted ?? colors.olive;

  const openLink = (url: string) => {
    void openExternalUrl(url, t.common.linkUnavailable);
  };

  const reference =
    linkMode === 'auto' ? getDuaReference(dua, t.duas.onQuran, t.duas.onSunnah) : null;

  return (
    <>
      <View style={styles.arabicBlock}>
        <Text style={[textStyles.arabic, arabicLayout]}>{duaArabic(dua, language)}</Text>
      </View>
      <Text style={[textStyles.translation, proseLayout(language)]}>{duaTranslation(dua, language)}</Text>
      {speaker ? (
        <Text style={[textStyles.meta, proseLayout(language)]}>
          {t.duas.speaker}: {speaker}
        </Text>
      ) : null}
      {linkMode === 'auto' && reference?.url ? (
        <Pressable onPress={() => openLink(reference.url!)} style={[styles.linkRow, textStyles.linkRow]}>
          <Icon name="link" color={linkColor} size={16} />
          <Text style={[textStyles.link, proseInlineLayout(language), { color: linkColor, fontFamily: labelFont }]}>
            {reference.label}
          </Text>
        </Pressable>
      ) : null}
      {linkMode === 'split' && dua.quranUrl ? (
        <Pressable onPress={() => openLink(dua.quranUrl!)} style={[styles.linkRow, textStyles.linkRow]}>
          <Icon name="link" color={linkColor} size={15} />
          <Text style={[textStyles.link, proseInlineLayout(language), { color: linkColor, fontFamily: labelFont }]}>
            {dua.quranReference} {t.duas.onQuran}
          </Text>
        </Pressable>
      ) : null}
      {linkMode === 'split' && dua.hadithUrl ? (
        <Pressable onPress={() => openLink(dua.hadithUrl!)} style={[styles.linkRow, textStyles.linkRow]}>
          <Icon name="link" color={linkColor} size={15} />
          <Text style={[textStyles.link, proseInlineLayout(language), { color: linkColor, fontFamily: labelFont }]}>
            {dua.hadithReference} {t.duas.onSunnah}
          </Text>
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  arabicBlock: arabicBlockLayout,
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});
