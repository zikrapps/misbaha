import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resolveTimelineDua } from '@/src/data/dayTimelineResolve';
import { dayTimelineReferenceShort } from '@/src/data/dayTimelineSupplications';
import { DuaContentBody } from '@/src/features/duas/DuaContentBody';
import { dayTimelineSupplicationTitle } from '@/src/i18n/dayTimelineText';
import { duaTitle } from '@/src/i18n/duaText';
import { useLanguage, useT } from '@/src/i18n/strings';
import { radii, spacing, useTheme } from '@/src/theme/theme';
import { DayTimelineSupplication } from '@/src/types/misbaha';

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

  if (!supplication) return null;

  const dua = resolveTimelineDua(supplication);
  const title = dua ? duaTitle(dua, language) : dayTimelineSupplicationTitle(supplication.id, language);
  const reference =
    dayTimelineReferenceShort(supplication.quranReference ?? supplication.hadithReference) || '';

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.dismissArea} />
        <SafeAreaView edges={['bottom']} style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <View style={[styles.handle, { backgroundColor: colors.line }]} />
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
          <Text style={[styles.title, proseLayout, { color: colors.ink, fontFamily: labelFont, fontSize: typo.subtitle + 2 }]}>
            {title}
          </Text>
          {reference ? (
            <View style={[styles.refBadge, { backgroundColor: colors.cream, borderColor: colors.line }]}>
              <Text style={[styles.refText, { color: colors.oliveDeep, fontFamily: labelFont, fontSize: typo.micro }]}>
                {reference}
              </Text>
            </View>
          ) : null}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
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
                    fontSize: typo.arabic,
                    lineHeight: Math.round(typo.arabic * 1.65),
                  },
                  translation: {
                    color: colors.muted,
                    fontSize: typo.body,
                    lineHeight: Math.round(typo.body * 1.5),
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
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
    backgroundColor: 'rgba(55, 44, 36, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    maxHeight: '78%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    borderRadius: radii.pill,
    height: 4,
    marginBottom: spacing.md,
    width: 40,
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
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  fallback: {
    lineHeight: 22,
  },
  closeBtn: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  closeText: {
    fontWeight: '700',
  },
});
