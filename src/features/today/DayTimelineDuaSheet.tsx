import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resolveTimelineDua } from '@/src/data/dayTimelineResolve';
import { dayTimelineReferenceShort } from '@/src/data/dayTimelineSupplications';
import { DuaContentBody } from '@/src/features/duas/DuaContentBody';
import { dayTimelineSupplicationTitle } from '@/src/i18n/dayTimelineText';
import { duaTitle } from '@/src/i18n/duaText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { lineHeightFor } from '@/src/i18n/textLayout';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DayTimelineSupplication } from '@/src/types/misbaha';

const DONE_BUTTON_HEIGHT = 52;
const CARD_CHROME = spacing.xl + spacing.lg + DONE_BUTTON_HEIGHT + spacing.md;

type DayTimelineDuaSheetProps = {
  supplication: DayTimelineSupplication | null;
  onClose: () => void;
};

export function DayTimelineDuaSheet({ supplication, onClose }: DayTimelineDuaSheetProps) {
  const theme = useTheme();
  const colors = theme.colors;
  const { typo, labelFont, proseLayout, labelDecoration } = theme;
  const t = useT();
  const language = useLanguage();
  const { height: windowHeight } = useWindowDimensions();

  if (!supplication) return null;

  const dua = resolveTimelineDua(supplication);
  const title = dua ? duaTitle(dua, language) : dayTimelineSupplicationTitle(supplication.id, language);
  const reference =
    dayTimelineReferenceShort(supplication.quranReference ?? supplication.hadithReference) || '';
  const arabicSize = typo.arabic + (language === 'ur' ? 4 : 6);
  const scrollMaxHeight = Math.max(160, Math.round(windowHeight * 0.82) - CARD_CHROME);

  return (
    <Modal animationType="fade" transparent visible onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: 'rgba(55, 44, 36, 0.58)' }]}>
        <Pressable accessibilityRole="button" onPress={onClose} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safe} pointerEvents="box-none">
          <View
            pointerEvents="auto"
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}
          >
            <ScrollView
              style={{ maxHeight: scrollMaxHeight }}
              contentContainerStyle={styles.body}
              nestedScrollEnabled
              showsVerticalScrollIndicator
              bounces
            >
              <Text
                style={[
                  styles.eyebrow,
                  proseLayout,
                  labelDecoration,
                  { color: colors.oliveDark, fontSize: typo.micro },
                ]}
              >
                {t.dayTimeline.duaForThisTime}
              </Text>
              <Text
                style={[
                  styles.title,
                  proseLayout,
                  { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle + 2 },
                ]}
              >
                {title}
              </Text>
              {reference ? (
                <View style={[styles.refBadge, { backgroundColor: colors.cream, borderColor: colors.line }]}>
                  <Text
                    style={[styles.refText, { color: colors.oliveDeep, fontFamily: labelFont, fontSize: typo.micro }]}
                  >
                    {reference}
                  </Text>
                </View>
              ) : null}
              {dua ? (
                <DuaContentBody
                  dua={dua}
                  language={language}
                  labelFont={labelFont}
                  colors={colors}
                  linkMode="split"
                  textStyles={{
                    arabic: {
                      color: colors.ink,
                      fontSize: arabicSize,
                      lineHeight: lineHeightFor(language, arabicSize, 1.75),
                      paddingVertical: spacing.xs,
                    },
                    translation: {
                      color: colors.muted,
                      fontSize: typo.body,
                      lineHeight: lineHeightFor(language, typo.body, 1.55),
                    },
                    link: { fontSize: typo.small },
                  }}
                />
              ) : (
                <Text style={[styles.fallback, proseLayout, { color: colors.muted, fontSize: typo.body }]}>
                  {t.dayTimeline.contentUnavailable}
                </Text>
              )}
            </ScrollView>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.oliveDeep, borderColor: colors.oliveDark }]}
            >
              <Text style={[styles.closeText, { color: colors.white, fontFamily: labelFont, fontSize: typo.body }]}>
                {t.common.done}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  safe: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    maxHeight: '82%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    width: '100%',
  },
  eyebrow: {
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: spacing.xs,
  },
  refBadge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  refText: {
    fontWeight: '700',
  },
  body: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  fallback: {
    lineHeight: 22,
  },
  closeBtn: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: DONE_BUTTON_HEIGHT,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  closeText: {
    fontWeight: '700',
  },
});
